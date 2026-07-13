// lib/vocal-remover/mdxSeparate.js
//
// Client-side vocal/instrumental separation using an MDX-Net model
// (Kim_Vocal_2, from the Ultimate Vocal Remover project — see
// public/audio-models/Kim_Vocal_2.onnx). Runs entirely in the browser via
// onnxruntime-web (WASM). No upload, no server cost.
//
// The STFT/ISTFT framing, windowing and chunked overlap-add are a direct
// port of UVR's own SeperateMDX.demix()/run_model() and the STFT class in
// lib_v5/tfc_tdf_v3.py, so the output matches what the UVR desktop app
// itself produces for this model. Verified numerically against a
// Python/numpy + onnxruntime reference (STFT relative RMS error ~1e-7,
// full pipeline relative RMS error ~2e-8 on a synthetic test signal).
//
// The actual separation (model download + STFT/ISTFT + inference) runs in
// separation.worker.js, off the main thread — that loop is CPU-heavy
// synchronous JS and was triggering Chrome's "Page Unresponsive" dialog
// when run inline. This file just decodes audio, ships the PCM to the
// worker, and encodes whatever comes back. See separation.worker.js for
// the actual DSP/inference code.
//
// This module is isolated from lib/music-mixer/ on purpose — it does not
// import or modify anything used by the other free tools.

const SAMPLE_RATE = 44100;

// ── Separation worker (persistent, lazily created) ─────────────────────────
let worker = null;
let nextRequestId = 0;

function getWorker() {
  if (typeof window === "undefined") {
    throw new Error("The separation worker can only be created in the browser.");
  }
  if (!worker) {
    worker = new Worker(new URL("./separation.worker.js", import.meta.url));
  }
  return worker;
}

/**
 * Send a stereo PCM buffer to the separation worker and resolve with the
 * separated instrumental PCM. Progress callback receives ("loading-model" |
 * "processing", ratio) exactly like the phases reported by removeVocals.
 */
function separateInWorker(mix, onProgress) {
  return new Promise((resolve, reject) => {
    const w = getWorker();
    const id = nextRequestId++;

    const handleMessage = (event) => {
      const msg = event.data;
      if (!msg || msg.id !== id) return;

      if (msg.type === "progress") {
        if (onProgress) onProgress(msg.phase, msg.ratio);
      } else if (msg.type === "result") {
        w.removeEventListener("message", handleMessage);
        w.removeEventListener("error", handleError);
        resolve([new Float64Array(msg.left), new Float64Array(msg.right)]);
      } else if (msg.type === "error") {
        w.removeEventListener("message", handleMessage);
        w.removeEventListener("error", handleError);
        reject(new Error(msg.message));
      }
    };
    const handleError = (event) => {
      w.removeEventListener("message", handleMessage);
      w.removeEventListener("error", handleError);
      reject(new Error(event.message || "Separation worker crashed."));
    };

    w.addEventListener("message", handleMessage);
    w.addEventListener("error", handleError);

    // mix[0]/mix[1] may be subarray() views sharing a buffer with the
    // full-length decode — copy before transferring so we don't detach
    // memory the caller (or a later "full song" re-run) still needs.
    const left = Float64Array.from(mix[0]);
    const right = Float64Array.from(mix[1]);
    w.postMessage({ type: "separate", id, left: left.buffer, right: right.buffer }, [left.buffer, right.buffer]);
  });
}

// ── Audio decode (Web Audio API → stereo Float64 PCM @ 44100Hz) ───────────
async function decodeToStereoPCM(file) {
  const arrayBuffer = await file.arrayBuffer();
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const probeCtx = new AudioCtx();
  let decoded;
  try {
    decoded = await probeCtx.decodeAudioData(arrayBuffer.slice(0));
  } finally {
    probeCtx.close();
  }

  let audioBuffer = decoded;
  if (decoded.sampleRate !== SAMPLE_RATE) {
    const offline = new OfflineAudioContext(
      2,
      Math.ceil((decoded.duration * SAMPLE_RATE)),
      SAMPLE_RATE
    );
    const src = offline.createBufferSource();
    src.buffer = decoded;
    src.connect(offline.destination);
    src.start();
    audioBuffer = await offline.startRendering();
  }

  const left = new Float64Array(audioBuffer.getChannelData(0));
  const right = new Float64Array(
    audioBuffer.numberOfChannels > 1 ? audioBuffer.getChannelData(1) : audioBuffer.getChannelData(0)
  );
  return { mix: [left, right], sampleRate: SAMPLE_RATE, duration: audioBuffer.duration };
}

