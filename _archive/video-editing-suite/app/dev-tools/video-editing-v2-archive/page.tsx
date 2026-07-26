"use client";

/**
 * Manual Video Editor — /tools/video-editing
 *
 * Layered-track model, closer to a standard NLE:
 *   MUSIC   (top)    — multiple independent music/audio clips
 *   TEXT              — multiple timed text overlays
 *   OVERLAY           — multiple image/video overlay items (B-roll, PiP, logos)
 *   VIDEO   (bottom)  — multiple video clips in sequence, each carrying its
 *                       own embedded-audio waveform inline (not a separate row)
 *
 * Video and Music clips share the same flex-grow "block" timeline mechanics
 * (split/trim/drag-reorder/lock/duplicate/delete), one file per clip (see
 * `ClipBase`). Overlay shares the Text track's mechanics (absolute time-based
 * position, drag-to-shift, edge-handle-to-trim) rather than the flex-grow
 * model, since overlay items need explicit start/end seconds + x/y/width/
 * height placement, same as text.
 *
 * EXPORT: renders the full layered state (Video/Overlay/Text/Music, every
 * per-clip crop/rotate/speed/color edit) to a real MP4 via ffmpeg.wasm — see
 * lib/video-editor/export-v2.ts for the render pipeline itself; this file
 * only gathers current state into its input shape and drives the progress
 * modal (handleExportClick, below). Auto Edit is left as-is (deprioritized),
 * pointed at whichever video clip is currently selected/previewed.
 *
 * The prior single-track editor is archived, unlinked, at
 * app/dev-tools/video-editing-v1-archive/page.tsx (safety backup only).
 *
 * STYLING: inline `style` props only — this project has no Tailwind
 * installed. COLORS token object shared with auto-edit.
 */

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { exportVideoV2, type ExportV2ClipInput, type ExportV2VideoClipInput, type ExportV2OverlayInput, type ExportV2TextInput } from "@/lib/video-editor/export-v2";

// ---- Design tokens (matches v1 / auto-edit/page.tsx) ----
const COLORS = {
  bg: "#141210",
  card: "#1c1a17",
  cardBorder: "#2a2621",
  accent: "#e0995e",
  accentText: "#1c1a17",
  textPrimary: "#f5f1ea",
  textMuted: "#a89f92",
  danger: "#e07a5f",
  panelBg: "#1e1c1a",
  panelBgDark: "#141210",
  trackHeaderBg: "#221f1c",
  trackRowBg: "#181614",
  ruler: "#3a352f",
  editedDot: "#4ade80",
  textTrackAccent: "#7dd3fc",
  overlayTrackAccent: "#c084fc",
  musicTrackAccent: "#86efac",
};

type ToolId = "media" | "color" | "text" | "overlay";
type PopoverTool = "crop" | "rotate" | "speed";
type AutoEditStage = "idle" | "paying" | "verifying" | "analyzing" | "done" | "error";
// Export intentionally has no working states in this phase — see top-of-file note.
// Extended to "text" | "overlay" so the same click-to-open block menu works
// uniformly across all 4 track types (see handleMenu* below).
type TrackKind = "video" | "music" | "text" | "overlay";
type Corner = "nw" | "ne" | "sw" | "se";
type AspectRatio = "16:9" | "9:16" | "1:1";

interface RazorpayHandlerResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: { error?: { description?: string } }) => void) => void;
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  handler: (response: RazorpayHandlerResponse) => void;
  modal?: { ondismiss?: () => void };
  theme?: { color: string };
}
declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

// Shared shape for every flex-grow "block" clip on the Video or Music track.
// Each clip now carries its OWN file/url/duration — v1's single shared
// videoFile/audioFile is gone. sourceStartFrac/sourceEndFrac are a fixed,
// reorder-independent pointer into THIS clip's own file (0-1); splitting a
// clip produces two clips that both point at the same file with a divided
// range, exactly like v1's single-file split did.
interface ClipBase {
  id: string;
  file: File;
  url: string;
  duration: number; // native duration of this clip's own file, seconds (0 until probed)
  sourceStartFrac: number;
  sourceEndFrac: number;
  trimStart: number; // 0-0.4 fraction trimmed off the block's own span
  trimEnd: number;
  widthFrac: number; // relative flex-grow width in the track row
  locked: boolean;
}
type VideoClip = ClipBase;
type MusicClip = ClipBase;

interface ContextMenuState {
  x: number;
  y: number;
  trackKind: TrackKind;
  blockId: string;
}

interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ColorGrade {
  brightness: number;
  contrast: number;
  saturation: number;
}

interface SegmentEdit {
  crop: CropRect;
  rotation: 0 | 90 | 180 | 270;
  flipH: boolean;
  flipV: boolean;
  speed: number;
  color: ColorGrade;
}

interface TextOverlay {
  id: string;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  startTime: number;
  endTime: number;
  locked: boolean;
}

// New: Overlay track item (image or video, e.g. B-roll/PiP/logo). Reuses the
// exact positioning/timing field names TextOverlay already established
// (startTime/endTime/x/y), plus width/height since overlay media (unlike
// text) needs an explicit visual footprint.
interface OverlayItem {
  id: string;
  type: "image" | "video";
  file: File;
  url: string;
  startTime: number;
  endTime: number;
  x: number; // 0-100, % across the video frame (center point)
  y: number; // 0-100, % down the video frame (center point)
  width: number; // 0-100, % of frame width
  height: number; // 0-100, % of frame height
  locked: boolean;
}

const DEFAULT_CROP: CropRect = { x: 0, y: 0, width: 100, height: 100 };
const DEFAULT_COLOR: ColorGrade = { brightness: 0, contrast: 0, saturation: 0 };
const DEFAULT_EDIT: SegmentEdit = { crop: DEFAULT_CROP, rotation: 0, flipH: false, flipV: false, speed: 1, color: DEFAULT_COLOR };
const MIN_CROP_PCT = 10;
const MIN_TEXT_DURATION = 0.1;
const MIN_OVERLAY_DURATION = 0.1;
const METER_BAR_COUNT = 7;
const METER_FFT_SIZE = 64;

const ASPECT_CSS: Record<AspectRatio, string> = { "16:9": "16 / 9", "9:16": "9 / 16", "1:1": "1 / 1" };

const CROP_PRESETS: { label: string; ratio: number | null }[] = [
  { label: "Free", ratio: null },
  { label: "1:1", ratio: 1 },
  { label: "9:16", ratio: 9 / 16 },
  { label: "16:9", ratio: 16 / 9 },
  { label: "4:5", ratio: 4 / 5 },
];

const TOOLS: { id: ToolId; icon: string; label: string; enabled: boolean }[] = [
  { id: "media", icon: "🗂️", label: "Media", enabled: true },
  { id: "color", icon: "🎨", label: "Color", enabled: true },
  { id: "text", icon: "🔤", label: "Text", enabled: true },
  { id: "overlay", icon: "🖼️", label: "Overlay", enabled: true },
];

const QUICK_TOOLS: { id: PopoverTool; icon: string; label: string }[] = [
  { id: "crop", icon: "⬛", label: "Crop" },
  { id: "rotate", icon: "🔄", label: "Rotate" },
  { id: "speed", icon: "⏱️", label: "Speed" },
];

const CONTEXT_MENU_ITEMS: { id: "replace" | "keyframe" | "lock" | "duplicate" | "delete" | "split"; label: string; icon: string }[] = [
  { id: "replace", label: "Replace", icon: "🔁" },
  { id: "keyframe", label: "Keyframe", icon: "◆" },
  { id: "lock", label: "Lock", icon: "🔒" },
  { id: "duplicate", label: "Duplicate", icon: "⧉" },
  { id: "delete", label: "Delete", icon: "🗑️" },
  { id: "split", label: "Split", icon: "✂️" },
];

