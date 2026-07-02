"use client";

import React from "react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

// Since these are older components without "use client" directives at the top,
// we dynamically import them with SSR disabled to prevent hydration or SSR hook errors.
const CT01ColourWheel = dynamic(() => import("../../../../learning-tools/CT01_ColourWheel.jsx"), { ssr: false });
const CT02HueSaturationValue = dynamic(() => import("../../../../learning-tools/CT02_HueSaturationValue.jsx"), { ssr: false });
const CT03TintToneShade = dynamic(() => import("../../../../learning-tools/CT03_TintToneShade.jsx"), { ssr: false });
const CT04RGBCMYKHEXPantone = dynamic(() => import("../../../../learning-tools/CT04_RGBCMYKHEXPantone.jsx"), { ssr: false });
const CT05WarmVsCool = dynamic(() => import("../../../../learning-tools/CT05_WarmVsCool.jsx"), { ssr: false });
const CT06ColourHarmony = dynamic(() => import("../../../../learning-tools/CT06_ColourHarmony.jsx"), { ssr: false });
const CT07SixtyThirtyTen = dynamic(() => import("../../../../learning-tools/CT07_SixtyThirtyTen.jsx"), { ssr: false });
const CT08ColourPsychology = dynamic(() => import("../../../../learning-tools/CT08_ColourPsychology.jsx"), { ssr: false });
const CT09TemperatureContrast = dynamic(() => import("../../../../learning-tools/CT09_TemperatureContrast.jsx"), { ssr: false });
const CT10SimultaneousContrast = dynamic(() => import("../../../../learning-tools/CT10_SimultaneousContrast.jsx"), { ssr: false });
const CT11ColourAccessibility = dynamic(() => import("../../../../learning-tools/CT11_ColourAccessibility.jsx"), { ssr: false });

// ── Typography (T01–T05 live) ──────────────────────────────────────────────
const T01WhatIsTypography     = dynamic(() => import("../../../../learning-tools/T01_WhatIsTypography.jsx"),     { ssr: false });
const T02TypefaceVsFont       = dynamic(() => import("../../../../learning-tools/T02_TypefaceVsFont.jsx"),       { ssr: false });
const T03SerifVsSansSerif     = dynamic(() => import("../../../../learning-tools/T03_SerifVsSansSerif.jsx"),     { ssr: false });
const T04TypeScaleHierarchy   = dynamic(() => import("../../../../learning-tools/T04_TypeScaleHierarchy.jsx"),   { ssr: false });
const T05LeadingTrackingKerning = dynamic(() => import("../../../../learning-tools/T05_LeadingTrackingKerning.jsx"), { ssr: false });

export default function Level1Topic({ params }) {
  // In Next.js 15+, params is a Promise. Unwrap it with React.use()
  const { slug } = React.use(params);

  // ── Colour Theory ──────────────────────────────────────────────────────
  if (slug === "colour-wheel") {
    return (
      <div style={{ backgroundColor: "#FFFCF9", minHeight: "100vh" }}>
        <CT01ColourWheel />
      </div>
    );
  }
  
  if (slug === "hue-saturation-value") {
    return (
      <div style={{ backgroundColor: "#FFFCF9", minHeight: "100vh" }}>
        <CT02HueSaturationValue />
      </div>
    );
  }

  if (slug === "tint-tone-shade") {
    return (
      <div style={{ backgroundColor: "#FFFCF9", minHeight: "100vh" }}>
        <CT03TintToneShade />
      </div>
    );
  }

  if (slug === "rgb-cmyk-hex-pantone") {
    return (
      <div style={{ backgroundColor: "#FFFCF9", minHeight: "100vh" }}>
        <CT04RGBCMYKHEXPantone />
      </div>
    );
  }

  if (slug === "warm-vs-cool") {
    return (
      <div style={{ backgroundColor: "#FFFCF9", minHeight: "100vh" }}>
        <CT05WarmVsCool />
      </div>
    );
  }

  if (slug === "colour-harmony") {
    return (
      <div style={{ backgroundColor: "#FFFCF9", minHeight: "100vh" }}>
        <CT06ColourHarmony />
      </div>
    );
  }

  if (slug === "sixty-thirty-ten") {
    return (
      <div style={{ backgroundColor: "#FFFCF9", minHeight: "100vh" }}>
        <CT07SixtyThirtyTen />
      </div>
    );
  }

  if (slug === "colour-psychology") {
    return (
      <div style={{ backgroundColor: "#FFFCF9", minHeight: "100vh" }}>
        <CT08ColourPsychology />
      </div>
    );
  }

  if (slug === "temperature-and-contrast") {
    return (
      <div style={{ backgroundColor: "#FFFCF9", minHeight: "100vh" }}>
        <CT09TemperatureContrast />
      </div>
    );
  }

  if (slug === "simultaneous-contrast") {
    return (
      <div style={{ backgroundColor: "#FFFCF9", minHeight: "100vh" }}>
        <CT10SimultaneousContrast />
      </div>
    );
  }

  if (slug === "colour-accessibility") {
    return (
      <div style={{ backgroundColor: "#FFFCF9", minHeight: "100vh" }}>
        <CT11ColourAccessibility />
      </div>
    );
  }

  // ── Typography (T01–T05) ───────────────────────────────────────────────
  if (slug === "what-is-typography") {
    return (
      <div style={{ backgroundColor: "#FFFCF9", minHeight: "100vh" }}>
        <T01WhatIsTypography />
      </div>
    );
  }

  if (slug === "typeface-vs-font") {
    return (
      <div style={{ backgroundColor: "#FFFCF9", minHeight: "100vh" }}>
        <T02TypefaceVsFont />
      </div>
    );
  }

  if (slug === "serif-vs-sans-serif") {
    return (
      <div style={{ backgroundColor: "#FFFCF9", minHeight: "100vh" }}>
        <T03SerifVsSansSerif />
      </div>
    );
  }

  if (slug === "type-scale-hierarchy") {
    return (
      <div style={{ backgroundColor: "#FFFCF9", minHeight: "100vh" }}>
        <T04TypeScaleHierarchy />
      </div>
    );
  }

  if (slug === "leading-tracking-kerning") {
    return (
      <div style={{ backgroundColor: "#FFFCF9", minHeight: "100vh" }}>
        <T05LeadingTrackingKerning />
      </div>
    );
  }

  return notFound();
}
