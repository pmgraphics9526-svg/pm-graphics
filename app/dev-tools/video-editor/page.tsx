"use client";

/**
 * Manual Video Editor — /dev-tools/video-editor
 *
 * PHASE 1 SCOPE: media upload, a two-track (Video + Audio) timeline, and
 * cut/trim functionality only. Every other sidebar tool (Crop, Rotate,
 * Speed, Color, Text, Audio effects) renders as a disabled placeholder —
 * search "TODO(phase" for each stub and the phase it belongs to.
 *
 * This is a separate, standalone tool from /dev-tools/auto-edit. It does
 * not import from or modify that file.
 *
 * STYLING: inline `style` props only — this project has no Tailwind
 * installed. COLORS token object matches the one used in auto-edit/page.tsx.
 */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
};

type ToolId = "media" | "crop" | "rotate" | "speed" | "color" | "text" | "audio";
type AspectRatio = "16:9" | "9:16" | "1:1";
type TrackKind = "video" | "audio";

interface EditBlock {
  id: string;
  trimStart: number; // 0-1 fraction trimmed off the left (in-point)
  trimEnd: number; // 0-1 fraction trimmed off the right (out-point)
  widthFrac: number; // relative width within its track row (flex-grow basis)
}

const ASPECT_CSS: Record<AspectRatio, string> = { "16:9": "16 / 9", "9:16": "9 / 16", "1:1": "1 / 1" };

