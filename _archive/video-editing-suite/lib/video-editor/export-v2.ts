// lib/video-editor/export-v2.ts
//
// Real ffmpeg.wasm export pipeline for the v2 multi-track editor
// (/dev-tools/video-editing-v2). Composes the layered MUSIC / TEXT /
// OVERLAY / VIDEO track model that page.tsx holds in state into one
// downloadable MP4.
//
// REUSE, DON'T REBUILD: the ffmpeg singleton/loading/caching (getFFmpeg),
// the timeout-wrapped exec pattern (execWithTimeout), and the small
// filter-string helpers (buildAtempoChain, escapeDrawtext,
// hexToDrawtextColor, isDefaultCrop, isDefaultColor, roundToEven,
// detectHasAudioStream, EXPORT_RESOLUTIONS) are all imported from
// lib/video-editor/export.ts (v1's pipeline) rather than duplicated — see
// that file for the ffmpeg.wasm loading/caching design notes, which apply
// unchanged here since both pipelines share the one module-scoped instance.
//
// WHAT'S DIFFERENT FROM V1: v1 assumed one shared source video file, cut
// into segments by (sourceStart, sourceEnd) pairs. v2 has real per-track
// arrays of independently-uploaded files, so every clip/overlay is its own
// ffmpeg input rather than a trim of a shared one, and the whole graph is
// built and rendered in a SINGLE ffmpeg.exec() call (one filter_complex —
// video concat, overlay compositing, text burn-in, and music mix all in one
// pass) rather than v1's two-stage intermediate-file approach, since there's
// no longer a natural "render video, then mix in one audio file" split.
//
// ORDER (deliberate, mirrors the task's own dependency chain):
//   1. concat all VIDEO clips (each with its own crop/rotate/speed/color)
//   2. composite OVERLAY items on top via the `overlay` filter, chained
//   3. burn in TEXT via drawtext, chained onto the same running video label
//      — LAST, after overlay/rotate, for the same reason v1's drawtext runs
//      after every per-segment transform: captions must stay upright and
//      correctly placed on the FINAL canvas, never mirrored/rotated along
//      with a transform that was only ever meant for the footage under it.
//   4. concat + pad MUSIC clips, amix against the video track's own audio
//   5. map the final video/audio labels to one output file
//
// SCOPE DECISION (documented, not hidden): total export duration is the
// VIDEO track's own total length, not `timelineDuration` (which is
// max(video, music) in the editor UI, purely for ruler/layout purposes).
// There is no video content to show past the last video clip, so music
// beyond that point is truncated and music shorter than it is silence-
// padded — the video track is the timeline's backbone; music decorates it.

import {
  type SegmentEdit,
  type ExportAspectRatio,
  EXPORT_RESOLUTIONS,
  getFFmpeg,
  execWithTimeout,
  buildAtempoChain,
  roundToEven,
  escapeDrawtext,
  hexToDrawtextColor,
  isDefaultCrop,
  isDefaultColor,
  detectHasAudioStream,
} from "./export";

// Shared shape for a trimmed clip pointing at its own file — mirrors the
// editor's own ClipBase (id/file/duration/sourceStartFrac/sourceEndFrac/
// trimStart/trimEnd), minus the timeline-layout-only fields (widthFrac,
// locked, url isn't needed here except on video clips for dimension probing).
export interface ExportV2ClipInput {
  id: string;
  file: File;
  duration: number; // native duration of this clip's own file, seconds
  sourceStartFrac: number;
  sourceEndFrac: number;
  trimStart: number;
  trimEnd: number;
}

export interface ExportV2VideoClipInput extends ExportV2ClipInput {
  url: string; // for browser-side native-resolution probing, not re-uploaded
  edit: SegmentEdit;
}

export interface ExportV2OverlayInput {
  id: string;
  type: "image" | "video";
  file: File;
  startTime: number; // seconds, ABSOLUTE on the v2 timeline (unlike v1's per-segment-local text timing)
  endTime: number;
  x: number; // 0-100, % across the frame, CENTER point (matches the live preview's translate(-50%,-50%))
  y: number;
  width: number; // 0-100, % of frame width
  height: number;
}

