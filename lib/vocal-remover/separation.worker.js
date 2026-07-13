// lib/vocal-remover/separation.worker.js
//
// Runs the MDX-Net separation pipeline (STFT → ONNX inference → ISTFT,
// chunked overlap-add) off the main thread. The STFT/ISTFT math here is
// identical to lib/vocal-remover/mdxSeparate.js — this file exists only so
// that the CPU-heavy per-chunk loop doesn't block the page (which was
// triggering Chrome's "Page Unresponsive" dialog on anything longer than a
// few seconds of audio).
//
// Audio decoding (needs AudioContext, not available in workers) and the
// final MP3 encode (ffmpeg.wasm already runs in its own worker) stay on the
// main thread — see mdxSeparate.js.

import { FFTR } from "kissfft-js";

const N_FFT = 7680;
const HOP = 1024;
const DIM_F = 3072;
const SEGMENT_SIZE = 256;
const COMPENSATE = 1.009;
const TRIM = N_FFT / 2;
const CHUNK_SIZE = HOP * (SEGMENT_SIZE - 1);
const GEN_SIZE = CHUNK_SIZE - 2 * TRIM;
const N_BINS = N_FFT / 2 + 1;

const MODEL_URL = "/audio-models/Kim_Vocal_2.onnx";
const ORT_SCRIPT_URL = "/ort/ort.wasm.min.js";
const ORT_WASM_DIR = "/ort/";

const HANN = new Float64Array(N_FFT);
for (let i = 0; i < N_FFT; i++) HANN[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / N_FFT);

const fftr = new FFTR(N_FFT);

function reflectPad(x, pad) {
  const n = x.length;
  const out = new Float64Array(n + 2 * pad);
  out.set(x, pad);
  for (let i = 0; i < pad; i++) {
    out[pad - 1 - i] = x[i + 1];
    out[pad + n + i] = x[n - 2 - i];
  }
  return out;
}

function stft(x) {
  const c = x.length;
  const pad = N_FFT / 2;
  const padded = x.map((ch) => reflectPad(ch, pad));
  const nFrames = 1 + Math.floor((padded[0].length - N_FFT) / HOP);
  const out = [];
  for (let k = 0; k < c * 2; k++) out.push(new Float64Array(DIM_F * nFrames));
  const frame = new Float64Array(N_FFT);
  for (let ch = 0; ch < c; ch++) {
    for (let f = 0; f < nFrames; f++) {
      const start = f * HOP;
      for (let i = 0; i < N_FFT; i++) frame[i] = padded[ch][start + i] * HANN[i];
      const spec = fftr.forward(frame);
      const reOut = out[ch * 2];
      const imOut = out[ch * 2 + 1];
      for (let b = 0; b < DIM_F; b++) {
        reOut[b * nFrames + f] = spec[2 * b];
        imOut[b * nFrames + f] = spec[2 * b + 1];
      }
    }
  }
  return { out, nFrames };
}

function istft(x, nFrames, outLen) {
  const c = 2;
  const outFramesLen = (nFrames - 1) * HOP + N_FFT;
  const res = [new Float64Array(outFramesLen), new Float64Array(outFramesLen)];
  const winSum = new Float64Array(outFramesLen);

  const complexFrame = new Float64Array(N_BINS * 2);
  for (let ch = 0; ch < c; ch++) {
    const re = x[ch * 2];
    const im = x[ch * 2 + 1];
    for (let f = 0; f < nFrames; f++) {
      complexFrame.fill(0);
      for (let b = 0; b < DIM_F; b++) {
        complexFrame[2 * b] = re[b * nFrames + f];
        complexFrame[2 * b + 1] = im[b * nFrames + f];
      }
      const timeFrame = fftr.inverse(complexFrame);
      const start = f * HOP;
      for (let i = 0; i < N_FFT; i++) res[ch][start + i] += (timeFrame[i] / N_FFT) * HANN[i];
      if (ch === 0) {
        for (let i = 0; i < N_FFT; i++) winSum[start + i] += HANN[i] * HANN[i];
      }
    }
  }

  const pad = N_FFT / 2;
  const out = [new Float64Array(outLen), new Float64Array(outLen)];
  for (let ch = 0; ch < c; ch++) {
    for (let i = 0; i < outLen; i++) {
      const idx = i + pad;
      const w = winSum[idx] < 1e-11 ? 1.0 : winSum[idx];
      out[ch][i] = res[ch][idx] / w;
    }
  }
  return out;
}

async function runModel(session, ort, mixChunk) {
  const { out, nFrames } = stft(mixChunk);
  for (let ch = 0; ch < 4; ch++) {
    for (let b = 0; b < 3; b++) {
      for (let f = 0; f < nFrames; f++) out[ch][b * nFrames + f] = 0;
    }
  }
  const inputData = new Float32Array(4 * DIM_F * nFrames);
  for (let ch = 0; ch < 4; ch++) {
    for (let b = 0; b < DIM_F; b++) {
      for (let f = 0; f < nFrames; f++) {
        inputData[ch * DIM_F * nFrames + b * nFrames + f] = out[ch][b * nFrames + f];
      }
    }
  }
  const inputName = session.inputNames[0];
  const tensor = new ort.Tensor("float32", inputData, [1, 4, DIM_F, nFrames]);
  const result = await session.run({ [inputName]: tensor });
  const outputName = session.outputNames[0];
  const predData = result[outputName].data;

  const pred = [];
  for (let ch = 0; ch < 4; ch++) {
    const arr = new Float64Array(DIM_F * nFrames);
    for (let i = 0; i < DIM_F * nFrames; i++) arr[i] = predData[ch * DIM_F * nFrames + i];
    pred.push(arr);
  }
  return istft(pred, nFrames, CHUNK_SIZE);
}

