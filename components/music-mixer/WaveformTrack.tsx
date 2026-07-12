"use client";

// components/music-mixer/WaveformTrack.tsx
//
// Renders one uploaded song: waveform, detected BPM, beat-marker overlay,
// and a draggable region for picking the start/end. Every drag snaps to
// the nearest beat so users can never cut mid-beat.
//
// Bug-fix (overlap): registers with playerRegistry so clicking ▶ on this
//   track pauses every other track automatically.
//
// Feature (time inputs): two number fields (start / end in seconds) next
//   to the preview button let users type exact cut points. They stay in
//   sync with the waveform region and snap identically to dragging.

import { useEffect, useRef, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin, { Region } from "wavesurfer.js/dist/plugins/regions.esm.js";
import { decodeAudioFile, detectBeats, snapToNearestBeat, BeatInfo } from "@/lib/music-mixer/beatDetect";
import { registerPlayer, unregisterPlayer, pauseAllExcept } from "@/lib/music-mixer/playerRegistry";

export interface TrackSelection {
  start: number;
  end: number;
}

interface WaveformTrackProps {
  id: string;
  trackNumber: number;
  file: File;
  onSelectionChange: (id: string, selection: TrackSelection) => void;
  onRemove: (id: string) => void;
}

export default function WaveformTrack({
  id,
  trackNumber,
  file,
  onSelectionChange,
  onRemove,
}: WaveformTrackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const regionsRef = useRef<RegionsPlugin | null>(null);
  const regionRef = useRef<Region | null>(null);
  const beatMarkerElementsRef = useRef<HTMLElement[]>([]);
  const beatInfoRef = useRef<BeatInfo | null>(null);
  const durationRef = useRef<number>(0);

  const [beatInfo, setBeatInfo] = useState<BeatInfo | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [selection, setSelection] = useState<TrackSelection | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [zoom, setZoom] = useState(10); // minPxPerSec
  const [snapEnabled, setSnapEnabled] = useState(true);
  const snapEnabledRef = useRef(snapEnabled);
  const [showBeatLines, setShowBeatLines] = useState(true);

  useEffect(() => {
    snapEnabledRef.current = snapEnabled;
  }, [snapEnabled]);

  useEffect(() => {
    beatMarkerElementsRef.current.forEach((el) => {
      el.style.display = showBeatLines ? "block" : "none";
    });
  }, [showBeatLines]);

  // Controlled values for the two text inputs (kept as strings to allow
  // partial / in-progress typing without forcing numeric coercion).
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");

  // Push a new selection outward and keep inputs in sync.
  const applySelection = useCallback(
    (sel: TrackSelection) => {
      setSelection(sel);
      setStartInput(sel.start.toFixed(2));
      setEndInput(sel.end.toFixed(2));
      onSelectionChange(id, sel);
    },
    [id, onSelectionChange]
  );

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    const regions = RegionsPlugin.create();
    regionsRef.current = regions;

    const ws = WaveSurfer.create({
      container,
      height: 48,
      waveColor: "#5b5650",
      progressColor: "#c98a4b",
      cursorColor: "#e8c39e",
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      plugins: [regions],
    });
    wavesurferRef.current = ws;

    // Register in the singleton so other tracks can pause us.
    // We use id instead of index so pausing works reliably even if reordered
    registerPlayer(id as any, ws);

    // Pause all other tracks the moment this one starts playing.
    ws.on("play", () => {
      setIsPlaying(true);
      pauseAllExcept(id as any);
    });
    ws.on("pause", () => setIsPlaying(false));

    ws.loadBlob(file);

    ws.on("ready", async () => {
      let info: BeatInfo | null = null;
      try {
        const audioBuffer = await decodeAudioFile(file);
        info = await detectBeats(audioBuffer);
        if (cancelled) return;
        beatInfoRef.current = info;
        setBeatInfo(info);
        setStatus("ready");
      } catch (err) {
        console.error("Beat detection failed, falling back to manual selection:", err);
        setStatus("error");
      }

      if (cancelled) return;

      const duration = ws.getDuration();
      durationRef.current = duration;
      // Render beat markers
      const currentMarkers = info?.eightCountMarkers ?? [];
      const markerElements: HTMLElement[] = [];
      currentMarkers.forEach((m) => {
        const marker = regions.addRegion({
          start: m,
          end: m + 0.001,
          color: "rgba(255, 255, 255, 0.4)",
          drag: false,
          resize: false,
        });
        if ((marker as any).element) {
          const el = (marker as any).element as HTMLElement;
          el.style.borderLeft = "1px solid rgba(255, 255, 255, 0.4)";
          el.style.pointerEvents = "none";
          // the useEffect will handle subsequent updates, but we set initial state here
          el.style.display = "block"; 
          markerElements.push(el);
        }
      });
      beatMarkerElementsRef.current = markerElements;

      const defaultStart = snapToNearestBeat(0, currentMarkers, Infinity);
      const defaultEnd = snapToNearestBeat(
        Math.min(duration, defaultStart + 30),
        currentMarkers,
        Infinity
      );

      const region = regions.addRegion({
        start: defaultStart,
        end: defaultEnd,
        color: "rgba(201, 138, 75, 0.25)",
        drag: true,
        resize: true,
      });
      regionRef.current = region;

      const emit = (r: Region) => {
        const marks = beatInfoRef.current?.eightCountMarkers ?? [];
        const isSnap = snapEnabledRef.current;
        const tolerance = isSnap ? 0.15 : 0; // 150ms tolerance when snapping

        let snappedStart = r.start;
        let snappedEnd = r.end;

        if (isSnap && marks.length) {
          snappedStart = snapToNearestBeat(r.start, marks, tolerance);
          snappedEnd = snapToNearestBeat(r.end, marks, tolerance);
        }

        if (marks.length && (snappedStart !== r.start || snappedEnd !== r.end)) {
          r.setOptions({ start: snappedStart, end: snappedEnd });
        }
        applySelection({ start: snappedStart, end: snappedEnd });
      };

      region.on("update-end", () => emit(region));
      emit(region);
      
      ws.on("click", (relativeX) => {
        ws.setTime(relativeX * duration);
      });
    });

    return () => {
      cancelled = true;
      unregisterPlayer(id as any);
      ws.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  // ----- Handlers for typed time inputs -----

  /** Apply a new start value typed by the user. */
  const commitStart = (raw: string) => {
    const num = parseFloat(raw);
    if (isNaN(num) || !selection) {
      // Revert to last valid
      setStartInput(selection ? selection.start.toFixed(2) : "");
      return;
    }
    const duration = durationRef.current;
    const markers = beatInfoRef.current?.eightCountMarkers ?? [];
    const clamped = Math.max(0, Math.min(num, selection.end - 0.1, duration));
    const isSnap = snapEnabledRef.current;
    const snapped = (isSnap && markers.length) ? snapToNearestBeat(clamped, markers, 0.15) : clamped;
    const newSel = { start: snapped, end: selection.end };

    // Move the waveform region to match
    if (regionRef.current) {
      regionRef.current.setOptions({ start: snapped, end: newSel.end });
    }
    applySelection(newSel);
  };

  /** Apply a new end value typed by the user. */
  const commitEnd = (raw: string) => {
    const num = parseFloat(raw);
    if (isNaN(num) || !selection) {
      setEndInput(selection ? selection.end.toFixed(2) : "");
      return;
    }
    const duration = durationRef.current;
    const markers = beatInfoRef.current?.eightCountMarkers ?? [];
    const clamped = Math.max(selection.start + 0.1, Math.min(num, duration));
    const isSnap = snapEnabledRef.current;
    const snapped = (isSnap && markers.length) ? snapToNearestBeat(clamped, markers, 0.15) : clamped;
    const newSel = { start: selection.start, end: snapped };

    if (regionRef.current) {
      regionRef.current.setOptions({ start: newSel.start, end: snapped });
    }
    applySelection(newSel);
  };

  const togglePlay = () => {
    const ws = wavesurferRef.current;
    if (!ws || !selection) return;
    
    if (isPlaying) {
      ws.pause();
    } else {
      pauseAllExcept(id as any);
      ws.play(selection.start, selection.end);
    }
  };

  return (
    <div className="mixer-track">
      <div className="mixer-track__head">
        <span className="mixer-track__number">{trackNumber}</span>
        <span className="mixer-track__name">{file.name}</span>
        
        <div className="mixer-track__head-controls" style={{ display: 'flex', alignItems: 'center', gap: '14px', marginLeft: 'auto', marginRight: '16px' }}>
          <label className="mixer-track__control-label" style={{ margin: 0 }}>
            <input
              type="checkbox"
              checked={snapEnabled}
              onChange={(e) => setSnapEnabled(e.target.checked)}
              className="mixer-track__snap-checkbox"
            />
            Snap
          </label>

          <label className="mixer-track__control-label" style={{ margin: 0 }}>
            <input
              type="checkbox"
              checked={showBeatLines}
              onChange={(e) => setShowBeatLines(e.target.checked)}
              className="mixer-track__snap-checkbox"
            />
            Beat lines
          </label>
        </div>

        <button
          type="button"
          className="mixer-track__remove"
          onClick={() => onRemove(id)}
          title="Remove track"
          aria-label={`Remove ${file.name}`}
        >
          ×
        </button>
      </div>

      <div ref={containerRef} className="mixer-track__waveform" style={{ margin: '8px 0' }} />
      <div className="mixer-track__footer" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'nowrap', width: '100%', overflow: 'hidden' }}>
        <button type="button" className="mixer-track__play" onClick={togglePlay} disabled={!selection} style={{ flexShrink: 0, padding: '5px 10px', fontSize: '12px' }}>
          {isPlaying ? "■ Stop" : "▶ Preview"}
        </button>
 
        <label className="mixer-track__control-label" title="Zoom waveform" style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, margin: 0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
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
            style={{ width: '50px' }}
          />
        </label>
 
        {status === "ready" && beatInfo && (
          <span className="mixer-track__bpm" style={{ margin: 0, fontSize: '11px', flexShrink: 0 }}>
            {Math.round(beatInfo.bpm)} BPM
          </span>
        )}
 
        {/* Manual time inputs - Type text resolves React state locks */}
        <div className="mixer-track__time-inputs" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto', flexShrink: 0 }}>
          <label className="mixer-track__time-label" style={{ margin: 0, gap: '2px', fontSize: '11px' }}>
            Start
            <input
              type="text"
              className="mixer-track__time-input"
              value={startInput}
              disabled={!selection}
              onChange={(e) => setStartInput(e.target.value)}
              onBlur={(e) => commitStart(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") commitStart((e.target as HTMLInputElement).value); }}
              style={{ width: '40px', padding: '2px 4px', fontSize: '11px', textAlign: 'center' }}
            />
          </label>
          <label className="mixer-track__time-label" style={{ margin: 0, gap: '2px', fontSize: '11px' }}>
            End
            <input
              type="text"
              className="mixer-track__time-input"
              value={endInput}
              disabled={!selection}
              onChange={(e) => setEndInput(e.target.value)}
              onBlur={(e) => commitEnd(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") commitEnd((e.target as HTMLInputElement).value); }}
              style={{ width: '40px', padding: '2px 4px', fontSize: '11px', textAlign: 'center' }}
            />
          </label>
        </div>
 
        {selection && (
          <span className="mixer-track__range" style={{ fontWeight: 600, color: '#c98a4b', fontSize: '11px', flexShrink: 0 }}>
            {(selection.end - selection.start).toFixed(1)}s
          </span>
        )}
      </div>
    </div>
  );
}
