"use client";

import React, { useState, useEffect, CSSProperties } from "react";
import "./cybercore-background.css";

export interface CybercoreBackgroundProps {
  beamCount?: number;
}

interface Beam {
  id: number;
  type: "primary" | "secondary";
  style: CSSProperties;
}

const DEFAULT_BEAM_COUNT = 70;

const CybercoreBackground: React.FC<CybercoreBackgroundProps> = ({
  beamCount = DEFAULT_BEAM_COUNT,
}) => {
  const [beams, setBeams] = useState<Beam[]>([]);

  useEffect(() => {
    const generated: Beam[] = Array.from({ length: beamCount }).map((_, i) => {
      const riseDur = Math.random() * 3 + 5;   // 5–8 s
      const fadeDur = riseDur;                  // keep in sync
      const type: "primary" | "secondary" =
        Math.random() < 0.15 ? "secondary" : "primary";

      return {
        id: i,
        type,
        style: {
          left: `${Math.random() * 100}%`,
          width: `${Math.floor(Math.random() * 2) + 1}px`,
          animationDelay: `${Math.random() * 6}s`,
          // Two durations: one for beam-rise, one for beam-fade
          animationDuration: `${riseDur}s, ${fadeDur}s`,
        },
      };
    });
    setBeams(generated);
  }, [beamCount]);

  return (
    <div
      className="scene"
      role="img"
      aria-label="Animated rising light beams background"
    >
      <div className="floor" />
      <div className="main-column" />
      <div className="light-stream-container">
        {beams.map((beam) => (
          <div
            key={beam.id}
            className={`light-beam ${beam.type}`}
            style={beam.style}
          />
        ))}
      </div>
    </div>
  );
};

export default CybercoreBackground;
