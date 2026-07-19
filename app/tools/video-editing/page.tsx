"use client";

/**
 * Manual Video Editor — /tools/video-editing
 *
 * PHASE 1: media upload, a two-track (Video + Audio) timeline, and cut/trim
 * functionality.
 * PHASE 2: Crop, Rotate/Flip, and Speed tools, applied per-segment — each
 * block created by Phase 1's Split carries its own independent
 * { crop, rotation, flipH, flipV, speed } state, selected via clicking a
 * block in the Video track.
 * PHASE 3 (this update): the Text tool is now functional. Text overlays are
 * timed objects ({ content, x, y, fontSize, color, startTime, endTime })
 * shown on the preview only while the playhead is within their time range,
 * draggable directly on the preview to reposition, and rendered as their
 * own blocks in a new Text timeline row (between Video and Audio) that
 * supports drag-to-shift and edge-handle drag-to-trim, same interaction
 * pattern as the Phase 1 video/audio trim handles.
 * PHASE 4: light per-segment color grading (Brightness/Contrast/Saturation,
 * -100..100, applied as a CSS filter on the preview) — reuses the same
 * selectedSegmentId + segmentEdits pattern as Phase 2's crop/rotate/speed,
 * including the "edited" indicator dot and per-segment independence.
 * PHASE 5 (this update): a real-time Web Audio level meter for the
 * separately-uploaded audio track (background music etc). The audio element
 * is routed through an AnalyserNode that also forwards on to
 * audioContext.destination (source -> analyser -> destination) so metering
 * doesn't silence playback; the AudioContext is created/resumed from the
 * Play button's click handler specifically, since browsers require a user
 * gesture before an AudioContext can produce sound. See AudioMeter,
 * ensureAudioGraph, and startMeterLoop/stopMeterLoop.
 *
 * This is a separate, standalone tool from /dev-tools/auto-edit. It does
 * not import from or modify that file.
 *
 * STYLING: inline `style` props only — this project has no Tailwind
 * installed. COLORS token object matches the one used in auto-edit/page.tsx.
 */

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { exportVideo } from "@/lib/video-editor/export";

// ---- Design tokens (matches auto-edit/page.tsx) ----
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
};

// Media/Color/Text/Audio stay in the left sidebar + right panel. Crop/
// Rotate/Speed moved to compact popover buttons near the transport bar
// (quick-adjustment tools, not primary navigation) — tracked separately via
// `openPopover` so they're fully decoupled from the sidebar/right-panel.
type ToolId = "media" | "color" | "text" | "audio";
type PopoverTool = "crop" | "rotate" | "speed";
type AutoEditStage = "idle" | "paying" | "verifying" | "analyzing" | "done" | "error";
type ExportStage = "idle" | "loading" | "rendering" | "done" | "error";

// Minimal shape of the Razorpay Checkout.js global — the SDK is loaded
// dynamically at runtime (loadRazorpayScript), it ships no official types.
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
type AspectRatio = "16:9" | "9:16" | "1:1";
type TrackKind = "video" | "audio";
type Corner = "nw" | "ne" | "sw" | "se";

interface EditBlock {
  id: string;
  trimStart: number; // 0-1 fraction trimmed off the left (in-point)
  trimEnd: number; // 0-1 fraction trimmed off the right (out-point)
  widthFrac: number; // relative width within its track row (flex-grow basis)
  // Fixed, reorder-independent pointer into the ORIGINAL uploaded file's own
  // timeline (0-1 fraction of its total duration) — set once at upload/
  // split time and never touched by later drag-reordering, which only
  // changes array order, not what source footage a block represents. Export
  // uses these (combined with trimStart/trimEnd) to know exactly which
  // range of the source file each block should pull from.
  sourceStartFrac: number;
  sourceEndFrac: number;
  // Set via the segment's right-click context menu — blocks drag-reorder,
  // trim, and delete while true (checked at each of those call sites).
  locked: boolean;
}

interface ContextMenuState {
  x: number;
  y: number;
  trackKind: TrackKind;
  blockId: string;
}

interface CropRect {
  x: number; // 0-100, % from left of the video frame
  y: number; // 0-100, % from top of the video frame
  width: number; // 0-100, % of frame width
  height: number; // 0-100, % of frame height
}

interface ColorGrade {
  brightness: number; // -100..100, 0 = no change
  contrast: number; // -100..100, 0 = no change
  saturation: number; // -100..100, 0 = no change
}

interface SegmentEdit {
  crop: CropRect;
  rotation: 0 | 90 | 180 | 270;
  flipH: boolean;
  flipV: boolean;
  speed: number; // 0.25 - 3
  color: ColorGrade;
}

interface TextOverlay {
  id: string;
  content: string;
  x: number; // 0-100, % across the video frame
  y: number; // 0-100, % down the video frame
  fontSize: number; // px
  color: string; // hex
  startTime: number; // seconds
  endTime: number; // seconds
}

const DEFAULT_CROP: CropRect = { x: 0, y: 0, width: 100, height: 100 };
const DEFAULT_COLOR: ColorGrade = { brightness: 0, contrast: 0, saturation: 0 };
const DEFAULT_EDIT: SegmentEdit = { crop: DEFAULT_CROP, rotation: 0, flipH: false, flipV: false, speed: 1, color: DEFAULT_COLOR };
const MIN_CROP_PCT = 10;
const MIN_TEXT_DURATION = 0.1;
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
  { id: "audio", icon: "🔊", label: "Audio", enabled: false },
];

// Quick-adjustment tools rendered as compact icon buttons near the
// transport bar instead of the large left sidebar — each opens a small
// popover with its (unchanged) controls.
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

// Maps a -100..100 slider value to a CSS filter percentage (0 -> 100%, so
// the slider's neutral midpoint is "no change" for brightness/contrast/
// saturate, which are all 100%-centered CSS filter functions).
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