export interface ExportV2TextInput {
  content: string;
  x: number; // 0-100, % across the frame, CENTER point
  y: number;
  fontSize: number;
  color: string;
  startTime: number; // seconds, ABSOLUTE on the v2 timeline
  endTime: number;
}

// Every video-bearing filter chain (clips AND overlays) is normalized to
// this fixed frame rate before it reaches concat/overlay — see the `fps=`
// note inside buildVideoClipFilter for why a mismatched/VFR source frame
// rate silently blows up the render instead of erroring out.
const EXPORT_FPS = 30;

export interface ExportV2Options {
  videoClips: ExportV2VideoClipInput[]; // timeline order
  musicClips: ExportV2ClipInput[]; // timeline order
  overlays: ExportV2OverlayInput[];
  textOverlays: ExportV2TextInput[];
  aspectRatio: ExportAspectRatio;
  onLoadProgress?: (ratio: number) => void; // 0..1, one-time engine download
  onProgress?: (ratio: number) => void; // 0..1, render progress
  onStage?: (label: string) => void; // human-readable current step
}

/** A clip's actual [start, end) in seconds within ITS OWN file, resolving
 * both the split boundary (sourceStartFrac/sourceEndFrac) and the
 * additional drag-handle trim (trimStart/trimEnd) on top of it — matches
 * exactly how the editor's own effectiveDuration() already treats the two
 * together for the timeline's visual block width. */
function resolveSourceRange(clip: { duration: number; sourceStartFrac: number; sourceEndFrac: number; trimStart: number; trimEnd: number }): { start: number; end: number } {
  const rawStart = clip.sourceStartFrac * clip.duration;
  const rawEnd = clip.sourceEndFrac * clip.duration;
  const rawSpan = Math.max(0, rawEnd - rawStart);
  const start = Math.max(0, rawStart + clip.trimStart * rawSpan);
  const end = Math.max(start + 0.01, rawEnd - clip.trimEnd * rawSpan);
  return { start, end };
}

/** Native pixel dimensions of a video clip, probed in-browser (no extra
 * ffmpeg round trip) — needed per-clip since v2 (unlike v1's one shared
 * source file) can have differently-sized uploads, and crop % is always
 * relative to a clip's OWN native resolution, not the export canvas. */
function probeVideoDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const el = document.createElement("video");
    el.preload = "metadata";
    el.src = url;
    const timeout = setTimeout(() => resolve({ width: 0, height: 0 }), 8000);
    el.onloadedmetadata = () => {
      clearTimeout(timeout);
      resolve({ width: el.videoWidth || 0, height: el.videoHeight || 0 });
    };
    el.onerror = () => {
      clearTimeout(timeout);
      resolve({ width: 0, height: 0 });
    };
  });
}

/** One video clip's filter chain: trim -> crop -> rotate/flip -> speed ->
 * color eq -> scale/pad to the shared export canvas. Directly adapted from
 * v1's buildSegmentVideoFilter, minus the per-segment text burn-in (v2 text
 * timing is already timeline-absolute, so it runs once globally after
 * concat+overlay instead — see exportVideoV2 below), and reading from this
 * clip's OWN input index instead of a shared "0:v" label. */
