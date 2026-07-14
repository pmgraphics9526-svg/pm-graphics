# PM Graphics — Product Requirements

## What this is

PM Graphics (pmgraphics.in) is a design studio's marketing website that doubles as a lead-generation platform. It has two jobs:

1. **Convince visitors to hire the studio** — portfolio, services/pricing, testimonials, contact form.
2. **Generate leads through free, useful tools** — a suite of client-side audio/design utilities that let visitors experience the studio's quality firsthand, with every tool funneling to a WhatsApp CTA ("I used this tool, I need custom/professional work").

There is no e-commerce, no user accounts for visitors, and no SaaS subscription model — monetization is 100% "free tool → WhatsApp conversation → paid custom work," plus the marketing site's own contact form.

## Users

- **Prospective clients** — browse the portfolio and pricing on the homepage, submit the contact form or a testimonial, or reach out via WhatsApp.
- **Free-tool users** — arrive via search/social for a specific utility (e.g. "remove vocals from a song online"), use it entirely in-browser, and are shown a WhatsApp CTA on completion. This is the primary lead-gen surface, not a side feature.
- **The studio owner (admin)** — logs into `/admin` to manage portfolio entries, approve/reject visitor-submitted testimonials, and edit site-wide settings (contact info, pricing tiers) without touching code.

## Site structure

The public marketing site is **one page** (`app/page.js`) — Hero, portfolio grid (BentoGrid), About, Pricing, Process, Testimonials, Contact form — all anchor-scrolled sections, not separate routes. There are no standalone `/portfolio` or `/services` pages.

## Feature set

### Marketing site
- Hero section with founder photo + floating tool-icon animation (Ai/Ps/Ae/Pr/video camera).
- Portfolio showcase (BentoGrid), sourced from Airtable with a static-data fallback.
- Services/pricing tiers (Starter / Professional / Enterprise), editable from admin.
- Testimonials — visitors can submit one (goes in as "Pending"); only admin-approved ones show publicly.
- Contact form → written to Airtable as a lead record.

### Admin panel (`/admin`)
- Password-gated login (bcrypt-hashed password + JWT session cookie), with optional Google reCAPTCHA v3 and IP-based rate limiting.
- Dashboard (`/admin/dashboard`) for: portfolio CRUD, testimonial approval/rejection, contact-info editing, pricing/features editing.
- No database in the traditional sense — Airtable is the CMS backend (see `architecture.md`).

### Free Tools Suite (`/tools`)
Everything here runs **entirely client-side** — no upload, no server processing cost, no server-side file storage. Grouped into two categories on the tools hub:

**Audio Tools**
| Tool | Route | What it does |
|---|---|---|
| Audio Trim | `/tools/audio-trim` | Upload audio, drag-select a range on a waveform, download the trimmed MP3. |
| Noise Reduce | `/tools/noise-reduce` | Upload a voice recording, run an FFT/highpass denoiser, download the cleaned MP3. |
| Music Mixer | `/tools/music-mixer` | Upload 2–4 songs, beat-detect + drag-select cut regions per track, mix into one track with auto-crossfades. |
| Vocal Remover | `/tools/vocal-remover` | Upload a song, trim to a clip, run an on-device MDX-Net (ONNX) model to strip vocals, download the instrumental. |

**Design Tools**
| Tool | Route | What it does |
|---|---|---|
| Colour (Color Lab) | `/tools/color` | Interactive color-wheel/palette builder for brand colors. |
| Typography (Typography Lab) | `/tools/typography` | Preview/pair Google Fonts for a brand. |
| Shapes (Shape Lab) | `/tools/shape` | Explore shapes and their brand-psychology associations, with a recommendation engine. |
| Layout (Layout Lab) | `/tools/layout` | Grid-system explainer/preview with gutter/margin controls and real-world layout presets. |

## Known feature gaps (worth tracking, not blockers)
- Audio Trim imports `WhatsAppCTA` but never renders it — every other rendered-CTA tool has the lead-gen funnel, this one is silently missing it.
- Noise Reduce has no WhatsApp CTA at all.
- None of the four Design Tools have a WhatsApp CTA.
- These are inconsistencies against the stated lead-gen pattern (see `rules.md`), not intentional design choices.

## Non-goals (current)
- No visitor accounts/login.
- No payment processing on-site (deals close over WhatsApp/manually).
- No server-side media processing for the Free Tools (deliberate — see `architecture.md`/`memory.md` for why).
