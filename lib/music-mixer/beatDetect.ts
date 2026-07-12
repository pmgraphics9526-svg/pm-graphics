// lib/music-mixer/beatDetect.ts
//
// Detects BPM + first-beat offset for an uploaded track, then generates
// an array of beat-marker timestamps (seconds) across the whole track.
// Runs fully client-side — no server call.

import { guess } from "web-audio-beat-detector";

export interface BeatInfo {
  bpm: number;
  offset: number; // seconds — position of the first detected beat
  beatMarkers: number[]; // seconds — every detected beat across the track
  eightCountMarkers: number[]; // seconds — every 8th beat (dance "8-count")
}

/**
 * Decode a File into an AudioBuffer using the Web Audio API.
 */
export async function decodeAudioFile(file: File): Promise<AudioBuffer> {
  const arrayBuffer = await file.arrayBuffer();
  // Safari still needs webkitAudioContext fallback.
  const AudioCtx =
    window.AudioContext || (window as any).webkitAudioContext;
  const ctx = new AudioCtx();
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
  await ctx.close();
  return audioBuffer;
}

/**
 * Run BPM + offset detection and build out a full grid of beat markers
 * for the track's duration. 8-count markers are what dancers actually
 * think in, so we surface those separately for the snap logic.
 */
export async function detectBeats(audioBuffer: AudioBuffer): Promise<BeatInfo> {
  const { bpm, offset } = await guess(audioBuffer);

  const secondsPerBeat = 60 / bpm;
  const duration = audioBuffer.duration;

  const beatMarkers: number[] = [];
  // Walk backward from offset to 0 first, then forward to the end,
  // so the grid is anchored on the detected beat regardless of where
  // the offset sits inside the first bar.
  let t = offset % secondsPerBeat;
  while (t < duration) {
    beatMarkers.push(Number(t.toFixed(3)));
    t += secondsPerBeat;
  }

  const eightCountMarkers = beatMarkers.filter((_, i) => i % 8 === 0);

  return { bpm: Math.round(bpm * 10) / 10, offset, beatMarkers, eightCountMarkers };
}

/**
 * Snap a raw user-picked time (seconds) to the nearest beat marker.
 * Falls back to the raw time if no markers exist (e.g. detection failed).
 */
export function snapToNearestBeat(rawTime: number, markers: number[], tolerance: number = Infinity): number {
  if (!markers.length) return rawTime;
  let closest = markers[0];
  let closestDist = Math.abs(rawTime - closest);
  for (const m of markers) {
    const d = Math.abs(rawTime - m);
    if (d < closestDist) {
      closest = m;
      closestDist = d;
    }
  }
  return closestDist <= tolerance ? closest : rawTime;
}
