// lib/video-editor/export.ts
//
// Real ffmpeg.wasm export pipeline for the Manual Video Editor
// (/dev-tools/video-editor). Renders every edit currently held in that
// page's state — Phase 1 split/trim, Phase 2 crop/rotate/flip/speed,
// Phase 3 text overlays, Phase 4 color grading, and the Phase 1 separately-
// uploaded audio track — into one downloadable MP4.
//
// Reuses the same self-hosted-core-files + fetch-then-warm-cache loading
// pattern proven in lib/music-mixer/ffmpegMix.ts: blob: URLs don't work
// under COEP: require-corp, so the core/wasm files are pre-fetched (driving
// the load-progress UI and warming the browser's HTTP cache, which is
// served with a long immutable Cache-Control), then ffmpeg.load() is handed
// the same same-origin URLs so its own internal fetch resolves instantly.
// This module keeps its own module-scoped ffmpeg singleton (not shared with
// Music Mixer's) since the two tools are never mounted at the same time —
// each is a full page navigation — so there's nothing to gain by sharing
// one, and it avoids coupling two otherwise-independent tools together.
//
// SCOPE DECISION (documented, not hidden): a video segment's own embedded
// audio (if the uploaded video file has one) is intentionally carried
// through per-segment, speed-adjusted via atempo in lock-step with that
// segment's setpts video-speed change — this is the one place atempo is
// actually exercised, per the task's explicit requirement. The separately-
// uploaded Audio track (Phase 1's "Audio" row) has no per-block speed
// control anywhere in the UI, so its blocks are only trimmed/concatenated,
// never atempo'd, then amix'd on top of the edited video's own audio as an
// additional layer — "mixed in", not a replacement.

export interface CropRect {
  x: number; // 0-100, % from left of the video frame
  y: number; // 0-100, % from top of the video frame
  width: number; // 0-100, % of frame width
  height: number; // 0-100, % of frame height
}

export interface ColorGrade {
  brightness: number; // -100..100, 0 = no change
  contrast: number; // -100..100, 0 = no change
  saturation: number; // -100..100, 0 = no change
}

export interface SegmentEdit {
  crop: CropRect;
  rotation: 0 | 90 | 180 | 270;
  flipH: boolean;
  flipV: boolean;
  speed: number; // 0.25 - 3
  color: ColorGrade;
}

export interface ExportVideoSegment {
  id: string;
  sourceStart: number; // seconds, in the ORIGINAL uploaded video's own timeline
  sourceEnd: number; // seconds
  edit: SegmentEdit;
}

export interface ExportAudioSegment {
  sourceStart: number; // seconds, in the uploaded audio file's own timeline
  sourceEnd: number;
}

export interface ExportTextOverlay {
  content: string;
  // x/y are 0-100% and fontSize is raw px — all three are applied against
  // the FINAL target export canvas (see buildSegmentVideoFilter's own doc
  // comment for why: drawtext runs last, after every segment is scaled to
  // the same canvas, so text stays upright and consistently positioned
  // regardless of an individual segment's crop/rotation).
  x: number;
  y: number;
  fontSize: number;
  color: string; // hex, e.g. "#f5f1ea"
  startTime: number; // seconds, in the ORIGINAL uploaded video's own timeline
  endTime: number;
}

export type ExportAspectRatio = "16:9" | "9:16" | "1:1";

const EXPORT_RESOLUTIONS: Record<ExportAspectRatio, { width: number; height: number }> = {
  "16:9": { width: 1280, height: 720 },
  "9:16": { width: 720, height: 1280 },
  "1:1": { width: 720, height: 720 },
};

export interface ExportOptions {
  videoFile: File;
  videoWidth: number; // native resolution of the uploaded video, for crop % -> px conversion
  videoHeight: number;
  aspectRatio: ExportAspectRatio;
  segments: ExportVideoSegment[]; // in final timeline order (post drag-reorder)
  textOverlays: ExportTextOverlay[];
  audioFile: File | null;
  audioSegments: ExportAudioSegment[]; // in order; only used if audioFile is set
  onLoadProgress?: (ratio: number) => void; // 0..1, one-time engine download
  onProgress?: (ratio: number) => void; // 0..1, overall export progress
  onStage?: (label: string) => void; // human-readable current step
}