// Splits the block that the playhead currently sits inside into two blocks,
// preserving each half's original trim on its outer edge and resetting the
// new inner edge to 0. No-op (returns the same array reference) if the
// playhead is on a block boundary/edge.
function splitBlocksAt(blocks: EditBlock[], playheadFrac: number, prefix: string): EditBlock[] {
  const total = blocks.reduce((s, b) => s + b.widthFrac, 0);
  if (total <= 0) return blocks;
  let cursor = 0;
  for (let i = 0; i < blocks.length; i += 1) {
    const b = blocks[i];
    const bStart = cursor / total;
    const bEnd = (cursor + b.widthFrac) / total;
    if (!b.locked && playheadFrac > bStart + 0.01 && playheadFrac < bEnd - 0.01) {
      const localF = (playheadFrac - bStart) / (bEnd - bStart);
      // The split point in the SOURCE file's own timeline, derived from
      // this block's own fixed sourceStartFrac/sourceEndFrac (not from its
      // current array position) — correct even if this block was earlier
      // drag-reordered away from its original neighbors.
      const splitSourceFrac = b.sourceStartFrac + localF * (b.sourceEndFrac - b.sourceStartFrac);
      const left: EditBlock = { id: `${prefix}-${Date.now()}-l`, trimStart: b.trimStart, trimEnd: 0, widthFrac: b.widthFrac * localF, sourceStartFrac: b.sourceStartFrac, sourceEndFrac: splitSourceFrac, locked: false };
      const right: EditBlock = { id: `${prefix}-${Date.now()}-r`, trimStart: 0, trimEnd: b.trimEnd, widthFrac: b.widthFrac * (1 - localF), sourceStartFrac: splitSourceFrac, sourceEndFrac: b.sourceEndFrac, locked: false };
      const next = [...blocks];
      next.splice(i, 1, left, right);
      return next;
    }
    cursor += b.widthFrac;
  }
  return blocks;
}

