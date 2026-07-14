# Architecture

## Tech stack

- **Framework**: Next.js 16 (App Router, Turbopack), React 19.
- **Hosting**: Vercel, via GitHub integration (push to `main` → auto-deploy).
- **Data/CMS**: Airtable — accessed via raw `fetch()` calls to the Airtable REST API, no SDK.
- **Auth (admin only)**: custom JWT (`jsonwebtoken` + `bcryptjs`), not Firebase Auth (see below).
- **Firebase**: `firebase`/`firebase-admin` are dependencies with real init code (`lib/core/firebase.js`, `lib/core/firebase-admin.js`), but **not currently wired into any feature** — no Firestore/Storage/Auth calls anywhere in the app. Leftover scaffolding from an earlier direction; see `memory.md`.
- **Large binaries**: Git LFS, for the two files too big to push as regular git objects (see "Git LFS" below).
- **Free Tools processing**: all client-side — `ffmpeg.wasm`, `onnxruntime-web` (WASM), custom waveform/FFT code. No server compute cost per tool use.

## Folder structure

```
app/
  page.js                    — the entire public marketing site (single page, anchor-scrolled sections)
  layout.js                  — root layout, fonts (Syne/Inter/Space Grotesk), globals.css import
  privacy/, terms/           — static legal pages
  admin/
    page.js                  — admin login (client component)
    dashboard/page.js        — admin dashboard (client component, ~1500 lines)
  tools/
    page.js                  — tools hub (Audio Tools / Design Tools sections)
    tools.css
    audio-trim/, noise-reduce/, music-mixer/, vocal-remover/   — audio tools (page + own CSS)
    color/, typography/, shape/, layout/                        — design tool page wrappers (thin, dynamic-import the real component)
  api/
    portfolio/, testimonials/, settings/, contact/, projects/   — public API routes
    admin/
      login/, logout/, verify/                                  — auth
      portfolio/, testimonials/, contact/, packages/, upload/    — admin CRUD, all backed by Airtable except upload (see below)

components/
  *.js                       — top-level re-export shims, e.g. `Hero.js` → `export { default } from "./site/Hero"`
  site/                      — the real implementations: Hero.js, Navbar.js, BentoGrid.js, AboutSection.js,
                                PricingSection.js, ProcessSection.js, TestimonialsSection.js, ContactForm.js,
                                ProjectModal.js, Preloader.js, GlobalParticlesBackground.jsx,
                                PremiumHeroBackground.jsx, projectsData.js (static portfolio fallback data)
  design-tools/               ColorLab.jsx, TypographyLab.jsx, ShapeLab.jsx, LayoutLab.jsx — one component
                               per design tool, self-contained, own local color palette, no shared audio-tool infra
  audio-tools/                SimpleWaveform.tsx (shared by Audio Trim + Vocal Remover), HeroIllustrations.tsx,
                               audio-hero-bg.css (shared hero glow background, used by Music Mixer/Audio Trim/
                               Noise Reduce/Vocal Remover)
  music-mixer/                WaveformTrack.tsx (Music Mixer's own per-track waveform, separate from
                               SimpleWaveform), WhatsAppCTA.tsx (the one shared CTA component every
                               tool-with-a-CTA renders)
  ui/                         cybercore-background.tsx/css — decorative animated background (Music Mixer hero)

lib/
  *.js                       — top-level re-export shims (same pattern as components/), e.g. `auth.js` → `lib/core/auth.js`
  core/
    auth.js                  — JWT sign/verify, isAuthenticated(), reads ADMIN_PASSWORD (bcrypt hash) + JWT_SECRET
    firebase.js               client SDK init (unused in practice — see above)
    firebase-admin.js         admin SDK init (unused in practice — see above)
  music-mixer/
    ffmpegMix.ts              — trimAudio(), reduceNoise(), mixTracks() — shared ffmpeg.wasm wrapper used by
                                Audio Trim, Noise Reduce, and Music Mixer
    beatDetect.ts             — web-audio-beat-detector wrapper, Music Mixer only
  vocal-remover/
    mdxSeparate.js             — decode/trim/encode orchestration, runs on the main thread
    separation.worker.js       — the actual MDX-Net STFT/inference, runs in a Web Worker (kept off the main
                                 thread deliberately — see memory.md)
  empty-shim.js               — stub for Node's fs/path in browser builds (kissfft-js workaround, see next.config.mjs)

public/
  audio-models/Kim_Vocal_2.onnx        — 67MB, LFS-tracked, Vocal Remover's ONNX model
  audio-models/std.rnnn                — ~300KB, NOT LFS, Noise Reduce's RNNoise profile
  ort/ort-wasm-simd-threaded.wasm      — 14MB, LFS-tracked, onnxruntime-web runtime
  ort/ort.wasm.min.js, ort-wasm-simd-threaded.mjs — onnxruntime-web loader, loaded via <Script>/importScripts,
                                                     NOT an npm package
  ffmpeg/                              — self-hosted ffmpeg.wasm build (~31MB core, NOT LFS-tracked — see
                                         "known inconsistency" below), loaded via <Script src="/ffmpeg/ffmpeg.js">
  projects/                            — portfolio images/assets

scripts/
  vercel-build.sh            — Vercel's actual build command (see vercel.json). Runs `git lfs pull` as a
                               fallback, then verifies the two LFS files resolved to real binaries (not
                               ~130-byte pointer stubs) before running `next build`. Fails loudly if not.
  generate-password-hash.js  — CLI helper to bcrypt-hash a new ADMIN_PASSWORD
  migrate-to-airtable.js     — one-off script that seeded Airtable's Portfolio table from the old static data
```

