"use client";

// app/tools/music-mixer/page.tsx
//
// PM Graphics — Music Mixer (free tool, MVP / Phase 1: "Smart Assist")
//
// Flow: upload 3–4 songs → see waveform + BPM → drag a region on each
// (auto-snaps to the beat) → hit Mix → get one downloadable track with
// automatic crossfades at every join. Everything runs in the browser;
// no upload to a server, no backend cost.

import { useState, useRef } from "react";
import Script from "next/script";
import WaveformTrack, { TrackSelection } from "@/components/music-mixer/WaveformTrack";
import WhatsAppCTA from "@/components/music-mixer/WhatsAppCTA";
import { mixTracks, ClipSelection } from "@/lib/music-mixer/ffmpegMix";
import Navbar from "@/components/Navbar";
import CybercoreBackground from "@/components/ui/cybercore-background";
import { Upload, Layers, Zap, Shield, Music2 } from "lucide-react";
import "@/components/audio-tools/audio-hero-bg.css";
import "./music-mixer.css";

const MAX_FILES = 4;

export interface TrackData {
  id: string;
  file: File;
  selection: TrackSelection | null;
}

export default function MusicMixerPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [mixing, setMixing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addFiles = (incoming: File[]) => {
    const newTracks = incoming.map((file) => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
      selection: null,
    }));
    setTracks((prev) => [...prev, ...newTracks]);
  };

  const removeTrack = (id: string) => {
    setTracks((prev) => prev.filter((t) => t.id !== id));
    setResultUrl(null);
  };

  const updateSelection = (id: string, selection: TrackSelection) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, selection } : t))
    );
    setResultUrl(null);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Slight delay to allow drag image to render before applying styles
    setTimeout(() => {
      const el = e.target as HTMLElement;
      if (el) el.classList.add("dragging");
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault(); // Necessary to allow dropping
    if (draggedIndex === null || draggedIndex === index) return;
    
    setTracks((prev) => {
      const copy = [...prev];
      const draggedItem = copy[draggedIndex];
      copy.splice(draggedIndex, 1);
      copy.splice(index, 0, draggedItem);
      return copy;
    });
    setDraggedIndex(index);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedIndex(null);
    const el = e.target as HTMLElement;
    if (el) el.classList.remove("dragging");
  };

  const canMix = tracks.length >= 2 && tracks.every((t) => t.selection !== null);

  const handleMix = async () => {
    setError(null);
    setResultUrl(null);
    setMixing(true);
    setProgress(0);
    // Note: loadProgress is intentionally NOT reset here. The ffmpeg engine
    // is cached after its first load (see ffmpegInstance in ffmpegMix.ts),
    // so onLoadProgress only ever fires on the very first mix of a session
    // — leaving it at whatever it settled on (1, i.e. 100%) means later
    // mixes go straight to "Mixing..." instead of flashing "Loading... 0%".
    try {
      const clips: ClipSelection[] = tracks.map((track) => ({
        file: track.file,
        start: track.selection!.start,
        end: track.selection!.end,
      }));
      const blob = await mixTracks({
        clips,
        crossfadeSeconds: 0.75,
        outputFormat: "mp3",
        onProgress: setProgress,
        onLoadProgress: setLoadProgress,
      });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Mixing failed. Try shorter selections and retry.");
    } finally {
      setMixing(false);
    }
  };

  return (
    <div className="tool-page-shell">
      <Navbar showBack backHref="/tools" />
      <Script src="/ffmpeg/ffmpeg.js" strategy="afterInteractive" />

      {/* ── Full-bleed Hero — NOT inside the max-width container ── */}
      <header className="mixer-header mixer-header--cybercore">
        <CybercoreBackground beamCount={40} />
        {/* Gradient overlay keeps text legible */}
        <div className="mixer-hero-overlay" />
        <div className="mixer-hero-content">
          <h1><span>Music Mixer</span><br /><span className="mixer-hero-line2">Beat Snap &amp; Mix.</span></h1>
          <p className="mixer-header__subtitle">
            Cut and blend songs into one track — cuts snap to the beat, transitions
            crossfade automatically.
          </p>
        </div>
      </header>

      {/* ── Page content — constrained max-width ── */}
      <main className="mixer-page">
        <section className="mixer-section mixer-section--upload" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            multiple
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files) addFiles(Array.from(e.target.files));
            }}
          />
          <button
            className="btn-mixer-upload"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={17} />
            Upload Audio File
          </button>
          {tracks.length > 0 && (
            <p style={{ marginTop: "12px", fontSize: "12px", color: "#a99f8f", fontFamily: '"JetBrains Mono", monospace' }}>
              {tracks.length} tracks added
            </p>
          )}
        </section>

        {tracks.length === 0 && (
          <div className="mm-features-row">
            <div className="mm-feature-item">
              <div className="mm-feature-icon">
                <Layers size={22} />
              </div>
              <div className="mm-feature-text">
                <h4>Beat-Synced Mixing</h4>
                <p>Cuts and transitions automatically snap to the beat.</p>
              </div>
            </div>
            <div className="mm-feature-item">
              <div className="mm-feature-icon">
                <Zap size={22} />
              </div>
              <div className="mm-feature-text">
                <h4>Fast Processing</h4>
                <p>Runs directly in your browser — no waiting for uploads.</p>
              </div>
            </div>
            <div className="mm-feature-item">
              <div className="mm-feature-icon">
                <Shield size={22} />
              </div>
              <div className="mm-feature-text">
                <h4>100% Private</h4>
                <p>Your tracks never leave your device.</p>
              </div>
            </div>
            <div className="mm-feature-item">
              <div className="mm-feature-icon">
                <Music2 size={22} />
              </div>
              <div className="mm-feature-text">
                <h4>Smooth Crossfades</h4>
                <p>Every join blends automatically for a seamless mix.</p>
              </div>
            </div>
          </div>
        )}

        {tracks.length === 0 && (
          <div className="mm-how-it-works">
            <h2>How It Works</h2>
            <div className="mm-how-divider" />
            <div className="mm-steps-row">
              <div className="mm-step-item">
                <div className="mm-step-number">1</div>
                <div className="mm-step-text">
                  <h4>Upload Songs</h4>
                  <p>Add 2–4 tracks — any length, any source.</p>
                </div>
              </div>
              <div className="mm-step-item">
                <div className="mm-step-number">2</div>
                <div className="mm-step-text">
                  <h4>Set Cut Points</h4>
                  <p>Drag a region on each waveform — it auto-snaps to the beat.</p>
                </div>
              </div>
              <div className="mm-step-item">
                <div className="mm-step-number">3</div>
                <div className="mm-step-text">
                  <h4>Mix &amp; Download</h4>
                  <p>Get one track with automatic crossfades at every join.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tracks.length > 0 && (
          <section className="mixer-section">
            <h2 className="mixer-section__title" style={{ fontSize: "18px", marginBottom: "16px" }}>Set Cut Points</h2>
            
            <div className="mixer-tracklist">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  className="mixer-track-wrapper"
                >
                  <div className="mixer-track-content">
                    <WaveformTrack
                      id={track.id}
                      trackNumber={index + 1}
                      file={track.file}
                      onSelectionChange={updateSelection}
                      onRemove={removeTrack}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tracks.length > 0 && (
          <section className="mixer-section">
            <h2 className="mixer-section__title">3. Mix &amp; download</h2>
            <div className="mixer-action">
              <button
                type="button"
                className="mixer-action__button"
                disabled={!canMix || mixing}
                onClick={handleMix}
              >
                {mixing
                  ? (progress === 0 && loadProgress < 1
                      ? `Loading audio engine… ${Math.round(loadProgress * 100)}%`
                      : `Mixing… ${Math.round(progress * 100)}%`)
                  : "Mix tracks"}
              </button>
              {!canMix && tracks.length >= 2 && (
                <p className="mixer-action__hint">Pick a start/end on every song to continue.</p>
              )}
              {error && <p className="mixer-action__error">{error}</p>}
            </div>
          </section>
        )}

        {resultUrl && (
          <div className="mixer-result">
            <audio controls src={resultUrl} className="mixer-result__player" />
            <a href={resultUrl} download="pm-graphics-mix.mp3" className="mixer-result__download">
              Download MP3
            </a>
          </div>
        )}

        <div className="mixer-cta">
          <WhatsAppCTA toolName="Music Mixer" phoneNumber="919101811613" />
        </div>
      </main>
    </div>
  );
}
