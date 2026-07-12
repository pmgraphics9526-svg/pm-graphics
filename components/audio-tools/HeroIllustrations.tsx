import React from "react";

export function MusicMixerIllustration() {
  return (
    <svg viewBox="0 0 800 400" className="hero-ill-parallax" preserveAspectRatio="xMidYMax slice" style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", height: "100%", minWidth: "800px", zIndex: 0, opacity: 0.15, pointerEvents: "none" }}>
      {/* Turntables */}
      <circle cx="250" cy="350" r="120" fill="none" stroke="var(--accent)" strokeWidth="2" opacity="0.3" />
      <circle cx="250" cy="350" r="40" fill="var(--accent)" opacity="0.1" />
      <circle cx="550" cy="350" r="120" fill="none" stroke="var(--accent)" strokeWidth="2" opacity="0.3" />
      <circle cx="550" cy="350" r="40" fill="var(--accent)" opacity="0.1" />
      
      {/* Mixer Center */}
      <rect x="380" y="280" width="40" height="120" fill="var(--accent)" opacity="0.2" rx="4" />
      <rect x="395" y="320" width="10" height="40" fill="var(--accent)" opacity="0.5" rx="2" />
      
      {/* Abstract DJ Silhouette */}
      <circle cx="400" cy="120" r="45" fill="var(--accent)" opacity="0.4" />
      <path d="M 300 300 Q 400 180 500 300 L 450 400 L 350 400 Z" fill="var(--accent)" opacity="0.15" />
      <path d="M 340 250 Q 400 160 460 250" fill="none" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

export function AudioTrimIllustration() {
  return (
    <svg viewBox="0 0 800 400" className="hero-ill-parallax" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", height: "100%", minWidth: "800px", zIndex: 0, opacity: 0.15, pointerEvents: "none" }}>
      {/* Waveform Bars */}
      <g fill="var(--accent)" opacity="0.3">
        {Array.from({ length: 40 }).map((_, i) => {
          const h = 20 + Math.random() * 140;
          return <rect key={i} x={100 + i * 15} y={200 - h / 2} width="8" height={h} rx="4" />;
        })}
      </g>
      {/* Dotted Cut Line */}
      <line x1="400" y1="50" x2="400" y2="350" stroke="var(--accent)" strokeWidth="4" strokeDasharray="12 12" opacity="0.6" />
      {/* Scissors Shape (Abstract) */}
      <g stroke="var(--accent)" fill="none" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" transform="translate(380, 150) rotate(-45)">
        <circle cx="0" cy="0" r="20" />
        <circle cx="0" cy="50" r="20" />
        <line x1="20" y1="0" x2="100" y2="25" />
        <line x1="20" y1="50" x2="100" y2="25" />
        <circle cx="45" cy="25" r="4" fill="var(--accent)" />
      </g>
    </svg>
  );
}

/* Smooth curved wave (not jagged). Starts/ends at the center line so the
   two tiled copies join seamlessly. */
const WAVE_PATH =
  "M0,50 C25,10 25,10 50,50 C75,90 75,90 100,50 " +
  "C125,10 125,10 150,50 C175,90 175,90 200,50 " +
  "C225,10 225,10 250,50 C275,90 275,90 300,50 " +
  "C325,10 325,10 350,50 C375,90 375,90 400,50";

const WAVE_BAND_OPACITY = [1, 0.75, 0.5, 0.25];
const WAVE_BAND_GAP = 48; // ~half inch
// Each band gets its own speed and starting offset so they drift apart
// instead of scrolling in lockstep as one frozen block.
const WAVE_BAND_DURATION = [7, 11, 6, 9]; // seconds per loop
const WAVE_BAND_DELAY = [0, -3, -1.5, -5]; // negative = starts partway through

interface AudioWaveScrollProps {
  /** Noise Reduce only: adds a centre divider and quiets the wave after it. */
  cutLine?: boolean;
}

export function AudioWaveScroll({ cutLine = false }: AudioWaveScrollProps) {
  return (
    <div className="at-wave-stack">
      {cutLine && <div className="at-wave-divider" />}
      {WAVE_BAND_OPACITY.map((op, band) => (
        <div
          key={band}
          className="at-wave-band"
          style={{ top: band * WAVE_BAND_GAP, opacity: op }}
        >
          <div className={cutLine ? "at-wave-band-left" : "at-wave-band-full"}>
            <div
              className="at-wave-track"
              style={{
                animationDuration: `${WAVE_BAND_DURATION[band]}s`,
                animationDelay: `${WAVE_BAND_DELAY[band]}s`,
              }}
            >
              {[0, 1].map((i) => (
                <svg
                  key={i}
                  className="at-wave-svg"
                  viewBox="0 0 400 100"
                  preserveAspectRatio="none"
                >
                  <path d={WAVE_PATH} fill="none" stroke="var(--accent)" strokeWidth="2.5" />
                </svg>
              ))}
            </div>
          </div>
          {/* Right half (Noise Reduce only): same wave, shrunk — noise dropped after the cut line */}
          {cutLine && (
            <div className="at-wave-band-right">
              <div className="at-wave-band-right-scale">
                <div
                  className="at-wave-track"
                  style={{
                    animationDuration: `${WAVE_BAND_DURATION[band]}s`,
                    animationDelay: `${WAVE_BAND_DELAY[band]}s`,
                  }}
                >
                  {[0, 1].map((i) => (
                    <svg
                      key={i}
                      className="at-wave-svg"
                      viewBox="0 0 400 100"
                      preserveAspectRatio="none"
                    >
                      <path d={WAVE_PATH} fill="none" stroke="var(--accent)" strokeWidth="2.5" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function NoiseReduceIllustration() {
  return (
    <svg viewBox="0 0 1200 600" className="hero-ill-parallax" preserveAspectRatio="xMidYMax slice" style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", height: "100%", minWidth: "1200px", zIndex: 0, pointerEvents: "none" }}>
      <defs>
        <linearGradient id="nr-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#c98a4b" stopOpacity="0"   />
          <stop offset="20%"  stopColor="#c98a4b" stopOpacity="0.6" />
          <stop offset="80%"  stopColor="#e8a96a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#c98a4b" stopOpacity="0"   />
        </linearGradient>
        <filter id="nr-glow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Subtle scatter dots */}
      <g fill="#c98a4b" opacity="0.35">
        <circle cx="120"  cy="120" r="2"   />
        <circle cx="320"  cy="80"  r="1.5" />
        <circle cx="900"  cy="100" r="2.5" />
        <circle cx="1080" cy="220" r="2"   />
        <circle cx="600"  cy="40"  r="1.5" />
        <circle cx="750"  cy="160" r="1"   />
      </g>

      {/* Sweeping background lines */}
      <g stroke="url(#nr-grad)" fill="none" opacity="0.25">
        {Array.from({ length: 6 }).map((_, i) => (
          <path
            key={`sweep-${i}`}
            d={`M 0 ${380 + i * 18} Q 300 ${240 + i * 28} 600 ${420 - i * 12} T 1200 ${310 + i * 22}`}
            strokeWidth="1.5"
          />
        ))}
      </g>

      {/* EQ Bars — amber, bottom-anchored, wave envelope */}
      <g fill="url(#nr-grad)" filter="url(#nr-glow)">
        {Array.from({ length: 38 }).map((_, i) => {
          const x   = 270 + i * 18;
          const dist = Math.abs(19 - i);
          // deterministic height so it doesn't flash on re-render
          const seed = ((i * 7919 + 31) % 43) / 43;
          const h    = 18 + seed * 30 + Math.max(0, 140 - dist * 9);
          return <rect key={`bar-${i}`} x={x} y={560 - h} width="5" height={h} rx="2.5" />;
        })}
      </g>
    </svg>
  );
}
