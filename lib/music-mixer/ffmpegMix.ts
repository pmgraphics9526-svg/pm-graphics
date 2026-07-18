// lib/music-mixer/ffmpegMix.ts
//
// Trims each selected clip, then chains ffmpeg's `acrossfade` filter between
// every consecutive pair so transitions are a smooth blend instead of a
// "jhatka" hard cut. Everything happens in the browser via ffmpeg.wasm —
// no upload, no server cost.

export interface ClipSelection {
  file: File;
  start: number; // seconds, already beat-snapped
  end: number; // seconds, already beat-snapped
}

export interface MixOptions {
  clips: ClipSelection[];
  crossfadeSeconds?: number; // default 0.75s, within the 0.5–1s spec range
  outputFormat?: "mp3" | "wav";
  onProgress?: (ratio: number) => void; // 0..1, mixing/processing progress
  onLoadProgress?: (ratio: number) => void; // 0..1, one-time engine download progress
}

// Load dynamically on window in the browser, avoiding any bundler compiling
let ffmpegInstance: any = null;

// Fetches a URL while reporting byte-level download progress. ffmpeg.load()'s
// own internal fetch is opaque (no progress events), so this pre-fetch is
// what actually drives the loading UI; the browser's HTTP cache (see the
// immutable Cache-Control on /ffmpeg/*) then makes ffmpeg.load()'s own
// fetch of the same URL resolve instantly right after.
async function fetchWithProgress(
  url: string,
  onChunk?: (loadedBytes: number) => void
): Promise<Blob> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`);
  }
  if (!res.body) {
    // No streaming support (rare) — fall back to a single non-progressive read.
    return res.blob();
  }

  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;
    if (onChunk) onChunk(loaded);
  }

  return new Blob(chunks as BlobPart[]);
}

async function getFFmpeg(
  onLog?: (msg: string) => void,
  onLoadProgress?: (ratio: number) => void
): Promise<any> {
  if (ffmpegInstance) return ffmpegInstance;

  if (typeof window === "undefined") {
    throw new Error("FFmpeg can only be loaded in the browser context.");
  }

  const FFmpegClass = (window as any).FFmpegWASM?.FFmpeg;
  if (!FFmpegClass) {
    throw new Error("FFmpeg library is not loaded on window. Make sure /ffmpeg/ffmpeg.js is included.");
  }

  const ffmpeg = new FFmpegClass();

  // Register a default console logger for debugging, and a custom one if provided
  ffmpeg.on("log", ({ message }: any) => {
    console.log("[ffmpeg]", message);
    if (onLog) {
      onLog(message);
    }
  });

  // Load from local public/ffmpeg folder to avoid cross-origin / COEP blocking issues
  const baseURL = window.location.origin + "/ffmpeg";

  try {
    console.log(`[ffmpeg] Initializing engine... loading core files from local paths under: ${baseURL}`);

    // ffmpeg-core.wasm is ~32MB — the dominant cost by far (ffmpeg-core.js
    // is ~110KB). Passing blob: URLs to ffmpeg.load() is the usual trick
    // for progress-tracked loading, but it doesn't work here: with
    // COEP: require-corp active (needed for SharedArrayBuffer), Chrome's
    // internal fetch of a blob: URL fails outright (TypeError: Failed to
    // fetch) — confirmed by testing. So instead: fetch both files
    // ourselves first purely to drive the progress UI and warm the HTTP
    // cache (these files are served with a long immutable Cache-Control),
    // then hand ffmpeg.load() the original same-origin URLs — its
    // internal fetch resolves from that warm cache instantly rather than
    // re-downloading.
    const ESTIMATED_WASM_BYTES = 32_000_000;

    const headRes = await fetch(`${baseURL}/ffmpeg-core.wasm`, { method: "HEAD" }).catch(() => null);
    const wasmTotal = Number(headRes?.headers.get("content-length")) || ESTIMATED_WASM_BYTES;
    const jsTotal = 115_000; // ffmpeg-core.js is tiny relative to the wasm; a rough estimate is fine
    const grandTotal = wasmTotal + jsTotal;

    let jsLoaded = 0;
    let wasmLoaded = 0;
    const reportCombined = () => {
      if (!onLoadProgress) return;
      // Capped at 0.98, not 1 — these are OUR download fetches finishing,
      // not ffmpeg.load() itself. ffmpeg.load() still has to instantiate/
      // compile the ~32MB WASM module after this, which is not
      // instantaneous. Reporting 100% here (as an earlier version did)
      // made the UI flip to "Mixing... 0%" while still genuinely inside
      // the load step — a real bug: it looked like mixing was hung at 0%
      // when it was actually still compiling the WASM module.
      onLoadProgress(Math.min(0.98, (jsLoaded + wasmLoaded) / grandTotal));
    };

    console.log("[ffmpeg] Phase: downloading core files...");
    await Promise.all([
      fetchWithProgress(`${baseURL}/ffmpeg-core.js`, (loaded) => {
        jsLoaded = loaded;
        reportCombined();
      }),
      fetchWithProgress(`${baseURL}/ffmpeg-core.wasm`, (loaded) => {
        wasmLoaded = loaded;
        reportCombined();
      }),
    ]);
    console.log("[ffmpeg] Phase: core files downloaded, instantiating WASM module...");

    // True fallback only — normal loads finish via the fetches above and
    // never hit this. This guards against a genuinely stuck/dead
    // connection (e.g. WiFi drops mid-download) rather than being the
    // primary UX, which is now the real progress percentage above.
    // Distinct message from the exec-phase timeout below so a failure
    // here is never confused with a hang during the actual mix/trim/
    // noise-reduce operation.
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Loading audio engine timed out after 4 minutes")), 240000)
    );

    // Note: The UMD build resolves its worker chunk '814.ffmpeg.js' relative to the path where ffmpeg.js was loaded.
    const loadPromise = ffmpeg.load({
      classWorkerURL: window.location.origin + "/ffmpeg/worker.js",
      coreURL: `${baseURL}/ffmpeg-core.js`,
      wasmURL: `${baseURL}/ffmpeg-core.wasm`,
    });

    await Promise.race([loadPromise, timeoutPromise]);
    if (onLoadProgress) onLoadProgress(1); // only now is loading truly complete
    console.log("[ffmpeg] Phase: audio engine loaded successfully, ready to exec.");
  } catch (err) {
    console.error("[ffmpeg] FATAL ERROR: Failed to load ffmpeg core files from self-hosted paths.", err);
    throw err;
  }

  ffmpegInstance = ffmpeg;
  return ffmpeg;
}

// Runs ffmpeg.exec() with its own timeout and explicit before/after logging,
// completely separate from the load-phase timeout in getFFmpeg(). Before
// this, a hang here had NO timeout at all (the load timeoutPromise only
// wraps ffmpeg.load(), which has already resolved by the time exec() runs)
// — it would hang forever with no error, or on retry surface the load
// timeout's message even though the actual stall was here, which is
// exactly the mislabeling this fixes.
async function execWithTimeout(
  ffmpeg: any,
  args: string[],
  label: string,
  timeoutMs = 180000
): Promise<number> {
  console.log(`[ffmpeg] exec start (${label}): ffmpeg ${args.join(" ")}`);
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error(`${label} timed out after ${Math.round(timeoutMs / 1000)}s`)),
      timeoutMs
    )
  );
  const result = await Promise.race([ffmpeg.exec(args), timeoutPromise]);
  console.log(`[ffmpeg] exec finished (${label}), exit code:`, result);
  return result as number;
}

/**
 * Mix 2–4 selected clips into a single downloadable track with automatic
 * crossfades at every join. Returns a Blob the caller can turn into an
 * object URL for preview/download.
 */
export async function mixTracks({
  clips,
  crossfadeSeconds = 0.75,
  outputFormat = "mp3",
  onProgress,
  onLoadProgress,
}: MixOptions): Promise<Blob> {
  if (clips.length < 2) {
    throw new Error("Select at least 2 clips to mix.");
  }

  const ffmpeg = await getFFmpeg(undefined, onLoadProgress);

  // Store listener ref so we can remove it after the operation — prevents
  // stale listeners from stacking up on repeated calls (memory leak fix).
  let progressListener: ((e: any) => void) | null = null;
  if (onProgress) {
    progressListener = ({ progress, time }: any) => {
      console.log(`[ffmpeg] mix progress: ${(progress * 100).toFixed(1)}% (time=${time})`);
      onProgress(Math.min(progress, 1));
    };
    ffmpeg.on("progress", progressListener);
  }

  try {
    // Write each source file into ffmpeg's virtual FS.
    console.log(`[ffmpeg] writing ${clips.length} input file(s) to virtual FS...`);
    const inputNames: string[] = [];
    for (let i = 0; i < clips.length; i++) {
      const name = `in${i}.input`;
      // Use native arrayBuffer to write the file, completely avoiding @ffmpeg/util's fetchFile
      const arrayBuffer = await clips[i].file.arrayBuffer();
      await ffmpeg.writeFile(name, new Uint8Array(arrayBuffer));
      inputNames.push(name);
      console.log(`[ffmpeg] wrote ${name} (${arrayBuffer.byteLength} bytes)`);
    }

    // Build filter_complex: trim each clip to its selection, then chain
    // acrossfade across every consecutive pair.
    const trimLabels: string[] = [];
    const filterParts: string[] = [];

    clips.forEach((clip, i) => {
      const dur = Math.max(0, clip.end - clip.start);
      const label = `t${i}`;
      filterParts.push(
        `[${i}:a]atrim=start=${clip.start}:duration=${dur},asetpts=PTS-STARTPTS[${label}]`
      );
      trimLabels.push(label);
    });

    let chainLabel = trimLabels[0];
    for (let i = 1; i < trimLabels.length; i++) {
      const outLabel = i === trimLabels.length - 1 ? "mixout" : `x${i}`;
      filterParts.push(
        `[${chainLabel}][${trimLabels[i]}]acrossfade=d=${crossfadeSeconds}:c1=tri:c2=tri[${outLabel}]`
      );
      chainLabel = outLabel;
    }

    const filterComplex = filterParts.join(";");
    const outputName = outputFormat === "mp3" ? "mixed_output.mp3" : "mixed_output.wav";

    const args: string[] = [];
    inputNames.forEach((name) => {
      args.push("-i", name);
    });
    args.push("-filter_complex", filterComplex, "-map", "[mixout]");
    if (outputFormat === "mp3") {
      args.push("-c:a", "libmp3lame", "-q:a", "2");
    }
    args.push(outputName);

    await execWithTimeout(ffmpeg, args, "Mixing");

    const data = await ffmpeg.readFile(outputName);
    const mime = outputFormat === "mp3" ? "audio/mpeg" : "audio/wav";
    return new Blob([data as any], { type: mime });
  } finally {
    // Always remove the progress listener to prevent memory leaks
    if (progressListener) ffmpeg.off("progress", progressListener);
  }
}

/**
 * Trim a single audio file from start to end (in seconds).
 */
export async function trimAudio(
  file: File,
  start: number,
  end: number,
  outputFormat: "mp3" | "wav" = "mp3",
  onProgress?: (ratio: number) => void,
  onLoadProgress?: (ratio: number) => void
): Promise<Blob> {
  const ffmpeg = await getFFmpeg(undefined, onLoadProgress);

  let progressListener: ((e: any) => void) | null = null;
  if (onProgress) {
    progressListener = ({ progress, time }: any) => {
      console.log(`[ffmpeg] trim progress: ${(progress * 100).toFixed(1)}% (time=${time})`);
      onProgress(Math.min(progress, 1));
    };
    ffmpeg.on("progress", progressListener);
  }

  try {
    const inputName = "input.file";
    const arrayBuffer = await file.arrayBuffer();
    await ffmpeg.writeFile(inputName, new Uint8Array(arrayBuffer));
    console.log(`[ffmpeg] wrote ${inputName} (${arrayBuffer.byteLength} bytes)`);

    const outputName = outputFormat === "mp3" ? "trimmed_output.mp3" : "trimmed_output.wav";
    const dur = Math.max(0, end - start);

    const args = [
      "-i", inputName,
      "-af", `atrim=start=${start}:duration=${dur},asetpts=PTS-STARTPTS`
    ];
    if (outputFormat === "mp3") {
      args.push("-c:a", "libmp3lame", "-q:a", "2");
    }
    args.push(outputName);

    await execWithTimeout(ffmpeg, args, "Trimming");

    const data = await ffmpeg.readFile(outputName);
    const mime = outputFormat === "mp3" ? "audio/mpeg" : "audio/wav";
    return new Blob([data as any], { type: mime });
  } finally {
    if (progressListener) ffmpeg.off("progress", progressListener);
  }
}

/**
 * Reduce background noise from an audio file.
 * Tries arnndn (RNN-based) for better non-stationary noise (like wind) suppression.
 * Falls back to tuned afftdn (FFT-based) if arnndn isn't available.
 */
export async function reduceNoise(
  file: File,
  outputFormat: "mp3" | "wav" = "mp3",
  onProgress?: (ratio: number) => void,
  onLoadProgress?: (ratio: number) => void
): Promise<Blob> {
  const ffmpeg = await getFFmpeg(undefined, onLoadProgress);

  let progressListener: ((e: any) => void) | null = null;
  if (onProgress) {
    progressListener = ({ progress, time }: any) => {
      console.log(`[ffmpeg] noise-reduce progress: ${(progress * 100).toFixed(1)}% (time=${time})`);
      onProgress(Math.min(progress, 1));
    };
    ffmpeg.on("progress", progressListener);
  }

  try {
    const inputName = "input_noise.file";
    const arrayBuffer = await file.arrayBuffer();
    await ffmpeg.writeFile(inputName, new Uint8Array(arrayBuffer));
    console.log(`[ffmpeg] wrote ${inputName} (${arrayBuffer.byteLength} bytes)`);

    const outputName = outputFormat === "mp3" ? "cleaned_output.mp3" : "cleaned_output.wav";

    let arnndnSuccess = false;
    const modelName = "std.rnnn";

    try {
      // Attempt to load the RNNoise model
      const modelResponse = await fetch("/audio-models/std.rnnn");
      if (modelResponse.ok) {
        const modelBuffer = await modelResponse.arrayBuffer();
        await ffmpeg.writeFile(modelName, new Uint8Array(modelBuffer));

        const args = [
          "-i", inputName,
          "-af", `highpass=f=100,arnndn=m=${modelName}`
        ];
        if (outputFormat === "mp3") {
          args.push("-c:a", "libmp3lame", "-q:a", "2");
        }
        args.push(outputName);

        const code = await execWithTimeout(ffmpeg, args, "Noise reduction (arnndn)");

        // Check if output file was actually created successfully
        try {
          await ffmpeg.readFile(outputName);
          if (code === 0) arnndnSuccess = true;
        } catch (e) {
          arnndnSuccess = false;
        }
      }
    } catch (err) {
      console.warn("[ffmpeg] arnndn attempt failed or timed out, falling back to afftdn:", err);
    }

    if (!arnndnSuccess) {
      console.log("[ffmpeg] Using afftdn fallback for noise reduction");
      const fallbackArgs = [
        "-i", inputName,
        "-af", "highpass=f=100,afftdn=nr=10:nf=-20:tn=1"
      ];
      if (outputFormat === "mp3") {
        fallbackArgs.push("-c:a", "libmp3lame", "-q:a", "2");
      }
      fallbackArgs.push(outputName);

      await execWithTimeout(ffmpeg, fallbackArgs, "Noise reduction (afftdn)");
    }

    const data = await ffmpeg.readFile(outputName);
    const mime = outputFormat === "mp3" ? "audio/mpeg" : "audio/wav";
    return new Blob([data as any], { type: mime });
  } finally {
    // Always remove the progress listener — prevents stacking on repeated calls
    if (progressListener) ffmpeg.off("progress", progressListener);
  }
}
