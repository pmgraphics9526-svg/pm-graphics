"use client";

import React, { useState, useEffect, useRef } from "react";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import { reduceNoise } from "@/lib/music-mixer/ffmpegMix";
import {
  Upload,
  Wand2,
  Shield,
  Zap,
  SlidersHorizontal,
  Download,
  RotateCcw,
  Volume2,
} from "lucide-react";
import { NoiseReduceIllustration, AudioWaveScroll } from "@/components/audio-tools/HeroIllustrations";
import "@/components/audio-tools/audio-hero-bg.css";
import "../music-mixer/music-mixer.css";
import "./noise-reduce.css";

export default function NoiseReducePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [cleanedUrl, setCleanedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);
      setCleanedUrl(null);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleCleanNoise = async () => {
    if (!file) return;
    try {
      setIsProcessing(true);
      setProgress(0);
      const blob = await reduceNoise(file, "mp3", (ratio) => {
        setProgress(ratio);
      });
      const url = URL.createObjectURL(blob);
      setCleanedUrl(url);
    } catch (err) {
      console.error("Noise reduction failed:", err);
      alert("Failed to reduce noise. See console for details.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleStartOver = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (cleanedUrl) URL.revokeObjectURL(cleanedUrl);
    setFile(null);
    setOriginalUrl(null);
    setCleanedUrl(null);
  };

  const handleDownload = () => {
    if (!cleanedUrl || !file) return;
    const a = document.createElement("a");
    a.href = cleanedUrl;
    a.download = `cleaned_${file.name.replace(/\.[^/.]+$/, "")}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="tool-page-shell noise-reduce-page">
      <Navbar showBack backHref="/tools" />
      <Script src="/ffmpeg/ffmpeg.js" strategy="afterInteractive" />

      {/* ── Hero ── */}
      <header className="noise-reduce-hero">
        <NoiseReduceIllustration />
        <div className="tool-hero-content">
          <AudioWaveScroll cutLine />
          <h1>
            <span>Noise Reduce.</span> Clean Audio.
          </h1>
          <p>
            Strip background hiss and hum in seconds —<br />right in your browser.
          </p>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="noise-reduce-container">

        {/* ── EMPTY STATE ── */}
        {!file && (
          <>
            {/* Upload Actions */}
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
                  <SlidersHorizontal size={22} />
                </div>
                <div className="nr-feature-text">
                  <h4>FFT Denoiser</h4>
                  <p>Spectral subtraction removes steady-state hiss and hum precisely.</p>
                </div>
              </div>
              <div className="nr-feature-item">
                <div className="nr-feature-icon">
                  <Zap size={22} />
                </div>
                <div className="nr-feature-text">
                  <h4>Fast Processing</h4>
                  <p>Runs directly in your browser — no waiting for uploads.</p>
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
                  <Volume2 size={22} />
                </div>
                <div className="nr-feature-text">
                  <h4>Natural Output</h4>
                  <p>Voice stays clear — no robotic artifacts or clipping.</p>
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
                    <h4>Upload Audio</h4>
                    <p>Drop your MP3 or WAV file — any length, any mic.</p>
                  </div>
                </div>
                <div className="nr-step-item">
                  <div className="nr-step-number">2</div>
                  <div className="nr-step-text">
                    <h4>Denoise</h4>
                    <p>
                      A highpass filter + FFT denoiser removes rumble, hiss and
                      background noise while keeping your voice intact.
                    </p>
                  </div>
                </div>
                <div className="nr-step-item">
                  <div className="nr-step-number">3</div>
                  <div className="nr-step-text">
                    <h4>Download Clean MP3</h4>
                    <p>Compare before & after, then download the cleaned file.</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── POST-UPLOAD STATE (file selected, processing or done) ── */}
        {file && (
          <div className="noise-comparison-container">
            {/* Header row */}
            <div className="noise-comparison-header">
              <h3>
                {file.name.length > 40
                  ? file.name.slice(0, 40) + "…"
                  : file.name}
              </h3>
              <div className="noise-comparison-header-right">
                <span>
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </span>
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

            {/* Before / After players */}
            <div className="noise-comparison-grid">
              <div className="audio-player-wrapper">
                <h3>Original</h3>
                {originalUrl && <audio src={originalUrl} controls />}
              </div>
              <div className="audio-player-wrapper">
                <h3>Cleaned</h3>
                {cleanedUrl ? (
                  <audio src={cleanedUrl} controls />
                ) : (
                  <p className="audio-player-placeholder">
                    {isProcessing
                      ? "Processing…"
                      : 'Click "Remove Noise" below to process'}
                  </p>
                )}
              </div>
            </div>

            {/* Action bar */}
            <div className="nr-action-bar">
              {isProcessing ? (
                <div className="nr-progress-wrap">
                  <div className="nr-progress-bar-track">
                    <div
                      className="nr-progress-bar-fill"
                      style={{ width: `${Math.round(progress * 100)}%` }}
                    />
                  </div>
                  <p className="nr-progress-label">
                    Removing noise… {Math.round(progress * 100)}%
                  </p>
                </div>
              ) : !cleanedUrl ? (
                <>
                  <button
                    className="btn-nr-primary"
                    onClick={handleCleanNoise}
                    disabled={isProcessing}
                  >
                    <Wand2 size={17} />
                    Remove Noise
                  </button>
                  <button className="btn-nr-ghost" onClick={handleStartOver}>
                    <RotateCcw size={14} style={{ marginRight: 6 }} />
                    Change File
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-nr-primary" onClick={handleDownload}>
                    <Download size={17} />
                    Download Cleaned MP3
                  </button>
                  <button className="btn-nr-ghost" onClick={handleStartOver}>
                    <RotateCcw size={14} style={{ marginRight: 6 }} />
                    Start Over
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
