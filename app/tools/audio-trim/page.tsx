"use client";

import React, { useState, useRef } from "react";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import WhatsAppCTA from "@/components/music-mixer/WhatsAppCTA";
import SimpleWaveform, { TrackSelection } from "@/components/audio-tools/SimpleWaveform";
import { trimAudio } from "@/lib/music-mixer/ffmpegMix";
import { Download, Scissors, Zap, Shield, Music2, Upload } from "lucide-react";
import { AudioWaveScroll } from "@/components/audio-tools/HeroIllustrations";
import "@/components/audio-tools/audio-hero-bg.css";
import "../music-mixer/music-mixer.css";
import "./audio-trim.css";

export default function AudioTrimPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [selection, setSelection] = useState<TrackSelection | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleTrimAndDownload = async () => {
    if (!file || !selection) return;

    try {
      setIsProcessing(true);
      setProgress(0);

      const blob = await trimAudio(file, selection.start, selection.end, "mp3", (ratio) => {
        setProgress(ratio);
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `trimmed_${file.name.replace(/\.[^/.]+$/, "")}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Trim failed:", err);
      alert("Failed to trim audio. See console for details.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="tool-page-shell">
      <Navbar showBack backHref="/tools" />
      <Script src="/ffmpeg/ffmpeg.js" strategy="afterInteractive" />

      {/* ── Full-bleed Hero ── */}
      <header className="audio-trim-hero audio-hero-bg">
        <div className="tool-hero-content">
          <AudioWaveScroll />
          <h1><span>Audio Trim.</span> Quick &amp; Easy.</h1>
          <p>
            Upload audio, trim the exact part you need, download instantly.
          </p>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="audio-trim-container">
        {!file ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <input
                type="file"
                accept="audio/*"
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{ display: "none" }}
              />
              <button
                className="btn-mixer-upload"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={17} />
                Upload Audio File
              </button>
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
            </div>

            {/* Feature Strip */}
            <div className="at-features-row">
              <div className="at-feature-item">
                <div className="at-feature-icon">
                  <Scissors size={22} />
                </div>
                <div className="at-feature-text">
                  <h4>Precise Trimming</h4>
                  <p>Drag to set the exact start and end point, down to the second.</p>
                </div>
              </div>
              <div className="at-feature-item">
                <div className="at-feature-icon">
                  <Zap size={22} />
                </div>
                <div className="at-feature-text">
                  <h4>Fast Processing</h4>
                  <p>Runs directly in your browser — no waiting for uploads.</p>
                </div>
              </div>
              <div className="at-feature-item">
                <div className="at-feature-icon">
                  <Shield size={22} />
                </div>
                <div className="at-feature-text">
                  <h4>100% Private</h4>
                  <p>Your audio never leaves your device.</p>
                </div>
              </div>
              <div className="at-feature-item">
                <div className="at-feature-icon">
                  <Music2 size={22} />
                </div>
                <div className="at-feature-text">
                  <h4>Clean MP3 Export</h4>
                  <p>Get a trimmed MP3 instantly, ready to share or use.</p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="at-how-it-works">
              <h2>How It Works</h2>
              <div className="at-how-divider" />
              <div className="at-steps-row">
                <div className="at-step-item">
                  <div className="at-step-number">1</div>
                  <div className="at-step-text">
                    <h4>Upload Audio</h4>
                    <p>Drop your MP3 or WAV file — any length, any source.</p>
                  </div>
                </div>
                <div className="at-step-item">
                  <div className="at-step-number">2</div>
                  <div className="at-step-text">
                    <h4>Select Range</h4>
                    <p>Drag the waveform handles to pick the exact start and end point.</p>
                  </div>
                </div>
                <div className="at-step-item">
                  <div className="at-step-number">3</div>
                  <div className="at-step-text">
                    <h4>Download MP3</h4>
                    <p>Trim instantly and download the clipped file.</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="mixer-workspace">
            <SimpleWaveform
              file={file}
              onSelectionChange={setSelection}
              onRemove={() => {
                setFile(null);
                setSelection(null);
              }}
            />

            <div className="mixer-action" style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
              <button
                className="mixer-action__button"
                onClick={handleTrimAndDownload}
                disabled={!selection || isProcessing}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner" style={{ border: '2px solid rgba(0,0,0,0.1)', borderTopColor: '#000', borderRadius: '50%', width: '16px', height: '16px', animation: 'spin 1s linear infinite' }}></span>
                    Processing... {Math.round(progress * 100)}%
                  </>
                ) : (
                  <>
                    <Scissors size={20} />
                    Trim &amp; Download MP3
                  </>
                )}
              </button>
            </div>
          </div>
        )}


      </main>
    </div>
  );
}
