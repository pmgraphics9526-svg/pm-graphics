# Project-wide Rules & Conventions

## Dark theme, every tool

Every tool page shares the same palette (see `design.md` for exact hex values): near-black background, orange/amber accent, `Inter`/`JetBrains Mono` typography. New tools should match this, not invent a new look. Reuse `components/audio-tools/audio-hero-bg.css` for the hero glow if the tool is an audio tool; reuse the `.btn-nr-primary`/`.btn-nr-ghost`/`.mixer-*` class families from `music-mixer.css`/`noise-reduce.css` where the UI shape matches (upload button, action bar, progress bar) rather than writing new button styles from scratch.

## Client-side-only processing for Free Tools

This is load-bearing, not a style preference: **no Free Tool sends media to a server for processing.** Audio trimming/mixing/denoising runs through `ffmpeg.wasm` in the browser; vocal separation runs through `onnxruntime-web` (WASM) in a Web Worker; design tools are pure client-side computation. This keeps the tool suite's marginal cost at zero regardless of usage volume — a new tool that requires server-side compute is a different cost model and needs to be a deliberate, explicit decision, not a default.

## WhatsApp CTA — the lead-gen pattern

Every tool is a lead-gen surface. The pattern: import `components/music-mixer/WhatsAppCTA.tsx` and render `<WhatsAppCTA toolName="<Tool Name>" phoneNumber="919101811613" />` after the tool's main result/output, so a successful tool use ends with a path to a real conversation. It builds a `wa.me` link pre-filled with `"Hi, I used ${toolName} on your site, I need custom/professional work"`.

**This is currently inconsistently applied — check before assuming it's done:**
- Music Mixer, Vocal Remover, and the tools hub page itself: implemented correctly.
- Audio Trim: imports `WhatsAppCTA` but never renders it (dead import).
- Noise Reduce and all four Design Tools (Color/Typography/Shape/Layout Lab): no CTA at all.

New tools must render it. If you're touching an existing tool for another reason and notice it's missing the CTA, flag it — don't silently add it as a scope-creep side effect unless asked, but don't assume it's already there either.

## Git LFS for binaries

Any file that isn't source code and crosses roughly a few MB — models, WASM binaries, large media — should be added to `.gitattributes` for LFS tracking *before* the first commit that adds it, e.g.:
```
git lfs track "*.onnx" "*.wasm"
```
If a large binary somehow lands in history as a regular git object first, converting it after the fact requires `git lfs migrate import` (not just `git lfs track`), and — critically — that only rewrites commits that aren't yet pushed to a shared remote. Once it's pushed, migrating it means rewriting shared history, which needs explicit buy-in before doing it. Don't assume `git lfs track` alone retroactively fixes an already-committed file.

Vercel needs its native "Git LFS Support" project setting enabled to resolve LFS pointers on deploy. `scripts/vercel-build.sh` is a build-time safety net that verifies the binaries actually resolved (not left as pointer stubs) before running `next build` — keep this check in place if you touch the build pipeline, and extend its file list if you add new LFS-tracked binaries that the build depends on.

## CSP header considerations for WASM tools

Any tool that calls `WebAssembly.instantiate()`/`WebAssembly.compile()` (directly or via a library like `onnxruntime-web`) needs `'wasm-unsafe-eval'` in the `script-src` directive of `next.config.mjs`'s CSP — this already exists site-wide, so new WASM-based tools should just work, but if you see a CSP violation error mentioning WebAssembly compilation in production (that didn't show up locally, since dev mode has the broader `'unsafe-eval'`), this is the first thing to check. Prefer `'wasm-unsafe-eval'` over `'unsafe-eval'` — it's the narrower, WASM-specific grant and doesn't open up general `eval()`/`Function()` usage site-wide.

If a tool needs its own Web Worker, make sure `worker-src` still includes `'self' blob:` (already does) — don't add a new CSP directive without checking whether the existing one already covers it.

## Shared components: scope changes, don't break siblings

`SimpleWaveform.tsx` (used by both Audio Trim and Vocal Remover), `ffmpegMix.ts` (used by Audio Trim, Noise Reduce, and Music Mixer), and the shared CSS files (`music-mixer.css`, `noise-reduce.css`, `audio-hero-bg.css`) are load-bearing for multiple tools at once. When a change is needed for one tool but not appropriate for its siblings:

- **Add a new optional prop/parameter that defaults to the old behavior**, rather than changing the default. E.g. `SimpleWaveform`'s `fullLengthByDefault` prop and the `.mixer-track--full-length` modifier class were added specifically so Vocal Remover could get a wider trim range and bigger touch targets without changing Audio Trim's behavior at all.
- **Scope new CSS to a modifier class gated by that prop**, not a bare selector — a bare `.mixer-track__footer` override affects every consumer of that class.
- **After any shared-component change, verify the sibling tool(s) are visually/functionally unaffected** — a `git diff` showing zero changes to files the sibling depends on is the cheap first check; a real before/after screenshot comparison is the thorough one for anything touching layout.

## Build must stay green before pushing

Run `npm run build` (not just `npm run dev` working locally) before pushing anything that touches shared code, CSP config, or the build pipeline itself — Turbopack dev mode and the production build can behave differently (e.g. CSP's dev-only `'unsafe-eval'` masks WASM CSP issues that only appear in production). If a change touches a shared component, also spot-check the sibling tool(s) that depend on it, not just the tool you were asked to change.