function buildVideoClipFilter(
  edit: SegmentEdit,
  sourceStart: number,
  sourceEnd: number,
  clipWidth: number,
  clipHeight: number,
  targetWidth: number,
  targetHeight: number,
  inputIndex: number,
  outputLabel: string
): string {
  const parts: string[] = [`trim=start=${sourceStart}:end=${sourceEnd}`, "setpts=PTS-STARTPTS"];

  if (!isDefaultCrop(edit.crop)) {
    const cw = Math.max(2, roundToEven((edit.crop.width / 100) * clipWidth));
    const ch = Math.max(2, roundToEven((edit.crop.height / 100) * clipHeight));
    const cx = Math.max(0, Math.round((edit.crop.x / 100) * clipWidth));
    const cy = Math.max(0, Math.round((edit.crop.y / 100) * clipHeight));
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
    "setsar=1",
    // Browser-recorded WebM (MediaRecorder output) commonly reports a VFR/
    // high-timebase stream ("1k tbr, 1k tbn") rather than a fixed frame
    // rate. Left alone, concatenating/overlaying that against a differently
    // -timed clip, a looped still image, and a looped overlay video makes
    // ffmpeg infer an absurd output frame rate to represent every distinct
    // timestamp, which manifests as encoding "succeeding" but emitting
    // thousands of duplicate frames per real millisecond of output (seen
    // directly in testing: 27000 frames encoded for 0.02s of PTS) -- not a
    // crash, just effectively never finishing. Normalizing every clip to
    // the SAME fixed frame rate here, before concat, eliminates the
    // mismatch at the source.
    `fps=${EXPORT_FPS}`
  );

  return `[${inputIndex}:v]${parts.join(",")}[${outputLabel}]`;
}

/**
 * Renders the editor's full layered state (Video/Overlay/Text/Music tracks)
 * into one downloadable MP4.
 */
