"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin, { Region } from "wavesurfer.js/dist/plugins/regions.esm.js";

export interface TrackSelection {
  start: number;
  end: number;
}

interface SimpleWaveformProps {
  file: File;
  onSelectionChange: (selection: TrackSelection) => void;
  onRemove: () => void;
}

export default function SimpleWaveform({
  file,
  onSelectionChange,
  onRemove,
}: SimpleWaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const regionsRef = useRef<RegionsPlugin | null>(null);
  const regionRef = useRef<Region | null>(null);
  const durationRef = useRef<number>(0);

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [selection, setSelection] = useState<TrackSelection | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(10); // minPxPerSec

  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");

  const applySelection = useCallback(
    (sel: TrackSelection) => {
      setSelection(sel);
      setStartInput(sel.start.toFixed(2));
      setEndInput(sel.end.toFixed(2));
      onSelectionChange(sel);
    },
    [onSelectionChange]
  );

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    const regions = RegionsPlugin.create();
    regionsRef.current = regions;

    const ws = WaveSurfer.create({
      container,
      height: 84,
      waveColor: "#5b5650",
      progressColor: "#c98a4b",
      cursorColor: "#e8c39e",
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      plugins: [regions],
    });
    wavesurferRef.current = ws;

    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));

    ws.loadBlob(file);

    ws.on("ready", () => {
      if (cancelled) return;
      setStatus("ready");

      const duration = ws.getDuration();
      durationRef.current = duration;

      const defaultStart = 0;
      const defaultEnd = Math.min(duration, 30);

      const region = regions.addRegion({
        start: defaultStart,
        end: defaultEnd,
        color: "rgba(201, 138, 75, 0.25)",
        drag: true,
        resize: true,
      });
      regionRef.current = region;

      const emit = (r: Region) => {
        applySelection({ start: r.start, end: r.end });
      };

      region.on("update-end", () => emit(region));
      emit(region);
      
      ws.on("click", (relativeX) => {
        ws.setTime(relativeX * duration);
      });
    });

    return () => {
      cancelled = true;
      ws.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const commitStart = (raw: string) => {
    const num = parseFloat(raw);
    if (isNaN(num) || !selection) {
      setStartInput(selection ? selection.start.toFixed(2) : "");
      return;
    }
    const duration = durationRef.current;
    const clamped = Math.max(0, Math.min(num, selection.end - 0.1, duration));
    const newSel = { start: clamped, end: selection.end };

    if (regionRef.current) {
      regionRef.current.setOptions({ start: clamped, end: newSel.end });
    }
    applySelection(newSel);
  };

  const commitEnd = (raw: string) => {
    const num = parseFloat(raw);
    if (isNaN(num) || !selection) {
      setEndInput(selection ? selection.end.toFixed(2) : "");
      return;
    }
    const duration = durationRef.current;
    const clamped = Math.max(selection.start + 0.1, Math.min(num, duration));
    const newSel = { start: selection.start, end: clamped };

    if (regionRef.current) {
      regionRef.current.setOptions({ start: newSel.start, end: clamped });
    }
    applySelection(newSel);
  };

  const togglePlay = () => {
    const ws = wavesurferRef.current;
    if (!ws || !selection) return;
    
    if (isPlaying) {
      ws.pause();
    } else {
      ws.play(selection.start, selection.end);
    }
  };

  return (
    <div className="mixer-track">
      <div className="mixer-track__head">
        <span className="mixer-track__name">{file.name}</span>
        
        <div className="mixer-track__toolbar">
          <label className="mixer-track__control-label" title="Zoom waveform">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              type="range"
              min="10"
              max="150"
              value={zoom}
              onChange={(e) => {
                const val = Number(e.target.value);
                setZoom(val);
                wavesurferRef.current?.zoom(val);
              }}
              className="mixer-track__zoom-slider"
            />
          </label>
        </div>

        <button
          type="button"
          className="mixer-track__remove"
          onClick={onRemove}
          title="Remove track"
          aria-label={`Remove ${file.name}`}
        >
          ×
        </button>
      </div>

      <div ref={containerRef} className="mixer-track__waveform" />

      <div className="mixer-track__footer">
        <button type="button" className="mixer-track__play" onClick={togglePlay} disabled={!selection}>
          {isPlaying ? "■ Stop" : "▶ Preview"}
        </button>

        <div className="mixer-track__time-inputs">
          <label className="mixer-track__time-label">
            Start
            <input
              type="number"
              className="mixer-track__time-input"
              value={startInput}
              min={0}
              max={durationRef.current || undefined}
              step={0.01}
              disabled={!selection}
              onChange={(e) => setStartInput(e.target.value)}
              onBlur={(e) => commitStart(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") commitStart((e.target as HTMLInputElement).value); }}
            />
            <span className="mixer-track__time-unit">s</span>
          </label>
          <label className="mixer-track__time-label">
            End
            <input
              type="number"
              className="mixer-track__time-input"
              value={endInput}
              min={0}
              max={durationRef.current || undefined}
              step={0.01}
              disabled={!selection}
              onChange={(e) => setEndInput(e.target.value)}
              onBlur={(e) => commitEnd(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") commitEnd((e.target as HTMLInputElement).value); }}
            />
            <span className="mixer-track__time-unit">s</span>
          </label>
        </div>

        {selection && (
          <span className="mixer-track__range">
            {(selection.end - selection.start).toFixed(2)}s
          </span>
        )}
      </div>
    </div>
  );
}
