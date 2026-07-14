# Project History — Phases

Reconstructed from git history (32 commits, June 24 – July 14, 2026). Dates are commit dates, not necessarily calendar-accurate to when work started.

## Phase 1 — Portfolio site + admin panel foundation (Jun 24 – Jul 1)

`f748310` initial commit through `6330fb1`/`3fc53b6` (~Jul 1).

- Initial site scaffold, admin login page with password visibility toggle.
- Admin auth hardened: bcrypt password + JWT, IP-based rate limiting (5 attempts / 15 min lockout) — `e94b872`.
- Firebase wired in for a private key fix (`86ccb76`) — this predates the realization that Firebase wouldn't end up used for anything; see `memory.md`.
- Airtable enabled on production (`d941db5`/`0e927cb`) — the CMS backend decision was made here.
- `b4d128a` "airtable admin migration work in progress" — portfolio/testimonials/settings migrated off static data onto Airtable tables.
- Domain switched to pmgraphics.in, admin dashboard gradient theme, mobile/stats fixes, ISR caching added to the public API routes (`c26e636`).
- `eb2c75b` — cleanup pass (removed scratch scripts, debug logs, an orphaned StatsSection component).

**Outcome**: a working marketing site + Airtable-backed admin CMS, deployed to pmgraphics.in.

## Phase 1.5 — "Learn" section (Jul 2)

`d2a29cd` "Add PM Graphics Learn section: Colour Theory (11), Typography (5 live/4 locked), 4 interactive tools, homepage integration."

An earlier attempt at educational/interactive content with a locked/unlocked lesson structure. This appears to be the direct predecessor of what became the Design Tools (Color/Typography/Shape/Layout Lab) — the "4 interactive tools" language matches. Ten days later this got restructured into the current `/tools` hub.

## Phase 2 — Free Tools Suite launch (Jul 12)

Six commits landed same-day, all Jul 12:

1. `1df6288` "Tools suite restructure, legal pages, navbar, stats, mobile polish" — established the `/tools` hub as it exists today, added `/privacy` and `/terms`, restructured `components/Hero.js` → `components/site/Hero.js` (introducing the `.hero-photo-stage` wrapper — see `memory.md` for a bug this inadvertently carried forward).
2. `996c135` "Add missing music-mixer dependencies", `b3a5e8f` "Add wavesurfer.js dependency" — Music Mixer's audio pipeline.
3. `69c652b` "Fix CSP: allow blob workers for audio tools" — first CSP adjustment for the new client-side audio processing pattern (`worker-src 'self' blob:'`).
4. `e43d442` "Convert design tools to dark theme, unify back navigation" — the Learn-section tools became the current dark-themed Color/Typography/Shape/Layout Lab, matching the audio tools' visual language.
5. `a104963` "Fix LayoutLab fontSize/escape bug and update About section experience to 5+ years."

**Outcome**: Music Mixer, Audio Trim, Noise Reduce, and the four Design Tools all live under `/tools`, sharing the dark theme and (for audio tools) the ffmpeg.wasm client-side pipeline.

## Phase 3 — Vocal Remover (Jul 14)

Five commits, Jul 14, each addressing a distinct problem in sequence rather than one big feature drop:

1. `7bdc934` "Add Vocal Remover tool with MDX-Net separation" — the tool itself: upload → trim → on-device MDX-Net (ONNX) separation → download instrumental. Required sourcing and verifying a real ONNX model (Kim_Vocal_2.onnx, from the Ultimate Vocal Remover project) and building the STFT/ISTFT pipeline from scratch, numerically verified against a Python/numpy reference.
2. `8ba98e5` "Fix CSP: allow wasm-unsafe-eval for vocal remover WebAssembly" — production-only bug (`onnxruntime-web`'s WASM compile failed under the site's CSP; worked in dev because dev mode has the broader `'unsafe-eval'`).
3. `8615080` "Add Vercel Git LFS verification safety net" — the 67MB ONNX model (plus a 14MB onnxruntime-web WASM runtime) couldn't be pushed as regular git objects on a slow connection; migrated to Git LFS and added a build-time check so a broken LFS checkout fails loudly instead of shipping pointer-stub files to production.
4. `c93486a` "Fix Vocal Remover mobile layout: footer wrap, touch-friendly drag handles, taller inputs" — mobile audit at 375/390px found real overflow and undersized touch targets; fixed scoped to Vocal Remover only (Audio Trim, which shares the underlying `SimpleWaveform` component, verified unaffected).
5. `14efc07` "Fix hero section: floating icons rendering above founder photo due to missing position property" — an unrelated, pre-existing bug (present since the initial commit) noticed and fixed in the same session; also moved the separation pipeline into a Web Worker mid-phase after discovering the main thread was blocking hard enough to trigger Chrome's "Page Unresponsive" dialog.

**Outcome**: the fourth audio tool, with the heaviest client-side compute in the suite (a real neural network running in-browser) and the first tool requiring Git LFS.

## What's next (not yet started)

- **Hinglish subtitle generator** — floated as a future Free Tools Suite addition; no design or implementation work has started.
- **Monetization strategy beyond WhatsApp CTA** — still undecided. Current model is entirely "free tool → WhatsApp lead," with no pricing/paywall on the tools themselves under consideration yet.
- **Free Tools CTA gaps** — Audio Trim's dead `WhatsAppCTA` import, and the total absence of a CTA on Noise Reduce and all four Design Tools, are known inconsistencies (see `PRD.md`/`rules.md`) not yet scheduled for a fix.
- **Firebase**: still an unused dependency (`firebase`/`firebase-admin`, plus `firestore.rules`/`storage.rules`/`firebase.json`). No decision recorded on whether to finish wiring it up or remove it.