export default function VideoEditorPage() {
  const [activeTool, setActiveTool] = useState<ToolId>("media");
  const [openPopover, setOpenPopover] = useState<PopoverTool | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");

  // Independent playback controls: the uploaded video's OWN audio vs the
  // separately-uploaded Audio track — genuinely separate <video>/<audio>
  // element properties, not a shared value.
  const [videoMuted, setVideoMuted] = useState(false);
  const [videoVolume, setVideoVolume] = useState(1);
  const [audioTrackMuted, setAudioTrackMuted] = useState(false);
  const [audioTrackVolume, setAudioTrackVolume] = useState(1);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [meterLevels, setMeterLevels] = useState<number[]>(Array(METER_BAR_COUNT).fill(0));

  const [videoBlocks, setVideoBlocks] = useState<EditBlock[]>([]);
  const [audioBlocks, setAudioBlocks] = useState<EditBlock[]>([]);
  const [dragVideoId, setDragVideoId] = useState<string | null>(null);
  const [dragAudioId, setDragAudioId] = useState<string | null>(null);

  // Per-segment crop/rotate/flip/speed, keyed by video EditBlock id.
  const [segmentEdits, setSegmentEdits] = useState<Record<string, SegmentEdit>>({});
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);

  // Text overlays: independent timed objects, not tied to video/audio blocks.
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [textDraftContent, setTextDraftContent] = useState("");
  const [textDraftFontSize, setTextDraftFontSize] = useState(32);
  const [textDraftColor, setTextDraftColor] = useState("#f5f1ea");

  // Auto Edit: Razorpay TEST MODE payment -> simulated AI-edit pass over the
  // video/audio already uploaded in this session.
  const [autoEditStage, setAutoEditStage] = useState<AutoEditStage>("idle");
  const [autoEditError, setAutoEditError] = useState<string | null>(null);
  const [autoEditProgress, setAutoEditProgress] = useState(0);
  const [autoEditLabel, setAutoEditLabel] = useState("");

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoWidth, setVideoWidth] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playheadFrac, setPlayheadFrac] = useState(0);

  // Export: real ffmpeg.wasm render of every edit currently in state (see
  // lib/video-editor/export.ts). Independent of the Auto Edit payment flow.
  const [exportStage, setExportStage] = useState<ExportStage>("idle");
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStageLabel, setExportStageLabel] = useState("");
  const [exportResultUrl, setExportResultUrl] = useState<string | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const replaceVideoInputRef = useRef<HTMLInputElement>(null);
  const replaceAudioInputRef = useRef<HTMLInputElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const audioElRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const meterRafRef = useRef<number | null>(null);

  const currentEdit: SegmentEdit = (selectedSegmentId && segmentEdits[selectedSegmentId]) || DEFAULT_EDIT;
  const selectedTextOverlay = textOverlays.find((t) => t.id === selectedTextId) ?? null;
  const activeTextOverlays = textOverlays.filter((t) => currentTime >= t.startTime && currentTime <= t.endTime);

  // ---- Preview player: object URL for the uploaded video file ----
  useEffect(() => {
    if (!videoFile) {
      setVideoUrl(null);
      return;
    }
    const url = URL.createObjectURL(videoFile);
    setVideoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  // ---- Timeline: a fresh video upload resets to a single full-width block,
  // clears any prior per-segment edits, and selects the new block. Text
  // overlays are cleared too since their timing is tied to the old clip. ----
  useEffect(() => {
    if (videoFile) {
      const id = `v-${Date.now()}`;
      setVideoBlocks([{ id, trimStart: 0, trimEnd: 0, widthFrac: 1, sourceStartFrac: 0, sourceEndFrac: 1, locked: false }]);
      setSegmentEdits({});
      setSelectedSegmentId(id);
    } else {
      setVideoBlocks([]);
      setSegmentEdits({});
      setSelectedSegmentId(null);
    }
    setTextOverlays([]);
    setSelectedTextId(null);
  }, [videoFile]);

  useEffect(() => {
    setAudioBlocks(audioFile ? [{ id: `a-${Date.now()}`, trimStart: 0, trimEnd: 0, widthFrac: 1, sourceStartFrac: 0, sourceEndFrac: 1, locked: false }] : []);
  }, [audioFile]);

  // ---- Audio meter: object URL for the uploaded audio file ----
  useEffect(() => {
    if (!audioFile) {
      setAudioUrl(null);
      return;
    }
    const url = URL.createObjectURL(audioFile);
    setAudioUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [audioFile]);

  // Stop the meter's rAF loop on unmount and close the AudioContext so it
  // doesn't keep running (and, in dev, doesn't survive a Fast Refresh).
  useEffect(() => {
    return () => {
      if (meterRafRef.current !== null) cancelAnimationFrame(meterRafRef.current);
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  // ---- Speed: keep the actual <video> element in sync with the selected segment ----
  useEffect(() => {
    const v = previewVideoRef.current;
    if (v) v.playbackRate = currentEdit.speed;
  }, [currentEdit.speed, videoUrl]);

  // ---- Independent mute/volume: video's own sound vs the separate audio
  // track, each wired to their own real media element ----
  useEffect(() => {
    const v = previewVideoRef.current;
    if (v) {
      v.muted = videoMuted;
      v.volume = videoVolume;
    }
  }, [videoMuted, videoVolume, videoUrl]);
  useEffect(() => {
    const a = audioElRef.current;
    if (a) {
      a.muted = audioTrackMuted;
      a.volume = audioTrackVolume;
    }
  }, [audioTrackMuted, audioTrackVolume, audioUrl]);

  // ---- Audio level meter (Web Audio API) ----
  // Lazily builds the graph on first use, in direct response to a user
  // gesture (the Play button click below) — browsers require this before an
  // AudioContext is allowed to actually produce sound.
  //   source -> analyser -> destination
  // The analyser MUST also be connected on to destination (not just read
  // from) — createMediaElementSource() detaches the element's normal direct
  // output the moment it's called, so if the analyser only forwarded to our
  // own reads and never on to destination, the audio would go silent even
  // though the <audio> element itself still reports "playing".
  const ensureAudioGraph = () => {
    const audioEl = audioElRef.current;
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

  const handleAudioPlay = () => startMeterLoop();
  const handleAudioPause = () => stopMeterLoop();
  const handleAudioEnded = () => stopMeterLoop();

  // ---- Transport controls ----
  const FRAME_SEC = 1 / 30;
  const handlePlayPause = () => {
    const v = previewVideoRef.current;
    if (!v) return;
    if (v.paused) {
      ensureAudioGraph();
      v.play();
      audioElRef.current?.play().catch(() => {});
    } else {
      v.pause();
      audioElRef.current?.pause();
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
  const handleAudioLoadedMetadata = () => {
    const a = audioElRef.current;
    if (a) setAudioDuration(a.duration);
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

  // ---- Reorder within a track (drag/drop) ----
  const handleVideoDrop = (targetId: string) => {
    if (!dragVideoId || dragVideoId === targetId) return;
    setVideoBlocks((prev) => {
      const dragged = prev.find((b) => b.id === dragVideoId);
      if (!dragged) return prev;
      const without = prev.filter((b) => b.id !== dragVideoId);
      const idx = without.findIndex((b) => b.id === targetId);
      const next = [...without];
      next.splice(idx, 0, dragged);
      return next;
    });
    setDragVideoId(null);
  };
  const handleAudioDrop = (targetId: string) => {
    if (!dragAudioId || dragAudioId === targetId) return;
    setAudioBlocks((prev) => {
      const dragged = prev.find((b) => b.id === dragAudioId);
      if (!dragged) return prev;
      const without = prev.filter((b) => b.id !== dragAudioId);
      const idx = without.findIndex((b) => b.id === targetId);
      const next = [...without];
      next.splice(idx, 0, dragged);
      return next;
    });
    setDragAudioId(null);
  };

  // ---- Trim (drag edge handle) ----
  const trimVideoBlock = (id: string, side: "start" | "end", delta: number) => {
    setVideoBlocks((prev) => prev.map((b) => applyTrim(b, id, side, delta)));
  };
  const trimAudioBlock = (id: string, side: "start" | "end", delta: number) => {
    setAudioBlocks((prev) => prev.map((b) => applyTrim(b, id, side, delta)));
  };

  // ---- Split at playhead (video split also carries the split block's edit
  // state over onto both resulting halves, so a segment you'd already
  // cropped/rotated/sped-up doesn't silently reset when you cut it) ----
  const handleSplitVideo = () => {
    // Computed once from the current state snapshot (not inside a setState
    // updater): nesting a second, side-effecting setState call inside
    // setVideoBlocks's functional updater is unsafe under React's
    // double-invoke-in-dev purity check — splitBlocksAt's Date.now()-based
    // ids would differ between the two invocations and silently drop the
    // inherited edit. Computing next/removedId/addedIds once up front keeps
    // every setState call below a plain, idempotent, top-level update.
    const prev = videoBlocks;
    const next = splitBlocksAt(prev, playheadFrac, "v");
    if (next === prev) return;
    const prevIds = new Set(prev.map((b) => b.id));
    const nextIds = new Set(next.map((b) => b.id));
    const removedId = prev.find((b) => !nextIds.has(b.id))?.id;
    const addedIds = next.filter((b) => !prevIds.has(b.id)).map((b) => b.id);
    setVideoBlocks(next);
    if (removedId && addedIds.length === 2) {
      setSegmentEdits((prevEdits) => {
        const edit = prevEdits[removedId] ?? DEFAULT_EDIT;
        const rest = { ...prevEdits };
        delete rest[removedId];
        return { ...rest, [addedIds[0]]: edit, [addedIds[1]]: edit };
      });
      setSelectedSegmentId(addedIds[0]);
    }
  };
  const handleSplitAudio = () => setAudioBlocks((prev) => splitBlocksAt(prev, playheadFrac, "a"));

  // ---- Segment context menu (right-click a Video/Text/Audio block) ----
  // Right-click was chosen over click-and-hold: it's the standard desktop-
  // web pattern for a timeline/editor context menu (matches Figma, most NLE
  // web apps), whereas click-and-hold is primarily a touch/mobile idiom.
  const handleBlockContextMenu = (trackKind: TrackKind, id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, trackKind, blockId: id });
  };
  const closeContextMenu = () => setContextMenu(null);

  // Dismiss the context menu on outside click or Escape.
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

  const handleMenuToggleLock = () => {
    if (!contextMenu) return;
    const { trackKind, blockId } = contextMenu;
    const setBlocks = trackKind === "video" ? setVideoBlocks : setAudioBlocks;
    setBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, locked: !b.locked } : b)));
    closeContextMenu();
  };

  const handleMenuDuplicate = () => {
    if (!contextMenu) return;
    const { trackKind, blockId } = contextMenu;
    const prefix = trackKind === "video" ? "v" : "a";
    // Generated once, up front, so the SAME id is used both for the new
    // array entry and (for video) its copied segmentEdits — matches the
    // same "compute once, then issue plain top-level setState calls"
    // pattern used by handleSplitVideo, for the same reason: nesting a
    // second setState inside another's functional updater is unsafe under
    // React's dev-mode double-invoke purity check.
    const newId = `${prefix}-${Date.now()}-copy`;
    const blocks = trackKind === "video" ? videoBlocks : audioBlocks;
    const idx = blocks.findIndex((b) => b.id === blockId);
    if (idx === -1) {
      closeContextMenu();
      return;
    }
    const copy: EditBlock = { ...blocks[idx], id: newId, locked: false };
    const next = [...blocks];
    next.splice(idx + 1, 0, copy);
    if (trackKind === "video") {
      setVideoBlocks(next);
      setSegmentEdits((prev) => {
        const original = prev[blockId];
        return original ? { ...prev, [newId]: original } : prev;
      });
    } else {
      setAudioBlocks(next);
    }
    closeContextMenu();
  };

  const handleMenuDelete = () => {
    if (!contextMenu) return;
    const { trackKind, blockId } = contextMenu;
    if (trackKind === "video") {
      setVideoBlocks((prev) => prev.filter((b) => b.id !== blockId));
      setSegmentEdits((prev) => {
        const rest = { ...prev };
        delete rest[blockId];
        return rest;
      });
      setSelectedSegmentId((prev) => (prev === blockId ? null : prev));
    } else {
      setAudioBlocks((prev) => prev.filter((b) => b.id !== blockId));
    }
    closeContextMenu();
  };

  // Replace: opens a real file picker for the segment's track type. Actual
  // source-swap is genuinely out of scope for this pass — the whole
  // timeline is built from ONE uploaded file per track (sliced via each
  // block's sourceStartFrac/sourceEndFrac), so swapping a single segment's
  // source would need a per-block file reference, a real architecture
  // change, not a UI relocation. TODO(future phase): wire actual
  // replacement once per-block source files are supported.
  const handleMenuReplace = () => {
    if (!contextMenu) return;
    const input = contextMenu.trackKind === "video" ? replaceVideoInputRef.current : replaceAudioInputRef.current;
    input?.click();
    closeContextMenu();
  };

  const handleMenuSplit = () => {
    if (!contextMenu) return;
    if (contextMenu.trackKind === "video") handleSplitVideo();
    else handleSplitAudio();
    closeContextMenu();
  };

  // ---- Per-segment crop/rotate/speed edits ----
  const updateSelectedEdit = (patch: Partial<SegmentEdit>) => {
    if (!selectedSegmentId) return;
    setSegmentEdits((prev) => ({
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

  // Drag the whole crop rect to reposition it (pan) within the frame.
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

  // Drag a corner handle to resize the crop rect from that corner.
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

  // ---- Text overlays ----
  const handleAddText = () => {
    const id = `t-${Date.now()}`;
    const start = currentTime;
    const overlay: TextOverlay = {
      id,
      content: textDraftContent.trim() || "Text",
      x: 50,
      y: 50,
      fontSize: textDraftFontSize,
      color: textDraftColor,
      startTime: start,
      endTime: start + 3,
    };
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

  // Drag a text overlay directly on the preview to reposition it (x/y %).
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

  // Drag a text block's body in the Text track to shift its timing (start
  // and end move together, duration stays fixed).
  const startTextBlockMove = (id: string) => (e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedTextId(id);
    if (duration <= 0) return;
    const overlay = textOverlays.find((t) => t.id === id);
    if (!overlay) return;
    const row = (e.currentTarget as HTMLElement).closest<HTMLElement>("[data-text-row]");
    const rowWidth = row?.getBoundingClientRect().width ?? 0;
    if (rowWidth <= 0) return;
    const startX = e.clientX;
    const span = overlay.endTime - overlay.startTime;
    const startTimeAtDown = overlay.startTime;
    const handleMove = (ev: PointerEvent) => {
      const dxSec = ((ev.clientX - startX) / rowWidth) * duration;
      const newStart = Math.max(0, Math.min(duration - span, startTimeAtDown + dxSec));
      setTextOverlays((prev) => prev.map((t) => (t.id === id ? { ...t, startTime: newStart, endTime: newStart + span } : t)));
    };
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  // Drag a text block's edge handle to adjust startTime/endTime independently.
  const resizeTextEdge = (id: string, side: "start" | "end", deltaFraction: number) => {
    if (duration <= 0) return;
    const deltaSec = deltaFraction * duration;
    setTextOverlays((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (side === "start") {
          const next = Math.min(t.endTime - MIN_TEXT_DURATION, Math.max(0, t.startTime + deltaSec));
          return { ...t, startTime: next };
        }
        const next = Math.max(t.startTime + MIN_TEXT_DURATION, Math.min(duration, t.endTime + deltaSec));
        return { ...t, endTime: next };
      })
    );
  };

  // ---- Auto Edit: Razorpay TEST MODE payment, then a simulated AI-edit
  // pass over the video/audio already uploaded in this session ----
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

  // TODO(phase 8+): replace this simulated pass with real AI processing
  // (beat-sync, face/subject tracking, auto-cut selection) — out of scope
  // here, which is payment infra + the UI transition only.
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

  // ---- Export: render every current edit into a real downloadable MP4 ----
  const handleExportClick = async () => {
    if (!videoFile || videoBlocks.length === 0 || duration <= 0) return;
    if (exportResultUrl) URL.revokeObjectURL(exportResultUrl);
    setExportError(null);
    setExportResultUrl(null);
    setExportStage("loading");
    setExportProgress(0);
    setExportStageLabel("Loading export engine...");
    try {
      const segments = buildExportSegments(videoBlocks, segmentEdits, duration);
      const audioSegs = buildExportAudioSegments(audioBlocks, audioDuration);
      const blob = await exportVideo({
        videoFile,
        videoWidth,
        videoHeight,
        aspectRatio,
        segments,
        textOverlays,
        audioFile,
        audioSegments: audioSegs,
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
        {/* TODO(phase 5): wire real undo/redo history stack */}
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
            disabled={!videoUrl || videoBlocks.length === 0 || exportStage !== "idle" || autoEditStage !== "idle"}
            title={videoUrl ? "Render every current edit into a downloadable MP4" : "Upload a video first"}
            style={{ borderRadius: 8, border: `1px solid ${COLORS.cardBorder}`, padding: "8px 14px", fontSize: 13, fontWeight: 600, background: "transparent", color: COLORS.textPrimary, opacity: !videoUrl || videoBlocks.length === 0 || exportStage !== "idle" || autoEditStage !== "idle" ? 0.4 : 1, cursor: !videoUrl || videoBlocks.length === 0 || exportStage !== "idle" || autoEditStage !== "idle" ? "not-allowed" : "pointer" }}
          >
            &#8681; Export
          </button>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", padding: "3px 6px", borderRadius: 4, border: `1px solid ${COLORS.danger}`, color: COLORS.danger }} title="Razorpay TEST mode — no real payments are processed">
            TEST MODE
          </span>
          <button
            type="button"
            onClick={handleAutoEditClick}
            disabled={!videoUrl || autoEditStage !== "idle" || exportStage !== "idle"}
            title={videoUrl ? "Pay ₹500 (test) to run Auto Edit on this session's video/audio" : "Upload a video first"}
            style={{ borderRadius: 8, border: "none", padding: "8px 14px", fontSize: 13, fontWeight: 600, backgroundColor: COLORS.accent, color: COLORS.accentText, opacity: !videoUrl || autoEditStage !== "idle" || exportStage !== "idle" ? 0.4 : 1, cursor: !videoUrl || autoEditStage !== "idle" || exportStage !== "idle" ? "not-allowed" : "pointer" }}
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
                onTimeUpdate={handleTimeUpdate}
                onSeeked={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />
            ) : (
              <div style={{ color: COLORS.textMuted, fontSize: 13 }}>No video uploaded</div>
            )}

            {/* Separately-uploaded audio track (e.g. background music) —
                not visually rendered; it plays in sync with the video via
                handlePlayPause and feeds the level meter in the timeline. */}
            {audioUrl && (
              <audio
                ref={audioElRef}
                src={audioUrl}
                style={{ display: "none" }}
                onPlay={handleAudioPlay}
                onPause={handleAudioPause}
                onEnded={handleAudioEnded}
                onLoadedMetadata={handleAudioLoadedMetadata}
              />
            )}

            {/* Crop frame: dim+border always shown when a non-default crop is
                set (so it's visible on other tools too), draggable handles
                only appear while the Crop tool itself is active. */}
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

            {/* Text overlays: shown whenever the playhead is within their
                start/end range, draggable to reposition only while the Text
                tool is active (so they don't intercept clicks on other
                tools' handles). */}
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

          {/* Transport bar + quick-adjustment row: prev/play/next/time,
              Crop/Rotate/Speed compact icons (each opens a popover with its
              unchanged controls), and independent Video-sound / Audio-track
              mute+volume controls — all on one row, flush under the preview. */}
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
                            <p style={{ fontSize: 12, color: COLORS.textMuted, margin: 0 }}>Select a segment in the timeline to crop.</p>
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
                            <p style={{ fontSize: 12, color: COLORS.textMuted, margin: 0 }}>Select a segment in the timeline to rotate.</p>
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
                            <p style={{ fontSize: 12, color: COLORS.textMuted, margin: 0 }}>Select a segment in the timeline to change its speed.</p>
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
            {audioFile && <SoundControl label="Audio track" muted={audioTrackMuted} volume={audioTrackVolume} onToggleMute={() => setAudioTrackMuted((m) => !m)} onVolumeChange={setAudioTrackVolume} />}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ width: 280, flexShrink: 0, padding: 20, backgroundColor: COLORS.card, borderLeft: `1px solid ${COLORS.cardBorder}`, overflowY: "auto" }}>
          {activeTool === "media" && (
            <>
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 16px" }}>Media</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <UploadSlot label="Video" sublabel={videoFile ? videoFile.name : "Upload footage"} icon="🎥" onClick={() => videoInputRef.current?.click()} filled={!!videoFile} />
                <input ref={videoInputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)} />

                <UploadSlot label="Audio" sublabel={audioFile ? audioFile.name : "Upload a track"} icon="🎵" onClick={() => audioInputRef.current?.click()} filled={!!audioFile} />
                <input ref={audioInputRef} type="file" accept="audio/*" style={{ display: "none" }} onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)} />
              </div>
            </>
          )}

          {activeTool === "color" && (
            <>
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 16px" }}>Color</h2>
              {!selectedSegmentId ? (
                <p style={{ fontSize: 12, color: COLORS.textMuted }}>Upload a video and select a segment in the timeline to grade its color.</p>
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
                  <button type="button" onClick={handleAddText} disabled={!textDraftContent.trim()} style={{ ...primaryFullBtnStyle, opacity: textDraftContent.trim() ? 1 : 0.4, cursor: textDraftContent.trim() ? "pointer" : "not-allowed" }}>
                    + Add Text
                  </button>
                </>
              )}
            </>
          )}

          {activeTool === "audio" && (
            <div style={{ fontSize: 13, color: COLORS.textMuted }}>
              {TOOLS.find((t) => t.id === activeTool)?.label} &mdash; coming soon.
            </div>
          )}
        </div>
      </div>

      {/* ---- Timeline ---- */}
      <div style={{ position: "relative", flexShrink: 0, borderTop: `1px solid ${COLORS.cardBorder}`, backgroundColor: COLORS.panelBg }}>
        <div ref={timelineRef} style={{ position: "relative" }}>
          {/* Playhead line */}
          <div
            style={{ position: "absolute", left: `calc(88px + ${playheadFrac} * (100% - 88px))`, top: 0, bottom: 0, width: 2, backgroundColor: COLORS.accent, pointerEvents: "none", zIndex: 2 }}
          />

          {/* Ruler (click/drag to seek) */}
          <div
            onPointerDown={handleTimelinePointerDown}
            style={{ display: "flex", paddingLeft: 88, height: 24, alignItems: "flex-end", borderBottom: `1px solid ${COLORS.cardBorder}`, backgroundColor: COLORS.trackHeaderBg, cursor: "pointer" }}
          >
            {["00:00", "00:04", "00:08", "00:12", "00:16", "00:20"].map((t) => (
              <span key={t} style={{ flex: 1, fontSize: 10, color: COLORS.textMuted, borderLeft: `1px solid ${COLORS.ruler}`, paddingLeft: 4 }}>
                {t}
              </span>
            ))}
          </div>

          {/* Video track — blocks are click-to-select (drives the Crop/
              Rotate/Speed popovers) and right-click for the segment
              context menu (Replace/Keyframe/Lock/Duplicate/Delete/Split). */}
          <TrackShell label="Video" icon="🎥">
            {videoBlocks.length === 0 ? (
              <EmptyTrackHint text="No video uploaded" />
            ) : (
              <EditBlockRow
                blocks={videoBlocks}
                dragId={dragVideoId}
                onDragStart={setDragVideoId}
                onDrop={handleVideoDrop}
                onTrim={trimVideoBlock}
                onContextMenu={(id, e) => handleBlockContextMenu("video", id, e)}
                renderContent={() => <span>Video</span>}
                selectedId={selectedSegmentId}
                onSelect={setSelectedSegmentId}
                isEdited={(id) => {
                  const e = segmentEdits[id];
                  return !!e && !isDefaultEdit(e);
                }}
              />
            )}
          </TrackShell>

          {/* Text track — independent timed overlay blocks, positioned by
              real start/end seconds relative to the clip duration (not the
              flex-proportion model the Video/Audio blocks use). */}
          <TrackShell label="Text" icon="🔤">
            {duration <= 0 ? (
              <EmptyTrackHint text="Upload a video to add text timing" />
            ) : (
              <div data-text-row style={{ position: "relative", height: 56, width: "100%" }}>
                {textOverlays.map((t) => {
                  const leftPct = Math.max(0, Math.min(100, (t.startTime / duration) * 100));
                  const widthPct = Math.max(1, Math.min(100 - leftPct, ((t.endTime - t.startTime) / duration) * 100));
                  return (
                    <div
                      key={t.id}
                      onPointerDown={startTextBlockMove(t.id)}
                      onClick={() => setSelectedTextId(t.id)}
                      style={{
                        position: "absolute",
                        left: `${leftPct}%`,
                        width: `${widthPct}%`,
                        top: 8,
                        bottom: 8,
                        borderRadius: 4,
                        backgroundColor: COLORS.textTrackAccent,
                        opacity: selectedTextId === t.id ? 0.95 : 0.75,
                        outline: selectedTextId === t.id ? `2px solid ${COLORS.textPrimary}` : "none",
                        outlineOffset: -2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        fontSize: 10,
                        fontWeight: 600,
                        color: "#0b1a24",
                        cursor: "grab",
                        userSelect: "none",
                        padding: "0 6px",
                      }}
                      title="Drag to shift timing, drag edges to trim duration, click to select"
                    >
                      <TextEdgeHandle side="left" onDrag={(frac) => resizeTextEdge(t.id, "start", frac)} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.content || "Text"}</span>
                      <TextEdgeHandle side="right" onDrag={(frac) => resizeTextEdge(t.id, "end", frac)} />
                    </div>
                  );
                })}
              </div>
            )}
          </TrackShell>

          {/* Audio track — the level meter now lives in a fixed floating
              panel on the right side of the screen (see below), not here. */}
          <TrackShell label="Audio" icon="🎵">
            {audioBlocks.length === 0 ? (
              <EmptyTrackHint text="No audio uploaded" />
            ) : (
              <EditBlockRow
                blocks={audioBlocks}
                dragId={dragAudioId}
                onDragStart={setDragAudioId}
                onDrop={handleAudioDrop}
                onTrim={trimAudioBlock}
                onContextMenu={(id, e) => handleBlockContextMenu("audio", id, e)}
                // TODO(phase 4b): derive bar heights from real audio analysis
                renderContent={() => <Waveform />}
              />
            )}
          </TrackShell>
        </div>

        {/* ---- Level meter: floating on the right side of the timeline,
            not part of any track row — clearly labeled since it measures
            the separately-uploaded Audio track specifically (not the
            video's own sound). Positioned `absolute` inside this
            `position: relative` timeline wrapper (rather than `fixed`
            against the raw viewport) so its right edge is always tied to
            the timeline's own box — which already matches the width of
            the rest of the page — instead of an independent viewport-
            relative calculation that could drift out of sync with it. ---- */}
        <div data-level-meter-panel style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", zIndex: 40, borderRadius: 10, border: `1px solid ${COLORS.cardBorder}`, backgroundColor: COLORS.card, padding: "10px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 9, fontWeight: 600, color: COLORS.textMuted, letterSpacing: "0.03em" }}>AUDIO TRACK</span>
          <AudioMeter levels={meterLevels} active={!!audioUrl} />
        </div>
      </div>

      {/* ---- Auto Edit overlay: payment -> verification -> simulated AI pass -> result ---- */}
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
                <p style={{ marginBottom: 16, fontSize: 14, color: COLORS.textMuted }}>Auto Edit complete (simulated result — see TODO(phase 8+) in source for real AI processing).</p>
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

      {/* ---- Export overlay: real ffmpeg.wasm render -> download ---- */}
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
      <input ref={replaceVideoInputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={closeContextMenu} />
      <input ref={replaceAudioInputRef} type="file" accept="audio/*" style={{ display: "none" }} onChange={closeContextMenu} />

      {/* ---- Segment context menu ---- */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
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

// Converts video blocks + their per-segment edits into export.ts's input
// shape: each block's fixed sourceStartFrac/sourceEndFrac (reorder-
// independent) plus its own trimStart/trimEnd narrow the range further,
// then everything is scaled from fractions to real seconds using the
// uploaded video's actual duration.
function buildExportSegments(blocks: EditBlock[], edits: Record<string, SegmentEdit>, videoDuration: number) {
  return blocks.map((b) => {
    const span = b.sourceEndFrac - b.sourceStartFrac;
    const effStartFrac = b.sourceStartFrac + b.trimStart * span;
    const effEndFrac = b.sourceEndFrac - b.trimEnd * span;
    return {
      id: b.id,
      sourceStart: effStartFrac * videoDuration,
      sourceEnd: effEndFrac * videoDuration,
      edit: edits[b.id] ?? DEFAULT_EDIT,
    };
  });
}

// Same conversion for the separately-uploaded audio track's blocks, scaled
// against that file's own duration (a different number from the video's).
function buildExportAudioSegments(blocks: EditBlock[], audioFileDuration: number) {
  return blocks.map((b) => {
    const span = b.sourceEndFrac - b.sourceStartFrac;
    const effStartFrac = b.sourceStartFrac + b.trimStart * span;
    const effEndFrac = b.sourceEndFrac - b.trimEnd * span;
    return {
      sourceStart: effStartFrac * audioFileDuration,
      sourceEnd: effEndFrac * audioFileDuration,
    };
  });
}

function applyTrim(b: EditBlock, id: string, side: "start" | "end", delta: number): EditBlock {
  if (b.id !== id) return b;
  if (side === "start") {
    const next = Math.min(0.4, Math.max(0, b.trimStart + delta));
    return { ...b, trimStart: next };
  }
  const next = Math.min(0.4, Math.max(0, b.trimEnd + delta));
  return { ...b, trimEnd: next };
}

function UploadSlot({ label, sublabel, icon, onClick, filled }: { label: string; sublabel: string; icon: string; onClick: () => void; filled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4, borderRadius: 12, border: `1px solid ${filled ? COLORS.accent : COLORS.cardBorder}`, padding: 16, textAlign: "left", background: "transparent", cursor: "pointer", color: COLORS.textPrimary }}
    >
      <span style={{ fontSize: 24 }}>{icon}</span>
      <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 12, color: COLORS.textMuted, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sublabel}</span>
    </button>
  );
}

// Independent mute-toggle + volume-slider control, used for both "Video
// sound" and "Audio track" near the transport bar — each instance wired to
// its own genuinely separate media element (see the two useEffects syncing
// videoMuted/videoVolume and audioTrackMuted/audioTrackVolume).
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
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          style={{ width: 72, accentColor: COLORS.accent, verticalAlign: "middle" }}
          title={`${label} volume`}
        />
      </div>
    </div>
  );
}

function ToggleButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 8, border: `1px solid ${active ? COLORS.accent : COLORS.cardBorder}`, background: active ? COLORS.trackHeaderBg : "transparent", color: COLORS.textPrimary, fontSize: 13, cursor: "pointer" }}
    >
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

