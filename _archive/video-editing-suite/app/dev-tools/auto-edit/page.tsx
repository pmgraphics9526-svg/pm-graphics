"use client";

/**
 * Auto Short Video Edit — /dev-tools/auto-edit
 *
 * PHASE 0/1 SCOPE: UI shell only. All state transitions are simulated with
 * setTimeout/mock data so the flow can be reviewed end-to-end before any
 * real logic (MediaPipe tracking, beat detection, ffmpeg render, Razorpay)
 * is wired in. Search "TODO(phase" for every stub.
 *
 * STYLING: inline `style` props only — this project has no Tailwind
 * installed (confirmed during Phase 0 review), so this matches the
 * project's actual convention instead of assuming a framework.
 *
 * STEP 3 VISUAL NOTE: the editor panel below is styled to visually
 * resemble a professional NLE (Premiere-style dark panels, program
 * monitor, track rows, transport bar) per direct reference request.
 * Functionally it is intentionally limited to:
 *   1. Playing the actual uploaded video in the program monitor, with
 *      basic transport controls (play/pause, step, jump to start/end).
 *   2. Reordering AI-detected segments (drag left/right) within a track,
 *      and moving a segment between the V1/V2 tracks (drag onto the
 *      other row).
 *   3. Trimming a segment's start/end (drag its edge handles).
 * There is no real multi-track compositing (no overlay/blend/opacity
 * between V1 and V2 — this is a visual/structural 2-track layout only),
 * no clip import, no effects — the extra visual chrome (lock/eye icons,
 * track labels, ruler) is decorative to match the reference look.
 */

import { useCallback, useEffect, useRef, useState } from "react";

// ---- Design tokens ----
const COLORS = {
  bg: "#141210",
  card: "#1c1a17",
  cardBorder: "#2a2621",
  accent: "#e0995e",
  accentText: "#1c1a17",
  textPrimary: "#f5f1ea",
  textMuted: "#a89f92",
  danger: "#e07a5f",
  whatsapp: "#25D366",
  // Premiere-style panel tones (neutral, separate from brand accent above)
  panelBg: "#1e1c1a",
  panelBgDark: "#141210",
  trackHeaderBg: "#221f1c",
  trackRowBg: "#181614",
  ruler: "#3a352f",
};

type Stage = "upload" | "analyzing" | "preview" | "paying" | "rendering" | "done";
type AudioSource = "existing-mix" | "new-upload" | null;
type TrackId = "V1" | "V2";

interface Segment {
  id: string;
  label: string;
  widthPct: number; // relative width within its track's row (flex-grow basis)
  trimStart: number; // 0-1 fraction trimmed off the left
  trimEnd: number; // 0-1 fraction trimmed off the right
  track: TrackId;
}

const initialSegments = (): Segment[] => [
  { id: "seg-1", label: "Clip 1", widthPct: 22, trimStart: 0, trimEnd: 0, track: "V1" },
  { id: "seg-2", label: "Clip 2", widthPct: 18, trimStart: 0, trimEnd: 0, track: "V1" },
  { id: "seg-3", label: "Clip 3", widthPct: 25, trimStart: 0, trimEnd: 0, track: "V1" },
  { id: "seg-4", label: "Clip 4", widthPct: 20, trimStart: 0, trimEnd: 0, track: "V2" },
  { id: "seg-5", label: "Clip 5", widthPct: 15, trimStart: 0, trimEnd: 0, track: "V2" },
];