## Free Tools Suite structure

Every tool under `app/tools/<name>/` is an **independent, self-contained client module**:
- Its own `page.jsx`/`page.tsx` (marked `"use client"`) and its own CSS file.
- Design tools go through a thin wrapper page that `next/dynamic(..., { ssr: false })`-imports the real component from `components/design-tools/`.
- Audio tools do their heavy lifting through shared `lib/` helpers (`ffmpegMix.ts`, `beatDetect.ts`) and shared UI (`SimpleWaveform.tsx`, `audio-hero-bg.css`) — but each tool's page owns its own state and flow; there's no shared "tool framework" or router beyond plain Next.js pages.
- No tool calls a server API for its core function. The only network activity is downloading static assets (the ffmpeg.wasm core, the ONNX model, the wavesurfer-less custom waveform rendering) — everything else happens in the browser.
- Vocal Remover goes one step further and pushes its heaviest work into a **Web Worker** (`separation.worker.js`) so the main thread never blocks — see `memory.md` for why this was necessary.

## Admin panel ↔ Airtable

There is no traditional database. Airtable is the CMS, queried via plain `fetch()`:

| Airtable table | Read by (public) | Read/written by (admin) |
|---|---|---|
| `Portfolio` | `GET /api/portfolio` (ISR, 5 min) | `GET/POST/PUT/DELETE /api/admin/portfolio` |
| `Testimonials` | `GET /api/testimonials` (approved only, ISR 5 min); `POST /api/testimonials` (public submission → `Status: "Pending"`) | `GET/PUT /api/admin/testimonials` (approve/reject) |
| `Contact Messages` | — | `POST /api/contact` writes here (this is the lead inbox) |
| `Site Settings` (key/value) | `GET /api/settings` (ISR 5 min) | `GET/POST/PUT /api/admin/contact` (contact-info keys), `GET/PUT /api/admin/packages` (pricing/feature keys) |

Env vars: `AIRTABLE_BASE_ID`, `AIRTABLE_READ_API_KEY`, `AIRTABLE_WRITE_API_KEY`, optional `AIRTABLE_TABLE_NAME` override for the Testimonials table name. Every route degrades to hardcoded fallback data if Airtable isn't configured or the call fails — the site works without Airtable present.

Image uploads (`POST /api/admin/upload`) don't use Airtable's attachment API — they proxy to `tmpfiles.org` and store the resulting URL as a plain string field.

## Admin authentication

Custom, single-admin JWT scheme — **not** Firebase Auth:
1. `POST /api/admin/login` — checks IP rate limit (in-memory, resets on cold start), optionally verifies reCAPTCHA v3, then `bcrypt.compareSync(password, ADMIN_PASSWORD)` (the env var holds a bcrypt hash, generated via `scripts/generate-password-hash.js`).
2. On success, signs a JWT (`lib/core/auth.js`) and sets it as an httpOnly, secure, 24h `admin_token` cookie.
3. Each protected admin API route calls `isAuthenticated(request)` itself — **there is no root `middleware.js`/`middleware.ts`**, so route protection is manual and per-handler, not centrally enforced.
4. The dashboard page is a client component that fetches `GET /api/admin/verify` on mount and redirects if unauthenticated — meaning the dashboard's HTML/JS ships before the auth check resolves (client-side gate, not a server-side one).

`GET /api/admin/portfolio` and `GET /api/admin/contact` are currently **not** gated by `isAuthenticated` (worth knowing if you're auditing access control).

## Git LFS

Two binaries are LFS-tracked (`.gitattributes`): `public/audio-models/*.onnx` and `public/ort/*.wasm`. This was necessary because pushing them as regular git objects (~80MB combined) hit GitHub's `git-receive-pack` request timeout on a slow connection — LFS's chunked upload doesn't have that single-request-timeout problem. See `memory.md` for the full story.

**Known inconsistency**: `public/ffmpeg/ffmpeg-core.wasm` (~32MB) and `public/audio-models/std.rnnn` (~300KB) are *not* LFS-tracked despite one of them being comparably large to the LFS-tracked files. This works today only because that push happened to succeed; it's a latent risk if that file ever needs to change and gets re-pushed on a slow connection.

**Vercel + LFS**: Vercel's native "Git LFS Support" project setting is the primary mechanism for resolving LFS pointers during deploy. `scripts/vercel-build.sh` (wired in via `vercel.json`'s `buildCommand`) is a safety net on top of that — it retries `git lfs pull` and fails the build loudly (rather than silently shipping broken pointer files) if the binaries didn't resolve.

## CSP / WASM

`next.config.mjs`'s `headers()` sets a site-wide CSP. It includes `'wasm-unsafe-eval'` in `script-src` (added specifically to unblock `onnxruntime-web`'s `WebAssembly.instantiate()` call in production — the narrower, WASM-specific alternative to `'unsafe-eval'`). `worker-src 'self' blob:` is required for the audio tools' Web Workers and ffmpeg.wasm's internal worker. See `rules.md` for the pattern to follow when adding new WASM-based tools.

## ISR / caching

Public GET API routes use `export const revalidate = 300` (5-minute ISR) to reduce Airtable load. Admin GET routes instead pass `next: { revalidate: 0 }` on their internal `fetch()` calls to force live reads, so edits show up in the dashboard immediately.
