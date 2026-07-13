"use client";

// app/tools/vocal-remover/page.jsx
//
// PM Graphics — Vocal Remover (free tool)
//
// Flow: upload a song → "Remove Vocals" → (one-time model download, then
// per-chunk processing) → download the instrumental. Runs fully client-side:
// MDX-Net separation via onnxruntime-web (WASM), final MP3 encode via
// ffmpeg.wasm. See lib/vocal-remover/mdxSeparate.js for the pipeline.
//
// Isolated addition — does not import from or modify Music Mixer, Audio
// Trim, or Noise Reduce.

import React, { useState, useEffect, useRef } from "react";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import WhatsAppCTA from "@/components/music-mixer/WhatsAppCTA";
import SimpleWaveform from "@/components/audio-tools/SimpleWaveform";
import { removeVocals } from "@/lib/vocal-remover/mdxSeparate";
import {
  Upload,
  Mic2,
  Shield,
  Zap,
  Cpu,
  Download,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { AudioWaveScroll } from "@/components/audio-tools/HeroIllustrations";
import "@/components/audio-tools/audio-hero-bg.css";
import "../music-mixer/music-mixer.css";
import "../noise-reduce/noise-reduce.css";
import "./vocal-remover.css";

const PHASE_LABEL = {
  "loading-model": "Loading separation model (one-time download, ~65MB)…",
  decoding: "Reading audio…",
  processing: "Processing your song…",
  encoding: "Encoding MP3…",
};

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VocalRemoverPage() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [instrumentalUrl, setInstrumentalUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [phase, setPhase] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [selection, setSelection] = useState(null);
  const [duration, setDuration] = useState(null);
  const [processedRange, setProcessedRange] = useState(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);
      setInstrumentalUrl(null);
      setError(null);
      setSelection(null);
      setDuration(null);
      setProcessedRange(null);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleRemoveVocals = async () => {
    if (!file) return;
    try {
      setError(null);
      setIsProcessing(true);
      setPhase("loading-model");
      setProgress(0);
      const trimRange = selection ? { start: selection.start, end: selection.end } : null;
      const blob = await removeVocals(
        file,
        (nextPhase, ratio) => {
          setPhase(nextPhase);
          setProgress(ratio);
        },
        trimRange
      );
      const url = URL.createObjectURL(blob);
      setInstrumentalUrl(url);
      setProcessedRange(trimRange);
    } catch (err) {
      console.error("Vocal removal failed:", err);
      setError(
        err?.message || "Failed to remove vocals. See console for details."
      );
    } finally {
      setIsProcessing(false);
      setPhase(null);
      setProgress(0);
    }
  };

  const handleStartOver = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (instrumentalUrl) URL.revokeObjectURL(instrumentalUrl);
    setFile(null);
    setOriginalUrl(null);
    setInstrumentalUrl(null);
    setError(null);
    setSelection(null);
    setDuration(null);
    setProcessedRange(null);
  };

  const handleDownload = () => {
    if (!instrumentalUrl || !file) return;
    const a = document.createElement("a");
    a.href = instrumentalUrl;
    a.download = `instrumental_${file.name.replace(/\.[^/.]+$/, "")}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="tool-page-shell noise-reduce-page vocal-remover-page">
      <Navbar showBack backHref="/tools" />
      <Script src="/ffmpeg/ffmpeg.js" strategy="afterInteractive" />
      {/* onnxruntime-web (ort.wasm.min.js) is loaded inside separation.worker.js
          via importScripts, not here — separation runs off the main thread. */}

      {/* ── Hero ── */}
      <header className="noise-reduce-hero">
        <div className="tool-hero-content">
          <AudioWaveScroll />
          <h1>
            <span>Vocal Remover.</span> No Vocals.
          </h1>
          <p>
            Strip the vocals from any song — right in your browser, no upload.
          </p>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="noise-reduce-container">
        {/* ── EMPTY STATE ── */}
        {!file && (
          <>
            <div className="noise-reduce-actions">
              <input
                type="file"
                accept="audio/*"
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{ display: "none" }}
              />
              <button
                className="btn-nr-primary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={17} />
                Upload Audio File
              </button>
            </div>
            <p
              style={{
                textAlign: "center",
                color: "#4a453c",
                fontSize: "12px",
                fontFamily: '"JetBrains Mono", monospace',
                letterSpacing: "0.06em",
                marginTop: "14px",
              }}
            >
              Accepts MP3 or WAV
            </p>

            {/* Feature Strip */}
            <div className="nr-features-row">
              <div className="nr-feature-item">
                <div className="nr-feature-icon">
                  <Mic2 size={22} />
                </div>
                <div className="nr-feature-text">
                  <h4>AI Vocal Separation</h4>
                  <p>MDX-Net neural network isolates and removes lead vocals.</p>
                </div>
              </div>
              <div className="nr-feature-item">
                <div className="nr-feature-icon">
                  <Cpu size={22} />
                </div>
                <div className="nr-feature-text">
                  <h4>Runs On-Device</h4>
                  <p>The model downloads once, then every song processes locally.</p>
                </div>
              </div>
              <div className="nr-feature-item">
                <div className="nr-feature-icon">
                  <Shield size={22} />
                </div>
                <div className="nr-feature-text">
                  <h4>100% Private</h4>
                  <p>Your audio never leaves your device.</p>
                </div>
              </div>
              <div className="nr-feature-item">
                <div className="nr-feature-icon">
                  <Zap size={22} />
                </div>
                <div className="nr-feature-text">
                  <h4>No Upload Wait</h4>
                  <p>No server round-trip — processing starts immediately.</p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="nr-how-it-works">
              <h2>How It Works</h2>
              <div className="nr-how-divider" />
              <div className="nr-steps-row">
                <div className="nr-step-item">
                  <div className="nr-step-number">1</div>
                  <div className="nr-step-text">
                    <h4>Upload a Song</h4>
                    <p>Drop your MP3 or WAV — any track, any genre.</p>
                  </div>
                </div>
                <div className="nr-step-item">
                  <div className="nr-step-number">2</div>
                  <div className="nr-step-text">
                    <h4>Remove Vocals</h4>
                    <p>
                      The first run downloads the separation model once
                      (~65MB), then every song after that processes without
                      re-downloading.
                    </p>
                  </div>
                </div>
                <div className="nr-step-item">
                  <div className="nr-step-number">3</div>
                  <div className="nr-step-text">
                    <h4>Download Instrumental</h4>
                    <p>Preview the result, then download the instrumental MP3.</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── POST-UPLOAD, PRE-PROCESSED: trim + process ── */}
        {file && !instrumentalUrl && (
          <div className="noise-comparison-container vr-trim-container">
            {/* Filename is already shown in the SimpleWaveform header below —
                this bar just surfaces file size; SimpleWaveform's own "×"
                handles removal. */}
            <div className="noise-comparison-header vr-trim-header">
              <span className="vr-trim-header-size">{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
            </div>

            <SimpleWaveform
              file={file}
              onSelectionChange={setSelection}
              onRemove={handleStartOver}
              fullLengthByDefault
              onDurationReady={setDuration}
            />

            <p className="vr-trim-hint">
              {selection && duration
                ? selection.start <= 0.05 && selection.end >= duration - 0.05
                  ? "Processing the full song. Drag the waveform handles above to trim to a shorter clip and speed things up."
                  : `Only ${formatTime(selection.end - selection.start)} (${formatTime(
                      selection.start
                    )}–${formatTime(selection.end)}) will be processed — trimming shortens processing time.`
                : "Drag the waveform handles to select a shorter clip, or leave it at full length to process the whole song."}
            </p>

            {selection && selection.end - selection.start > 30 && (
              <p className="vr-length-warning">
                <AlertTriangle size={13} />
                Longer clips take proportionally more time to process — for best results, keep clips
                under 30 seconds.
              </p>
            )}

            <div className="nr-action-bar">
              {isProcessing ? (
                <div className="nr-progress-wrap">
                  <div className="vr-progress-row">
                    <span className="vr-spinner" aria-hidden="true" />
                    <div className="nr-progress-bar-track vr-progress-bar-track">
                      <div
                        className="nr-progress-bar-fill"
                        style={{ width: `${Math.round(progress * 100)}%` }}
                      />
                    </div>
                  </div>
                  <p className="nr-progress-label">
                    {PHASE_LABEL[phase] || "Working…"}{" "}
                    {phase && phase !== "decoding" ? `${Math.round(progress * 100)}%` : ""}
                  </p>
                  {phase === "processing" && (
                    <p className="vr-processing-hint">
                      This can take a few minutes for longer tracks. Please keep this tab open.
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <button
                    className="btn-nr-primary"
                    onClick={handleRemoveVocals}
                    disabled={isProcessing || !selection}
                  >
                    <Mic2 size={17} />
                    Remove Vocals
                  </button>
                  <button className="btn-nr-ghost" onClick={handleStartOver}>
                    <RotateCcw size={14} style={{ marginRight: 6 }} />
                    Change File
                  </button>
                </>
              )}
              {error && <p className="mixer-action__error">{error}</p>}
            </div>
          </div>
        )}

        {/* ── RESULT STATE ── */}
        {file && instrumentalUrl && (
          <div className="noise-comparison-container">
            <div className="noise-comparison-header">
              <h3>
                {file.name.length > 40
                  ? file.name.slice(0, 40) + "…"
                  : file.name}
              </h3>
              <div className="noise-comparison-header-right">
                <span>{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                <button
                  type="button"
                  className="noise-comparison-remove"
                  onClick={handleStartOver}
                  title="Remove file"
                  aria-label="Remove file"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="noise-comparison-grid">
              <div className="audio-player-wrapper">
                <h3>
                  Original
                  {processedRange && duration
                    ? ` — ${formatTime(processedRange.start)}–${formatTime(processedRange.end)} of ${formatTime(duration)}`
                    : ""}
                </h3>
                {originalUrl && <audio src={originalUrl} controls />}
              </div>
              <div className="audio-player-wrapper">
                <h3>Instrumental</h3>
                <audio src={instrumentalUrl} controls />
              </div>
            </div>

            <div className="nr-action-bar">
              <button className="btn-nr-primary" onClick={handleDownload}>
                <Download size={17} />
                Download Instrumental MP3
              </button>
              <button className="btn-nr-ghost" onClick={handleStartOver}>
                <RotateCcw size={14} style={{ marginRight: 6 }} />
                Try Another Song
              </button>
            </div>
          </div>
        )}

        <div className="mixer-cta vocal-remover-cta">
          <WhatsAppCTA toolName="Vocal Remover" phoneNumber="919101811613" />
        </div>
      </main>
    </div>
  );
}