const TOOLS: { id: ToolId; icon: string; label: string; enabled: boolean }[] = [
  { id: "media", icon: "🗂️", label: "Media", enabled: true },
  { id: "crop", icon: "⬛", label: "Crop", enabled: false },
  { id: "rotate", icon: "🔄", label: "Rotate", enabled: false },
  { id: "speed", icon: "⏱️", label: "Speed", enabled: false },
  { id: "color", icon: "🎨", label: "Color", enabled: false },
  { id: "text", icon: "🔤", label: "Text", enabled: false },
  { id: "audio", icon: "🔊", label: "Audio", enabled: false },
];

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Splits the block that the playhead currently sits inside into two blocks,
// preserving each half's original trim on its outer edge and resetting the
// new inner edge to 0. No-op if the playhead is on a block boundary/edge.
function splitBlocksAt(blocks: EditBlock[], playheadFrac: number, prefix: string): EditBlock[] {
  const total = blocks.reduce((s, b) => s + b.widthFrac, 0);
  if (total <= 0) return blocks;
  let cursor = 0;
  for (let i = 0; i < blocks.length; i += 1) {
    const b = blocks[i];
    const bStart = cursor / total;
    const bEnd = (cursor + b.widthFrac) / total;
    if (playheadFrac > bStart + 0.01 && playheadFrac < bEnd - 0.01) {
      const localF = (playheadFrac - bStart) / (bEnd - bStart);
      const left: EditBlock = { id: `${prefix}-${Date.now()}-l`, trimStart: b.trimStart, trimEnd: 0, widthFrac: b.widthFrac * localF };
      const right: EditBlock = { id: `${prefix}-${Date.now()}-r`, trimStart: 0, trimEnd: b.trimEnd, widthFrac: b.widthFrac * (1 - localF) };
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
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const [videoBlocks, setVideoBlocks] = useState<EditBlock[]>([]);
  const [audioBlocks, setAudioBlocks] = useState<EditBlock[]>([]);
  const [dragVideoId, setDragVideoId] = useState<string | null>(null);
  const [dragAudioId, setDragAudioId] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playheadFrac, setPlayheadFrac] = useState(0);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

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

  // ---- Timeline: a fresh video uploads resets to a single full-width block ----
  useEffect(() => {
    setVideoBlocks(videoFile ? [{ id: `v-${Date.now()}`, trimStart: 0, trimEnd: 0, widthFrac: 1 }] : []);
  }, [videoFile]);

  useEffect(() => {
    setAudioBlocks(audioFile ? [{ id: `a-${Date.now()}`, trimStart: 0, trimEnd: 0, widthFrac: 1 }] : []);
  }, [audioFile]);

  // ---- Transport controls ----
  const FRAME_SEC = 1 / 30;
  const handlePlayPause = () => {
    const v = previewVideoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
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
    if (v) setDuration(v.duration);
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

  // ---- Split at playhead ----
  const handleSplitVideo = () => setVideoBlocks((prev) => splitBlocksAt(prev, playheadFrac, "v"));
  const handleSplitAudio = () => setAudioBlocks((prev) => splitBlocksAt(prev, playheadFrac, "a"));

  return (
    <div style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column", backgroundColor: COLORS.bg, color: COLORS.textPrimary, overflow: "hidden" }}>
      {/* ---- Top bar ---- */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 20px", borderBottom: `1px solid ${COLORS.cardBorder}`, backgroundColor: COLORS.trackHeaderBg, flexShrink: 0 }}>
        <Link href="/dev-tools" style={{ color: COLORS.textMuted, fontSize: 18, textDecoration: "none" }} title="Back">
          &#8592;
        </Link>
        <span style={{ fontSize: 14, fontWeight: 600 }}>My Project</span>
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
        {/* TODO(phase 6): wire real Razorpay checkout + auto-edit render pipeline */}
        <button
          type="button"
          disabled
          title="Coming soon"
          style={{ marginLeft: "auto", borderRadius: 8, border: "none", padding: "8px 14px", fontSize: 13, fontWeight: 600, backgroundColor: COLORS.accent, color: COLORS.accentText, opacity: 0.4, cursor: "not-allowed" }}
        >
          &#10024; Auto Edit &mdash; &#8377;500
        </button>
      </div>

      {/* ---- Middle: sidebar + preview + right panel ---- */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Left sidebar */}
        <div style={{ width: 72, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "16px 0", backgroundColor: COLORS.trackHeaderBg, borderRight: `1px solid ${COLORS.cardBorder}` }}>
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
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: COLORS.panelBgDark }}>
          <div style={{ aspectRatio: ASPECT_CSS[aspectRatio], maxHeight: "100%", maxWidth: "100%", width: aspectRatio === "9:16" ? "auto" : "100%", height: aspectRatio === "9:16" ? "100%" : "auto", border: `1px solid ${COLORS.cardBorder}`, borderRadius: 6, overflow: "hidden", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {videoUrl ? (
              <video
                ref={previewVideoRef}
                src={videoUrl}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />
            ) : (
              <div style={{ color: COLORS.textMuted, fontSize: 13 }}>No video uploaded</div>
            )}
          </div>

          {/* Transport bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 16 }}>
            <button type="button" onClick={handlePrevFrame} title="Previous frame" style={transportBtnStyle}>&#9198;</button>
            <button type="button" onClick={handlePlayPause} title={isPlaying ? "Pause" : "Play"} style={{ ...transportBtnStyle, color: COLORS.textPrimary, fontSize: 20 }}>
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button type="button" onClick={handleNextFrame} title="Next frame" style={transportBtnStyle}>&#9197;</button>
            <span style={{ fontSize: 12, color: COLORS.textMuted, fontVariantNumeric: "tabular-nums", marginLeft: 8 }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ width: 280, flexShrink: 0, padding: 20, backgroundColor: COLORS.card, borderLeft: `1px solid ${COLORS.cardBorder}`, overflowY: "auto" }}>
          {activeTool === "media" ? (
            <>
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 16px" }}>Media</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <UploadSlot label="Video" sublabel={videoFile ? videoFile.name : "Upload footage"} icon="🎥" onClick={() => videoInputRef.current?.click()} filled={!!videoFile} />
                <input ref={videoInputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)} />

                <UploadSlot label="Audio" sublabel={audioFile ? audioFile.name : "Upload a track"} icon="🎵" onClick={() => audioInputRef.current?.click()} filled={!!audioFile} />
                <input ref={audioInputRef} type="file" accept="audio/*" style={{ display: "none" }} onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)} />
              </div>
            </>
          ) : (
            <div style={{ fontSize: 13, color: COLORS.textMuted }}>
              {TOOLS.find((t) => t.id === activeTool)?.label} &mdash; coming soon.
            </div>
          )}
        </div>
      </div>

      {/* ---- Timeline ---- */}
      <div style={{ flexShrink: 0, borderTop: `1px solid ${COLORS.cardBorder}`, backgroundColor: COLORS.panelBg }}>
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

          {/* Video track */}
          <TrackShell label="Video" icon="🎥" onSplit={handleSplitVideo} splitDisabled={videoBlocks.length === 0}>
            {videoBlocks.length === 0 ? (
              <EmptyTrackHint text="No video uploaded" />
            ) : (
              <EditBlockRow
                blocks={videoBlocks}
                dragId={dragVideoId}
                onDragStart={setDragVideoId}
                onDrop={handleVideoDrop}
                onTrim={trimVideoBlock}
                renderContent={() => <span>Video</span>}
              />
            )}
          </TrackShell>

          {/* Audio track */}
          <TrackShell label="Audio" icon="🎵" onSplit={handleSplitAudio} splitDisabled={audioBlocks.length === 0}>
            {audioBlocks.length === 0 ? (
              <EmptyTrackHint text="No audio uploaded" />
            ) : (
              <EditBlockRow
                blocks={audioBlocks}
                dragId={dragAudioId}
                onDragStart={setDragAudioId}
                onDrop={handleAudioDrop}
                onTrim={trimAudioBlock}
                // TODO(phase 4): replace with bars derived from real audio analysis
                renderContent={() => <Waveform />}
              />
            )}
          </TrackShell>
        </div>
      </div>
    </div>
  );
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

function TrackShell({ label, icon, onSplit, splitDisabled, children }: { label: string; icon: string; onSplit: () => void; splitDisabled: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", borderBottom: `1px solid ${COLORS.cardBorder}` }}>
      <div style={{ width: 88, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 4, padding: "4px 10px", backgroundColor: COLORS.trackHeaderBg, borderRight: `1px solid ${COLORS.cardBorder}`, fontSize: 11, color: COLORS.textMuted }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span>&#128274;</span>
          <span>{icon}</span>
          <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>{label}</span>
        </div>
        <button
          type="button"
          onClick={onSplit}
          disabled={splitDisabled}
          title="Split at playhead"
          style={{ fontSize: 10, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 4, padding: "2px 6px", background: "transparent", color: splitDisabled ? COLORS.textMuted : COLORS.accent, opacity: splitDisabled ? 0.4 : 1, cursor: splitDisabled ? "not-allowed" : "pointer" }}
        >
          &#9986; Split
        </button>
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

function EditBlockRow({
  blocks,
  dragId,
  onDragStart,
  onDrop,
  onTrim,
  renderContent,
}: {
  blocks: EditBlock[];
  dragId: string | null;
  onDragStart: (id: string) => void;
  onDrop: (targetId: string) => void;
  onTrim: (id: string, side: "start" | "end", delta: number) => void;
  renderContent: (block: EditBlock) => React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", height: 56, width: "100%" }}>
      {blocks.map((b) => (
        <div
          key={b.id}
          draggable
          onDragStart={() => onDragStart(b.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.stopPropagation();
            onDrop(b.id);
          }}
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
            cursor: "grab",
            color: COLORS.accentText,
            fontSize: 11,
            fontWeight: 600,
            userSelect: "none",
          }}
          title="Drag to reorder"
        >
          <TrimHandle side="left" onDrag={(d) => onTrim(b.id, "start", d)} />
          {renderContent(b)}
          <TrimHandle side="right" onDrag={(d) => onTrim(b.id, "end", d)} />
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

// TODO(phase 4): replace with bars derived from real decoded-audio analysis
function Waveform() {
  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%", width: "100%", gap: 1, padding: "0 4px", pointerEvents: "none" }}>
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: `${20 + Math.abs(Math.sin(i * 0.6)) * 16}px`, backgroundColor: COLORS.panelBgDark, borderRadius: 1 }} />
      ))}
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