function TrackShell({ label, icon, children }: { label: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", borderBottom: `1px solid ${COLORS.cardBorder}` }}>
      <div style={{ width: 88, flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "0 10px", backgroundColor: COLORS.trackHeaderBg, borderRight: `1px solid ${COLORS.cardBorder}`, fontSize: 11, color: COLORS.textMuted }}>
        <span>&#128274;</span>
        <span>{icon}</span>
        <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>{label}</span>
      </div>
      <div style={{ flex: 1, backgroundColor: COLORS.trackRowBg, padding: "0 4px" }}>{children}</div>
    </div>
  );
}

function EmptyTrackHint({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", height: 56, fontSize: 12, color: COLORS.textMuted }}>{text}</div>
  );
}

// Floating right-click menu for a Video/Audio timeline segment. Positioned
// at the click coordinates; the page-level click/Escape listeners (see
// closeContextMenu's useEffect) handle dismissal, so this component only
// needs to stop its own clicks from immediately re-triggering that same
// window-level "click closes the menu" handler.
function ContextMenu({
  x,
  y,
  onReplace,
  onLock,
  onDuplicate,
  onDelete,
  onSplit,
}: {
  x: number;
  y: number;
  onReplace: () => void;
  onLock: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSplit: () => void;
}) {
  const handlers: Record<string, () => void> = {
    replace: onReplace,
    lock: onLock,
    duplicate: onDuplicate,
    delete: onDelete,
    split: onSplit,
  };
  const MENU_WIDTH = 160;
  const ITEM_HEIGHT = 34;
  const estimatedHeight = CONTEXT_MENU_ITEMS.length * ITEM_HEIGHT + 8;
  // Right-clicking near the bottom or right edge of the viewport (e.g. a
  // segment late in the timeline, which sits near the bottom of the page)
  // would otherwise position the menu partly or fully off-screen — flip to
  // open upward/leftward from the click point instead when there isn't
  // room to grow down/right.
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
        const disabled = item.id === "keyframe";
        return (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            onClick={disabled ? undefined : handlers[item.id]}
            title={disabled ? "Coming soon" : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "none",
              background: "transparent",
              color: item.id === "delete" ? COLORS.danger : disabled ? COLORS.textMuted : COLORS.textPrimary,
              fontSize: 12,
              textAlign: "left",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.5 : 1,
            }}
          >
            <span style={{ fontSize: 12, width: 16, textAlign: "center" }}>{item.icon}</span>
            {item.label}
            {disabled && <span style={{ marginLeft: "auto", fontSize: 9, color: COLORS.textMuted }}>Coming soon</span>}
          </button>
        );
      })}
    </div>
  );
}

