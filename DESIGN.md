---
name: PM Graphics Portfolio
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#FFFFFF'
  on-surface-variant: '#e2bfb0'
  inverse-surface: '#FFFFFF'
  inverse-on-surface: '#313030'
  outline: '#a98a7d'
  outline-variant: '#5a4136'
  surface-tint: '#ffb694'
  primary: '#ffb694'
  on-primary: '#571f00'
  primary-container: '#ff6a00'
  on-primary-container: '#571f00'
  inverse-primary: '#a14000'
  secondary: '#888888'
  on-secondary: '#FFFFFF'
  secondary-container: '#131313'
  on-secondary-container: '#FFFFFF'
  tertiary: '#FFFFFF'
  on-tertiary: '#FFFFFF'
  tertiary-container: '#FFFFFF'
  on-tertiary-container: '#FFFFFF'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  background: '#0B0B0B'
  on-background: '#FFFFFF'
  surface-variant: '#131313'
typography:
  display:
    fontFamily: Space Grotesk
    fontSize: 80px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 24px
  section-gap: 160px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system embodies **Luxury Minimalism** tailored for a high-end creative professional. The aesthetic is anchored in a **"Void & Fire"** concept: a dark, premium environment with deep blacks (#0B0B0B), charcoal surfaces (#131313), and intense orange (#FF6A00) accents. The target audience includes premium agencies, tech founders, and luxury brands seeking strategic design expertise.

The UI evokes a sense of **authority, precision, and modern sophistication**. By blending the structural rigidity of Swiss design with the ethereal qualities of Glassmorphism, the design system achieves a balance between being grounded and visionary. Every element is intentional, prioritizing high-impact whitespace and bold tones to allow the portfolio work to breathe and command attention.

## Colors

The palette is strictly controlled to maintain a premium atmosphere. 

- **Background (#0B0B0B):** A solid, deep black canvas representing the void, providing a dramatic backplane that highlights premium visuals and portfolio work.
- **Accent (#FF6A00):** A vibrant, fiery orange representing fire, energy, creative spark, and modern technical authority.
- **Glass Surfaces:** Semi-transparent dark layers of `#131313` at 40-50% opacity with thin white borders at 10% opacity that transition to active accent orange on hover.
- **Text:** Crisp white (`#FFFFFF`) for primary headings and metadata, and neutral light grey (`#888888`) for descriptions and secondary text.

## Typography

The typography strategy relies on the tension between the expressive nature of **Space Grotesk** and the invisible utility of **Inter**.

- **Headlines:** Space Grotesk should be set with tight letter-spacing to create a "blocky," editorial feel. Large display type should use "Bold" or "Medium" weights to dominate the layout.
- **Body:** Inter is used for all descriptive text. It should be set with generous line heights (1.6x) to ensure effortless readability against the dark background.
- **Labels:** Use uppercase Space Grotesk for section labels and tags to maintain the structural, architectural vibe of the system.

## Layout & Spacing

The layout utilizes a **12-column rigid grid** for desktop and a **4-column grid** for mobile. 

- **Modular Alignment:** Elements must snap to grid lines. Avoid centered layouts unless for massive display headlines; stick to a left-aligned, architectural composition.
- **Breathable Whitespace:** Use `section-gap` (160px) between major content blocks to signify a premium, unhurried pace.
- **The "Bento" Grid:** For the portfolio section, use a modular card system where items span variable column widths (e.g., a 2x2 grid where some cards span 8 columns and others 4) to create visual rhythm.

## Elevation & Depth

Hierarchy is established through **Backdrop Blurs** rather than traditional shadows.

1.  **Level 0 (Base):** Deep black (#0B0B0B).
2.  **Level 1 (Cards):** Glassmorphic surfaces with a 1px solid border (white at 10% opacity) and a 10px background blur. This creates a "frosted glass" effect that subtly floats above the black canvas.
3.  **Level 2 (Popovers/Nav):** Higher opacity glass (#131313 at 75%) with a soft, diffused orange shadow (0px 8px 32px rgba(255,106,0,0.15)) to suggest it is floating closer to the user.
4.  **Interaction:** When hovering over a card, the 1px border transitions to the Primary Accent color (#FF6A00) with a warm orange drop glow.

## Shapes

This design system uses a **Hyper-Rounded** language to contrast with the rigid grid. 

- **Primary Radius:** All main containers and cards use a 28px/32px radius. This creates a modern, "hardware-inspired" look reminiscent of high-end consumer electronics.
- **Buttons & Chips:** Use fully rounded (pill-shaped) corners.
- **Media:** Portfolio imagery and video should always inherit the container radius to maintain a cohesive visual unit.

## Components

### Buttons
- **Primary:** Solid #FF6A00 background with white text. Pill-shaped. On hover, slight scale increase (1.02x) and shadow glow (rgba(255,106,0,0.45)).
- **Secondary:** Ghost style with a 1.5px #FF6A00 border and orange text. Transitions to an orange background with white text on hover.

### Glass Cards
- Used for project showcases. Features a subtle 1px top-down gradient stroke to simulate a "light catch" on the top edge. All content inside cards follows the `stack-lg` spacing.

### Inputs
- Dark backgrounds (#131313) with a 28px radius. The focus state replaces the border with a 1.5px #FF6A00 stroke and a subtle outer glow.

### Navigation
- A floating "Island" style navbar at the top of the screen. Glassmorphic with pill-shaped active state indicators in the primary orange.

### Portfolio Tags
- Small, uppercase labels using Space Grotesk. Bordered with a pill-shaped radius, used to categorize projects (e.g., "STRATEGY", "3D RENDER").