export async function exportVideoV2({
  videoClips,
  musicClips,
  overlays,
  textOverlays,
  aspectRatio,
  onLoadProgress,
  onProgress,
  onStage,
}: ExportV2Options): Promise<Blob> {
  if (videoClips.length === 0) throw new Error("No video clips to export.");

  const ffmpeg = await getFFmpeg(onLoadProgress);
  const { width: targetWidth, height: targetHeight } = EXPORT_RESOLUTIONS[aspectRatio];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let progressListener: ((e: any) => void) | null = null;
  if (onProgress) {
    // Unlike v1's two-exec split, everything here is ONE ffmpeg.exec() call
    // (see top-of-file note), so ffmpeg's own progress events already cover
    // the whole render end-to-end — no stage-weighting needed.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    progressListener = ({ progress }: any) => onProgress(Math.min(Math.max(progress, 0), 1));
    ffmpeg.on("progress", progressListener);
  }

  try {
    onStage?.("Preparing source files...");

    const videoInputNames: string[] = [];
    const videoDims: { width: number; height: number }[] = [];
    for (let i = 0; i < videoClips.length; i += 1) {
      const clip = videoClips[i];
      const name = `vid_${i}.input`;
      await ffmpeg.writeFile(name, new Uint8Array(await clip.file.arrayBuffer()));
      videoInputNames.push(name);
      const dims = await probeVideoDimensions(clip.url);
      videoDims.push({ width: dims.width || targetWidth, height: dims.height || targetHeight });
    }

    const overlayInputNames: string[] = [];
    for (let j = 0; j < overlays.length; j += 1) {
      const name = `ovl_${j}.input`;
      await ffmpeg.writeFile(name, new Uint8Array(await overlays[j].file.arrayBuffer()));
      overlayInputNames.push(name);
    }

    const musicInputNames: string[] = [];
    for (let p = 0; p < musicClips.length; p += 1) {
      const name = `mus_${p}.input`;
      await ffmpeg.writeFile(name, new Uint8Array(await musicClips[p].file.arrayBuffer()));
      musicInputNames.push(name);
    }

    onStage?.("Loading font for captions...");
    const fontRes = await fetch("/fonts/DrawtextFont.ttf");
    if (!fontRes.ok) throw new Error("Failed to load caption font.");
    await ffmpeg.writeFile("font.ttf", new Uint8Array(await fontRes.arrayBuffer()));

    onStage?.("Checking source audio...");
    const videoHasAudio: boolean[] = [];
    for (let i = 0; i < videoClips.length; i += 1) {
      videoHasAudio.push(await detectHasAudioStream(ffmpeg, videoInputNames[i]));
    }

    onStage?.("Building render graph...");

    // ---- Track every input's ffmpeg index as we add it, in this fixed
    // order: video clips, overlay files, music clips, silent placeholders. ----
    const args: string[] = [];
    let nextInputIndex = 0;

    const videoInputIdx: number[] = [];
    for (const name of videoInputNames) {
      args.push("-i", name);
      videoInputIdx.push(nextInputIndex);
      nextInputIndex += 1;
    }

    const overlayInputIdx: number[] = [];
    overlays.forEach((o, j) => {
      // Loop each overlay's own source indefinitely at the demux level, then
      // trim to exactly the visible window's duration below — matches the
      // live preview's <video loop> / static <img> behavior regardless of
      // whether the overlay's own source is shorter or longer than its
      // on-timeline window.
      if (o.type === "image") args.push("-loop", "1", "-i", overlayInputNames[j]);
      else args.push("-stream_loop", "-1", "-i", overlayInputNames[j]);
      overlayInputIdx.push(nextInputIndex);
      nextInputIndex += 1;
    });

    const musicInputIdx: number[] = [];
    for (const name of musicInputNames) {
      args.push("-i", name);
      musicInputIdx.push(nextInputIndex);
      nextInputIndex += 1;
    }

    // Silent audio placeholder for any video clip with no native audio
    // stream — concat's a=1 requires exactly one audio stream per clip.
    const silentInputIdx: (number | null)[] = [];
    videoClips.forEach((_clip, i) => {
      if (videoHasAudio[i]) {
        silentInputIdx.push(null);
        return;
      }
      args.push("-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100");
      silentInputIdx.push(nextInputIndex);
      nextInputIndex += 1;
    });

    const filterParts: string[] = [];

    // ---- 1) VIDEO: per-clip filter chains, then concat ----
    const concatLabels: string[] = [];
    videoClips.forEach((clip, i) => {
      const { start, end } = resolveSourceRange(clip);
      const outDur = (end - start) / clip.edit.speed;
      const vOut = `v${i}`;
      filterParts.push(buildVideoClipFilter(clip.edit, start, end, videoDims[i].width, videoDims[i].height, targetWidth, targetHeight, videoInputIdx[i], vOut));

      const aOut = `a${i}`;
      if (videoHasAudio[i]) {
        const atempoSuffix = clip.edit.speed !== 1 ? `,${buildAtempoChain(clip.edit.speed).join(",")}` : "";
        filterParts.push(`[${videoInputIdx[i]}:a]atrim=start=${start}:end=${end},asetpts=PTS-STARTPTS${atempoSuffix}[${aOut}]`);
      } else {
        filterParts.push(`[${silentInputIdx[i]}:a]atrim=duration=${outDur.toFixed(3)},asetpts=PTS-STARTPTS[${aOut}]`);
      }
      concatLabels.push(`[${vOut}][${aOut}]`);
    });
    filterParts.push(`${concatLabels.join("")}concat=n=${videoClips.length}:v=1:a=1[vcat][acat]`);

    // ---- 2) OVERLAY: scale each to its "cover" footprint, chain-composite ----
    let runningVideoLabel = "vcat";
    overlays.forEach((o, j) => {
      const wPx = Math.max(2, roundToEven((o.width / 100) * targetWidth));
      const hPx = Math.max(2, roundToEven((o.height / 100) * targetHeight));
      const durNeeded = Math.max(0.01, o.endTime - o.startTime);
      const scaledLabel = `ovs${j}`;
      // scale-to-increase + crop === CSS object-fit: cover, matching the
      // live preview's overlay rendering exactly (not the letterbox/pad
      // treatment video clips get, which is object-fit: contain). fps=
      // normalizes this stream to the SAME rate as the base video (see
      // EXPORT_FPS/buildVideoClipFilter's note) -- overlay images/videos
      // have their own native rate (a looped PNG defaults to 25fps, an
      // overlay webm keeps whatever it was recorded at), and feeding a
      // mismatched rate into `overlay` against the already-normalized base
      // reintroduces the exact frame-duplication blowup this is guarding
      // against, just one filter later.
      filterParts.push(
        `[${overlayInputIdx[j]}:v]trim=duration=${durNeeded.toFixed(3)},setpts=PTS-STARTPTS,scale=${wPx}:${hPx}:force_original_aspect_ratio=increase,crop=${wPx}:${hPx},setsar=1,fps=${EXPORT_FPS}[${scaledLabel}]`
      );
      const x = Math.round((o.x / 100) * targetWidth - wPx / 2);
      const y = Math.round((o.y / 100) * targetHeight - hPx / 2);
      const nextLabel = `ov${j}`;
      filterParts.push(`[${runningVideoLabel}][${scaledLabel}]overlay=x=${x}:y=${y}:enable='between(t\\,${o.startTime.toFixed(3)}\\,${o.endTime.toFixed(3)})'[${nextLabel}]`);
      runningVideoLabel = nextLabel;
    });

    // ---- 3) TEXT: drawtext, chained onto the same running video label,
    // AFTER overlay compositing (see top-of-file ORDER note) ----
    if (textOverlays.length > 0) {
      const drawtextParts = textOverlays.map((t) => {
        const x = Math.round((t.x / 100) * targetWidth);
        const y = Math.round((t.y / 100) * targetHeight);
        return `drawtext=fontfile=/font.ttf:text='${escapeDrawtext(t.content)}':x=${x}-text_w/2:y=${y}-text_h/2:fontsize=${Math.round(t.fontSize)}:fontcolor=${hexToDrawtextColor(t.color)}:borderw=2:bordercolor=black@0.6:enable='between(t\\,${t.startTime.toFixed(3)}\\,${t.endTime.toFixed(3)})'`;
      });
      filterParts.push(`[${runningVideoLabel}]${drawtextParts.join(",")}[vfinal]`);
      runningVideoLabel = "vfinal";
    }

    // ---- 4) MUSIC: concat, pad/trim to the video track's total length,
    // amix against the video track's own (concatenated) audio ----
    const totalVideoDuration = videoClips.reduce((sum, clip) => {
      const { start, end } = resolveSourceRange(clip);
      return sum + (end - start) / clip.edit.speed;
    }, 0);

    let finalAudioLabel = "acat";
    if (musicClips.length > 0) {
      const musicLabels: string[] = [];
      musicClips.forEach((clip, p) => {
        const { start, end } = resolveSourceRange(clip);
        const label = `mus${p}`;
        filterParts.push(`[${musicInputIdx[p]}:a]atrim=start=${start}:end=${end},asetpts=PTS-STARTPTS[${label}]`);
        musicLabels.push(`[${label}]`);
      });
      filterParts.push(`${musicLabels.join("")}concat=n=${musicClips.length}:v=0:a=1[musiccat]`);
      filterParts.push(`[musiccat]apad,atrim=duration=${totalVideoDuration.toFixed(3)}[musicpadded]`);
      filterParts.push(`[acat][musicpadded]amix=inputs=2:duration=first:dropout_transition=0[afinal]`);
      finalAudioLabel = "afinal";
    }

    args.push("-filter_complex", filterParts.join(";"));
    args.push("-map", `[${runningVideoLabel}]`, "-map", `[${finalAudioLabel}]`);
    args.push("-c:v", "libx264", "-preset", "ultrafast", "-crf", "23", "-c:a", "aac", "-b:a", "160k", "-pix_fmt", "yuv420p", "output.mp4");

    onStage?.("Rendering...");
    // Heavier single-pass graph than v1's per-stage calls (video concat +
    // overlay + text + music all at once) — a longer timeout budget than
    // v1's 300s default, with the same clearly-labeled "Export timed out"
    // message so a hang here is never confused with the load-phase timeout.
    await execWithTimeout(ffmpeg, args, "Rendering multi-track export", 480000);

    const data = await ffmpeg.readFile("output.mp4");
    onProgress?.(1);
    return new Blob([data as BlobPart], { type: "video/mp4" });
  } finally {
    if (progressListener) ffmpeg.off("progress", progressListener);
  }
}