function EditBlockRow({
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
}: {
  blocks: EditBlock[];
  dragId: string | null;
  onDragStart: (id: string) => void;
  onDrop: (targetId: string) => void;
  onTrim: (id: string, side: "start" | "end", delta: number) => void;
  onContextMenu?: (id: string, e: React.MouseEvent) => void;
  renderContent: (block: EditBlock) => React.ReactNode;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  isEdited?: (id: string) => boolean;
}) {
  return (
    <div style={{ display: "flex", height: 56, width: "100%" }}>
      {blocks.map((b) => (
        <div
          key={b.id}
          draggable={!b.locked}
          onDragStart={() => !b.locked && onDragStart(b.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.stopPropagation();
            if (!b.locked) onDrop(b.id);
          }}
          onClick={() => onSelect?.(b.id)}
          onContextMenu={(e) => onContextMenu?.(b.id, e)}
          style={{
            position: "relative",
            flexGrow: b.widthFrac,
            flexBasis: 0,
            margin: "4px 2px",
            borderRadius: 4,
            backgroundColor: COLORS.accent,
            opacity: (dragId === b.id ? 0.4 : 0.85) - b.trimStart * 0.3 - b.trimEnd * 0.3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            cursor: b.locked ? "not-allowed" : "grab",
            color: COLORS.accentText,
            fontSize: 11,
            fontWeight: 600,
            userSelect: "none",
            outline: selectedId === b.id ? `2px solid ${COLORS.textPrimary}` : "none",
            outlineOffset: -2,
          }}
          title={b.locked ? "Locked — right-click for options" : onSelect ? "Click to select, drag to reorder, right-click for options" : "Drag to reorder, right-click for options"}
        >
          {!b.locked && <TrimHandle side="left" onDrag={(d) => onTrim(b.id, "start", d)} />}
          {renderContent(b)}
          {!b.locked && <TrimHandle side="right" onDrag={(d) => onTrim(b.id, "end", d)} />}
          {isEdited?.(b.id) && (
            <div title="Has crop/rotate/speed edits" style={{ position: "absolute", top: 3, right: 3, width: 7, height: 7, borderRadius: "50%", backgroundColor: COLORS.editedDot, border: `1px solid ${COLORS.accentText}` }} />
          )}
          {b.locked && (
            <div title="Locked" style={{ position: "absolute", top: 3, left: 3, fontSize: 9 }}>&#128274;</div>
          )}
        </div>
      ))}
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
      // Sits inside a draggable=true block. React's stopPropagation() above
      // only stops React's own synthetic bubbling — it does not stop the
      // browser's native HTML5 drag-gesture detection on the ancestor,
      // which would otherwise hijack a trim-drag into a reorder-drag.
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      style={{ position: "absolute", [side]: 0, top: 0, bottom: 0, width: 6, cursor: "ew-resize", backgroundColor: "rgba(0,0,0,0.25)" } as React.CSSProperties}
      title="Drag to trim"
    />
  );
}