// Divides the ruler into a fixed number of EQUAL fractional segments of the
// real total duration (rather than a fixed step like "every 4s") so the
// last tick always lands exactly on the true end of the timeline, no matter
// how long that timeline is — a fixed-step ruler either stops early on long
// timelines or looks too sparse/dense on short ones.
const RULER_TICK_COUNT = 8;
function buildRulerTicks(totalDuration: number): number[] {
  const ticks: number[] = [];
  for (let i = 0; i <= RULER_TICK_COUNT; i += 1) ticks.push((i / RULER_TICK_COUNT) * totalDuration);
  return ticks;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function isDefaultCrop(c: CropRect): boolean {
  return c.x === 0 && c.y === 0 && c.width === 100 && c.height === 100;
}
function isDefaultColor(c: ColorGrade): boolean {
  return c.brightness === 0 && c.contrast === 0 && c.saturation === 0;
}
function isDefaultEdit(e: SegmentEdit): boolean {
  return isDefaultCrop(e.crop) && e.rotation === 0 && !e.flipH && !e.flipV && e.speed === 1 && isDefaultColor(e.color);
}

function colorFilterCss(color: ColorGrade): string {
  const b = 100 + color.brightness;
  const c = 100 + color.contrast;
  const s = 100 + color.saturation;
  return `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;
}

function cornerHandleStyle(corner: Corner): React.CSSProperties {
  const size = 12;
  const half = -size / 2;
  const base: React.CSSProperties = { position: "absolute", width: size, height: size, backgroundColor: COLORS.accent, border: `1px solid ${COLORS.accentText}`, borderRadius: 2 };
  if (corner === "nw") return { ...base, left: half, top: half, cursor: "nwse-resize" };
  if (corner === "ne") return { ...base, right: half, top: half, cursor: "nesw-resize" };
  if (corner === "sw") return { ...base, left: half, bottom: half, cursor: "nesw-resize" };
  return { ...base, right: half, bottom: half, cursor: "nwse-resize" };
}

// Loads just enough of a file to read its native duration, without
// rendering anything — used when a clip is added to any track so its
// timeline block can start out proportional to real seconds instead of an
// arbitrary equal share (closer to how a real NLE lays out clips).
function probeMediaDuration(url: string, kind: "video" | "audio"): Promise<number> {
  return new Promise((resolve) => {
    const el = document.createElement(kind);
    el.preload = "metadata";
    el.src = url;
    const timeout = setTimeout(() => resolve(0), 8000);
    el.onloadedmetadata = () => {
      clearTimeout(timeout);
      resolve(Number.isFinite(el.duration) ? el.duration : 0);
    };
    el.onerror = () => {
      clearTimeout(timeout);
      resolve(0);
    };
  });
}

// A clip's REAL remaining screen-time after trim — widthFrac is initialized
// to the clip's own native duration in seconds (see handleAddVideoClip/
// handleAddMusicClip below) and conserved through splits, so treating it as
// a seconds value lets both the ruler and each block's rendered width stay
// duration-accurate instead of a block visually overstating how much of it
// is actually left after trimming.
function effectiveDuration(clip: ClipBase): number {
  return clip.widthFrac * (1 - clip.trimStart - clip.trimEnd);
}

// Generalized from v1's splitBlocksAt: splits whichever clip the playhead
// currently sits inside into two clips. Both halves keep the SAME file/url/
// duration (spread from the original) — only their sourceStartFrac/
// sourceEndFrac/trimStart/trimEnd/widthFrac/id differ, exactly like v1's
// single-shared-file split, just now per-clip instead of per-track.
function splitClipsAt<T extends ClipBase>(clips: T[], playheadFrac: number, prefix: string): T[] {
  const total = clips.reduce((s, c) => s + c.widthFrac, 0);
  if (total <= 0) return clips;
  let cursor = 0;
  for (let i = 0; i < clips.length; i += 1) {
    const c = clips[i];
    const cStart = cursor / total;
    const cEnd = (cursor + c.widthFrac) / total;
    if (!c.locked && playheadFrac > cStart + 0.01 && playheadFrac < cEnd - 0.01) {
      const localF = (playheadFrac - cStart) / (cEnd - cStart);
      const splitSourceFrac = c.sourceStartFrac + localF * (c.sourceEndFrac - c.sourceStartFrac);
      const left: T = { ...c, id: `${prefix}-${Date.now()}-l`, trimEnd: 0, widthFrac: c.widthFrac * localF, sourceEndFrac: splitSourceFrac, locked: false };
      const right: T = { ...c, id: `${prefix}-${Date.now()}-r`, trimStart: 0, widthFrac: c.widthFrac * (1 - localF), sourceStartFrac: splitSourceFrac, locked: false };
      const next = [...clips];
      next.splice(i, 1, left, right);
      return next;
    }
    cursor += c.widthFrac;
  }
  return clips;
}

function applyTrim<T extends ClipBase>(clip: T, id: string, side: "start" | "end", delta: number): T {
  if (clip.id !== id) return clip;
  if (side === "start") return { ...clip, trimStart: Math.min(0.4, Math.max(0, clip.trimStart + delta)) };
  return { ...clip, trimEnd: Math.min(0.4, Math.max(0, clip.trimEnd + delta)) };
}

// Removes a clip by id, revoking its object URL — UNLESS another remaining
// clip still shares that same URL (true right after a Split, where both
// halves point at the same source file; revoking then would break the
// sibling still using it).
function removeClipById<T extends ClipBase>(clips: T[], id: string): T[] {
  const target = clips.find((c) => c.id === id);
  const next = clips.filter((c) => c.id !== id);
  if (target && !next.some((c) => c.url === target.url)) {
    URL.revokeObjectURL(target.url);
  }
  return next;
}

export default function VideoEditorV2Page() {
  const [activeTool, setActiveTool] = useState<ToolId>("media");
  const [openPopover, setOpenPopover] = useState<PopoverTool | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");

  const [videoMuted, setVideoMuted] = useState(false);
  const [videoVolume, setVideoVolume] = useState(1);
  const [musicMuted, setMusicMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(1);

  // ---- VIDEO track: multiple clips, each its own file ----
  const [videoClips, setVideoClips] = useState<VideoClip[]>([]);
  const [dragVideoId, setDragVideoId] = useState<string | null>(null);
  const [videoClipEdits, setVideoClipEdits] = useState<Record<string, SegmentEdit>>({});
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);

  // ---- MUSIC track: multiple clips, each its own file ----
  const [musicClips, setMusicClips] = useState<MusicClip[]>([]);
  const [dragMusicId, setDragMusicId] = useState<string | null>(null);
  const [selectedMusicId, setSelectedMusicId] = useState<string | null>(null);
  const [meterLevels, setMeterLevels] = useState<number[]>(Array(METER_BAR_COUNT).fill(0));

  // ---- OVERLAY track: multiple image/video items, time-based like Text ----
  const [overlayItems, setOverlayItems] = useState<OverlayItem[]>([]);
  const [selectedOverlayId, setSelectedOverlayId] = useState<string | null>(null);

  // ---- TEXT track: unchanged from v1 ----
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [textDraftContent, setTextDraftContent] = useState("");
  const [textDraftFontSize, setTextDraftFontSize] = useState(32);
  const [textDraftColor, setTextDraftColor] = useState("#f5f1ea");

  // ---- Track-level lock: a whole-track restriction layered ON TOP OF each
  // clip's own `locked` field, not a replacement for it. Unlocking a track
  // must not clear clips that were individually locked beforehand -- so this
  // stays a separate map, and every draggable/trim/menu check below ORs the
  // two together instead of writing trackLocks back into the clip arrays. ----
  const [trackLocks, setTrackLocks] = useState<Record<TrackKind, boolean>>({ video: false, music: false, text: false, overlay: false });
  const toggleTrackLock = (trackKind: TrackKind) => setTrackLocks((prev) => ({ ...prev, [trackKind]: !prev[trackKind] }));

  const [autoEditStage, setAutoEditStage] = useState<AutoEditStage>("idle");
  const [autoEditError, setAutoEditError] = useState<string | null>(null);
  const [autoEditProgress, setAutoEditProgress] = useState(0);
  const [autoEditLabel, setAutoEditLabel] = useState("");

  // ---- Export: real ffmpeg.wasm render of the full multi-track state ----
  type ExportStage = "idle" | "loading" | "rendering" | "done" | "error";
  const [exportStage, setExportStage] = useState<ExportStage>("idle");
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStageLabel, setExportStageLabel] = useState("");
  const [exportResultUrl, setExportResultUrl] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoWidth, setVideoWidth] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);
  const [playheadFrac, setPlayheadFrac] = useState(0);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);
  const overlayImageInputRef = useRef<HTMLInputElement>(null);
  const overlayVideoInputRef = useRef<HTMLInputElement>(null);
  const replaceVideoInputRef = useRef<HTMLInputElement>(null);
  const replaceMusicInputRef = useRef<HTMLInputElement>(null);
  const replaceOverlayInputRef = useRef<HTMLInputElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const musicElRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const meterRafRef = useRef<number | null>(null);
  const replaceTargetRef = useRef<{ trackKind: TrackKind; id: string } | null>(null);
  // Text/Overlay items move via a manually-managed pointerdown/move/up
  // gesture (not native HTML5 draggable), which does NOT suppress the
  // browser's own subsequent click event the way native drag does -- so
  // every move-drag was also opening the click-to-edit menu right after,
  // right on top of the block that had just moved. Set true only once
  // movement crosses a small threshold (a plain click never trips it),
  // checked once in onClick to skip that one menu-open, then reset.
  const textDraggedRef = useRef(false);
  const overlayDraggedRef = useRef(false);

  // ---- Derived "active" clip for each single-file-shaped track (the
  // preview shows/plays the SELECTED clip; clicking a block in the
  // timeline selects it, same click-to-select gesture v1 used to drive the
  // Crop/Rotate/Speed popovers). See the top-of-file note: seamless
  // auto-advance playback across multiple video clips is deferred. ----
  const activeVideoClip = videoClips.find((c) => c.id === selectedSegmentId) ?? videoClips[0] ?? null;
  const videoUrl = activeVideoClip?.url ?? null;
  const activeMusicClip = musicClips.find((c) => c.id === selectedMusicId) ?? musicClips[0] ?? null;
  const musicUrl = activeMusicClip?.url ?? null;

  const currentEdit: SegmentEdit = (selectedSegmentId && videoClipEdits[selectedSegmentId]) || DEFAULT_EDIT;
  const selectedTextOverlay = textOverlays.find((t) => t.id === selectedTextId) ?? null;
  const selectedOverlayItem = overlayItems.find((o) => o.id === selectedOverlayId) ?? null;
  const activeTextOverlays = textOverlays.filter((t) => currentTime >= t.startTime && currentTime <= t.endTime);
  const activeOverlayItems = overlayItems.filter((o) => currentTime >= o.startTime && currentTime <= o.endTime);

  // ---- Master timeline duration: the ruler, and every track's block
  // widths/positions, are all scaled against this — the longest of the
  // Video/Music tracks' own REAL (trimmed) total length, not just the
  // currently-selected clip's own native duration. Falls back to a fixed
  // 20s span when nothing has been uploaded yet, purely so the empty
  // timeline still shows a reasonable ruler instead of collapsing to 0.
  // NOTE: the playhead's own position (playheadFrac) still tracks the
  // SELECTED clip's own progress, not this master duration — see the
  // "preview playback is per-selected-clip" limitation already flagged in
  // the last report; unifying that is a bigger change than this pass. ----
  const videoTrackDuration = videoClips.reduce((s, c) => s + effectiveDuration(c), 0);
  const musicTrackDuration = musicClips.reduce((s, c) => s + effectiveDuration(c), 0);
  const timelineDuration = Math.max(videoTrackDuration, musicTrackDuration) || 20;

  // ---- Keep selection valid whenever the underlying array changes (clip
  // removed, or first clip added) ----
  useEffect(() => {
    if (selectedSegmentId && !videoClips.some((c) => c.id === selectedSegmentId)) {
      setSelectedSegmentId(videoClips[0]?.id ?? null);
    } else if (!selectedSegmentId && videoClips.length > 0) {
      setSelectedSegmentId(videoClips[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoClips]);
  useEffect(() => {
    if (selectedMusicId && !musicClips.some((c) => c.id === selectedMusicId)) {
      setSelectedMusicId(musicClips[0]?.id ?? null);
    } else if (!selectedMusicId && musicClips.length > 0) {
      setSelectedMusicId(musicClips[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicClips]);

  // Stop the meter's rAF loop + close the AudioContext on unmount. Also
  // revoke every remaining clip/overlay object URL so nothing leaks (v1
  // only ever had at most one video + one audio URL to revoke; with arrays
  // of clips that can grow arbitrarily, unmount cleanup has to walk them).
  useEffect(() => {
    return () => {
      if (meterRafRef.current !== null) cancelAnimationFrame(meterRafRef.current);
      audioCtxRef.current?.close().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Speed: keep the actual <video> element in sync with the selected clip ----
  useEffect(() => {
    const v = previewVideoRef.current;
    if (v) v.playbackRate = currentEdit.speed;
  }, [currentEdit.speed, videoUrl]);

  // ---- Independent mute/volume: selected video clip's own sound vs the
  // selected music clip, each wired to their own real media element ----
  useEffect(() => {
    const v = previewVideoRef.current;
    if (v) {
      v.muted = videoMuted;
      v.volume = videoVolume;
    }
  }, [videoMuted, videoVolume, videoUrl]);
  useEffect(() => {
    const a = musicElRef.current;
    if (a) {
      a.muted = musicMuted;
      a.volume = musicVolume;
    }
  }, [musicMuted, musicVolume, musicUrl]);

  // ---- Audio level meter (Web Audio API) — same source -> analyser ->
  // destination pattern as v1, now measuring the selected Music clip. ----
  const ensureAudioGraph = () => {
    const audioEl = musicElRef.current;
    if (!audioEl) return;
    if (!audioCtxRef.current) {
      const Ctor: typeof AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctor();
      const source = ctx.createMediaElementSource(audioEl);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = METER_FFT_SIZE;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const stopMeterLoop = () => {
    if (meterRafRef.current !== null) {
      cancelAnimationFrame(meterRafRef.current);
      meterRafRef.current = null;
    }
    setMeterLevels(Array(METER_BAR_COUNT).fill(0));
  };

  const startMeterLoop = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const bucketSize = Math.max(1, Math.floor(data.length / METER_BAR_COUNT));
    const tick = () => {
      analyser.getByteFrequencyData(data);
      const bars: number[] = [];
      for (let i = 0; i < METER_BAR_COUNT; i += 1) {
        let sum = 0;
        for (let j = 0; j < bucketSize; j += 1) sum += data[i * bucketSize + j] ?? 0;
        bars.push(sum / bucketSize / 255);
      }
      setMeterLevels(bars);
      meterRafRef.current = requestAnimationFrame(tick);
    };
    meterRafRef.current = requestAnimationFrame(tick);
  };

  const handleMusicPlay = () => startMeterLoop();
  const handleMusicPause = () => stopMeterLoop();
  const handleMusicEnded = () => stopMeterLoop();
  const handleVideoEnded = () => {
    const a = musicElRef.current;
    if (a && !a.paused) a.pause();
  };

  // ---- Transport controls ----
  const FRAME_SEC = 1 / 30;
  const handlePlayPause = () => {
    const v = previewVideoRef.current;
    if (!v) return;
    if (v.paused) {
      ensureAudioGraph();
      v.play();
      musicElRef.current?.play().catch(() => {});
    } else {
      v.pause();
      musicElRef.current?.pause();
    }
  };
  const handlePrevFrame = () => {
    const v = previewVideoRef.current;
    if (v) v.currentTime = Math.max(0, v.currentTime - FRAME_SEC);
  };
  const handleNextFrame = () => {
    const v = previewVideoRef.current;
    if (v) v.currentTime = Math.min(v.duration || v.currentTime + FRAME_SEC, v.currentTime + FRAME_SEC);
  };
  const handleTimeUpdate = () => {
    const v = previewVideoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    if (v.duration) setPlayheadFrac(v.currentTime / v.duration);
  };
  const handleLoadedMetadata = () => {
    const v = previewVideoRef.current;
    if (v) {
      setDuration(v.duration);
      setVideoWidth(v.videoWidth);
      setVideoHeight(v.videoHeight);
    }
  };

  // ---- Playhead seek (click or drag on the timeline ruler) ----
  const seekAtClientX = (clientX: number) => {
    const el = timelineRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setPlayheadFrac(frac);
    const v = previewVideoRef.current;
    if (v && Number.isFinite(v.duration) && v.duration > 0) v.currentTime = frac * v.duration;
  };
  const handleTimelinePointerDown = (e: React.PointerEvent) => {
    seekAtClientX(e.clientX);
    const handleMove = (ev: PointerEvent) => seekAtClientX(ev.clientX);
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  // ---- Add clips (Media panel) ----
  // All three accept `multiple` file selection -- Promise.all probes every
  // file's duration in parallel but still builds the result array in
  // SELECTION order (Promise.all preserves input order regardless of which
  // duration resolves first), then appends the whole batch in one state
  // update so multi-select adds every file as its own clip, not just the
  // first.
  const handleAddVideoClip = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    const newClips = await Promise.all(
      files.map(async (file, i) => {
        const url = URL.createObjectURL(file);
        const dur = await probeMediaDuration(url, "video");
        const id = `v-${Date.now()}-${i}`;
        const clip: VideoClip = { id, file, url, duration: dur, sourceStartFrac: 0, sourceEndFrac: 1, trimStart: 0, trimEnd: 0, widthFrac: dur > 0 ? dur : 1, locked: false };
        return clip;
      })
    );
    setVideoClips((prev) => [...prev, ...newClips]);
    setSelectedSegmentId(newClips[newClips.length - 1].id);
  };
  const handleAddMusicClip = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    const newClips = await Promise.all(
      files.map(async (file, i) => {
        const url = URL.createObjectURL(file);
        const dur = await probeMediaDuration(url, "audio");
        const id = `m-${Date.now()}-${i}`;
        const clip: MusicClip = { id, file, url, duration: dur, sourceStartFrac: 0, sourceEndFrac: 1, trimStart: 0, trimEnd: 0, widthFrac: dur > 0 ? dur : 1, locked: false };
        return clip;
      })
    );
    setMusicClips((prev) => [...prev, ...newClips]);
    setSelectedMusicId(newClips[newClips.length - 1].id);
  };
  const handleAddOverlay = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    // Overlay items are time-based, not array-sequential like Video/Music,
    // so a multi-select batch needs its own placement: each item starts
    // where the previous one in THIS batch ends (same "avoid full overlap"
    // principle Duplicate already uses elsewhere), anchored at currentTime.
    const start = currentTime;
    const newItems: OverlayItem[] = files.map((file, i) => {
      const url = URL.createObjectURL(file);
      const id = `o-${Date.now()}-${i}`;
      const itemStart = start + i * 3;
      return { id, type, file, url, startTime: itemStart, endTime: itemStart + 3, x: 50, y: 50, width: 30, height: 30, locked: false };
    });
    setOverlayItems((prev) => [...prev, ...newItems]);
    setSelectedOverlayId(newItems[newItems.length - 1].id);
    // Deliberately does NOT switch to the Overlay tab (unlike an earlier
    // draft) -- that unmounted the Media panel's own upload inputs,
    // blocking a second add without manually switching tabs back. Stays
    // consistent with handleAddVideoClip/handleAddMusicClip, neither of
    // which switches tabs either.
  };

  const removeVideoClip = (id: string) => {
    setVideoClips((prev) => removeClipById(prev, id));
    setVideoClipEdits((prev) => {
      const rest = { ...prev };
      delete rest[id];
      return rest;
    });
  };
  const removeMusicClip = (id: string) => setMusicClips((prev) => removeClipById(prev, id));
  const removeOverlayItem = (id: string) => {
    setOverlayItems((prev) => {
      const target = prev.find((o) => o.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((o) => o.id !== id);
    });
    setSelectedOverlayId((prev) => (prev === id ? null : prev));
  };

  // ---- Reorder within a track (drag/drop) ----
  // Always inserting the dragged block immediately BEFORE the drop target is
  // a no-op exactly when the dragged block is already the target's
  // immediate predecessor -- i.e. the single most common reorder, swapping
  // two adjacent clips, silently did nothing (this is what made drag look
  // "stuck" for anyone testing with just two clips). Insert AFTER the
  // target when dragging forward (dragged started earlier in the array)
  // and BEFORE it when dragging backward, so the drop always lands past
  // wherever the block used to be relative to the target -- standard
  // reorderable-list behavior, and never a no-op for two distinct blocks.
  const handleVideoDrop = (targetId: string) => {
    if (!dragVideoId || dragVideoId === targetId) return;
    setVideoClips((prev) => {
      const draggedIdx = prev.findIndex((b) => b.id === dragVideoId);
      const targetIdx = prev.findIndex((b) => b.id === targetId);
      if (draggedIdx === -1 || targetIdx === -1) return prev;
      const dragged = prev[draggedIdx];
      const without = prev.filter((b) => b.id !== dragVideoId);
      const targetIdxInWithout = without.findIndex((b) => b.id === targetId);
      const insertAt = draggedIdx < targetIdx ? targetIdxInWithout + 1 : targetIdxInWithout;
      const next = [...without];
      next.splice(insertAt, 0, dragged);
      return next;
    });
    setDragVideoId(null);
  };
  const handleMusicDrop = (targetId: string) => {
    if (!dragMusicId || dragMusicId === targetId) return;
    setMusicClips((prev) => {
      const draggedIdx = prev.findIndex((b) => b.id === dragMusicId);
      const targetIdx = prev.findIndex((b) => b.id === targetId);
      if (draggedIdx === -1 || targetIdx === -1) return prev;
      const dragged = prev[draggedIdx];
      const without = prev.filter((b) => b.id !== dragMusicId);
      const targetIdxInWithout = without.findIndex((b) => b.id === targetId);
      const insertAt = draggedIdx < targetIdx ? targetIdxInWithout + 1 : targetIdxInWithout;
      const next = [...without];
      next.splice(insertAt, 0, dragged);
      return next;
    });
    setDragMusicId(null);
  };

  // ---- Trim (drag edge handle) ----
  const trimVideoClip = (id: string, side: "start" | "end", delta: number) => {
    setVideoClips((prev) => prev.map((b) => applyTrim(b, id, side, delta)));
  };
  const trimMusicClip = (id: string, side: "start" | "end", delta: number) => {
    setMusicClips((prev) => prev.map((b) => applyTrim(b, id, side, delta)));
  };

  // ---- Split at playhead ----
  const handleSplitVideo = () => {
    const prev = videoClips;
    const next = splitClipsAt(prev, playheadFrac, "v");
    if (next === prev) return;
    const prevIds = new Set(prev.map((b) => b.id));
    const nextIds = new Set(next.map((b) => b.id));
    const removedId = prev.find((b) => !nextIds.has(b.id))?.id;
    const addedIds = next.filter((b) => !prevIds.has(b.id)).map((b) => b.id);
    setVideoClips(next);
    if (removedId && addedIds.length === 2) {
      setVideoClipEdits((prevEdits) => {
        const edit = prevEdits[removedId] ?? DEFAULT_EDIT;
        const rest = { ...prevEdits };
        delete rest[removedId];
        return { ...rest, [addedIds[0]]: edit, [addedIds[1]]: edit };
      });
      setSelectedSegmentId(addedIds[0]);
    }
  };
  const handleSplitMusic = () => setMusicClips((prev) => splitClipsAt(prev, playheadFrac, "m"));

  // ---- Segment context menu — a single LEFT-CLICK on any block (Video,
  // Music, Text, or Overlay) opens this, selecting/loading the block at the
  // same time (see report for why: no real conflict between "select" and
  // "open menu" since they're just two effects of the same click). Right-
  // click still works too as a familiar secondary trigger.
  //
  // stopPropagation is essential here, not just defensive: the menu is
  // dismissed by a window-level "click" listener (see the effect below).
  // Since opening now happens FROM a click, that same click event would
  // otherwise keep bubbling up to that same window listener and close the
  // menu the instant it opened. preventDefault is only needed for the
  // right-click path (suppresses the native browser context menu) but is
  // harmless to call unconditionally. ----
  const handleBlockContextMenu = (trackKind: TrackKind, id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, trackKind, blockId: id });
  };
  const closeContextMenu = () => setContextMenu(null);

  useEffect(() => {
    if (!contextMenu) return;
    const handleClick = () => closeContextMenu();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeContextMenu();
    };
    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, [contextMenu]);

  // Lock/Duplicate/Delete/Replace/Split all now branch across all 4 track
  // kinds. Video/Music share one branch (the flex-grow ClipBase shape);
  // Text/Overlay share another (the time-based startTime/endTime shape).
  const handleMenuToggleLock = () => {
    if (!contextMenu) return;
    const { trackKind, blockId } = contextMenu;
    if (trackKind === "video") setVideoClips((prev) => prev.map((b) => (b.id === blockId ? { ...b, locked: !b.locked } : b)));
    else if (trackKind === "music") setMusicClips((prev) => prev.map((b) => (b.id === blockId ? { ...b, locked: !b.locked } : b)));
    else if (trackKind === "text") setTextOverlays((prev) => prev.map((t) => (t.id === blockId ? { ...t, locked: !t.locked } : t)));
    else setOverlayItems((prev) => prev.map((o) => (o.id === blockId ? { ...o, locked: !o.locked } : o)));
    closeContextMenu();
  };

  const handleMenuDuplicate = () => {
    if (!contextMenu) return;
    const { trackKind, blockId } = contextMenu;
    if (trackLocks[trackKind]) {
      closeContextMenu();
      return;
    }
    if (trackKind === "video" || trackKind === "music") {
      const prefix = trackKind === "video" ? "v" : "m";
      const newId = `${prefix}-${Date.now()}-copy`;
      const clips = trackKind === "video" ? videoClips : musicClips;
      const idx = clips.findIndex((b) => b.id === blockId);
      if (idx === -1) {
        closeContextMenu();
        return;
      }
      const copy: ClipBase = { ...clips[idx], id: newId, locked: false };
      const next = [...clips];
      next.splice(idx + 1, 0, copy);
      if (trackKind === "video") {
        setVideoClips(next);
        setVideoClipEdits((prev) => {
          const original = prev[blockId];
          return original ? { ...prev, [newId]: original } : prev;
        });
      } else {
        setMusicClips(next);
      }
    } else if (trackKind === "text") {
      // Time-based items have no "array position" on the timeline (they're
      // placed by absolute startTime/endTime, not array order), so unlike
      // Video/Music's insert-right-after, the duplicate is offset to start
      // right where the original ends — stacking it exactly on top would
      // make the duplicate invisible/indistinguishable at a glance.
      const original = textOverlays.find((t) => t.id === blockId);
      if (!original) {
        closeContextMenu();
        return;
      }
      const span = original.endTime - original.startTime;
      const newId = `t-${Date.now()}-copy`;
      const copy: TextOverlay = { ...original, id: newId, locked: false, startTime: original.endTime, endTime: original.endTime + span };
      setTextOverlays((prev) => [...prev, copy]);
      setSelectedTextId(newId);
    } else {
      const original = overlayItems.find((o) => o.id === blockId);
      if (!original) {
        closeContextMenu();
        return;
      }
      const span = original.endTime - original.startTime;
      const newId = `o-${Date.now()}-copy`;
      const copy: OverlayItem = { ...original, id: newId, locked: false, startTime: original.endTime, endTime: original.endTime + span };
      setOverlayItems((prev) => [...prev, copy]);
      setSelectedOverlayId(newId);
    }
    closeContextMenu();
  };

  const handleMenuDelete = () => {
    if (!contextMenu) return;
    const { trackKind, blockId } = contextMenu;
    if (trackLocks[trackKind]) {
      closeContextMenu();
      return;
    }
    if (trackKind === "video") removeVideoClip(blockId);
    else if (trackKind === "music") removeMusicClip(blockId);
    else if (trackKind === "text") deleteTextOverlay(blockId);
    else removeOverlayItem(blockId);
    closeContextMenu();
  };

  // Replace: genuinely wired for every track kind that owns a file (unlike
  // v1's TODO, blocked back then since the whole track shared one file).
  // Text has no associated file, so Replace is a harmless no-op there —
  // there's nothing sensible to swap in for a caption.
  const handleMenuReplace = () => {
    if (!contextMenu) return;
    const { trackKind, blockId } = contextMenu;
    if (trackKind === "text" || trackLocks[trackKind]) {
      closeContextMenu();
      return;
    }
    replaceTargetRef.current = { trackKind, id: blockId };
    const input = trackKind === "video" ? replaceVideoInputRef.current : trackKind === "music" ? replaceMusicInputRef.current : replaceOverlayInputRef.current;
    input?.click();
    closeContextMenu();
  };
  const handleReplaceFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    const target = replaceTargetRef.current;
    replaceTargetRef.current = null;
    if (!file || !target) return;
    const url = URL.createObjectURL(file);
    if (target.trackKind === "overlay") {
      setOverlayItems((prev) => prev.map((o) => (o.id === target.id ? { ...o, file, url, type: file.type.startsWith("video/") ? "video" : "image" } : o)));
      return;
    }
    const dur = await probeMediaDuration(url, target.trackKind === "video" ? "video" : "audio");
    const setClips = target.trackKind === "video" ? setVideoClips : setMusicClips;
    setClips((prev) =>
      prev.map((c) => (c.id === target.id ? { ...c, file, url, duration: dur, sourceStartFrac: 0, sourceEndFrac: 1 } : c))
    );
  };

  // Split for Text/Overlay targets the SPECIFIC clicked block (looked up by
  // id), not "whichever item the playhead is over" the way Video/Music's
  // split works — Video/Music blocks on the same track can never overlap in
  // time (sequential flex layout guarantees exactly one block per instant),
  // but Text/Overlay items routinely DO overlap (multiple captions active
  // at once), so "whichever is under the playhead" would be ambiguous.
  // Targeting the exact block the user clicked has no such ambiguity.
  const handleMenuSplit = () => {
    if (!contextMenu) return;
    const { trackKind, blockId } = contextMenu;
    if (trackLocks[trackKind]) {
      closeContextMenu();
      return;
    }
    if (trackKind === "video") handleSplitVideo();
    else if (trackKind === "music") handleSplitMusic();
    else if (trackKind === "text") {
      setTextOverlays((prev) => {
        const item = prev.find((t) => t.id === blockId);
        if (!item || item.locked || currentTime <= item.startTime + MIN_TEXT_DURATION || currentTime >= item.endTime - MIN_TEXT_DURATION) return prev;
        const newId = `t-${Date.now()}-r`;
        const right: TextOverlay = { ...item, id: newId, startTime: currentTime };
        return prev.map((t) => (t.id === blockId ? { ...t, endTime: currentTime } : t)).concat(right);
      });
    } else {
      setOverlayItems((prev) => {
        const item = prev.find((o) => o.id === blockId);
        if (!item || item.locked || currentTime <= item.startTime + MIN_OVERLAY_DURATION || currentTime >= item.endTime - MIN_OVERLAY_DURATION) return prev;
        const newId = `o-${Date.now()}-r`;
        const right: OverlayItem = { ...item, id: newId, startTime: currentTime };
        return prev.map((o) => (o.id === blockId ? { ...o, endTime: currentTime } : o)).concat(right);
      });
    }
    closeContextMenu();
  };

  // ---- Per-clip crop/rotate/speed/color edits (Video track only) ----
  const updateSelectedEdit = (patch: Partial<SegmentEdit>) => {
    if (!selectedSegmentId) return;
    setVideoClipEdits((prev) => ({
      ...prev,
      [selectedSegmentId]: { ...(prev[selectedSegmentId] ?? DEFAULT_EDIT), ...patch },
    }));
  };

  const applyCropPreset = (ratio: number | null) => {
    if (ratio === null) {
      updateSelectedEdit({ crop: DEFAULT_CROP });
      return;
    }
    const container = previewContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const containerRatio = rect.width / rect.height;
    let widthPct: number;
    let heightPct: number;
    if (ratio > containerRatio) {
      widthPct = 100;
      heightPct = (containerRatio / ratio) * 100;
    } else {
      heightPct = 100;
      widthPct = (ratio / containerRatio) * 100;
    }
    updateSelectedEdit({ crop: { x: (100 - widthPct) / 2, y: (100 - heightPct) / 2, width: widthPct, height: heightPct } });
  };

  const startCropMove = (e: React.PointerEvent) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startCrop = currentEdit.crop;
    const container = previewContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const handleMove = (ev: PointerEvent) => {
      const dxPct = ((ev.clientX - startX) / rect.width) * 100;
      const dyPct = ((ev.clientY - startY) / rect.height) * 100;
      const nx = Math.min(100 - startCrop.width, Math.max(0, startCrop.x + dxPct));
      const ny = Math.min(100 - startCrop.height, Math.max(0, startCrop.y + dyPct));
      updateSelectedEdit({ crop: { ...startCrop, x: nx, y: ny } });
    };
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const startCropResize = (corner: Corner) => (e: React.PointerEvent) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startCrop = currentEdit.crop;
    const container = previewContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const handleMove = (ev: PointerEvent) => {
      const dxPct = ((ev.clientX - startX) / rect.width) * 100;
      const dyPct = ((ev.clientY - startY) / rect.height) * 100;
      let { x, y, width, height } = startCrop;
      if (corner === "ne" || corner === "se") width = Math.min(100 - startCrop.x, Math.max(MIN_CROP_PCT, startCrop.width + dxPct));
      if (corner === "sw" || corner === "se") height = Math.min(100 - startCrop.y, Math.max(MIN_CROP_PCT, startCrop.height + dyPct));
      if (corner === "nw" || corner === "sw") {
        const newWidth = Math.max(MIN_CROP_PCT, startCrop.width - dxPct);
        const newX = startCrop.x + startCrop.width - newWidth;
        if (newX >= 0) {
          x = newX;
          width = newWidth;
        }
      }
      if (corner === "nw" || corner === "ne") {
        const newHeight = Math.max(MIN_CROP_PCT, startCrop.height - dyPct);
        const newY = startCrop.y + startCrop.height - newHeight;
        if (newY >= 0) {
          y = newY;
          height = newHeight;
        }
      }
      updateSelectedEdit({ crop: { x, y, width, height } });
    };
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const showCropFrame = !!videoUrl && !!selectedSegmentId && (openPopover === "crop" || !isDefaultCrop(currentEdit.crop));

  // ---- Text overlays (unchanged from v1) ----
  const handleAddText = () => {
    const id = `t-${Date.now()}`;
    const start = currentTime;
    const overlay: TextOverlay = { id, content: textDraftContent.trim() || "Text", x: 50, y: 50, fontSize: textDraftFontSize, color: textDraftColor, startTime: start, endTime: start + 3, locked: false };
    setTextOverlays((prev) => [...prev, overlay]);
    setSelectedTextId(id);
    setTextDraftContent("");
  };
  const updateSelectedText = (patch: Partial<TextOverlay>) => {
    if (!selectedTextId) return;
    setTextOverlays((prev) => prev.map((t) => (t.id === selectedTextId ? { ...t, ...patch } : t)));
  };
  const deleteTextOverlay = (id: string) => {
    setTextOverlays((prev) => prev.filter((t) => t.id !== id));
    setSelectedTextId((prev) => (prev === id ? null : prev));
  };
  const startTextDrag = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedTextId(id);
    const overlay = textOverlays.find((t) => t.id === id);
    const container = previewContainerRef.current;
    if (!overlay || !container) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = { x: overlay.x, y: overlay.y };
    const rect = container.getBoundingClientRect();
    const handleMove = (ev: PointerEvent) => {
      const dxPct = ((ev.clientX - startX) / rect.width) * 100;
      const dyPct = ((ev.clientY - startY) / rect.height) * 100;
      const nx = Math.min(100, Math.max(0, startPos.x + dxPct));
      const ny = Math.min(100, Math.max(0, startPos.y + dyPct));
      setTextOverlays((prev) => prev.map((t) => (t.id === id ? { ...t, x: nx, y: ny } : t)));
    };
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };
  const startTextBlockMove = (id: string) => (e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedTextId(id);
    if (timelineDuration <= 0) return;
    const overlay = textOverlays.find((t) => t.id === id);
    if (!overlay || overlay.locked || trackLocks.text) return;
    const row = (e.currentTarget as HTMLElement).closest<HTMLElement>("[data-text-row]");
    const rowWidth = row?.getBoundingClientRect().width ?? 0;
    if (rowWidth <= 0) return;
    const startX = e.clientX;
    const span = overlay.endTime - overlay.startTime;
    const startTimeAtDown = overlay.startTime;
    textDraggedRef.current = false;
    const handleMove = (ev: PointerEvent) => {
      if (Math.abs(ev.clientX - startX) > 3) textDraggedRef.current = true;
      const dxSec = ((ev.clientX - startX) / rowWidth) * timelineDuration;
      const newStart = Math.max(0, Math.min(timelineDuration - span, startTimeAtDown + dxSec));
      setTextOverlays((prev) => prev.map((t) => (t.id === id ? { ...t, startTime: newStart, endTime: newStart + span } : t)));
    };
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };
  const resizeTextEdge = (id: string, side: "start" | "end", deltaFraction: number) => {
    if (timelineDuration <= 0) return;
    const deltaSec = deltaFraction * timelineDuration;
    setTextOverlays((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (side === "start") {
          const next = Math.min(t.endTime - MIN_TEXT_DURATION, Math.max(0, t.startTime + deltaSec));
          return { ...t, startTime: next };
        }
        const next = Math.max(t.startTime + MIN_TEXT_DURATION, Math.min(timelineDuration, t.endTime + deltaSec));
        return { ...t, endTime: next };
      })
    );
  };

  // ---- Overlay items: same drag-to-shift / edge-handle-to-trim gestures
  // as Text, plus x/y/width/height editable from the Overlay tool panel ----
  const updateSelectedOverlay = (patch: Partial<OverlayItem>) => {
    if (!selectedOverlayId) return;
    setOverlayItems((prev) => prev.map((o) => (o.id === selectedOverlayId ? { ...o, ...patch } : o)));
  };
  const startOverlayDrag = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedOverlayId(id);
    const overlay = overlayItems.find((o) => o.id === id);
    const container = previewContainerRef.current;
    if (!overlay || !container) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = { x: overlay.x, y: overlay.y };
    const rect = container.getBoundingClientRect();
    const handleMove = (ev: PointerEvent) => {
      const dxPct = ((ev.clientX - startX) / rect.width) * 100;
      const dyPct = ((ev.clientY - startY) / rect.height) * 100;
      const nx = Math.min(100, Math.max(0, startPos.x + dxPct));
      const ny = Math.min(100, Math.max(0, startPos.y + dyPct));
      setOverlayItems((prev) => prev.map((o) => (o.id === id ? { ...o, x: nx, y: ny } : o)));
    };
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };
  const startOverlayBlockMove = (id: string) => (e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedOverlayId(id);
    if (timelineDuration <= 0) return;
    const overlay = overlayItems.find((o) => o.id === id);
    if (!overlay || overlay.locked || trackLocks.overlay) return;
    const row = (e.currentTarget as HTMLElement).closest<HTMLElement>("[data-overlay-row]");
    const rowWidth = row?.getBoundingClientRect().width ?? 0;
    if (rowWidth <= 0) return;
    const startX = e.clientX;
    const span = overlay.endTime - overlay.startTime;
    const startTimeAtDown = overlay.startTime;
    overlayDraggedRef.current = false;
    const handleMove = (ev: PointerEvent) => {
      if (Math.abs(ev.clientX - startX) > 3) overlayDraggedRef.current = true;
      const dxSec = ((ev.clientX - startX) / rowWidth) * timelineDuration;
      const newStart = Math.max(0, Math.min(timelineDuration - span, startTimeAtDown + dxSec));
      setOverlayItems((prev) => prev.map((o) => (o.id === id ? { ...o, startTime: newStart, endTime: newStart + span } : o)));
    };
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };
  const resizeOverlayEdge = (id: string, side: "start" | "end", deltaFraction: number) => {
    if (timelineDuration <= 0) return;
    const deltaSec = deltaFraction * timelineDuration;
    setOverlayItems((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        if (side === "start") {
          const next = Math.min(o.endTime - MIN_OVERLAY_DURATION, Math.max(0, o.startTime + deltaSec));
          return { ...o, startTime: next };
        }
        const next = Math.max(o.startTime + MIN_OVERLAY_DURATION, Math.min(timelineDuration, o.endTime + deltaSec));
        return { ...o, endTime: next };
      })
    );
  };

  // ---- Auto Edit: unchanged flow from v1, just gated on the currently
  // active/selected video clip instead of a single global file ----
  const loadRazorpayScript = (): Promise<boolean> =>
    new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const runSimulatedAutoEdit = () => {
    setAutoEditStage("analyzing");
    setAutoEditProgress(0);
    const steps: [number, string][] = [
      [25, "Detecting beats..."],
      [55, "Tracking subject..."],
      [85, "Applying auto-cuts..."],
      [100, "Ready"],
    ];
    let i = 0;
    const tick = () => {
      if (i >= steps.length) {
        setAutoEditStage("done");
        return;
      }
      const [pct, label] = steps[i];
      setAutoEditProgress(pct);
      setAutoEditLabel(label);
      i += 1;
      setTimeout(tick, 600);
    };
    tick();
  };

  const handleAutoEditClick = async () => {
    if (!videoUrl) return;
    setAutoEditError(null);
    setAutoEditStage("paying");
    try {
      const orderRes = await fetch("/api/create-order", { method: "POST" });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.order_id) {
        throw new Error(orderData.error || "Failed to create order.");
      }
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Failed to load Razorpay checkout.");
      }
      const rzp = new window.Razorpay({
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.order_id,
        name: "PM Graphics",
        description: "Auto Edit — AI-automated video edit (TEST MODE)",
        handler: async (response: RazorpayHandlerResponse) => {
          setAutoEditStage("verifying");
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.verified) {
              runSimulatedAutoEdit();
            } else {
              setAutoEditError(verifyData.error || "Payment verification failed.");
              setAutoEditStage("error");
            }
          } catch {
            setAutoEditError("Could not verify payment. Please try again.");
            setAutoEditStage("error");
          }
        },
        modal: {
          ondismiss: () => setAutoEditStage((prev) => (prev === "paying" ? "idle" : prev)),
        },
        theme: { color: COLORS.accent },
      });
      rzp.on("payment.failed", (resp: { error?: { description?: string } }) => {
        setAutoEditError(resp?.error?.description || "Payment failed.");
        setAutoEditStage("error");
      });
      rzp.open();
    } catch (err) {
      setAutoEditError(err instanceof Error ? err.message : "Something went wrong starting payment.");
      setAutoEditStage("error");
    }
  };

  // ---- Export: render the full Video/Overlay/Text/Music state into a real
  // downloadable MP4 via lib/video-editor/export-v2.ts ----
  const handleExportClick = async () => {
    if (videoClips.length === 0) return;
    if (exportResultUrl) URL.revokeObjectURL(exportResultUrl);
    setExportError(null);
    setExportResultUrl(null);
    setExportStage("loading");
    setExportProgress(0);
    setExportStageLabel("Loading export engine...");
    try {
      const exportVideoClips: ExportV2VideoClipInput[] = videoClips.map((c) => ({
        id: c.id,
        file: c.file,
        url: c.url,
        duration: c.duration,
        sourceStartFrac: c.sourceStartFrac,
        sourceEndFrac: c.sourceEndFrac,
        trimStart: c.trimStart,
        trimEnd: c.trimEnd,
        edit: videoClipEdits[c.id] || DEFAULT_EDIT,
      }));
      const exportMusicClips: ExportV2ClipInput[] = musicClips.map((c) => ({
        id: c.id,
        file: c.file,
        duration: c.duration,
        sourceStartFrac: c.sourceStartFrac,
        sourceEndFrac: c.sourceEndFrac,
        trimStart: c.trimStart,
        trimEnd: c.trimEnd,
      }));
      const exportOverlays: ExportV2OverlayInput[] = overlayItems.map((o) => ({
        id: o.id,
        type: o.type,
        file: o.file,
        startTime: o.startTime,
        endTime: o.endTime,
        x: o.x,
        y: o.y,
        width: o.width,
        height: o.height,
      }));
      const exportTextOverlays: ExportV2TextInput[] = textOverlays.map((t) => ({
        content: t.content,
        x: t.x,
        y: t.y,
        fontSize: t.fontSize,
        color: t.color,
        startTime: t.startTime,
        endTime: t.endTime,
      }));

      const blob = await exportVideoV2({
        videoClips: exportVideoClips,
        musicClips: exportMusicClips,
        overlays: exportOverlays,
        textOverlays: exportTextOverlays,
        aspectRatio,
        onLoadProgress: (ratio) => setExportProgress(Math.round(ratio * 30)),
        onProgress: (ratio) => {
          setExportStage("rendering");
          setExportStageLabel("Rendering...");
          setExportProgress(30 + Math.round(ratio * 70));
        },
        onStage: (label) => setExportStageLabel(label),
      });
      const url = URL.createObjectURL(blob);
      setExportResultUrl(url);
      setExportProgress(100);
      setExportStage("done");
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "Export failed.");
      setExportStage("error");
    }
  };

  // Revoke the exported blob URL on unmount so it doesn't leak.
  useEffect(() => {
    return () => {
      if (exportResultUrl) URL.revokeObjectURL(exportResultUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    <Script src="/ffmpeg/ffmpeg.js" strategy="afterInteractive" />
    <div style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column", backgroundColor: COLORS.bg, color: COLORS.textPrimary, overflow: "hidden" }}>
      {/* ---- Top bar ---- */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 20px", borderBottom: `1px solid ${COLORS.cardBorder}`, backgroundColor: COLORS.trackHeaderBg, flexShrink: 0 }}>
        <Link href="/tools" style={{ color: COLORS.textMuted, fontSize: 18, textDecoration: "none" }} title="Back">
          &#8592;
        </Link>
        <span style={{ fontSize: 14, fontWeight: 600 }}>Video Editing</span>
        <div style={{ display: "flex", gap: 4, marginLeft: 12 }}>
          <button type="button" disabled title="Undo (coming soon)" style={disabledIconStyle}>&#8630;</button>
          <button type="button" disabled title="Redo (coming soon)" style={disabledIconStyle}>&#8631;</button>
        </div>
        <select
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
          style={{ marginLeft: 12, backgroundColor: COLORS.card, color: COLORS.textPrimary, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 6, fontSize: 12, padding: "4px 8px" }}
        >
          <option value="16:9">16:9</option>
          <option value="9:16">9:16</option>
          <option value="1:1">1:1</option>
        </select>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={handleExportClick}
            disabled={videoClips.length === 0 || exportStage !== "idle" || autoEditStage !== "idle"}
            title={videoClips.length === 0 ? "Add a video clip first" : "Render the full Video + Overlay + Text + Music timeline to MP4"}
            style={{
              borderRadius: 8,
              border: `1px solid ${COLORS.cardBorder}`,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 600,
              background: "transparent",
              color: COLORS.textPrimary,
              opacity: videoClips.length === 0 || exportStage !== "idle" || autoEditStage !== "idle" ? 0.4 : 1,
              cursor: videoClips.length === 0 || exportStage !== "idle" || autoEditStage !== "idle" ? "not-allowed" : "pointer",
            }}
          >
            &#8681; Export
          </button>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", padding: "3px 6px", borderRadius: 4, border: `1px solid ${COLORS.danger}`, color: COLORS.danger }} title="Razorpay TEST mode — no real payments are processed">
            TEST MODE
          </span>
          <button
            type="button"
            onClick={handleAutoEditClick}
            disabled={!videoUrl || autoEditStage !== "idle"}
            title={videoUrl ? "Pay ₹500 (test) to run Auto Edit on the selected video clip" : "Upload a video first"}
            style={{ borderRadius: 8, border: "none", padding: "8px 14px", fontSize: 13, fontWeight: 600, backgroundColor: COLORS.accent, color: COLORS.accentText, opacity: !videoUrl || autoEditStage !== "idle" ? 0.4 : 1, cursor: !videoUrl || autoEditStage !== "idle" ? "not-allowed" : "pointer" }}
          >
            &#10024; Auto Edit &mdash; &#8377;500
          </button>
        </div>
      </div>

      {/* ---- Middle: sidebar + preview + right panel ---- */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Left sidebar */}
        <div style={{ width: 86, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "16px 0", backgroundColor: COLORS.trackHeaderBg, borderRight: `1px solid ${COLORS.cardBorder}` }}>
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              disabled={!tool.enabled}
              onClick={() => tool.enabled && setActiveTool(tool.id)}
              title={tool.enabled ? tool.label : "Coming soon"}
              style={{
                width: 56,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                padding: "8px 0",
                borderRadius: 8,
                border: "none",
                background: activeTool === tool.id ? COLORS.card : "transparent",
                color: tool.enabled ? (activeTool === tool.id ? COLORS.accent : COLORS.textPrimary) : COLORS.textMuted,
                opacity: tool.enabled ? 1 : 0.4,
                cursor: tool.enabled ? "pointer" : "not-allowed",
                fontSize: 18,
              }}
            >
              <span>{tool.icon}</span>
              <span style={{ fontSize: 9 }}>{tool.label}</span>
            </button>
          ))}
        </div>

        {/* Center: preview player */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 0", backgroundColor: COLORS.panelBgDark }}>
          <div
            ref={previewContainerRef}
            style={{ position: "relative", aspectRatio: ASPECT_CSS[aspectRatio], maxHeight: "100%", maxWidth: "100%", width: aspectRatio === "9:16" ? "auto" : "100%", height: aspectRatio === "9:16" ? "100%" : "auto", border: `1px solid ${COLORS.cardBorder}`, borderRadius: 6, overflow: "hidden", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {/* VIDEO (bottom layer) */}
            {videoUrl ? (
              <video
                ref={previewVideoRef}
                src={videoUrl}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transform: `rotate(${currentEdit.rotation}deg) scaleX(${currentEdit.flipH ? -1 : 1}) scaleY(${currentEdit.flipV ? -1 : 1})`,
                  filter: colorFilterCss(currentEdit.color),
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handleVideoEnded}
                onTimeUpdate={handleTimeUpdate}
                onSeeked={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />
            ) : (
              <div style={{ color: COLORS.textMuted, fontSize: 13 }}>No video uploaded</div>
            )}

            {musicUrl && (
              <audio
                ref={musicElRef}
                src={musicUrl}
                style={{ display: "none" }}
                onPlay={handleMusicPlay}
                onPause={handleMusicPause}
                onEnded={handleMusicEnded}
              />
            )}

            {/* Crop frame */}
            {showCropFrame && (
              <div
                onPointerDown={openPopover === "crop" ? startCropMove : undefined}
                style={{
                  position: "absolute",
                  left: `${currentEdit.crop.x}%`,
                  top: `${currentEdit.crop.y}%`,
                  width: `${currentEdit.crop.width}%`,
                  height: `${currentEdit.crop.height}%`,
                  border: `2px solid ${COLORS.accent}`,
                  boxShadow: "0 0 0 2000px rgba(0,0,0,0.55)",
                  boxSizing: "border-box",
                  cursor: openPopover === "crop" ? "move" : "default",
                  pointerEvents: openPopover === "crop" ? "auto" : "none",
                }}
              >
                {openPopover === "crop" &&
                  (["nw", "ne", "sw", "se"] as Corner[]).map((corner) => (
                    <div
                      key={corner}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        startCropResize(corner)(e);
                      }}
                      style={cornerHandleStyle(corner)}
                    />
                  ))}
              </div>
            )}

            {/* OVERLAY layer — drawn above Video, below Text, matching the
                timeline's Overlay-above-Video / Text-above-Overlay order */}
            {activeOverlayItems.map((o) => (
              <div
                key={o.id}
                onPointerDown={activeTool === "overlay" ? (e) => startOverlayDrag(o.id, e) : undefined}
                style={{
                  position: "absolute",
                  left: `${o.x}%`,
                  top: `${o.y}%`,
                  width: `${o.width}%`,
                  height: `${o.height}%`,
                  transform: "translate(-50%, -50%)",
                  cursor: activeTool === "overlay" ? "move" : "default",
                  pointerEvents: activeTool === "overlay" ? "auto" : "none",
                  outline: activeTool === "overlay" && selectedOverlayId === o.id ? `2px dashed ${COLORS.overlayTrackAccent}` : "none",
                  overflow: "hidden",
                  borderRadius: 4,
                  zIndex: 2,
                }}
              >
                {o.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={o.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
                ) : (
                  <video src={o.url} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
                )}
              </div>
            ))}

            {/* TEXT layer — drawn topmost, matching Text-above-Overlay */}
            {activeTextOverlays.map((t) => (
              <div
                key={t.id}
                onPointerDown={activeTool === "text" ? (e) => startTextDrag(t.id, e) : undefined}
                style={{
                  position: "absolute",
                  left: `${t.x}%`,
                  top: `${t.y}%`,
                  transform: "translate(-50%, -50%)",
                  fontSize: t.fontSize,
                  color: t.color,
                  fontWeight: 700,
                  textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                  cursor: activeTool === "text" ? "move" : "default",
                  pointerEvents: activeTool === "text" ? "auto" : "none",
                  userSelect: "none",
                  whiteSpace: "pre-wrap",
                  textAlign: "center",
                  maxWidth: "90%",
                  outline: activeTool === "text" && selectedTextId === t.id ? `1px dashed ${COLORS.accent}` : "none",
                  padding: 2,
                  zIndex: 3,
                }}
              >
                {t.content}
              </div>
            ))}
          </div>

          {/* Transport bar + quick-adjustment row */}
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "center", gap: 16, paddingTop: 12 }}>
            <button type="button" onClick={handlePrevFrame} title="Previous frame" style={transportBtnStyle}>&#9198;</button>
            <button type="button" onClick={handlePlayPause} title={isPlaying ? "Pause" : "Play"} style={{ ...transportBtnStyle, color: COLORS.textPrimary, fontSize: 20 }}>
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button type="button" onClick={handleNextFrame} title="Next frame" style={transportBtnStyle}>&#9197;</button>
            <span style={{ fontSize: 12, color: COLORS.textMuted, fontVariantNumeric: "tabular-nums" }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {QUICK_TOOLS.map((tool) => (
                <div key={tool.id} style={{ position: "relative" }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenPopover((prev) => (prev === tool.id ? null : tool.id));
                    }}
                    title={tool.label}
                    style={{
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 6,
                      border: `1px solid ${openPopover === tool.id ? COLORS.accent : COLORS.cardBorder}`,
                      background: openPopover === tool.id ? COLORS.card : "transparent",
                      color: openPopover === tool.id ? COLORS.accent : COLORS.textPrimary,
                      fontSize: 15,
                      cursor: "pointer",
                    }}
                  >
                    {tool.icon}
                  </button>

                  {openPopover === tool.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        position: "absolute",
                        bottom: "calc(100% + 8px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 240,
                        borderRadius: 12,
                        border: `1px solid ${COLORS.cardBorder}`,
                        backgroundColor: COLORS.card,
                        padding: 16,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                        zIndex: 50,
                        textAlign: "left",
                      }}
                    >
                      {tool.id === "crop" && (
                        <>
                          <h3 style={{ fontSize: 13, fontWeight: 600, margin: "0 0 12px" }}>Crop</h3>
                          {!selectedSegmentId ? (
                            <p style={{ fontSize: 12, color: COLORS.textMuted, margin: 0 }}>Select a video clip in the timeline to crop.</p>
                          ) : (
                            <>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                                {CROP_PRESETS.map((p) => (
                                  <button key={p.label} type="button" onClick={() => applyCropPreset(p.ratio)} style={{ ...presetBtnStyle, fontSize: 11, padding: "6px 4px" }}>
                                    {p.label}
                                  </button>
                                ))}
                              </div>
                              <p style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 6 }}>Drag the frame or its corner handles on the preview.</p>
                              <p style={{ fontSize: 10, color: COLORS.textMuted, fontVariantNumeric: "tabular-nums", margin: 0 }}>
                                x:{currentEdit.crop.x.toFixed(0)}% y:{currentEdit.crop.y.toFixed(0)}% w:{currentEdit.crop.width.toFixed(0)}% h:{currentEdit.crop.height.toFixed(0)}%
                              </p>
                            </>
                          )}
                        </>
                      )}

                      {tool.id === "rotate" && (
                        <>
                          <h3 style={{ fontSize: 13, fontWeight: 600, margin: "0 0 12px" }}>Rotate &amp; Flip</h3>
                          {!selectedSegmentId ? (
                            <p style={{ fontSize: 12, color: COLORS.textMuted, margin: 0 }}>Select a video clip in the timeline to rotate.</p>
                          ) : (
                            <>
                              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                                {([0, 90, 180, 270] as const).map((deg) => (
                                  <button
                                    key={deg}
                                    type="button"
                                    onClick={() => updateSelectedEdit({ rotation: deg })}
                                    style={{ ...presetBtnStyle, fontSize: 11, padding: "6px 4px", backgroundColor: currentEdit.rotation === deg ? COLORS.accent : "transparent", color: currentEdit.rotation === deg ? COLORS.accentText : COLORS.textPrimary, borderColor: currentEdit.rotation === deg ? COLORS.accent : COLORS.cardBorder }}
                                  >
                                    {deg}&deg;
                                  </button>
                                ))}
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <ToggleButton label="Flip horizontal" active={currentEdit.flipH} onClick={() => updateSelectedEdit({ flipH: !currentEdit.flipH })} />
                                <ToggleButton label="Flip vertical" active={currentEdit.flipV} onClick={() => updateSelectedEdit({ flipV: !currentEdit.flipV })} />
                              </div>
                            </>
                          )}
                        </>
                      )}

                      {tool.id === "speed" && (
                        <>
                          <h3 style={{ fontSize: 13, fontWeight: 600, margin: "0 0 12px" }}>Speed</h3>
                          {!selectedSegmentId ? (
                            <p style={{ fontSize: 12, color: COLORS.textMuted, margin: 0 }}>Select a video clip in the timeline to change its speed.</p>
                          ) : (
                            <>
                              <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.accent, marginBottom: 6, fontVariantNumeric: "tabular-nums" }}>{currentEdit.speed.toFixed(2)}x</div>
                              <input
                                type="range"
                                min={0.25}
                                max={3}
                                step={0.05}
                                value={currentEdit.speed}
                                onChange={(e) => updateSelectedEdit({ speed: Number(e.target.value) })}
                                style={{ width: "100%", accentColor: COLORS.accent }}
                              />
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: COLORS.textMuted }}>
                                <span>0.25x</span>
                                <span>3x</span>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ width: 1, height: 20, backgroundColor: COLORS.cardBorder }} />

            <SoundControl label="Video sound" muted={videoMuted} volume={videoVolume} onToggleMute={() => setVideoMuted((m) => !m)} onVolumeChange={setVideoVolume} />
            {musicClips.length > 0 && <SoundControl label="Music" muted={musicMuted} volume={musicVolume} onToggleMute={() => setMusicMuted((m) => !m)} onVolumeChange={setMusicVolume} />}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ width: 280, flexShrink: 0, padding: 20, backgroundColor: COLORS.card, borderLeft: `1px solid ${COLORS.cardBorder}`, overflowY: "auto" }}>
          {activeTool === "media" && (
            <>
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 16px" }}>Media</h2>

              <MediaSection title={`Video clips (${videoClips.length})`}>
                {videoClips.map((c) => (
                  <MediaChip key={c.id} name={c.file.name} sub={formatTime(c.duration)} onRemove={() => removeVideoClip(c.id)} />
                ))}
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={trackLocks.video}
                  title={trackLocks.video ? "Unlock Video track to add clips" : undefined}
                  style={{ ...presetBtnStyle, width: "100%", opacity: trackLocks.video ? 0.4 : 1, cursor: trackLocks.video ? "not-allowed" : "pointer" }}
                >
                  + Add video clip
                </button>
                <input ref={videoInputRef} type="file" accept="video/*" multiple style={{ display: "none" }} onChange={handleAddVideoClip} />
              </MediaSection>

              <MediaSection title={`Overlay items (${overlayItems.length})`}>
                {overlayItems.map((o) => (
                  <MediaChip key={o.id} name={o.file.name} sub={o.type} onRemove={() => removeOverlayItem(o.id)} />
                ))}
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => overlayImageInputRef.current?.click()}
                    disabled={trackLocks.overlay}
                    title={trackLocks.overlay ? "Unlock Overlay track to add items" : undefined}
                    style={{ ...presetBtnStyle, opacity: trackLocks.overlay ? 0.4 : 1, cursor: trackLocks.overlay ? "not-allowed" : "pointer" }}
                  >
                    + Image
                  </button>
                  <button
                    type="button"
                    onClick={() => overlayVideoInputRef.current?.click()}
                    disabled={trackLocks.overlay}
                    title={trackLocks.overlay ? "Unlock Overlay track to add items" : undefined}
                    style={{ ...presetBtnStyle, opacity: trackLocks.overlay ? 0.4 : 1, cursor: trackLocks.overlay ? "not-allowed" : "pointer" }}
                  >
                    + Video
                  </button>
                </div>
                <input ref={overlayImageInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => handleAddOverlay(e, "image")} />
                <input ref={overlayVideoInputRef} type="file" accept="video/*" multiple style={{ display: "none" }} onChange={(e) => handleAddOverlay(e, "video")} />
              </MediaSection>

              <MediaSection title={`Music clips (${musicClips.length})`}>
                {musicClips.map((c) => (
                  <MediaChip key={c.id} name={c.file.name} sub={formatTime(c.duration)} onRemove={() => removeMusicClip(c.id)} />
                ))}
                <button
                  type="button"
                  onClick={() => musicInputRef.current?.click()}
                  disabled={trackLocks.music}
                  title={trackLocks.music ? "Unlock Music track to add clips" : undefined}
                  style={{ ...presetBtnStyle, width: "100%", opacity: trackLocks.music ? 0.4 : 1, cursor: trackLocks.music ? "not-allowed" : "pointer" }}
                >
                  + Add music clip
                </button>
                <input ref={musicInputRef} type="file" accept="audio/*" multiple style={{ display: "none" }} onChange={handleAddMusicClip} />
              </MediaSection>
            </>
          )}

          {activeTool === "color" && (
            <>
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 16px" }}>Color</h2>
              {!selectedSegmentId ? (
                <p style={{ fontSize: 12, color: COLORS.textMuted }}>Upload a video clip and select it in the timeline to grade its color.</p>
              ) : (
                <>
                  <ColorSliderRow label="Brightness" value={currentEdit.color.brightness} onChange={(v) => updateSelectedEdit({ color: { ...currentEdit.color, brightness: v } })} />
                  <ColorSliderRow label="Contrast" value={currentEdit.color.contrast} onChange={(v) => updateSelectedEdit({ color: { ...currentEdit.color, contrast: v } })} />
                  <ColorSliderRow label="Saturation" value={currentEdit.color.saturation} onChange={(v) => updateSelectedEdit({ color: { ...currentEdit.color, saturation: v } })} />
                  <button type="button" onClick={() => updateSelectedEdit({ color: DEFAULT_COLOR })} style={{ ...presetBtnStyle, width: "100%", marginTop: 8 }}>
                    Reset
                  </button>
                </>
              )}
            </>
          )}

          {activeTool === "text" && (
            <>
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 16px" }}>Text</h2>
              {!videoUrl ? (
                <p style={{ fontSize: 12, color: COLORS.textMuted }}>Upload a video first to add text overlays.</p>
              ) : selectedTextOverlay ? (
                <>
                  <label style={fieldLabelStyle}>Content</label>
                  <textarea rows={3} value={selectedTextOverlay.content} onChange={(e) => updateSelectedText({ content: e.target.value })} style={textareaStyle} />
                  <label style={fieldLabelStyle}>Font size</label>
                  <input type="number" min={10} max={120} value={selectedTextOverlay.fontSize} onChange={(e) => updateSelectedText({ fontSize: Number(e.target.value) || 10 })} style={numberInputStyle} />
                  <label style={fieldLabelStyle}>Color</label>
                  <input type="color" value={selectedTextOverlay.color} onChange={(e) => updateSelectedText({ color: e.target.value })} style={{ width: "100%", height: 32, border: "none", background: "transparent", cursor: "pointer" }} />
                  <p style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 12, fontVariantNumeric: "tabular-nums" }}>
                    Position x:{selectedTextOverlay.x.toFixed(0)}% y:{selectedTextOverlay.y.toFixed(0)}% &mdash; drag on the preview to move.
                  </p>
                  <p style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>
                    Timing {formatTime(selectedTextOverlay.startTime)}&ndash;{formatTime(selectedTextOverlay.endTime)} &mdash; drag the block or its edges in the Text track.
                  </p>
                  <button type="button" onClick={() => deleteTextOverlay(selectedTextOverlay.id)} style={dangerBtnStyle}>
                    &times; Delete text
                  </button>
                  <button type="button" onClick={() => setSelectedTextId(null)} style={{ ...presetBtnStyle, width: "100%", marginTop: 8 }}>
                    + Add another text
                  </button>
                </>
              ) : (
                <>
                  <label style={fieldLabelStyle}>Content</label>
                  <textarea rows={3} placeholder="Enter caption text" value={textDraftContent} onChange={(e) => setTextDraftContent(e.target.value)} style={textareaStyle} />
                  <label style={fieldLabelStyle}>Font size</label>
                  <input type="number" min={10} max={120} value={textDraftFontSize} onChange={(e) => setTextDraftFontSize(Number(e.target.value) || 10)} style={numberInputStyle} />
                  <label style={fieldLabelStyle}>Color</label>
                  <input type="color" value={textDraftColor} onChange={(e) => setTextDraftColor(e.target.value)} style={{ width: "100%", height: 32, border: "none", background: "transparent", cursor: "pointer" }} />
                  <button
                    type="button"
                    onClick={handleAddText}
                    disabled={!textDraftContent.trim() || trackLocks.text}
                    title={trackLocks.text ? "Unlock Text track to add captions" : undefined}
                    style={{ ...primaryFullBtnStyle, opacity: textDraftContent.trim() && !trackLocks.text ? 1 : 0.4, cursor: textDraftContent.trim() && !trackLocks.text ? "pointer" : "not-allowed" }}
                  >
                    + Add Text
                  </button>
                </>
              )}
            </>
          )}

          {activeTool === "overlay" && (
            <>
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 16px" }}>Overlay</h2>
              {!videoUrl ? (
                <p style={{ fontSize: 12, color: COLORS.textMuted }}>Upload a video first to place overlay items.</p>
              ) : !selectedOverlayItem ? (
                <p style={{ fontSize: 12, color: COLORS.textMuted }}>Add an image or video overlay from the Media tab, or click one in the Overlay track to edit it.</p>
              ) : (
                <>
                  <p style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 8 }}>
                    {selectedOverlayItem.type === "image" ? "🖼️ Image" : "🎬 Video"}: {selectedOverlayItem.file.name}
                  </p>
                  <label style={fieldLabelStyle}>Width %</label>
                  <input type="number" min={5} max={100} value={Math.round(selectedOverlayItem.width)} onChange={(e) => updateSelectedOverlay({ width: Number(e.target.value) || 5 })} style={numberInputStyle} />
                  <label style={fieldLabelStyle}>Height %</label>
                  <input type="number" min={5} max={100} value={Math.round(selectedOverlayItem.height)} onChange={(e) => updateSelectedOverlay({ height: Number(e.target.value) || 5 })} style={numberInputStyle} />
                  <p style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 12, fontVariantNumeric: "tabular-nums" }}>
                    Position x:{selectedOverlayItem.x.toFixed(0)}% y:{selectedOverlayItem.y.toFixed(0)}% &mdash; drag on the preview to move.
                  </p>
                  <p style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>
                    Timing {formatTime(selectedOverlayItem.startTime)}&ndash;{formatTime(selectedOverlayItem.endTime)} &mdash; drag the block or its edges in the Overlay track.
                  </p>
                  <button type="button" onClick={() => removeOverlayItem(selectedOverlayItem.id)} style={dangerBtnStyle}>
                    &times; Delete overlay
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* ---- Timeline. Stacking order top-to-bottom: Music, Text, Overlay,
          Video (video at the bottom, matching a standard NLE layer order —
          higher rows composite visually "on top" in the preview too).
          The actual ruler+tracks content is flanked by two spacers (86px /
          280px) matching the sidebar and right-panel widths exactly, so its
          left AND right edges land precisely under the preview column
          above — rather than the outer wrapper's own full page width,
          which previously let the timeline extend past the preview's right
          edge, under the right panel. The floating meter panel stays a
          direct child of the OUTER (still full-width) wrapper, unaffected
          by this — see its own comment below for why that's correct. ---- */}
      <div style={{ position: "relative", flexShrink: 0, borderTop: `1px solid ${COLORS.cardBorder}`, backgroundColor: COLORS.panelBg }}>
        <div style={{ display: "flex" }}>
          <div style={{ width: 86, flexShrink: 0 }} />
          <div ref={timelineRef} style={{ position: "relative", flex: 1, minWidth: 0 }}>
          <div style={{ position: "absolute", left: `calc(88px + ${playheadFrac} * (100% - 198px))`, top: 0, bottom: 0, width: 2, backgroundColor: COLORS.accent, pointerEvents: "none", zIndex: 2 }} />

          <div
            onPointerDown={handleTimelinePointerDown}
            style={{ display: "flex", paddingLeft: 88, paddingRight: 110, height: 24, alignItems: "flex-end", borderBottom: `1px solid ${COLORS.cardBorder}`, backgroundColor: COLORS.trackHeaderBg, cursor: "pointer" }}
          >
            {/* Evenly-divided ticks spanning the REAL total timeline
                duration (see timelineDuration above) -- previously a fixed
                ["00:00".."00:20"] array that silently stopped at 20s no
                matter how much actual content followed. */}
            {buildRulerTicks(timelineDuration).slice(0, -1).map((t, i) => (
              <span key={i} style={{ flex: 1, fontSize: 10, color: COLORS.textMuted, borderLeft: `1px solid ${COLORS.ruler}`, paddingLeft: 4 }}>
                {formatTime(t)}
              </span>
            ))}
          </div>

          {/* MUSIC (top row) */}
          <TrackShell label="Music" icon="🎵" accent={COLORS.musicTrackAccent} locked={trackLocks.music} onToggleLock={() => toggleTrackLock("music")}>
            {musicClips.length === 0 ? (
              <EmptyTrackHint text="No music clips — add one from the Media tab" />
            ) : (
              <ClipBlockRow
                blocks={musicClips}
                dragId={dragMusicId}
                onDragStart={setDragMusicId}
                onDrop={handleMusicDrop}
                onTrim={trimMusicClip}
                onContextMenu={(id, e) => handleBlockContextMenu("music", id, e)}
                renderContent={() => <Waveform />}
                selectedId={selectedMusicId}
                onSelect={setSelectedMusicId}
                trackLocked={trackLocks.music}
              />
            )}
          </TrackShell>

          {/* TEXT */}
          <TrackShell label="Text" icon="🔤" accent={COLORS.textTrackAccent} locked={trackLocks.text} onToggleLock={() => toggleTrackLock("text")}>
            {duration <= 0 ? (
              <EmptyTrackHint text="Upload a video to add text timing" />
            ) : (
              <div data-text-row style={{ position: "relative", height: 44, width: "100%" }}>
                {textOverlays.map((t) => {
                  const leftPct = Math.max(0, Math.min(100, (t.startTime / timelineDuration) * 100));
                  const widthPct = Math.max(1, Math.min(100 - leftPct, ((t.endTime - t.startTime) / timelineDuration) * 100));
                  const effLocked = t.locked || trackLocks.text;
                  return (
                    <div
                      key={t.id}
                      onPointerDown={startTextBlockMove(t.id)}
                      onClick={(e) => {
                        if (textDraggedRef.current) {
                          textDraggedRef.current = false;
                          return;
                        }
                        setSelectedTextId(t.id);
                        handleBlockContextMenu("text", t.id, e);
                      }}
                      onContextMenu={(e) => handleBlockContextMenu("text", t.id, e)}
                      style={{
                        position: "absolute",
                        left: `${leftPct}%`,
                        width: `${widthPct}%`,
                        top: 8,
                        bottom: 8,
                        borderRadius: 4,
                        backgroundColor: COLORS.textTrackAccent,
                        opacity: (selectedTextId === t.id ? 0.95 : 0.75) - (effLocked ? 0.2 : 0),
                        outline: selectedTextId === t.id ? `2px solid ${COLORS.textPrimary}` : "none",
                        outlineOffset: -2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        fontSize: 10,
                        fontWeight: 600,
                        color: "#0b1a24",
                        cursor: effLocked ? "not-allowed" : "grab",
                        userSelect: "none",
                        padding: "0 6px",
                      }}
                      title={effLocked ? (trackLocks.text && !t.locked ? "Track locked — click for options" : "Locked — click for options") : "Click for options, drag to shift timing, drag edges to trim duration"}
                    >
                      {!effLocked && <EdgeHandle rowSelector="[data-text-row]" side="left" onDrag={(frac) => resizeTextEdge(t.id, "start", frac)} />}
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.content || "Text"}</span>
                      {!effLocked && <EdgeHandle rowSelector="[data-text-row]" side="right" onDrag={(frac) => resizeTextEdge(t.id, "end", frac)} />}
                      {effLocked && <span title={trackLocks.text && !t.locked ? "Track locked" : "Locked"} style={{ position: "absolute", top: 2, left: 2, fontSize: 8 }}>&#128274;</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </TrackShell>

          {/* OVERLAY */}
          <TrackShell label="Overlay" icon="🖼️" accent={COLORS.overlayTrackAccent} locked={trackLocks.overlay} onToggleLock={() => toggleTrackLock("overlay")}>
            {duration <= 0 ? (
              <EmptyTrackHint text="Upload a video to add overlay timing" />
            ) : (
              <div data-overlay-row style={{ position: "relative", height: 44, width: "100%" }}>
                {overlayItems.map((o) => {
                  const leftPct = Math.max(0, Math.min(100, (o.startTime / timelineDuration) * 100));
                  const widthPct = Math.max(1, Math.min(100 - leftPct, ((o.endTime - o.startTime) / timelineDuration) * 100));
                  const effLocked = o.locked || trackLocks.overlay;
                  return (
                    <div
                      key={o.id}
                      onPointerDown={startOverlayBlockMove(o.id)}
                      onClick={(e) => {
                        if (overlayDraggedRef.current) {
                          overlayDraggedRef.current = false;
                          return;
                        }
                        setSelectedOverlayId(o.id);
                        handleBlockContextMenu("overlay", o.id, e);
                      }}
                      onContextMenu={(e) => handleBlockContextMenu("overlay", o.id, e)}
                      style={{
                        position: "absolute",
                        left: `${leftPct}%`,
                        width: `${widthPct}%`,
                        top: 8,
                        bottom: 8,
                        borderRadius: 4,
                        backgroundColor: COLORS.overlayTrackAccent,
                        opacity: (selectedOverlayId === o.id ? 0.95 : 0.75) - (effLocked ? 0.2 : 0),
                        outline: selectedOverlayId === o.id ? `2px solid ${COLORS.textPrimary}` : "none",
                        outlineOffset: -2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        fontSize: 10,
                        fontWeight: 600,
                        color: "#1a0b24",
                        cursor: effLocked ? "not-allowed" : "grab",
                        userSelect: "none",
                        padding: "0 6px",
                        gap: 4,
                      }}
                      title={effLocked ? (trackLocks.overlay && !o.locked ? "Track locked — click for options" : "Locked — click for options") : "Click for options, drag to shift timing, drag edges to trim duration"}
                    >
                      {!effLocked && <EdgeHandle rowSelector="[data-overlay-row]" side="left" onDrag={(frac) => resizeOverlayEdge(o.id, "start", frac)} />}
                      <span>{o.type === "image" ? "🖼️" : "🎬"}</span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.file.name}</span>
                      {!effLocked && <EdgeHandle rowSelector="[data-overlay-row]" side="right" onDrag={(frac) => resizeOverlayEdge(o.id, "end", frac)} />}
                      {effLocked && <span title={trackLocks.overlay && !o.locked ? "Track locked" : "Locked"} style={{ position: "absolute", top: 2, left: 2, fontSize: 8 }}>&#128274;</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </TrackShell>

          {/* VIDEO (bottom row) — each block shows its own filename +
              embedded-audio waveform strip, taller than the other rows to
              fit both. */}
          <TrackShell label="Video" icon="🎥" accent={COLORS.accent} locked={trackLocks.video} onToggleLock={() => toggleTrackLock("video")}>
            {videoClips.length === 0 ? (
              <EmptyTrackHint text="No video clips — add one from the Media tab" />
            ) : (
              <ClipBlockRow
                blocks={videoClips}
                dragId={dragVideoId}
                onDragStart={setDragVideoId}
                onDrop={handleVideoDrop}
                onTrim={trimVideoClip}
                onContextMenu={(id, e) => handleBlockContextMenu("video", id, e)}
                renderContent={(clip) => <VideoClipContent clip={clip} />}
                selectedId={selectedSegmentId}
                onSelect={setSelectedSegmentId}
                isEdited={(id) => {
                  const e = videoClipEdits[id];
                  return !!e && !isDefaultEdit(e);
                }}
                rowHeight={56}
                trackLocked={trackLocks.video}
              />
            )}
          </TrackShell>
          </div>
          <div style={{ width: 280, flexShrink: 0 }} />
        </div>

        {/* Floating level meter: deliberately still a direct child of the
            OUTER (full page width) wrapper, not the narrowed inner content
            above — its `right: 16` is unchanged from before, so it stays
            pinned to the true page edge, landing in the space now to the
            right of the narrower timeline content (roughly under the right
            panel) instead of overlapping any real track content. Position
            untouched per spec; only the visual weight is reduced below. */}
        <div data-level-meter-panel style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", zIndex: 40, borderRadius: 8, backgroundColor: "rgba(28, 26, 23, 0.6)", padding: "6px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 7, fontWeight: 600, color: COLORS.textMuted, letterSpacing: "0.03em" }}>MUSIC</span>
          <AudioMeter levels={meterLevels} active={!!musicUrl} />
        </div>
      </div>

      {/* ---- Auto Edit overlay ---- */}
      {autoEditStage !== "idle" && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ width: "100%", maxWidth: 480, borderRadius: 16, border: `1px solid ${COLORS.cardBorder}`, backgroundColor: COLORS.card, padding: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 20px", display: "flex", alignItems: "center", gap: 10 }}>
              &#10024; Auto Edit
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", padding: "3px 6px", borderRadius: 4, border: `1px solid ${COLORS.danger}`, color: COLORS.danger }}>TEST MODE</span>
            </h2>
            {autoEditStage === "paying" && <p style={{ fontSize: 14, color: COLORS.textMuted }}>Opening payment...</p>}
            {autoEditStage === "verifying" && <p style={{ fontSize: 14, color: COLORS.textMuted }}>Verifying payment...</p>}
            {autoEditStage === "analyzing" && (
              <>
                <p style={{ marginBottom: 16, fontSize: 14, color: COLORS.textMuted }}>{autoEditLabel}</p>
                <div style={{ height: 8, width: "100%", overflow: "hidden", borderRadius: 999, backgroundColor: COLORS.cardBorder }}>
                  <div style={{ height: "100%", borderRadius: 999, width: `${autoEditProgress}%`, backgroundColor: COLORS.accent, transition: "width 300ms" }} />
                </div>
              </>
            )}
            {autoEditStage === "done" && (
              <>
                <p style={{ marginBottom: 16, fontSize: 14, color: COLORS.textMuted }}>Auto Edit complete (simulated result).</p>
                <div style={{ aspectRatio: "16 / 9", maxHeight: 320, margin: "0 auto 16px", borderRadius: 6, overflow: "hidden", backgroundColor: "#000", border: `1px solid ${COLORS.cardBorder}` }}>
                  {videoUrl && <video src={videoUrl} controls style={{ width: "100%", height: "100%", objectFit: "contain" }} />}
                </div>
                <button type="button" onClick={() => setAutoEditStage("idle")} style={{ width: "100%", padding: "10px 0", borderRadius: 8, border: "none", backgroundColor: COLORS.accent, color: COLORS.accentText, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Back to editor
                </button>
              </>
            )}
            {autoEditStage === "error" && (
              <>
                <p style={{ marginBottom: 20, fontSize: 14, color: COLORS.danger }}>{autoEditError || "Something went wrong."}</p>
                <div style={{ display: "flex", gap: 12 }}>
                  <button type="button" onClick={() => setAutoEditStage("idle")} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `1px solid ${COLORS.cardBorder}`, background: "transparent", color: COLORS.textPrimary, fontSize: 13, cursor: "pointer" }}>
                    Cancel
                  </button>
                  <button type="button" onClick={handleAutoEditClick} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", backgroundColor: COLORS.accent, color: COLORS.accentText, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    Retry
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ---- Export overlay: real ffmpeg.wasm render of the full
          multi-track state -> download ---- */}
      {exportStage !== "idle" && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ width: "100%", maxWidth: 480, borderRadius: 16, border: `1px solid ${COLORS.cardBorder}`, backgroundColor: COLORS.card, padding: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 20px" }}>&#8681; Export</h2>

            {(exportStage === "loading" || exportStage === "rendering") && (
              <>
                <p style={{ marginBottom: 16, fontSize: 14, color: COLORS.textMuted }}>
                  {exportStageLabel} {exportProgress}%
                </p>
                <div style={{ height: 8, width: "100%", overflow: "hidden", borderRadius: 999, backgroundColor: COLORS.cardBorder }}>
                  <div style={{ height: "100%", borderRadius: 999, width: `${exportProgress}%`, backgroundColor: COLORS.accent, transition: "width 300ms" }} />
                </div>
              </>
            )}

            {exportStage === "done" && exportResultUrl && (
              <>
                <p style={{ marginBottom: 16, fontSize: 14, color: COLORS.textMuted }}>Export complete.</p>
                <video src={exportResultUrl} controls style={{ width: "100%", borderRadius: 6, marginBottom: 16, backgroundColor: "#000" }} />
                <a
                  href={exportResultUrl}
                  download="exported-video.mp4"
                  style={{ display: "block", textAlign: "center", padding: "10px 0", borderRadius: 8, backgroundColor: COLORS.accent, color: COLORS.accentText, fontSize: 13, fontWeight: 600, textDecoration: "none", marginBottom: 8 }}
                >
                  Download MP4
                </a>
                <button type="button" onClick={() => setExportStage("idle")} style={{ width: "100%", padding: "10px 0", borderRadius: 8, border: `1px solid ${COLORS.cardBorder}`, background: "transparent", color: COLORS.textPrimary, fontSize: 13, cursor: "pointer" }}>
                  Close
                </button>
              </>
            )}

            {exportStage === "error" && (
              <>
                <p style={{ marginBottom: 20, fontSize: 14, color: COLORS.danger }}>{exportError || "Something went wrong."}</p>
                <div style={{ display: "flex", gap: 12 }}>
                  <button type="button" onClick={() => setExportStage("idle")} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `1px solid ${COLORS.cardBorder}`, background: "transparent", color: COLORS.textPrimary, fontSize: 13, cursor: "pointer" }}>
                    Cancel
                  </button>
                  <button type="button" onClick={handleExportClick} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", backgroundColor: COLORS.accent, color: COLORS.accentText, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    Retry
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hidden pickers for the context menu's "Replace" action. */}
      <input ref={replaceVideoInputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={handleReplaceFileChosen} />
      <input ref={replaceMusicInputRef} type="file" accept="audio/*" style={{ display: "none" }} onChange={handleReplaceFileChosen} />
      <input ref={replaceOverlayInputRef} type="file" accept="image/*,video/*" style={{ display: "none" }} onChange={handleReplaceFileChosen} />

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          trackLocked={trackLocks[contextMenu.trackKind]}
          onReplace={handleMenuReplace}
          onLock={handleMenuToggleLock}
          onDuplicate={handleMenuDuplicate}
          onDelete={handleMenuDelete}
          onSplit={handleMenuSplit}
        />
      )}
    </div>
    </>
  );
}

function MediaSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.03em" }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{children}</div>
    </div>
  );
}

function MediaChip({ name, sub, onRemove }: { name: string; sub: string; onRemove: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, borderRadius: 8, border: `1px solid ${COLORS.cardBorder}`, padding: "6px 10px", fontSize: 11 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: COLORS.textPrimary }}>{name}</div>
        <div style={{ color: COLORS.textMuted, fontSize: 10 }}>{sub}</div>
      </div>
      <button type="button" onClick={onRemove} title="Remove" style={{ flexShrink: 0, background: "transparent", border: "none", color: COLORS.danger, cursor: "pointer", fontSize: 13 }}>
        &times;
      </button>
    </div>
  );
}

function SoundControl({ label, muted, volume, onToggleMute, onVolumeChange }: { label: string; muted: boolean; volume: number; onToggleMute: () => void; onVolumeChange: (v: number) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <button
        type="button"
        onClick={onToggleMute}
        title={muted ? `Unmute ${label}` : `Mute ${label}`}
        style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, border: `1px solid ${COLORS.cardBorder}`, background: "transparent", color: muted ? COLORS.danger : COLORS.textPrimary, fontSize: 13, cursor: "pointer" }}
      >
        {muted ? "🔇" : "🔊"}
      </button>
      <div>
        <div style={{ fontSize: 9, color: COLORS.textMuted, marginBottom: 2 }}>{label}</div>
        <input type="range" min={0} max={1} step={0.05} value={volume} onChange={(e) => onVolumeChange(Number(e.target.value))} style={{ width: 72, accentColor: COLORS.accent, verticalAlign: "middle" }} title={`${label} volume`} />
      </div>
    </div>
  );
}

function ToggleButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 8, border: `1px solid ${active ? COLORS.accent : COLORS.cardBorder}`, background: active ? COLORS.trackHeaderBg : "transparent", color: COLORS.textPrimary, fontSize: 13, cursor: "pointer" }}>
      {label}
      <span style={{ color: active ? COLORS.accent : COLORS.textMuted, fontSize: 11 }}>{active ? "On" : "Off"}</span>
    </button>
  );
}

function ColorSliderRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>
        <span>{label}</span>
        <span style={{ color: COLORS.textPrimary, fontVariantNumeric: "tabular-nums" }}>{value > 0 ? `+${value}` : value}</span>
      </div>
      <input type="range" min={-100} max={100} step={1} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: "100%", accentColor: COLORS.accent }} />
    </div>
  );
}

function TrackShell({ label, icon, accent, locked, onToggleLock, children }: { label: string; icon: string; accent?: string; locked: boolean; onToggleLock: () => void; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", borderBottom: `1px solid ${COLORS.cardBorder}` }}>
      <div style={{ width: 88, flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "0 10px", backgroundColor: COLORS.trackHeaderBg, borderRight: `3px solid ${accent ?? COLORS.cardBorder}`, fontSize: 11, color: COLORS.textMuted }}>
        <button
          type="button"
          onClick={onToggleLock}
          title={locked ? `Unlock ${label} track` : `Lock ${label} track (clips become non-editable)`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 18,
            height: 18,
            padding: 0,
            border: "none",
            borderRadius: 4,
            backgroundColor: locked ? (accent ?? COLORS.accent) : "transparent",
            color: locked ? COLORS.accentText : COLORS.textMuted,
            fontSize: 10,
            lineHeight: 1,
            cursor: "pointer",
            opacity: locked ? 1 : 0.6,
            flexShrink: 0,
          }}
        >
          {locked ? "\u{1F512}" : "\u{1F513}"}
        </button>
        <span>{icon}</span>
        <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>{label}</span>
      </div>
      <div style={{ flex: 1, backgroundColor: COLORS.trackRowBg, padding: "0 4px", paddingRight: 110 }}>{children}</div>
    </div>
  );
}

function EmptyTrackHint({ text }: { text: string }) {
  return <div style={{ display: "flex", alignItems: "center", height: 44, fontSize: 12, color: COLORS.textMuted }}>{text}</div>;
}

function ContextMenu({ x, y, trackLocked, onReplace, onLock, onDuplicate, onDelete, onSplit }: { x: number; y: number; trackLocked: boolean; onReplace: () => void; onLock: () => void; onDuplicate: () => void; onDelete: () => void; onSplit: () => void }) {
  const handlers: Record<string, () => void> = { replace: onReplace, lock: onLock, duplicate: onDuplicate, delete: onDelete, split: onSplit };
  // Lock/Keyframe stay enabled even when the track is locked -- per-clip
  // lock is an independent piece of state you should still be able to
  // toggle for context, and Keyframe is disabled for its own unrelated
  // "coming soon" reason. Every other action would mutate/reorder a clip on
  // a track the user just explicitly locked, so those are the ones gated.
  const trackGatedIds = ["replace", "duplicate", "delete", "split"];
  const MENU_WIDTH = 160;
  const ITEM_HEIGHT = 34;
  const estimatedHeight = CONTEXT_MENU_ITEMS.length * ITEM_HEIGHT + 8;
  const openUpward = typeof window !== "undefined" && y + estimatedHeight > window.innerHeight;
  const openLeftward = typeof window !== "undefined" && x + MENU_WIDTH > window.innerWidth;
  return (
    <div
      data-segment-context-menu
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        position: "fixed",
        left: openLeftward ? undefined : x,
        right: openLeftward ? window.innerWidth - x : undefined,
        top: openUpward ? undefined : y,
        bottom: openUpward ? window.innerHeight - y : undefined,
        zIndex: 60,
        width: MENU_WIDTH,
        borderRadius: 8,
        border: `1px solid ${COLORS.cardBorder}`,
        backgroundColor: COLORS.card,
        padding: 4,
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}
    >
      {CONTEXT_MENU_ITEMS.map((item) => {
        const lockedByTrack = trackLocked && trackGatedIds.includes(item.id);
        const disabled = item.id === "keyframe" || lockedByTrack;
        return (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            onClick={disabled ? undefined : handlers[item.id]}
            title={item.id === "keyframe" ? "Coming soon" : lockedByTrack ? "Track is locked" : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "none",
              background: "transparent",
              color: item.id === "delete" && !disabled ? COLORS.danger : disabled ? COLORS.textMuted : COLORS.textPrimary,
              fontSize: 12,
              textAlign: "left",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.5 : 1,
            }}
          >
            <span style={{ fontSize: 12, width: 16, textAlign: "center" }}>{item.icon}</span>
            {item.label}
            {item.id === "keyframe" && <span style={{ marginLeft: "auto", fontSize: 9, color: COLORS.textMuted }}>Coming soon</span>}
            {lockedByTrack && <span style={{ marginLeft: "auto", fontSize: 9, color: COLORS.textMuted }}>Locked</span>}
          </button>
        );
      })}
    </div>
  );
}

function ClipBlockRow<T extends ClipBase>({
  blocks,
  dragId,
  onDragStart,
  onDrop,
  onTrim,
  onContextMenu,
  renderContent,
  selectedId,
  onSelect,
  isEdited,
  rowHeight = 44,
  trackLocked = false,
}: {
  blocks: T[];
  dragId: string | null;
  onDragStart: (id: string) => void;
  onDrop: (targetId: string) => void;
  onTrim: (id: string, side: "start" | "end", delta: number) => void;
  onContextMenu?: (id: string, e: React.MouseEvent) => void;
  renderContent: (block: T) => React.ReactNode;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  isEdited?: (id: string) => boolean;
  rowHeight?: number;
  trackLocked?: boolean;
}) {
  // Native HTML5 drag-and-drop normally suppresses the browser's own click
  // event for a recognized drag gesture -- but that suppression isn't
  // guaranteed across every browser/input-device combination, and this
  // click handler doubles as the menu-open trigger. This ref is a belt-and-
  // suspenders guard: set on dragstart, checked (and cleared) on click, and
  // cleared on dragend as a fallback for the normal case where no click
  // follows at all -- so a real drag can never be misread as a click that
  // pops the menu open over the block the user just moved.
  const justDraggedRef = useRef(false);
  return (
    <div style={{ display: "flex", height: rowHeight, width: "100%" }}>
      {blocks.map((b) => {
        const effLocked = b.locked || trackLocked;
        return (
        <div
          key={b.id}
          draggable={!effLocked}
          onDragStart={() => {
            if (effLocked) return;
            justDraggedRef.current = true;
            onDragStart(b.id);
          }}
          onDragEnd={() => {
            justDraggedRef.current = false;
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.stopPropagation();
            if (!effLocked) onDrop(b.id);
          }}
          onClick={(e) => {
            if (justDraggedRef.current) {
              justDraggedRef.current = false;
              return;
            }
            onSelect?.(b.id);
            onContextMenu?.(b.id, e);
          }}
          onContextMenu={(e) => onContextMenu?.(b.id, e)}
          style={{
            position: "relative",
            // effectiveDuration (widthFrac minus what trimStart/trimEnd cut
            // off), not raw widthFrac -- a trimmed block now visually
            // shrinks to its real remaining screen-time instead of staying
            // its original pre-trim width with only a dimmer fill.
            flexGrow: effectiveDuration(b),
            flexBasis: 0,
            margin: "2px 2px",
            borderRadius: 4,
            backgroundColor: COLORS.accent,
            opacity: (dragId === b.id ? 0.4 : 0.85) - b.trimStart * 0.3 - b.trimEnd * 0.3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            cursor: effLocked ? "not-allowed" : "grab",
            color: COLORS.accentText,
            fontSize: 11,
            fontWeight: 600,
            userSelect: "none",
            outline: selectedId === b.id ? `2px solid ${COLORS.textPrimary}` : "none",
            outlineOffset: -2,
          }}
          title={effLocked ? (trackLocked && !b.locked ? "Track locked — click for options" : "Locked — click for options") : onSelect ? "Click to select and open options, drag to reorder" : "Click for options, drag to reorder"}
        >
          {!effLocked && <TrimHandle side="left" onDrag={(d) => onTrim(b.id, "start", d)} />}
          {renderContent(b)}
          {!effLocked && <TrimHandle side="right" onDrag={(d) => onTrim(b.id, "end", d)} />}
          {isEdited?.(b.id) && <div title="Has crop/rotate/speed edits" style={{ position: "absolute", top: 3, right: 3, width: 7, height: 7, borderRadius: "50%", backgroundColor: COLORS.editedDot, border: `1px solid ${COLORS.accentText}` }} />}
          {effLocked && <div title={trackLocked && !b.locked ? "Track locked" : "Locked"} style={{ position: "absolute", top: 3, left: 3, fontSize: 9 }}>&#128274;</div>}
        </div>
        );
      })}
    </div>
  );
}

// Video-track block content: filename label + the clip's own embedded-audio
// waveform strip beneath it, per the new "audio travels with its video
// clip" requirement (no separate audio-of-video track row).
function VideoClipContent({ clip }: { clip: ClipBase }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      <div style={{ flex: "0 0 18px", fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", padding: "2px 4px" }}>{clip.file.name}</div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Waveform />
      </div>
    </div>
  );
}

function TrimHandle({ side, onDrag }: { side: "left" | "right"; onDrag: (deltaFraction: number) => void }) {
  const startX = useRef<number | null>(null);
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    startX.current = e.clientX;
    const handleMove = (ev: PointerEvent) => {
      if (startX.current === null) return;
      const delta = (ev.clientX - startX.current) / 400;
      onDrag(side === "left" ? -delta : delta);
      startX.current = ev.clientX;
    };
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };
  return (
    <div
      onPointerDown={handlePointerDown}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      style={{ position: "absolute", [side]: 0, top: 0, bottom: 0, width: 6, cursor: "ew-resize", backgroundColor: "rgba(0,0,0,0.25)" } as React.CSSProperties}
      title="Drag to trim"
    />
  );
}

// Shared edge-handle drag pattern for time-based rows (Text, Overlay):
// reports a 0-1 fraction of the row's own pixel width (found via
// `rowSelector`) rather than a fixed sensitivity divisor — the caller
// converts that fraction to a time delta using the clip duration.
function EdgeHandle({ side, rowSelector, onDrag }: { side: "left" | "right"; rowSelector: string; onDrag: (deltaFraction: number) => void }) {
  const startX = useRef<number | null>(null);
  const rowWidth = useRef(0);
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    startX.current = e.clientX;
    const row = (e.currentTarget as HTMLElement).closest<HTMLElement>(rowSelector);
    rowWidth.current = row?.getBoundingClientRect().width ?? 0;
    const handleMove = (ev: PointerEvent) => {
      if (startX.current === null || rowWidth.current <= 0) return;
      const deltaFraction = (ev.clientX - startX.current) / rowWidth.current;
      onDrag(deltaFraction);
      startX.current = ev.clientX;
    };
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };
  return (
    <div
      onPointerDown={handlePointerDown}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      style={{ position: "absolute", [side]: 0, top: 0, bottom: 0, width: 6, cursor: "ew-resize", backgroundColor: "rgba(0,0,0,0.25)" } as React.CSSProperties}
      title="Drag to adjust timing"
    />
  );
}

function Waveform() {
  const barCount = 60;
  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%", width: "100%", gap: 1, padding: "0 4px", overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div key={i} style={{ flexShrink: 0, width: 2, height: `${18 + Math.abs(Math.sin(i * 0.45)) * 22}%`, backgroundColor: "rgba(245, 241, 234, 0.55)", borderRadius: 1 }} />
      ))}
    </div>
  );
}

function AudioMeter({ levels, active }: { levels: number[]; active: boolean }) {
  return (
    <div data-audio-meter style={{ width: 30, height: 52, flexShrink: 0 }}>
      <div style={{ height: "100%", boxSizing: "border-box", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 2 }}>
        {levels.map((lvl, i) => {
          const heightPct = Math.max(10, Math.min(100, lvl * 100));
          return (
            <div
              key={i}
              data-meter-bar
              style={{
                width: 3,
                height: `${heightPct}%`,
                borderRadius: 1,
                backgroundColor: !active ? COLORS.cardBorder : lvl > 0.8 ? COLORS.danger : COLORS.accent,
                opacity: active ? 1 : 0.4,
                transition: "height 60ms linear, background-color 100ms linear",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

const disabledIconStyle: React.CSSProperties = { background: "transparent", border: "none", color: COLORS.textMuted, fontSize: 15, padding: "4px 6px", opacity: 0.4, cursor: "not-allowed" };
const transportBtnStyle: React.CSSProperties = { background: "transparent", border: "none", color: COLORS.textMuted, fontSize: 16, cursor: "pointer", padding: 4, lineHeight: 1 };
const presetBtnStyle: React.CSSProperties = { flex: 1, minWidth: 48, padding: "8px 4px", borderRadius: 6, border: `1px solid ${COLORS.cardBorder}`, background: "transparent", color: COLORS.textPrimary, fontSize: 12, cursor: "pointer" };
const fieldLabelStyle: React.CSSProperties = { display: "block", fontSize: 11, color: COLORS.textMuted, margin: "12px 0 4px" };
const textareaStyle: React.CSSProperties = { width: "100%", minHeight: 64, borderRadius: 8, border: `1px solid ${COLORS.cardBorder}`, background: COLORS.trackHeaderBg, color: COLORS.textPrimary, fontSize: 13, padding: 8, resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" };
const numberInputStyle: React.CSSProperties = { width: "100%", borderRadius: 8, border: `1px solid ${COLORS.cardBorder}`, background: COLORS.trackHeaderBg, color: COLORS.textPrimary, fontSize: 13, padding: "6px 8px", boxSizing: "border-box" };
const dangerBtnStyle: React.CSSProperties = { width: "100%", marginTop: 16, padding: "8px 0", borderRadius: 8, border: `1px solid ${COLORS.danger}`, background: "transparent", color: COLORS.danger, fontSize: 12, fontWeight: 600, cursor: "pointer" };
const primaryFullBtnStyle: React.CSSProperties = { width: "100%", padding: "10px 0", borderRadius: 8, border: "none", backgroundColor: COLORS.accent, color: COLORS.accentText, fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 12 };