function encodeWav(channels, sampleRate) {
  const numChannels = channels.length;
  const numSamples = channels[0].length;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = numSamples * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeStr = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bytesPerSample * 8, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const s = Math.max(-1, Math.min(1, channels[ch][i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }
  }
  return new Uint8Array(buffer);
}

// ── Isolated ffmpeg.wasm loader (deliberately not shared with
//    lib/music-mixer/ffmpegMix.ts, to keep this tool self-contained) ──────
let ffmpegInstance = null;
async function getFFmpeg() {
  if (ffmpegInstance) return ffmpegInstance;
  if (typeof window === "undefined") throw new Error("FFmpeg can only load in the browser.");

  const FFmpegClass = window.FFmpegWASM?.FFmpeg;
  if (!FFmpegClass) throw new Error("FFmpeg library is not loaded. Make sure /ffmpeg/ffmpeg.js is included.");

  const ffmpeg = new FFmpegClass();
  const baseURL = window.location.origin + "/ffmpeg";
  await ffmpeg.load({
    classWorkerURL: window.location.origin + "/ffmpeg/worker.js",
    coreURL: `${baseURL}/ffmpeg-core.js`,
    wasmURL: `${baseURL}/ffmpeg-core.wasm`,
  });
  ffmpegInstance = ffmpeg;
  return ffmpeg;
}

async function encodeToMp3(channels, sampleRate) {
  const ffmpeg = await getFFmpeg();
  const wavBytes = encodeWav(channels, sampleRate);
  await ffmpeg.writeFile("vocal_remover_input.wav", wavBytes);
  await ffmpeg.exec(["-i", "vocal_remover_input.wav", "-c:a", "libmp3lame", "-q:a", "2", "vocal_remover_output.mp3"]);
  const data = await ffmpeg.readFile("vocal_remover_output.mp3");
  return new Blob([data], { type: "audio/mpeg" });
}

/**
 * Remove vocals from an audio file, returning a downloadable instrumental
 * MP3 Blob. Everything runs client-side: MDX-Net separation via
 * onnxruntime-web (WASM), final encode via ffmpeg.wasm.
 *
 * @param {File} file
 * @param {(phase: "loading-model"|"decoding"|"processing"|"encoding", ratio: number) => void} onProgress
 * @param {{start: number, end: number}} [trimRange] - optional selection (seconds).
 *   Only this slice of the decoded audio is separated, so a short trim
 *   processes in a fraction of the time a full song would take. Omit to
 *   process the full track.
 */
export async function removeVocals(file, onProgress, trimRange) {
  const report = (phase, ratio) => {
    if (onProgress) onProgress(phase, ratio);
  };

  report("decoding", 0);
  const { mix: fullMix, sampleRate } = await decodeToStereoPCM(file);
  report("decoding", 1);

  let mix = fullMix;
  if (trimRange) {
    const startSample = Math.max(0, Math.round(trimRange.start * sampleRate));
    const endSample = Math.min(fullMix[0].length, Math.round(trimRange.end * sampleRate));
    mix = [fullMix[0].subarray(startSample, endSample), fullMix[1].subarray(startSample, endSample)];
  }

  // Model download + STFT/ISTFT + inference all happen inside the worker,
  // off the main thread — see separation.worker.js. It reports both the
  // "loading-model" (first run only) and "processing" phases.
  const instrumental = await separateInWorker(mix, report);

  report("encoding", 0);
  const blob = await encodeToMp3(instrumental, sampleRate);
  report("encoding", 1);

  return blob;
}