export default function AutoEditPage() {
  const [stage, setStage] = useState<Stage>("upload");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioSource, setAudioSource] = useState<AudioSource>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [analyzeLabel, setAnalyzeLabel] = useState("");
  const [trackingStrength, setTrackingStrength] = useState(50);
  const [cutFrequency, setCutFrequency] = useState(50);
  const [autoTransitions, setAutoTransitions] = useState(true);
  const [watermark, setWatermark] = useState(true);
  const [renderProgress, setRenderProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [segments, setSegments] = useState<Segment[]>(initialSegments);
  const [dragId, setDragId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  const canAnalyze = videoFile && (audioSource === "existing-mix" || audioFile);

  // ---- Program monitor: object URL for the uploaded video file ----
  useEffect(() => {
    if (!videoFile) {
      setVideoUrl(null);
      return;
    }
    const url = URL.createObjectURL(videoFile);
    setVideoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  // ---- TODO(phase 2): replace with real MediaPipe + BPM detection ----
  const runAnalysis = useCallback(() => {
    setErrorMsg(null);
    setStage("analyzing");
    setAnalyzeProgress(0);
    setAnalyzeLabel("Detecting beats...");
    const steps: [number, string][] = [
      [25, "Detecting beats..."],
      [55, "Tracking subject..."],
      [85, "Building segments..."],
      [100, "Ready"],
    ];
    let i = 0;
    const tick = () => {
      if (i >= steps.length) {
        setSegments(initialSegments());
        setStage("preview");
        return;
      }
      const [pct, label] = steps[i];
      setAnalyzeProgress(pct);
      setAnalyzeLabel(label);
      i += 1;
      setTimeout(tick, 550);
    };
    tick();
  }, []);

  // ---- TODO(phase 3): replace with real Razorpay checkout + verify-payment ----
  const startPayment = useCallback(() => {
    setStage("paying");
    setTimeout(() => {
      setStage("rendering");
      setRenderProgress(0);
      const tick = (pct: number) => {
        if (pct >= 100) {
          setStage("done");
          return;
        }
        setRenderProgress(pct);
        setTimeout(() => tick(pct + 12), 400);
      };
      tick(0);
    }, 1200);
  }, []);

  const reset = () => {
    setStage("upload");
    setVideoFile(null);
    setAudioSource(null);
    setAudioFile(null);
    setAnalyzeProgress(0);
    setRenderProgress(0);
    setErrorMsg(null);
    setSegments(initialSegments());
  };

  // ---- Reorder within a track, and move between V1/V2 (native HTML5 drag/drop) ----
  const handleDragStart = (id: string) => setDragId(id);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  // Dropped directly onto another segment: reorder within its track, or move
  // tracks and insert at that segment's position.
  const handleDropOnSegment = (targetId: string, targetTrack: TrackId) => {
    if (!dragId || dragId === targetId) return;
    setSegments((prev) => {
      const dragged = prev.find((s) => s.id === dragId);
      if (!dragged) return prev;
      const withoutDragged = prev.filter((s) => s.id !== dragId);
      const targetIndex = withoutDragged.findIndex((s) => s.id === targetId);
      const moved: Segment = { ...dragged, track: targetTrack };
      const next = [...withoutDragged];
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setDragId(null);
  };

  // Dropped on empty row space: move to that track, appended at the end.
  const handleDropOnRow = (targetTrack: TrackId) => {
    if (!dragId) return;
    setSegments((prev) => {
      const dragged = prev.find((s) => s.id === dragId);
      if (!dragged) return prev;
      if (dragged.track === targetTrack) return prev; // already in this row, no-op
      const withoutDragged = prev.filter((s) => s.id !== dragId);
      const moved: Segment = { ...dragged, track: targetTrack };
      return [...withoutDragged, moved];
    });
    setDragId(null);
  };

  // ---- Trim (drag edge handle to shrink a segment's effective width) ----
  const trimSegment = (id: string, side: "start" | "end", deltaFraction: number) => {
    setSegments((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (side === "start") {
          const next = Math.min(0.4, Math.max(0, s.trimStart + deltaFraction));
          return { ...s, trimStart: next };
        }
        const next = Math.min(0.4, Math.max(0, s.trimEnd + deltaFraction));
        return { ...s, trimEnd: next };
      })
    );
  };

  // ---- Transport controls (basic play/pause + skip on the program monitor) ----
  const handlePlayPause = () => {
    const v = previewVideoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };
  const handleSkipStart = () => {
    if (previewVideoRef.current) previewVideoRef.current.currentTime = 0;
  };
  const handleStepBack = () => {
    const v = previewVideoRef.current;
    if (v) v.currentTime = Math.max(0, v.currentTime - 5);
  };
  const handleStepForward = () => {
    const v = previewVideoRef.current;
    if (v) v.currentTime = Math.min(v.duration || v.currentTime + 5, v.currentTime + 5);
  };
  const handleSkipEnd = () => {
    const v = previewVideoRef.current;
    if (v && Number.isFinite(v.duration)) v.currentTime = v.duration;
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%", backgroundColor: COLORS.bg, color: COLORS.textPrimary }}>
      <div style={{ maxWidth: stage === "preview" ? "95vw" : 640, margin: "0 auto", padding: "64px 24px" }}>
        <header style={{ marginBottom: 48, textAlign: "center", maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
          <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
            Auto Short <span style={{ color: COLORS.accent }}>Video Edit</span>
          </h1>
          <p style={{ margin: "16px auto 0", maxWidth: 460, color: COLORS.textMuted, fontSize: 16 }}>
            Upload your raw clip and a track — get a polished, beat-synced reel back. No editing skills required.
          </p>
        </header>

        {errorMsg && (
          <div style={{ marginBottom: 24, borderRadius: 12, border: `1px solid ${COLORS.danger}`, padding: "12px 16px", color: COLORS.danger, fontSize: 14 }}>
            {errorMsg}
          </div>
        )}

        {stage === "upload" && (
          <Card>
            <StepLabel n={1} title="Upload" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <UploadSlot label="Video" sublabel={videoFile ? videoFile.name : "Raw footage, unedited"} icon="🎥" onClick={() => videoInputRef.current?.click()} filled={!!videoFile} />
              <input ref={videoInputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)} />

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <UploadSlot
                  label="Audio"
                  sublabel={audioSource === "existing-mix" ? "Using your Music Mixer track" : audioFile ? audioFile.name : "Choose a track"}
                  icon="🎵"
                  onClick={() => audioInputRef.current?.click()}
                  filled={!!audioSource}
                />
                <input ref={audioInputRef} type="file" accept="audio/*" style={{ display: "none" }} onChange={(e) => { setAudioFile(e.target.files?.[0] ?? null); setAudioSource("new-upload"); }} />
                <button
                  type="button"
                  onClick={() => { setAudioSource("existing-mix"); setAudioFile(null); }}
                  style={{ borderRadius: 8, border: `1px solid ${COLORS.cardBorder}`, padding: "8px 12px", textAlign: "left", fontSize: 12, color: COLORS.textMuted, background: "transparent", cursor: "pointer" }}
                >
                  or use your last Music Mixer track
                </button>
              </div>
            </div>
            <PrimaryButton disabled={!canAnalyze} onClick={runAnalysis} full style={{ marginTop: 32 }}>
              Analyze
            </PrimaryButton>
          </Card>
        )}

        {stage === "analyzing" && (
          <Card>
            <StepLabel n={2} title="Analyzing" />
            <p style={{ marginBottom: 16, fontSize: 14, color: COLORS.textMuted }}>{analyzeLabel}</p>
            <ProgressBar percent={analyzeProgress} />
          </Card>
        )}

        {/* ---- Step 3: Premiere-style editor panel ---- */}
        {stage === "preview" && (
          <div style={{ borderRadius: 12, border: `1px solid ${COLORS.cardBorder}`, overflow: "hidden", backgroundColor: COLORS.panelBg }}>
            {/* Panel title bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", backgroundColor: COLORS.trackHeaderBg, borderBottom: `1px solid ${COLORS.cardBorder}` }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: COLORS.accent, color: COLORS.accentText, fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>3</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Preview &amp; adjust</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: COLORS.textMuted }}>00:00:00:00</span>
            </div>

            {/* Program monitor */}
            <div style={{ padding: 20, backgroundColor: COLORS.panelBgDark }}>
              <div style={{ aspectRatio: "16 / 9", maxHeight: 360, maxWidth: 640, margin: "0 auto", border: `1px solid ${COLORS.cardBorder}`, borderRadius: 6, overflow: "hidden", backgroundColor: "#000" }}>
                {videoUrl ? (
                  <video
                    ref={previewVideoRef}
                    src={videoUrl}
                    controls
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.textMuted, fontSize: 13 }}>
                    No video uploaded
                  </div>
                )}
              </div>
              {/* Transport bar */}
              <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 12 }}>
                <button type="button" onClick={handleSkipStart} title="Jump to start" style={transportBtnStyle}>⏮</button>
                <button type="button" onClick={handleStepBack} title="Back 5s" style={transportBtnStyle}>◀</button>
                <button type="button" onClick={handlePlayPause} title={isPlaying ? "Pause" : "Play"} style={{ ...transportBtnStyle, color: COLORS.textPrimary }}>
                  {isPlaying ? "⏸" : "▶"}
                </button>
                <button type="button" onClick={handleStepForward} title="Forward 5s" style={transportBtnStyle}>▶</button>
                <button type="button" onClick={handleSkipEnd} title="Jump to end" style={transportBtnStyle}>⏭</button>
              </div>
            </div>

            {/* Timeline panel */}
            <div style={{ borderTop: `1px solid ${COLORS.cardBorder}` }}>
              {/* Ruler */}
              <div style={{ display: "flex", paddingLeft: 88, height: 24, alignItems: "flex-end", borderBottom: `1px solid ${COLORS.cardBorder}`, backgroundColor: COLORS.trackHeaderBg }}>
                {["00:00", "00:04", "00:08", "00:12", "00:16", "00:20"].map((t) => (
                  <span key={t} style={{ flex: 1, fontSize: 10, color: COLORS.textMuted, borderLeft: `1px solid ${COLORS.ruler}`, paddingLeft: 4 }}>
                    {t}
                  </span>
                ))}
              </div>

              {/* V1 / V2 — two independent, drag-reorderable + drag-between video tracks */}
              <TrackRow label="V1" icon="🎬">
                <SegmentTrack
                  track="V1"
                  segments={segments}
                  dragId={dragId}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDropOnSegment={handleDropOnSegment}
                  onDropOnRow={handleDropOnRow}
                  onTrim={trimSegment}
                />
              </TrackRow>
              <TrackRow label="V2" icon="🎬">
                <SegmentTrack
                  track="V2"
                  segments={segments}
                  dragId={dragId}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDropOnSegment={handleDropOnSegment}
                  onDropOnRow={handleDropOnRow}
                  onTrim={trimSegment}
                />
              </TrackRow>

              {/* A1 track — decorative only, mirrors the chosen audio */}
              <TrackRow label="A1" icon="🎵">
                <div style={{ display: "flex", alignItems: "center", height: 40, width: "100%", gap: 1, padding: "0 4px" }}>
                  {Array.from({ length: 80 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 2,
                        height: `${20 + Math.abs(Math.sin(i * 0.5)) * 16}px`,
                        backgroundColor: COLORS.cardBorder,
                        borderRadius: 1,
                      }}
                    />
                  ))}
                </div>
              </TrackRow>
            </div>

            {/* Controls + actions */}
            <div style={{ padding: 20, backgroundColor: COLORS.card }}>
              <div style={{ display: "grid", gap: 20 }}>
                <SliderRow label="Tracking strength" leftLabel="Loose" rightLabel="Tight" value={trackingStrength} onChange={setTrackingStrength} />
                <SliderRow label="Cut frequency" leftLabel="Slow" rightLabel="Fast" value={cutFrequency} onChange={setCutFrequency} />
                <CheckboxRow label="Auto-transitions on beat drops" checked={autoTransitions} onChange={setAutoTransitions} />
                <CheckboxRow label="PM Graphics watermark" checked={watermark} onChange={setWatermark} />
              </div>
              <PrimaryButton onClick={startPayment} full style={{ marginTop: 24 }}>
                Generate Full Video — ₹500
              </PrimaryButton>
            </div>
          </div>
        )}

        {(stage === "paying" || stage === "rendering") && (
          <Card>
            <StepLabel n={4} title="Generate" />
            {stage === "paying" ? (
              <p style={{ fontSize: 14, color: COLORS.textMuted }}>Opening payment...</p>
            ) : (
              <>
                <p style={{ marginBottom: 16, fontSize: 14, color: COLORS.textMuted }}>Rendering final video... {renderProgress}%</p>
                <ProgressBar percent={renderProgress} />
              </>
            )}
          </Card>
        )}

        {stage === "done" && (
          <Card>
            <StepLabel n={5} title="Download" />
            <div style={{ marginBottom: 24, display: "flex", aspectRatio: "9 / 16", maxHeight: 320, alignItems: "center", justifyContent: "center", borderRadius: 12, border: `1px solid ${COLORS.cardBorder}`, fontSize: 14, color: COLORS.textMuted }}>
              Final video
            </div>
            <PrimaryButton onClick={() => {}} full>Download</PrimaryButton>
            <a
              href="https://wa.me/91XXXXXXXXXX?text=Hi%2C%20I%20used%20Auto%20Edit%20on%20your%20site%2C%20I%20need%20custom%2Fprofessional%20work"
              target="_blank"
              rel="noreferrer"
              style={{ marginTop: 12, display: "block", width: "100%", borderRadius: 12, padding: "12px 0", textAlign: "center", fontSize: 14, fontWeight: 600, backgroundColor: COLORS.whatsapp, color: "#0b1a10", textDecoration: "none" }}
            >
              Chat on WhatsApp
            </a>
            <button type="button" onClick={reset} style={{ marginTop: 16, width: "100%", textAlign: "center", fontSize: 12, color: COLORS.textMuted, background: "transparent", border: "none", cursor: "pointer" }}>
              Start another edit
            </button>
          </Card>
        )}
      </div>
    </div>
  );

  // ---------------------------------------------------------------------
  function Card({ children }: { children: React.ReactNode }) {
    return (
      <div style={{ borderRadius: 16, border: `1px solid ${COLORS.cardBorder}`, backgroundColor: COLORS.card, padding: 32 }}>
        {children}
      </div>
    );
  }

  function StepLabel({ n, title }: { n: number; title: string }) {
    return (
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: COLORS.accent, color: COLORS.accentText, fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{n}</span>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{title}</h2>
      </div>
    );
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

  function PrimaryButton({ children, onClick, disabled, full, style: extraStyle }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; full?: boolean; style?: React.CSSProperties }) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        style={{ borderRadius: 12, padding: "12px 0", fontSize: 14, fontWeight: 600, border: "none", width: full ? "100%" : undefined, backgroundColor: COLORS.accent, color: COLORS.accentText, opacity: disabled ? 0.4 : 1, cursor: disabled ? "not-allowed" : "pointer", ...extraStyle }}
      >
        {children}
      </button>
    );
  }

  function ProgressBar({ percent }: { percent: number }) {
    return (
      <div style={{ height: 8, width: "100%", overflow: "hidden", borderRadius: 999, backgroundColor: COLORS.cardBorder }}>
        <div style={{ height: "100%", borderRadius: 999, width: `${percent}%`, backgroundColor: COLORS.accent, transition: "width 300ms" }} />
      </div>
    );
  }

  function SliderRow({ label, leftLabel, rightLabel, value, onChange }: { label: string; leftLabel: string; rightLabel: string; value: number; onChange: (v: number) => void }) {
    return (
      <div>
        <div style={{ marginBottom: 4, fontSize: 12, color: COLORS.textMuted }}>{label}</div>
        <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: "100%", accentColor: COLORS.accent }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: COLORS.textMuted }}>
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      </div>
    );
  }

  function CheckboxRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
      <label style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, cursor: "pointer" }}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ width: 16, height: 16, accentColor: COLORS.accent }} />
        {label}
      </label>
    );
  }

  function TrackRow({ label, icon, children }: { label: string; icon: string; children: React.ReactNode }) {
    return (
      <div style={{ display: "flex", borderBottom: `1px solid ${COLORS.cardBorder}` }}>
        <div style={{ width: 88, flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "0 10px", backgroundColor: COLORS.trackHeaderBg, borderRight: `1px solid ${COLORS.cardBorder}`, fontSize: 11, color: COLORS.textMuted }}>
          <span>🔒</span>
          <span>{icon}</span>
          <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>{label}</span>
        </div>
        <div style={{ flex: 1, backgroundColor: COLORS.trackRowBg, padding: "0 4px" }}>{children}</div>
      </div>
    );
  }

  function SegmentTrack({
    track,
    segments: allSegments,
    dragId: draggedId,
    onDragStart: onSegDragStart,
    onDragOver: onSegDragOver,
    onDropOnSegment,
    onDropOnRow,
    onTrim,
  }: {
    track: TrackId;
    segments: Segment[];
    dragId: string | null;
    onDragStart: (id: string) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDropOnSegment: (targetId: string, targetTrack: TrackId) => void;
    onDropOnRow: (targetTrack: TrackId) => void;
    onTrim: (id: string, side: "start" | "end", deltaFraction: number) => void;
  }) {
    const rowSegments = allSegments.filter((s) => s.track === track);
    return (
      <div
        style={{ display: "flex", height: 56, width: "100%" }}
        onDragOver={onSegDragOver}
        onDrop={() => onDropOnRow(track)}
      >
        {rowSegments.map((seg) => (
          <div
            key={seg.id}
            draggable
            onDragStart={() => onSegDragStart(seg.id)}
            onDragOver={onSegDragOver}
            onDrop={(e) => {
              e.stopPropagation();
              onDropOnSegment(seg.id, track);
            }}
            style={{
              position: "relative",
              flexGrow: seg.widthPct,
              flexBasis: 0,
              margin: "4px 2px",
              borderRadius: 4,
              backgroundColor: COLORS.accent,
              opacity: (draggedId === seg.id ? 0.4 : 0.85) - seg.trimStart * 0.3 - seg.trimEnd * 0.3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "grab",
              color: COLORS.accentText,
              fontSize: 11,
              fontWeight: 600,
              userSelect: "none",
            }}
            title="Drag to reorder, or drag onto the other track row to move it there"
          >
            {/* Trim handles */}
            <TrimHandle side="left" onDrag={(d) => onTrim(seg.id, "start", d)} />
            {seg.label}
            <TrimHandle side="right" onDrag={(d) => onTrim(seg.id, "end", d)} />
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
        const delta = (ev.clientX - startX.current) / 400; // arbitrary sensitivity
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
        // Sits inside a draggable=true segment. React's stopPropagation()
        // above only stops React's own synthetic bubbling — it does NOT
        // stop the browser's native HTML5 drag-gesture detection on the
        // ancestor, which would otherwise hijack a trim-drag into a
        // reorder-drag. draggable={false} + dragstart preventDefault is
        // the standard way to carve out a non-draggable "island" like this.
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        style={{
          position: "absolute",
          [side]: 0,
          top: 0,
          bottom: 0,
          width: 6,
          cursor: "ew-resize",
          backgroundColor: "rgba(0,0,0,0.25)",
        } as React.CSSProperties}
        title="Drag to trim"
      />
    );
  }
}

const transportBtnStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: COLORS.textMuted,
  fontSize: 16,
  cursor: "pointer",
  padding: 4,
  lineHeight: 1,
};