// ---- ffmpeg singleton + loading (pattern matches ffmpegMix.ts) ----

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ffmpegInstance: any = null;

async function fetchWithProgress(url: string, onChunk?: (loadedBytes: number) => void): Promise<Blob> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`);
  if (!res.body) return res.blob();
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;
    if (onChunk) onChunk(loaded);
  }
  return new Blob(chunks as BlobPart[]);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getFFmpeg(onLoadProgress?: (ratio: number) => void): Promise<any> {
  if (ffmpegInstance) return ffmpegInstance;
  if (typeof window === "undefined") {
    throw new Error("FFmpeg can only be loaded in the browser context.");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const FFmpegClass = (window as any).FFmpegWASM?.FFmpeg;
  if (!FFmpegClass) {
    throw new Error("FFmpeg library is not loaded on window. Make sure /ffmpeg/ffmpeg.js is included.");
  }

  const ffmpeg = new FFmpegClass();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ffmpeg.on("log", ({ message }: any) => console.log("[ffmpeg]", message));

  const baseURL = window.location.origin + "/ffmpeg";
  const ESTIMATED_WASM_BYTES = 32_000_000;

  const headRes = await fetch(`${baseURL}/ffmpeg-core.wasm`, { method: "HEAD" }).catch(() => null);
  const wasmTotal = Number(headRes?.headers.get("content-length")) || ESTIMATED_WASM_BYTES;
  const jsTotal = 115_000;
  const grandTotal = wasmTotal + jsTotal;

  let jsLoaded = 0;
  let wasmLoaded = 0;
  const reportCombined = () => {
    if (!onLoadProgress) return;
    // Capped below 1 — these are our own warm-up fetches finishing, not
    // ffmpeg.load() itself, which still has to instantiate/compile the wasm
    // module after this (see the identical note in ffmpegMix.ts — reporting
    // 100% here previously caused a "stuck at 0%" illusion in Music Mixer).
    onLoadProgress(Math.min(0.98, (jsLoaded + wasmLoaded) / grandTotal));
  };

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

  // Distinct message and distinct phase from execWithTimeout's below — a
  // failure here must never be reported as "Export timed out" (that label
  // is reserved for the actual render/exec phase). Getting this mislabeled
  // is the exact bug this project hit earlier with Music Mixer.
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Loading video engine timed out after 4 minutes")), 240000)
  );
  const loadPromise = ffmpeg.load({
    classWorkerURL: window.location.origin + "/ffmpeg/worker.js",
    coreURL: `${baseURL}/ffmpeg-core.js`,
    wasmURL: `${baseURL}/ffmpeg-core.wasm`,
  });
  await Promise.race([loadPromise, timeoutPromise]);
  if (onLoadProgress) onLoadProgress(1);

  ffmpegInstance = ffmpeg;
  return ffmpeg;
}

// Separate timeout from the load phase above, with its own clearly-labeled
// message — so a hang during actual rendering is never confused with (or
// reported as) a loading-phase failure, and vice versa.
async function execWithTimeout(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ffmpeg: any,
  args: string[],
  label: string,
  timeoutMs = 300000
): Promise<number> {
  console.log(`[ffmpeg] exec start (${label}): ffmpeg ${args.join(" ")}`);
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Export timed out during "${label}" after ${Math.round(timeoutMs / 1000)}s`)), timeoutMs)
  );
  const result = await Promise.race([ffmpeg.exec(args), timeoutPromise]);
  console.log(`[ffmpeg] exec finished (${label}), exit code:`, result);
  return result as number;
}

// ---- pure helpers (no ffmpeg needed — safe to unit-test in isolation) ----

/** Decomposes a 0.25x-3x speed into a chain of atempo factors, each within
 * the 0.5-2.0 range ffmpeg's atempo filter supports per instance. */
export function buildAtempoChain(speed: number): string[] {
  const clamped = Math.max(0.25, Math.min(3, speed));
  const factors: number[] = [];
  let remaining = clamped;
  while (remaining > 2) {
    factors.push(2);
    remaining /= 2;
  }
  while (remaining < 0.5) {
    factors.push(0.5);
    remaining /= 0.5;
  }
  factors.push(remaining);
  return factors.map((f) => `atempo=${f.toFixed(4)}`);
}