async function demix(session, ort, mix, onChunkProgress) {
  const origLen = mix[0].length;
  const gap = GEN_SIZE - (origLen % GEN_SIZE);
  const totalLen = TRIM + origLen + gap;

  const mixture = [new Float64Array(totalLen), new Float64Array(totalLen)];
  for (let ch = 0; ch < 2; ch++) mixture[ch].set(mix[ch], TRIM);

  const step = CHUNK_SIZE - N_FFT;
  const result = [new Float64Array(totalLen), new Float64Array(totalLen)];
  const divider = [new Float64Array(totalLen), new Float64Array(totalLen)];

  const totalChunks = Math.ceil(totalLen / step);
  let chunkIdx = 0;

  for (let i = 0; i < totalLen; i += step) {
    const start = i;
    const end = Math.min(i + CHUNK_SIZE, totalLen);
    const chunkActual = end - start;

    const window = new Float64Array(chunkActual);
    for (let k = 0; k < chunkActual; k++) {
      window[k] = chunkActual > 1 ? 0.5 - 0.5 * Math.cos((2 * Math.PI * k) / (chunkActual - 1)) : 1;
    }

    const mixPart = [new Float64Array(CHUNK_SIZE), new Float64Array(CHUNK_SIZE)];
    for (let ch = 0; ch < 2; ch++) mixPart[ch].set(mixture[ch].subarray(start, end), 0);

    const tarWave = await runModel(session, ort, mixPart);
    for (let ch = 0; ch < 2; ch++) {
      for (let k = 0; k < chunkActual; k++) {
        result[ch][start + k] += tarWave[ch][k] * window[k];
        divider[ch][start + k] += window[k];
      }
    }

    chunkIdx++;
    // Yield back to the worker's event loop between chunks so postMessage
    // (progress) is delivered promptly instead of queuing up behind a long
    // run of synchronous work.
    if (onChunkProgress) onChunkProgress(Math.min(chunkIdx / totalChunks, 1));
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  const source = [new Float64Array(origLen), new Float64Array(origLen)];
  for (let ch = 0; ch < 2; ch++) {
    for (let i = 0; i < origLen; i++) {
      const idx = i + TRIM;
      const d = divider[ch][idx];
      const v = d === 0 ? 0 : result[ch][idx] / d;
      source[ch][i] = v * COMPENSATE;
    }
  }
  return source;
}

// ── Model loading inside the worker ────────────────────────────────────
// Workers have no `document`, so instead of injecting a <script> tag (as
// the main thread does for other tools' ffmpeg loading) we use
// importScripts, which runs the UMD build in this worker's own global
// scope and defines a plain `ort` global here — same script, same self-
// hosted file, just a worker-appropriate loading mechanism.
let ortLoaded = false;
function loadOrt() {
  if (ortLoaded) return self.ort;
  importScripts(ORT_SCRIPT_URL);
  if (!self.ort) throw new Error("onnxruntime-web loaded but self.ort is missing.");
  self.ort.env.wasm.wasmPaths = ORT_WASM_DIR;
  self.ort.env.wasm.numThreads = 1;
  ortLoaded = true;
  return self.ort;
}

let sessionPromise = null;
async function getSession(onModelProgress) {
  if (sessionPromise) return sessionPromise;

  sessionPromise = (async () => {
    const ort = loadOrt();

    const response = await fetch(MODEL_URL);
    if (!response.ok || !response.body) {
      throw new Error(`Failed to download separation model (HTTP ${response.status}).`);
    }
    const total = Number(response.headers.get("content-length")) || 0;
    const reader = response.body.getReader();
    const chunks = [];
    let received = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      if (onModelProgress && total) onModelProgress(Math.min(received / total, 1));
    }
    const modelBytes = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) {
      modelBytes.set(chunk, offset);
      offset += chunk.length;
    }

    const session = await ort.InferenceSession.create(modelBytes, {
      executionProviders: ["wasm"],
    });
    return { session, ort };
  })();

  try {
    return await sessionPromise;
  } catch (err) {
    sessionPromise = null;
    throw err;
  }
}

self.onmessage = async (event) => {
  const msg = event.data;
  if (!msg || msg.type !== "separate") return;

  const { id, left, right } = msg;
  try {
    const { session, ort } = await getSession((ratio) => {
      self.postMessage({ type: "progress", id, phase: "loading-model", ratio });
    });

    const mix = [new Float64Array(left), new Float64Array(right)];
    const vocals = await demix(session, ort, mix, (ratio) => {
      self.postMessage({ type: "progress", id, phase: "processing", ratio });
    });

    const n = mix[0].length;
    const instrumentalLeft = new Float64Array(n);
    const instrumentalRight = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      instrumentalLeft[i] = mix[0][i] - vocals[0][i];
      instrumentalRight[i] = mix[1][i] - vocals[1][i];
    }

    self.postMessage(
      {
        type: "result",
        id,
        left: instrumentalLeft.buffer,
        right: instrumentalRight.buffer,
      },
      [instrumentalLeft.buffer, instrumentalRight.buffer]
    );
  } catch (err) {
    self.postMessage({ type: "error", id, message: err?.message || String(err) });
  }
};
