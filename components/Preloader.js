"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    console.log("Preloader useEffect entered!");
    // Start fading/sliding up at 1.5s
    const fadeTimer = setTimeout(() => {
      console.log("Preloader fade timeout fired!");
      setFade(true);
    }, 1500);
    // Unmount completely at 2.15s (after 0.65s transition completes)
    const removeTimer = setTimeout(() => {
      console.log("Preloader remove timeout fired!");
      setVisible(false);
    }, 2150);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#0B0B0B",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        pointerEvents: fade ? "none" : "all",
        opacity: fade ? 0 : 1,
        transform: fade ? "translateY(-100%)" : "translateY(0)",
        transition: "opacity 0.65s cubic-bezier(0.76, 0, 0.24, 1), transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)",
      }}
    >
      <style>{`
        @keyframes logoEntrance {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes taglineEntrance {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes progressEntrance {
          0% { width: 0; }
          100% { width: 120px; }
        }
        .animate-logo {
          animation: logoEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.15s;
        }
        .animate-tagline {
          animation: taglineEntrance 0.5s ease forwards;
          animation-delay: 0.55s;
        }
        .animate-progress {
          animation: progressEntrance 1.4s linear forwards;
          animation-delay: 0.2s;
        }
      `}</style>

      {/* Logo wordmark */}
      <div
        className="animate-logo"
        style={{
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: "clamp(2rem, 6vw, 3.5rem)",
          fontWeight: "800",
          letterSpacing: "-0.04em",
          color: "var(--text-primary)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          opacity: 0,
        }}
      >
        <span style={{ color: "var(--accent)" }}>PM</span>
        <span style={{ color: "#FFFFFF" }}>GRAPHICS</span>
      </div>

      {/* Tagline */}
      <div
        className="animate-tagline"
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "12px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: "rgba(255,106,0,0.6)",
          opacity: 0,
        }}
      >
        BRAND · VISUALS · MOTION
      </div>

      {/* Progress bar */}
      <div
        className="animate-progress"
        style={{
          height: "2px",
          backgroundColor: "var(--accent)",
          borderRadius: "9999px",
          boxShadow: "0 0 8px rgba(255,106,0,0.6)",
          marginTop: "8px",
          width: 0,
        }}
      />
    </div>
  );
}
