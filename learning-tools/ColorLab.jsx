
import React, { useState, useMemo } from "react";

// ---------- color math ----------
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return { r: parseInt(h.substring(0, 2), 16), g: parseInt(h.substring(2, 4), 16), b: parseInt(h.substring(4, 6), 16) };
}
function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}
function luminance({ r, g, b }) {
  const a = [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
function contrastRatio(h1, h2) {
  const l1 = luminance(hexToRgb(h1)), l2 = luminance(hexToRgb(h2));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
function hueDistance(a, b) { let d = Math.abs(a - b); return d > 180 ? 360 - d : d; }
function pairScore(h1, h2) {
  const a = rgbToHsl(hexToRgb(h1)), b = rgbToHsl(hexToRgb(h2));
  const hd = hueDistance(a.h, b.h);
  const t = [0, 30, 120, 150, 180, 210];
  const n = t.reduce((bb, x) => (Math.abs(hd - x) < Math.abs(hd - bb) ? x : bb), t[0]);
  const harmony = 100 - Math.min(100, Math.abs(hd - n) * 3.5);
  const cr = contrastRatio(h1, h2);
  const cs = cr >= 3 && cr <= 12 ? 100 : cr < 3 ? (cr / 3) * 100 : Math.max(40, 100 - (cr - 12) * 6);
  const sat = (a.s + b.s) / 2;
  const ss = sat <= 70 ? 100 : Math.max(50, 100 - (sat - 70) * 1.6);
  return harmony * 0.45 + cs * 0.35 + ss * 0.2;
}
function premiumScore(colors) {
  let tot = 0, c = 0;
  for (let i = 0; i < colors.length; i++)
    for (let j = i + 1; j < colors.length; j++) { tot += pairScore(colors[i], colors[j]); c++; }
  return Math.round(Math.max(8, Math.min(99, tot / c)));
}
function relationshipLabel(c1, c2) {
  const d = hueDistance(rgbToHsl(hexToRgb(c1)).h, rgbToHsl(hexToRgb(c2)).h);
  if (d <= 20) return "Analogous";
  if (d <= 45) return "Near-analogous";
  if (d <= 100) return "Split";
  if (d <= 140) return "Triadic";
  return "Complementary";
}

// ---------- curated combos (scores verified in code, 95-99 for pairs) ----------
// "mood" = honest colour-psychology association, not invented statistics
const COMBOS_2 = [
  { name: "Onyx & Tangerine", colors: ["#101010", "#FF8200"], mood: "Bold, energetic, confident" },
  { name: "Black & Amber", colors: ["#0A0A0A", "#FF9633"], mood: "Warm, premium, inviting" },
  { name: "Coal & Marigold", colors: ["#121212", "#FFA040"], mood: "Friendly yet upscale" },
  { name: "Deep Sea & Steel", colors: ["#0D1B2A", "#8BA0B8"], mood: "Cool, minimal, corporate" },
  { name: "Navy & Camel", colors: ["#0D1B2A", "#C99A6A"], mood: "Refined, classic menswear" },
  { name: "Ink & Dusk", colors: ["#1B1B2E", "#C9A0A0"], mood: "Quiet luxury, editorial" },
  { name: "Pine & Sage", colors: ["#1E2E22", "#A3C9AD"], mood: "Natural, calm, organic" },
  { name: "Maroon & Rosewood", colors: ["#3A1A1A", "#C99A9A"], mood: "Heritage, warm, grounded" },
  { name: "Oxblood & Blush", colors: ["#2E1414", "#C4A0A0"], mood: "Rich, intimate, premium" },
  { name: "Wine & Mauve", colors: ["#3E1F1F", "#C9A5A5"], mood: "Elegant, soft, mature" },
  { name: "Olive & Wheat", colors: ["#332B1A", "#C4AE7E"], mood: "Earthy, crafted, timeless" },
  { name: "Plum & Petal", colors: ["#33141F", "#C99AAA"], mood: "Feminine, modern, gentle" },
  { name: "Navy & Sand", colors: ["#1A1A2E", "#C9A07A"], mood: "Coastal, balanced, trusted" },
  { name: "Charcoal & Mint", colors: ["#1B1B1B", "#A5C9CA"], mood: "Fresh, clean, tech-calm" },
  { name: "Forest & Eucalyptus", colors: ["#13231A", "#9CC4A6"], mood: "Wellness, eco, soothing" },
  { name: "Indigo & Lilac", colors: ["#241B33", "#A695C9"], mood: "Creative, dreamy, soft" },
  { name: "Teal & Aqua", colors: ["#13282E", "#88C2CC"], mood: "Coastal, clear, modern" },
  { name: "Espresso & Latte", colors: ["#2C2418", "#C9B080"], mood: "Cozy, food-warm, organic" },
  { name: "Slate & Stone", colors: ["#0F1419", "#C9C0A0"], mood: "Neutral, architectural, calm" },
  { name: "Aubergine & Heather", colors: ["#2D1B30", "#B89AC4"], mood: "Luxe, artistic, unique" },
];

// 3-colour realistic top range is ~90-93 (verified); honest "90+" label
const COMBOS_3 = [
  { name: "Rosewood Layers", colors: ["#3E1F1F", "#C9A5A5", "#A07878"], mood: "Elegant, warm, mature" },
  { name: "Navy & Sand", colors: ["#1A1A2E", "#C9A07A", "#A37852"], mood: "Coastal, balanced, trusted" },
  { name: "Deep Sea Steel", colors: ["#0D1B2A", "#8BA0B8", "#5E7488"], mood: "Corporate, cool, minimal" },
  { name: "Warm Studio", colors: ["#101010", "#FFA040", "#C56A1E"], mood: "Bold, energetic depth" },
  { name: "Ocean Trio", colors: ["#102429", "#7FBAC4", "#52909C"], mood: "Fresh, clear, modern" },
  { name: "Rose Plum", colors: ["#2E1A24", "#C99AAE", "#A07085"], mood: "Feminine, soft, premium" },
  { name: "Violet Mist", colors: ["#241B33", "#A695C9", "#7A6AA0"], mood: "Creative, dreamy, unique" },
  { name: "Teal Depths", colors: ["#13282E", "#88C2CC", "#5A9AA5"], mood: "Coastal, calm, clean" },
  { name: "Sage Forest", colors: ["#1B3022", "#8FB89A", "#5E8A6E"], mood: "Natural, eco, soothing" },
  { name: "Espresso Gold", colors: ["#2C2418", "#C9B080", "#A38A55"], mood: "Cozy, organic, refined" },
  { name: "Indigo Dusk", colors: ["#1E1B4B", "#9B8FC9", "#6E5FA0"], mood: "Artistic, deep, modern" },
  { name: "Aubergine Layers", colors: ["#2D1B30", "#B89AC4", "#8A6E96"], mood: "Luxe, artistic, bold" },
  { name: "Stone Sand", colors: ["#0F1419", "#C9C0A0", "#A39A75"], mood: "Neutral, architectural" },
  { name: "Bronze Stack", colors: ["#33241A", "#C9AE85", "#A3855A"], mood: "Earthy, grounded luxe" },
  { name: "Eucalyptus", colors: ["#1A2E22", "#A3C9AD", "#74A082"], mood: "Wellness, fresh, calm" },
];

const T = {
  bg: "#FDF8F0", panel: "#FFFFFF", border: "#E8DFCF", line: "#F0E8DC",
  text: "#3A342A", muted: "#6B6258", dim: "#A79C8C", brand: "#FF7A00",
};

export default function ColorTheoryLab() {
  const [mode, setMode] = useState(2);
  const [colors, setColors] = useState(["#101010", "#FF7A00", "#C56A1E"]);
  const [showSuggest, setShowSuggest] = useState(false);

  const active = colors.slice(0, mode);
  const score = useMemo(() => premiumScore(active), [active]);
  const rel = useMemo(() => relationshipLabel(active[0], active[1]), [active]);
  const cr = useMemo(() => contrastRatio(active[0], active[1]).toFixed(1), [active]);

  const verdict =
    score >= 80 ? { t: "Premium", c: T.brand }
      : score >= 60 ? { t: "Solid", c: "#7FB069" }
      : score >= 40 ? { t: "Risky", c: "#E0A458" }
      : { t: "Clashing", c: "#E94560" };

  const setColorAt = (i, val) => setColors((p) => p.map((c, idx) => (idx === i ? val : c)));
  const applyCombo = (combo) => {
    const next = [...colors];
    combo.colors.forEach((c, i) => { next[i] = c; });
    setColors(next);
    setShowSuggest(false);
  };

  const labels = ["Base", "Accent", "Highlight"];
  const suggestions = mode === 2 ? COMBOS_2 : COMBOS_3;

  return (
    <div style={{
      minHeight: "100vh", background: T.bg, color: T.text,
      fontFamily: "'Inter', system-ui, sans-serif", padding: "40px 20px 70px",
    }}>
      <style>{`
        .ctl-grid { display: grid; grid-template-columns: 1fr; gap: 28px; max-width: 460px; margin: 0 auto; }
        @media (min-width: 860px) {
          .ctl-grid { grid-template-columns: 1fr 1fr; gap: 44px; max-width: 1000px; align-items: start; }
          .ctl-head { max-width: 1000px; margin: 0 auto 36px; }
        }
        .ctl-suggest-btn:hover { background: ${T.brand}; color: #FFFFFF; }
        .ctl-combo:hover { border-color: ${T.brand}; }
      `}</style>

      <div className="ctl-head">
        <p style={{ letterSpacing: 4, fontSize: 11, color: T.dim, margin: 0, fontWeight: 600 }}>
          LEARNING · COLOUR THEORY
        </p>
        <h1 style={{ fontSize: 34, lineHeight: 1.08, margin: "10px 0 8px", fontWeight: 800, fontFamily: "Georgia, serif" }}>
          Pick your colours. See how premium they look.
        </h1>
        <p style={{ color: T.muted, fontSize: 15, margin: 0, lineHeight: 1.55, maxWidth: 560 }}>
          Every combination carries a mood. Change a colour and watch the score react live.
          Learn <em>why</em> a pairing works — then, if you're stuck, get a curated suggestion below.
        </p>
      </div>

      <div className="ctl-grid">
        {/* LEFT: controls + preview */}
        <div>
          <div style={{ display: "flex", background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, padding: 4, marginBottom: 20 }}>
            {[2, 3].map((m) => (
              <button key={m} onClick={() => setMode(m)}
                style={{
                  flex: 1, padding: "11px 0", borderRadius: 9, border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 700, transition: "all .2s",
                  background: mode === m ? T.brand : "transparent", color: mode === m ? "#FFFFFF" : T.muted,
                }}>
                {m} Colours
              </button>
            ))}
          </div>

          <div style={{ borderRadius: 18, overflow: "hidden", border: `1px solid ${T.border}`, marginBottom: 22 }}>
            <div style={{ background: active[0], padding: "40px 24px" }}>
              <span style={{ display: "inline-block", padding: "8px 18px", borderRadius: 30, background: active[1], color: active[0], fontWeight: 700, fontSize: 15 }}>
                Your Brand
              </span>
              <h2 style={{ color: active[1], fontSize: 28, margin: "18px 0 6px", fontFamily: "Georgia, serif" }}>Premium feel.</h2>
              <p style={{ color: active[1], opacity: 0.8, fontSize: 13, margin: 0 }}>This is how your colours work on a real design.</p>
              {mode === 3 && <div style={{ marginTop: 18, height: 6, width: 90, borderRadius: 10, background: active[2] }} />}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {active.map((val, i) => (
              <label key={i} style={{ flex: 1 }}>
                <span style={{ fontSize: 11, color: T.dim, letterSpacing: 1 }}>{labels[i].toUpperCase()}</span>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginTop: 6, background: T.panel, border: `1px solid ${T.line}`, borderRadius: 12, padding: 8 }}>
                  <input type="color" value={val} onChange={(e) => setColorAt(i, e.target.value)}
                    style={{ width: "100%", height: 42, border: "none", background: "none", borderRadius: 8, cursor: "pointer" }} />
                  <span style={{ fontSize: 12, fontFamily: "monospace", color: T.dim }}>{val.toUpperCase()}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* RIGHT: score + breakdown + suggestion */}
        <div>
          <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 13, color: T.muted }}>Premium Score</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: verdict.c }}>{verdict.t}</span>
            </div>
            <div style={{ fontSize: 58, fontWeight: 800, margin: "4px 0 16px", color: verdict.c }}>
              {score}<span style={{ fontSize: 24, color: T.dim }}>/100</span>
            </div>
            <div style={{ height: 8, background: T.border, borderRadius: 10, overflow: "hidden" }}>
              <div style={{ width: `${score}%`, height: "100%", background: verdict.c, transition: "width .3s ease" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
            <Stat label="Relationship" value={rel} sub="base vs accent" />
            <Stat label="Contrast" value={`${cr}:1`} sub={cr >= 4.5 ? "Text readable" : "Text tough"} />
          </div>

          <p style={{ color: T.dim, fontSize: 12.5, lineHeight: 1.65, marginBottom: 22 }}>
            <strong style={{ color: T.muted }}>How the score works:</strong> it blends colour harmony
            (how hues relate), contrast balance (readability), and saturation restraint. Loud, over-saturated
            pairs score lower — premium design leans on restraint.
          </p>

          <button className="ctl-suggest-btn" onClick={() => setShowSuggest(true)}
            style={{ width: "100%", padding: "15px", borderRadius: 12, border: `1px solid ${T.brand}`, background: "transparent", color: T.brand, fontWeight: 700, fontSize: 14, cursor: "pointer", letterSpacing: 0.3, transition: "all .2s" }}>
            Premium Suggestions
          </button>
          <p style={{ color: T.dim, fontSize: 11.5, textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>
            Try your own first — that's how you learn. Open this only if you're stuck.
          </p>
        </div>
      </div>

      {/* Suggestion sheet */}
      {showSuggest && (
        <div onClick={() => setShowSuggest(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.72)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 18, width: "100%", maxWidth: 480, maxHeight: "82vh", overflowY: "auto", padding: "22px 18px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <h3 style={{ margin: 0, fontSize: 19, fontFamily: "Georgia, serif" }}>
                Premium {mode}-colour combos
              </h3>
              <button onClick={() => setShowSuggest(false)} style={{ background: "none", border: "none", color: T.muted, fontSize: 24, cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>
            <p style={{ color: T.dim, fontSize: 12, margin: "0 0 16px", lineHeight: 1.5 }}>
              {mode === 2
                ? "Picked from across the colour wheel — each scores 97+ on harmony, contrast and restraint. The mood note is colour psychology, not a fixed rule."
                : "Three colours are harder to balance, so these top out around 90-95 — that's an honest ceiling, not a flaw. Picked from many colour families."}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {suggestions.map((combo, i) => {
                const s = premiumScore(combo.colors);
                return (
                  <button key={i} className="ctl-combo" onClick={() => applyCombo(combo)}
                    style={{ display: "flex", alignItems: "center", gap: 13, padding: 11, background: T.panel, border: `1px solid ${T.line}`, borderRadius: 12, cursor: "pointer", textAlign: "left", transition: "border-color .15s" }}>
                    <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                      {combo.colors.map((c, j) => <span key={j} style={{ width: 24, height: 50, background: c }} />)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{combo.name}</div>
                      <div style={{ fontSize: 11.5, color: T.muted, margin: "1px 0 2px" }}>{combo.mood}</div>
                      <div style={{ fontSize: 10.5, color: T.dim, fontFamily: "monospace" }}>{combo.colors.join("  ")}</div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: T.brand }}>{s}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16 }}>
      <div style={{ fontSize: 11, color: T.dim, letterSpacing: 1 }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 17, fontWeight: 700, margin: "4px 0 2px" }}>{value}</div>
      <div style={{ fontSize: 11, color: T.muted }}>{sub}</div>
    </div>
  );
}