// Same edge-handle drag pattern as TrimHandle, but reports a plain 0-1
// fraction of the Text row's own pixel width (found via the closest
// [data-text-row] ancestor) rather than a fixed sensitivity divisor — the
// caller converts that fraction to a time delta using the clip duration.
function TextEdgeHandle({ side, onDrag }: { side: "left" | "right"; onDrag: (deltaFraction: number) => void }) {
  const startX = useRef<number | null>(null);
  const rowWidth = useRef(0);
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    startX.current = e.clientX;
    const row = (e.currentTarget as HTMLElement).closest<HTMLElement>("[data-text-row]");
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

// TODO(phase 4b): replace with a static waveform shape derived from real
// decoded-audio analysis (this is separate from the live level meter below,
// which already reflects real-time amplitude while the track plays).
function Waveform() {
  // Fixed-width, fixed-count bars with overflow:hidden on the container —
  // NOT flex:1 (the previous approach), which stretched/squished bars to
  // fill whatever width a given block happened to have after a Split,
  // producing the reported broken/overlapping-black-rectangle look at
  // narrow widths. A generous fixed bar count (clipped by overflow:hidden
  // at narrower widths) keeps bar width/spacing constant and correct
  // regardless of the segment's own pixel width, with no measurement
  // needed. Color is a translucent light tone (not near-black) so it reads
  // as a waveform against the orange block background, not solid rectangles.
  const barCount = 120;
  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%", width: "100%", gap: 1, padding: "0 4px", overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div key={i} style={{ flexShrink: 0, width: 2, height: `${18 + Math.abs(Math.sin(i * 0.45)) * 22}%`, backgroundColor: "rgba(245, 241, 234, 0.55)", borderRadius: 1 }} />
      ))}
    </div>
  );
}

