# Design Language

## Palette

Defined as CSS custom properties in `app/globals.css`:

```css
--background: #0B0B0B        /* near-black base */
--surface: #131313
--on-surface: #e5e2e1
--primary: #ffb694
--primary-container: #ff6a00
--accent: #FF6A00             /* the core orange/amber brand accent */
--accent-soft: #ffb694
--outline: #a98a7d
--text-primary: #f3cece
--text-secondary: #888888
```

The Free Tools pages (Music Mixer, Audio Trim, Noise Reduce, Vocal Remover) use a closely-related but slightly warmer local palette in their own CSS files rather than the raw globals tokens: background `#15130f`/`#191712`/`#1d1a15` (card layers), accent `#c98a4b`, text `#efe7db`/`#a99f8f`/`#79715f`. Treat this as the established "tool card" palette — new tools should match it, not the raw `--accent: #FF6A00` used on the main marketing site, since it reads better against the tools' darker, warmer card surfaces.

Design tools (`components/design-tools/*.jsx`) each hardcode their own local theme object (e.g. `LayoutLab.jsx`'s `T.brand = "#FF7A00"`) rather than importing shared tokens — close to but not identical to the main accent. Not ideal for consistency, but that's the current reality; don't assume they pull from `globals.css`.

## Typography

- `Syne` → `--font-display` — headlines.
- `Inter` → `--font-inter` — body text.
- `Space Grotesk` → `--font-space-grotesk` — used for a subset of headings/mono-ish UI elements.
- `JetBrains Mono` — used throughout the Free Tools UIs (file sizes, timecodes, phase labels, hint text) as a monospace face for anything that reads as "data" rather than prose. Not declared via `next/font` in `layout.js`; referenced directly by font-family stacks in tool CSS files.

## Navbar / footer pattern

Single shared `Navbar` component (`components/Navbar.js` → `components/site/Navbar.js`) used on every page, including every tool page. Takes two props: `showBack` (boolean) and `backHref` (string, defaults to `/`) — every tool page renders `<Navbar showBack backHref="/tools" />` so there's a consistent way back to the tools hub, distinct from the marketing site's own navbar (no back button, full nav links). Don't build a one-off header for a new tool page — reuse `Navbar` with these props.

## Tool page layout shape

Every Free Tool follows roughly the same structural skeleton, established first by Music Mixer/Noise Reduce and reused since:

1. **Hero** — full-bleed section with the tool's own headline + a short one-line description, using a shared radial-glow background (`components/audio-tools/audio-hero-bg.css`) or a decorative animated background (`components/ui/cybercore-background.tsx`, Music Mixer only).
2. **Empty state** (no file uploaded yet) — a single centered upload button, then a feature-highlight strip (3-4 short value props with icons), then a "How It Works" 3-step strip. This is boilerplate — copy the shape, change the copy/icons.
3. **Working state** — a card (`.noise-comparison-container`/`.mixer-track` class family) containing the tool's actual interactive UI (waveform, controls, before/after players).
4. **Result/download state** — download button + a "start over"/"try another" ghost button.
5. **WhatsApp CTA** — see `rules.md`. Should be the last thing on the page.

Design tools (Color/Typography/Shape/Layout Lab) don't follow this upload→process→download shape since they're not file-based — they're single-screen interactive configurators. They still sit inside the same dark-theme visual language and use the shared `Navbar`.

## Mobile-responsive approach

- Breakpoints in practice: `768px` (primary tablet/mobile cutover) and `480px` (small-phone tightening) — consistent across `music-mixer.css`, `noise-reduce.css`, `audio-trim.css`.
- The shared `SimpleWaveform`/`music-mixer.css` mobile rules use `!important` liberally to override desktop flex layouts — this is a real constraint when extending a shared component for one tool's mobile needs: don't fight `!important` with more `!important` on the shared file, add a scoped modifier class instead (see `rules.md`'s "shared components" section — this is exactly the pattern used for Vocal Remover's mobile fixes: footer wrap, 32px touch-friendly drag handles, taller inputs, all gated behind a `.mixer-track--full-length` modifier class that Audio Trim never receives).
- Test at 375px (iPhone SE) and 390px (standard iPhone) — these are the two widths that have actually caught real overflow bugs in this project. Check for `document.documentElement.scrollWidth > clientWidth`, not just "does it look okay" — flex `nowrap` rows are the most common culprit.
- Touch targets: resize handles and small controls in the audio tools' waveform UI default to mouse-precision sizes (as small as 8px) inherited from wavesurfer-adjacent library defaults — don't assume "it's draggable" means "it's usable on a touchscreen." Apple HIG (44×44pt) / Material (48×48dp) are the reference minimums; this project has settled for ~32-36px as a practical middle ground that doesn't overwhelm small waveform elements.

## How new tools should visually match existing ones

1. Start from the closest existing tool's `page.tsx`/`page.jsx` and CSS file as a template rather than building from scratch — the empty/working/result state shape (above) is intentional, not incidental.
2. Reuse `Navbar`, `WhatsAppCTA`, and — for audio tools — `audio-hero-bg.css`, `SimpleWaveform` (if the tool needs a trim/selection UI) or `ffmpegMix.ts` (if it needs to encode/trim/mix audio).
3. Match the tool-card palette (`#15130f`/`#c98a4b`/`#efe7db` family) and JetBrains Mono for data/timecode text, not the raw site-wide `--accent`.
4. Don't introduce a new component library, state manager, or CSS methodology for a new tool — every tool so far is plain React state + hand-written CSS files, no exceptions.
