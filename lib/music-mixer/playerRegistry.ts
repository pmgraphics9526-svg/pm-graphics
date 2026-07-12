// lib/music-mixer/playerRegistry.ts
//
// A lightweight module-level singleton that tracks every active WaveSurfer
// instance on the Music Mixer page. When a track starts playing it calls
// `pauseAllExcept(id)` to stop every other instance — one track at a time.

import type WaveSurfer from "wavesurfer.js";

type PlayerId = number;

const registry = new Map<PlayerId, WaveSurfer>();

/** Register a WaveSurfer instance under a numeric key (track index). */
export function registerPlayer(id: PlayerId, ws: WaveSurfer) {
  registry.set(id, ws);
}

/** Remove the entry when the track component unmounts. */
export function unregisterPlayer(id: PlayerId) {
  registry.delete(id);
}

/** Pause every registered instance except the one identified by `id`. */
export function pauseAllExcept(id: PlayerId) {
  registry.forEach((ws, key) => {
    if (key !== id && ws.isPlaying()) {
      ws.pause();
    }
  });
}