// Live VU-style level meter for the uploaded audio track, driven by
// AnalyserNode.getByteFrequencyData() via the rAF loop in startMeterLoop.
// `levels` are pre-normalized 0-1 values, one per bar. When no audio has
// been uploaded (`active` false), bars sit dimmed at their minimum height
// rather than being hidden — so the meter always has a clear, non-erroring
// idle state. Lives in a fixed floating panel on the right side of the
// screen (see the render call site), not inside the timeline.
function AudioMeter({ levels, active }: { levels: number[]; active: boolean }) {
  return (
    <div data-audio-meter style={{ width: 40, height: 100, flexShrink: 0 }}>
      <div style={{ height: "100%", boxSizing: "border-box", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 3 }}>
        {levels.map((lvl, i) => {
          const heightPct = Math.max(10, Math.min(100, lvl * 100));
          return (
            <div
              key={i}
              data-meter-bar
              style={{
                width: 5,
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

const disabledIconStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: COLORS.textMuted,
  fontSize: 15,
  padding: "4px 6px",
  opacity: 0.4,
  cursor: "not-allowed",
};

const transportBtnStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: COLORS.textMuted,
  fontSize: 16,
  cursor: "pointer",
  padding: 4,
  lineHeight: 1,
};

const presetBtnStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 48,
  padding: "8px 4px",
  borderRadius: 6,
  border: `1px solid ${COLORS.cardBorder}`,
  background: "transparent",
  color: COLORS.textPrimary,
  fontSize: 12,
  cursor: "pointer",
};

const fieldLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  color: COLORS.textMuted,
  margin: "12px 0 4px",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 64,
  borderRadius: 8,
  border: `1px solid ${COLORS.cardBorder}`,
  background: COLORS.trackHeaderBg,
  color: COLORS.textPrimary,
  fontSize: 13,
  padding: 8,
  resize: "vertical",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const numberInputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 8,
  border: `1px solid ${COLORS.cardBorder}`,
  background: COLORS.trackHeaderBg,
  color: COLORS.textPrimary,
  fontSize: 13,
  padding: "6px 8px",
  boxSizing: "border-box",
};

const dangerBtnStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 16,
  padding: "8px 0",
  borderRadius: 8,
  border: `1px solid ${COLORS.danger}`,
  background: "transparent",
  color: COLORS.danger,
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};

const primaryFullBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 0",
  borderRadius: 8,
  border: "none",
  backgroundColor: COLORS.accent,
  color: COLORS.accentText,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  marginTop: 12,
};
