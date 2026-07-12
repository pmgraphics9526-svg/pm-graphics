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
  onProgress?: (ratio: number) => void; // 0..1
}

// Load dynamically on window in the browser, avoiding any bundler compiling
let ffmpegInstance: any = null;

async function getFFmpeg(onLog?: (msg: string) => void): Promise<any> {
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
    
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("FFmpeg loading timed out after 15 seconds")), 15000)
    );

    // Note: The UMD build resolves its worker chunk '814.ffmpeg.js' relative to the path where ffmpeg.js was loaded.
    const loadPromise = ffmpeg.load({
      classWorkerURL: window.location.origin + "/ffmpeg/worker.js",
      coreURL: `${baseURL}/ffmpeg-core.js`,
      wasmURL: `${baseURL}/ffmpeg-core.wasm`,
    });

    await Promise.race([loadPromise, timeoutPromise]);
    console.log("[ffmpeg] Audio engine loaded successfully.");
  } catch (err) {
    console.error("[ffmpeg] FATAL ERROR: Failed to load ffmpeg core files from self-hosted paths.", err);
    throw err;
  }

  ffmpegInstance = ffmpeg;
  return ffmpeg;
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
}: MixOptions): Promise<Blob> {
  if (clips.length < 2) {
    throw new Error("Select at least 2 clips to mix.");
  }

  const ffmpeg = await getFFmpeg();

  // Store listener ref so we can remove it after the operation — prevents
  // stale listeners from stacking up on repeated calls (memory leak fix).
  let progressListener: ((e: any) => void) | null = null;
  if (onProgress) {
    progressListener = ({ progress }: any) => onProgress(Math.min(progress, 1));
    ffmpeg.on("progress", progressListener);
  }

  try {
    // Write each source file into ffmpeg's virtual FS.
    const inputNames: string[] = [];
    for (let i = 0; i < clips.length; i++) {
      const name = `in${i}.input`;
      // Use native arrayBuffer to write the file, completely avoiding @ffmpeg/util's fetchFile
      const arrayBuffer = await clips[i].file.arrayBuffer();
      await ffmpeg.writeFile(name, new Uint8Array(arrayBuffer));
      inputNames.push(name);
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

    await ffmpeg.exec(args);

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
  onProgress?: (ratio: number) => void
): Promise<Blob> {
  const ffmpeg = await getFFmpeg();

  let progressListener: ((e: any) => void) | null = null;
  if (onProgress) {
    progressListener = ({ progress }: any) => onProgress(Math.min(progress, 1));
    ffmpeg.on("progress", progressListener);
  }

  try {
    const inputName = "input.file";
    const arrayBuffer = await file.arrayBuffer();
    await ffmpeg.writeFile(inputName, new Uint8Array(arrayBuffer));

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

    await ffmpeg.exec(args);

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
  onProgress?: (ratio: number) => void
): Promise<Blob> {
  const ffmpeg = await getFFmpeg();

  let progressListener: ((e: any) => void) | null = null;
  if (onProgress) {
    progressListener = ({ progress }: any) => onProgress(Math.min(progress, 1));
    ffmpeg.on("progress", progressListener);
  }

  try {
    const inputName = "input_noise.file";
    const arrayBuffer = await file.arrayBuffer();
    await ffmpeg.writeFile(inputName, new Uint8Array(arrayBuffer));

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

        const code = await ffmpeg.exec(args);

        // Check if output file was actually created successfully
        try {
          await ffmpeg.readFile(outputName);
          if (code === 0) arnndnSuccess = true;
        } catch (e) {
          arnndnSuccess = false;
        }
      }
    } catch (err) {
      console.warn("arnndn setup failed, will fallback to afftdn", err);
    }

    if (!arnndnSuccess) {
      console.log("Using afftdn fallback for noise reduction");
      const fallbackArgs = [
        "-i", inputName,
        "-af", "highpass=f=100,afftdn=nr=10:nf=-20:tn=1"
      ];
      if (outputFormat === "mp3") {
        fallbackArgs.push("-c:a", "libmp3lame", "-q:a", "2");
      }
      fallbackArgs.push(outputName);

      await ffmpeg.exec(fallbackArgs);
    }

    const data = await ffmpeg.readFile(outputName);
    const mime = outputFormat === "mp3" ? "audio/mpeg" : "audio/wav";
    return new Blob([data as any], { type: mime });
  } finally {
    // Always remove the progress listener — prevents stacking on repeated calls
    if (progressListener) ffmpeg.off("progress", progressListener);
  }
}