function roundToEven(n: number): number {
  const r = Math.round(n);
  return r % 2 === 0 ? r : r + 1;
}

function escapeDrawtext(text: string): string {
  return text
    .replace(/\\/g, "\\\\\\\\")
    .replace(/:/g, "\\:")
    .replace(/'/g, "’")
    .replace(/%/g, "\\%")
    .replace(/\r?\n/g, " ");
}

function hexToDrawtextColor(hex: string): string {
  const clean = hex.replace("#", "");
  return clean.length === 6 || clean.length === 8 ? `0x${clean}` : "white";
}

function isDefaultCrop(c: CropRect): boolean {
  return c.x === 0 && c.y === 0 && c.width === 100 && c.height === 100;
}

function isDefaultColor(c: ColorGrade): boolean {
  return c.brightness === 0 && c.contrast === 0 && c.saturation === 0;
}

/** Builds the video-stream filter chain for one segment. Order matters:
 * trim+rebase -> crop -> rotate/flip -> speed (setpts) -> color eq ->
 * scale/pad to the common export canvas (required for the final concat
 * filter, since segments can have different crop/rotation choices and
 * therefore different pixel dimensions after crop+rotate alone) -> drawtext
 * LAST, on the final upright canvas.
 *
 * drawtext specifically has to be the last step, not interleaved earlier:
 * it burns actual pixels, so if it ran before rotate/flip those filters
 * would flip the burned-in text right along with the footage — verified by
 * hitting exactly this bug (mirrored, backwards captions on a flipped
 * segment) in manual testing. Text overlays are a UI-level caption layer,
 * not part of the source footage, and must stay upright/readable regardless
 * of what rotation or flip the underlying clip has. Positioning is
 * therefore expressed as a percentage of the FINAL target canvas (the same
 * one every segment gets scaled/padded into), not the source video's own
 * resolution — simpler, and consistent across segments with different crop/
 * rotation choices. The one tradeoff: text is no longer clipped by an
 * individual segment's crop region the way the live preview's dim-overlay
 * visually suggested — a deliberate, documented choice, since "captions
 * must never render mirrored" is the more clearly-correct behavior to
 * guarantee. Timing uses each overlay's own segment-local, POST-speed clock
 * (t after setpts=PTS/speed already reflects the sped-up timeline), so a
 * caption's on-screen duration scales naturally with that segment's speed. */
function buildSegmentVideoFilter(
  segment: ExportVideoSegment,
  overlays: ExportTextOverlay[],
  videoWidth: number,
  videoHeight: number,
  targetWidth: number,
  targetHeight: number,
  inputLabel: string,
  outputLabel: string
): string {
  const { edit } = segment;
  const dur = segment.sourceEnd - segment.sourceStart;
  const parts: string[] = [`trim=start=${segment.sourceStart}:end=${segment.sourceEnd}`, "setpts=PTS-STARTPTS"];

  if (!isDefaultCrop(edit.crop)) {
    const cw = Math.max(2, roundToEven((edit.crop.width / 100) * videoWidth));
    const ch = Math.max(2, roundToEven((edit.crop.height / 100) * videoHeight));
    const cx = Math.max(0, Math.round((edit.crop.x / 100) * videoWidth));
    const cy = Math.max(0, Math.round((edit.crop.y / 100) * videoHeight));
    parts.push(`crop=${cw}:${ch}:${cx}:${cy}`);
  }

  if (edit.rotation === 90) parts.push("transpose=1");
  else if (edit.rotation === 180) parts.push("hflip", "vflip");
  else if (edit.rotation === 270) parts.push("transpose=2");
  if (edit.flipH) parts.push("hflip");
  if (edit.flipV) parts.push("vflip");

  if (edit.speed !== 1) parts.push(`setpts=PTS/${edit.speed}`);

  if (!isDefaultColor(edit.color)) {
    const brightness = (edit.color.brightness / 200).toFixed(3);
    const contrast = (1 + edit.color.contrast / 100).toFixed(3);
    const saturation = Math.max(0, 1 + edit.color.saturation / 100).toFixed(3);
    parts.push(`eq=brightness=${brightness}:contrast=${contrast}:saturation=${saturation}`);
  }

  parts.push(
    `scale=${targetWidth}:${targetHeight}:force_original_aspect_ratio=decrease`,
    `pad=${targetWidth}:${targetHeight}:(ow-iw)/2:(oh-ih)/2:color=black`,
    "setsar=1"
  );

  const localOverlays = overlays.filter((o) => o.endTime > segment.sourceStart && o.startTime < segment.sourceEnd);
  for (const o of localOverlays) {
    const localStart = Math.max(0, o.startTime - segment.sourceStart) / edit.speed;
    const localEnd = Math.min(dur, o.endTime - segment.sourceStart) / edit.speed;
    if (localEnd <= localStart) continue;
    const x = Math.round((o.x / 100) * targetWidth);
    const y = Math.round((o.y / 100) * targetHeight);
    parts.push(
      `drawtext=fontfile=/font.ttf:text='${escapeDrawtext(o.content)}':x=${x}-text_w/2:y=${y}-text_h/2:fontsize=${Math.round(o.fontSize)}:fontcolor=${hexToDrawtextColor(o.color)}:borderw=2:bordercolor=black@0.6:enable='between(t\\,${localStart.toFixed(3)}\\,${localEnd.toFixed(3)})'`
    );
  }

  return `[${inputLabel}]${parts.join(",")}[${outputLabel}]`;
}

/** Probes whether a file written to ffmpeg's virtual FS has an audio
 * stream, by running `ffmpeg -i <name>` (no output — expected to "fail",
 * we only care about the stream info ffmpeg prints to its log either way)
 * and checking the captured log lines for an Audio stream entry. Reuses
 * the ffmpeg.on('log', ...) pattern already proven in ffmpegMix.ts, rather
 * than pulling in a separate ffprobe build. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function detectHasAudioStream(ffmpeg: any, inputName: string): Promise<boolean> {
  let sawAudio = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listener = ({ message }: any) => {
    if (/Stream #0:\d+.*Audio/i.test(message)) sawAudio = true;
  };
  ffmpeg.on("log", listener);
  try {
    await ffmpeg.exec(["-i", inputName]);
  } catch {
    // Expected — no output was requested, ffmpeg exits non-zero. We only
    // wanted the stream-info log lines, which are captured either way.
  }
  ffmpeg.off("log", listener);
  return sawAudio;
}

/**
 * Renders every edit currently in the video-editor's state into one
 * downloadable MP4: per-segment trim/crop/rotate/flip/speed/color, burned-
 * in timed text overlays, the edited video's own (speed-synced) audio if
 * present, and the separately-uploaded Audio track mixed on top.
 */
export async function exportVideo({
  videoFile,
  videoWidth,
  videoHeight,
  aspectRatio,
  segments,
  textOverlays,
  audioFile,
  audioSegments,
  onLoadProgress,
  onProgress,
  onStage,
}: ExportOptions): Promise<Blob> {
  if (segments.length === 0) throw new Error("No video segments to export.");

  const ffmpeg = await getFFmpeg(onLoadProgress);
  const { width: targetWidth, height: targetHeight } = EXPORT_RESOLUTIONS[aspectRatio];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let progressListener: ((e: any) => void) | null = null;
  if (onProgress) {
    // Two ffmpeg.exec() calls happen below (edited video, then final mix if
    // there's an uploaded audio track) — split the reported range so the
    // overall bar still reads as one continuous 0-100%.
    const stageWeight = audioFile ? 0.7 : 1;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    progressListener = ({ progress }: any) => onProgress(Math.min(progress, 1) * stageWeight);
    ffmpeg.on("progress", progressListener);
  }

  try {
    onStage?.("Preparing source files...");
    const videoInputName = "source_video.input";
    await ffmpeg.writeFile(videoInputName, new Uint8Array(await videoFile.arrayBuffer()));

    onStage?.("Loading font for captions...");
    const fontRes = await fetch("/fonts/DrawtextFont.ttf");
    if (!fontRes.ok) throw new Error("Failed to load caption font.");
    await ffmpeg.writeFile("font.ttf", new Uint8Array(await fontRes.arrayBuffer()));

    onStage?.("Checking source audio...");
    const hasNativeAudio = await detectHasAudioStream(ffmpeg, videoInputName);

    onStage?.("Rendering segments...");
    const filterParts: string[] = [];
    const concatLabels: string[] = [];
    let silentInputIndex = 1; // 0 = video input; lavfi silent inputs start at 1

    segments.forEach((segment, i) => {
      const vOut = `v${i}`;
      filterParts.push(buildSegmentVideoFilter(segment, textOverlays, videoWidth, videoHeight, targetWidth, targetHeight, "0:v", vOut));

      const aOut = `a${i}`;
      const dur = segment.sourceEnd - segment.sourceStart;
      const outDur = dur / segment.edit.speed;
      if (hasNativeAudio) {
        const atempoChain = buildAtempoChain(segment.edit.speed).join(",");
        filterParts.push(`[0:a]atrim=start=${segment.sourceStart}:end=${segment.sourceEnd},asetpts=PTS-STARTPTS,${atempoChain}[${aOut}]`);
      } else {
        // No native audio — synthesize silence so every segment has a
        // matching audio stream, which the concat filter requires.
        filterParts.push(`[${silentInputIndex}:a]atrim=duration=${outDur.toFixed(3)},asetpts=PTS-STARTPTS[${aOut}]`);
        silentInputIndex += 1;
      }
      concatLabels.push(`[${vOut}][${aOut}]`);
    });

    filterParts.push(`${concatLabels.join("")}concat=n=${segments.length}:v=1:a=1[vout][aout]`);

    const args = ["-i", videoInputName];
    if (!hasNativeAudio) {
      for (let i = 0; i < segments.length; i += 1) {
        args.push("-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100");
      }
    }
    args.push(
      "-filter_complex", filterParts.join(";"),
      "-map", "[vout]", "-map", "[aout]",
      "-c:v", "libx264", "-preset", "ultrafast", "-crf", "23",
      "-c:a", "aac", "-b:a", "160k",
      "-pix_fmt", "yuv420p",
      "edited_video.mp4"
    );

    await execWithTimeout(ffmpeg, args, "Rendering edited video");

    const finalOutputTotalDuration = segments.reduce((sum, s) => sum + (s.sourceEnd - s.sourceStart) / s.edit.speed, 0);

    let finalName = "edited_video.mp4";

    if (audioFile && audioSegments.length > 0) {
      onStage?.("Mixing in audio track...");
      const audioInputName = "source_audio.input";
      await ffmpeg.writeFile(audioInputName, new Uint8Array(await audioFile.arrayBuffer()));

      // Trim + concatenate the uploaded audio track's own blocks (no speed
      // control exists for audio blocks anywhere in the UI, so no atempo
      // here — only the video's own native audio above is speed-adjusted).
      const audioFilterParts: string[] = [];
      const audioLabels: string[] = [];
      audioSegments.forEach((seg, i) => {
        const label = `aa${i}`;
        audioFilterParts.push(`[0:a]atrim=start=${seg.sourceStart}:end=${seg.sourceEnd},asetpts=PTS-STARTPTS[${label}]`);
        audioLabels.push(`[${label}]`);
      });
      audioFilterParts.push(`${audioLabels.join("")}concat=n=${audioSegments.length}:v=0:a=1[musicout]`);

      await execWithTimeout(
        ffmpeg,
        ["-i", audioInputName, "-filter_complex", audioFilterParts.join(";"), "-map", "[musicout]", "music_track.wav"],
        "Preparing uploaded audio track"
      );

      // Mix the edited video's own audio with the prepared music track,
      // padding/trimming the shorter one so the result is synced to the
      // final video's length either way.
      await execWithTimeout(
        ffmpeg,
        [
          "-i", "edited_video.mp4",
          "-i", "music_track.wav",
          "-filter_complex",
          `[1:a]apad,atrim=duration=${finalOutputTotalDuration.toFixed(3)}[music_padded];[0:a][music_padded]amix=inputs=2:duration=first:dropout_transition=0[aout]`,
          "-map", "0:v", "-map", "[aout]",
          "-c:v", "copy", "-c:a", "aac", "-b:a", "160k",
          "final_output.mp4",
        ],
        "Mixing uploaded audio track"
      );
      finalName = "final_output.mp4";
      onProgress?.(1);
    }

    const data = await ffmpeg.readFile(finalName);
    return new Blob([data as BlobPart], { type: "video/mp4" });
  } finally {
    if (progressListener) ffmpeg.off("progress", progressListener);
  }
}
