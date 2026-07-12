import { useState, useRef } from "react";

const T = {
  bg: "#0B0B0B", panel: "#1A1A1A", panel2: "#1A1A1A", border: "rgba(255,255,255,0.1)",
  text: "#EDEDED", muted: "#AAAAAA", dim: "#999999", brand: "#FF7A00",
  white: "#FFFFFF", green: "#3ECB71", red: "#FF5C7A", blue: "#5B9CFF",
};
// Canvas-local colour: shape/boolean-op preview artboards intentionally stay
// white paper regardless of site theme (boolean "holes" must match this bg
// exactly to read as cutouts) — not read from T.panel.
const CV_PANEL = "#FFFFFF";

function Card({ children, style = {} }) {
  return <div style={{ background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, ...style }}>{children}</div>;
}
function Tag({ children, color = T.brand }) {
  return <span style={{ fontSize: 10, letterSpacing: 3, color, fontWeight: 700 }}>{children}</span>;
}

// ── Shape Builder ──
const SHAPE_TYPES = [
  { id: "circle",   label: "Circle" },
  { id: "square",   label: "Square" },
  { id: "triangle", label: "Triangle" },
  { id: "organic",  label: "Organic" },
  { id: "pentagon", label: "Pentagon" },
  { id: "diamond",  label: "Diamond" },
];

function ShapePreview({ type, size, radius, fill, stroke, strokeW }) {
  const s = size;
  const cx = 100, cy = 100;
  const shapeProps = { fill, stroke, strokeWidth: strokeW };

  const renderShape = () => {
    if (type === "circle") return <circle cx={cx} cy={cy} r={s * 0.42} {...shapeProps} />;
    if (type === "square") {
      const half = s * 0.42;
      return <rect x={cx - half} y={cy - half} width={half * 2} height={half * 2} rx={radius} {...shapeProps} />;
    }
    if (type === "triangle") {
      const r2 = s * 0.46;
      const pts = [0, 1, 2].map(i => {
        const a = (i * 120 - 90) * Math.PI / 180;
        return `${cx + r2 * Math.cos(a)},${cy + r2 * Math.sin(a)}`;
      }).join(" ");
      return <polygon points={pts} {...shapeProps} />;
    }
    if (type === "organic") {
      const r2 = s * 0.4;
      return <path d={`M${cx},${cy - r2} C${cx + r2 * 0.8},${cy - r2 * 1.1} ${cx + r2 * 1.2},${cy} ${cx + r2 * 0.9},${cy + r2 * 0.8} C${cx + r2 * 0.6},${cy + r2 * 1.2} ${cx - r2 * 0.4},${cy + r2 * 1.1} ${cx - r2},${cy + r2 * 0.5} C${cx - r2 * 1.3},${cy} ${cx - r2 * 0.9},${cy - r2 * 0.6} ${cx},${cy - r2} Z`} {...shapeProps} />;
    }
    if (type === "pentagon") {
      const r2 = s * 0.44;
      const pts = [0, 1, 2, 3, 4].map(i => {
        const a = (i * 72 - 90) * Math.PI / 180;
        return `${cx + r2 * Math.cos(a)},${cy + r2 * Math.sin(a)}`;
      }).join(" ");
      return <polygon points={pts} {...shapeProps} />;
    }
    if (type === "diamond") {
      const r2 = s * 0.46;
      return <polygon points={`${cx},${cy - r2} ${cx + r2 * 0.68},${cy} ${cx},${cy + r2} ${cx - r2 * 0.68},${cy}`} {...shapeProps} />;
    }
  };

  return (
    <svg viewBox="0 0 200 200" width="100%" style={{ maxHeight: 240, display: "block" }}>
      <rect width="200" height="200" fill={CV_PANEL} rx="12" />
      {[40, 80, 120, 160].map(x => [40, 80, 120, 160].map(y => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={1} fill={T.border} />
      )))}
      {renderShape()}
    </svg>
  );
}

function ShapeBuilder() {
  const [type, setType] = useState("circle");
  const [size, setSize] = useState(60);
  const [radius, setRadius] = useState(8);
  const [fill, setFill] = useState("#FF7A00");
  const [strokeC, setStrokeC] = useState("#FF7A00");
  const [strokeW, setStrokeW] = useState(0);
  const [mode, setMode] = useState("fill");

  const shapeInfo = {
    circle: "Circles: safe, friendly, infinite. No corners = no threat. Use for community, wellness, children's brands.",
    square: `Radius ${radius}px — ${radius === 0 ? "sharp: aggressive, technical" : radius < 10 ? "structured: professional, B2B" : radius < 24 ? "balanced: modern default" : "rounded: friendly, consumer"}. Rectangles signal stability and trust.`,
    triangle: "Triangles: dynamic, directional, tense. Sharp angles trigger energy responses. Use for sports, alerts, disruption.",
    organic: "Organic shapes: human, creative, natural. Imperfect asymmetry signals authenticity and craft.",
    pentagon: "Pentagons: structured but uncommon. Five sides suggest balance with a twist — less rigid than a square.",
    diamond: "Diamonds: premium, directional, elegant. The rotated square adds tension and luxury feel.",
  };

  return (
    <div className="sl-content-grid">
      {/* LEFT: Preview + info */}
      <div>
        <Card style={{ padding: 12, marginBottom: 12 }}>
          <ShapePreview
            type={type} size={size} radius={radius}
            fill={mode === "fill" || mode === "both" ? fill : "transparent"}
            stroke={mode === "stroke" || mode === "both" ? strokeC : "transparent"}
            strokeW={strokeW}
          />
        </Card>
        <div style={{ background: T.panel, borderRadius: 10, padding: "12px 16px", fontSize: 13, color: T.dim, lineHeight: 1.6 }}>
          {shapeInfo[type]}
        </div>
      </div>

      {/* RIGHT: Controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div style={{ fontSize: 11, color: T.dim, letterSpacing: 2, marginBottom: 10 }}>SHAPE TYPE</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {SHAPE_TYPES.map(s => (
              <button key={s.id} onClick={() => setType(s.id)} style={{ flex: "1 1 calc(33% - 6px)", padding: "8px 4px", background: type === s.id ? "rgba(255,122,0,.12)" : T.panel, border: `1px solid ${type === s.id ? T.brand : T.border}`, borderRadius: 10, color: type === s.id ? T.brand : T.muted, cursor: "pointer", fontSize: 12, fontWeight: type === s.id ? 700 : 400 }}>{s.label}</button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, color: T.dim, letterSpacing: 2, marginBottom: 8 }}>RENDER MODE</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[["fill", "Fill"], ["stroke", "Stroke"], ["both", "Both"]].map(([id, lbl]) => (
              <button key={id} onClick={() => setMode(id)} style={{ flex: 1, padding: "7px 4px", background: mode === id ? "rgba(255,122,0,.12)" : T.panel, border: `1px solid ${mode === id ? T.brand : T.border}`, borderRadius: 8, color: mode === id ? T.brand : T.muted, cursor: "pointer", fontSize: 11 }}>{lbl}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <label style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: T.dim, marginBottom: 6 }}>Size — {size}px</div>
            <input type="range" min={20} max={90} value={size} onChange={e => setSize(Number(e.target.value))} style={{ width: "100%", accentColor: T.brand }} />
          </label>
          {type === "square" && (
            <label style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: T.dim, marginBottom: 6 }}>Radius — {radius}px</div>
              <input type="range" min={0} max={50} value={radius} onChange={e => setRadius(Number(e.target.value))} style={{ width: "100%", accentColor: T.brand }} />
            </label>
          )}
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {(mode === "fill" || mode === "both") && (
            <label style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: T.dim, marginBottom: 6 }}>Fill colour</div>
              <input type="color" value={fill} onChange={e => setFill(e.target.value)} style={{ width: "100%", height: 38, border: "none", background: "none", cursor: "pointer", borderRadius: 8 }} />
            </label>
          )}
          {(mode === "stroke" || mode === "both") && (
            <>
              <label style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: T.dim, marginBottom: 6 }}>Stroke colour</div>
                <input type="color" value={strokeC} onChange={e => setStrokeC(e.target.value)} style={{ width: "100%", height: 38, border: "none", background: "none", cursor: "pointer", borderRadius: 8 }} />
              </label>
              <label style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: T.dim, marginBottom: 6 }}>Stroke — {strokeW}px</div>
                <input type="range" min={1} max={12} value={strokeW || 2} onChange={e => setStrokeW(Number(e.target.value))} style={{ width: "100%", accentColor: T.brand }} />
              </label>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Boolean Lab ──
const BOOL_OPS = [
  { id: "union",     label: "Union",     desc: "Merge both shapes into one outline." },
  { id: "subtract",  label: "Subtract",  desc: "Top shape punches a hole into the bottom." },
  { id: "intersect", label: "Intersect", desc: "Keep only the overlapping area." },
  { id: "exclude",   label: "Exclude",   desc: "Remove the overlap, keep the rest." },
];

const SHAPE_A_OPTS = ["circle", "square", "triangle", "diamond"];
const SHAPE_B_OPTS = ["circle", "square", "triangle", "diamond"];

function BoolShape({ type, cx, cy, r, fill, opacity = 1 }) {
  const p = { fill, opacity };
  if (type === "circle") return <circle cx={cx} cy={cy} r={r} {...p} />;
  if (type === "square") return <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} rx={4} {...p} />;
  if (type === "triangle") {
    const pts = [0, 1, 2].map(i => {
      const a = (i * 120 - 90) * Math.PI / 180;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");
    return <polygon points={pts} {...p} />;
  }
  if (type === "diamond") return <polygon points={`${cx},${cy - r} ${cx + r * 0.7},${cy} ${cx},${cy + r} ${cx - r * 0.7},${cy}`} {...p} />;
}

function BooleanLab() {
  const [shapeA, setShapeA] = useState("circle");
  const [shapeB, setShapeB] = useState("square");
  const [op, setOp] = useState("subtract");
  const [offset, setOffset] = useState(28);

  const ax = 80, ay = 70, r = 38;
  const bx = ax + offset, by = ay;
  const opInfo = BOOL_OPS.find(o => o.id === op);

  const renderResult = () => {
    if (op === "union") return (
      <>
        <BoolShape type={shapeA} cx={ax} cy={ay} r={r} fill={T.brand} opacity={0.9} />
        <BoolShape type={shapeB} cx={bx} cy={by} r={r} fill={T.brand} opacity={0.9} />
      </>
    );
    if (op === "subtract") return (
      <>
        <BoolShape type={shapeA} cx={ax} cy={ay} r={r} fill={T.brand} opacity={0.9} />
        <BoolShape type={shapeB} cx={bx} cy={by} r={r} fill={CV_PANEL} opacity={1} />
      </>
    );
    if (op === "intersect") return (
      <>
        <BoolShape type={shapeA} cx={ax} cy={ay} r={r} fill="#333" opacity={0.7} />
        <BoolShape type={shapeB} cx={bx} cy={by} r={r} fill="#333" opacity={0.7} />
        <svg x={ax - r} y={ay - r} width={r * 2} height={r * 2} overflow="visible">
          <defs><clipPath id="clipA2"><BoolShape type={shapeA} cx={r} cy={r} r={r} fill="white" /></clipPath></defs>
          <BoolShape type={shapeB} cx={bx - ax + r} cy={r} r={r} fill={T.brand} clipPath="url(#clipA2)" />
        </svg>
      </>
    );
    if (op === "exclude") return (
      <>
        <BoolShape type={shapeA} cx={ax} cy={ay} r={r} fill={T.brand} opacity={0.9} />
        <BoolShape type={shapeB} cx={bx} cy={by} r={r} fill={T.brand} opacity={0.9} />
        <svg x={ax - r} y={ay - r} width={r * 2 + 20} height={r * 2} overflow="visible">
          <defs><clipPath id="clipExA"><BoolShape type={shapeA} cx={r} cy={r} r={r} fill="white" /></clipPath></defs>
          <BoolShape type={shapeB} cx={bx - ax + r} cy={r} r={r} fill={CV_PANEL} clipPath="url(#clipExA)" />
        </svg>
      </>
    );
  };

  return (
    <div className="sl-content-grid">
      {/* LEFT: Shape pickers + Result */}
      <div>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: T.dim, letterSpacing: 2, marginBottom: 8 }}>SHAPE A</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {SHAPE_A_OPTS.map(s => (
                <button key={s} onClick={() => setShapeA(s)} style={{ padding: "7px 10px", background: shapeA === s ? "rgba(255,122,0,.12)" : T.panel, border: `1px solid ${shapeA === s ? T.brand : T.border}`, borderRadius: 8, color: shapeA === s ? T.brand : T.muted, cursor: "pointer", fontSize: 12, textAlign: "left" }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
              ))}
            </div>
          </div>
          <div style={{ flex: 2 }}>
            <div style={{ fontSize: 11, color: T.dim, letterSpacing: 2, marginBottom: 8 }}>RESULT</div>
            <div style={{ background: CV_PANEL, borderRadius: 12, overflow: "hidden" }}>
              <svg viewBox="0 0 200 140" width="100%">{renderResult()}</svg>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: T.dim, letterSpacing: 2, marginBottom: 8 }}>SHAPE B</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {SHAPE_B_OPTS.map(s => (
                <button key={s} onClick={() => setShapeB(s)} style={{ padding: "7px 10px", background: shapeB === s ? "rgba(255,122,0,.12)" : T.panel, border: `1px solid ${shapeB === s ? T.brand : T.border}`, borderRadius: 8, color: shapeB === s ? T.brand : T.muted, cursor: "pointer", fontSize: 12, textAlign: "left" }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Operation + Overlap + Info */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div style={{ fontSize: 11, color: T.dim, letterSpacing: 2, marginBottom: 8 }}>OPERATION</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {BOOL_OPS.map(o => (
              <button key={o.id} onClick={() => setOp(o.id)} style={{ flex: "1 1 calc(50% - 6px)", padding: "9px 4px", background: op === o.id ? "rgba(255,122,0,.12)" : T.panel, border: `1px solid ${op === o.id ? T.brand : T.border}`, borderRadius: 8, color: op === o.id ? T.brand : T.muted, cursor: "pointer", fontSize: 12, fontWeight: op === o.id ? 700 : 400 }}>{o.label}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: T.dim, marginBottom: 6 }}>Overlap — {Math.round((1 - offset / 76) * 100)}%</div>
          <input type="range" min={0} max={76} value={offset} onChange={e => setOffset(Number(e.target.value))} style={{ width: "100%", accentColor: T.brand }} />
        </div>
        <div style={{ background: T.panel, borderRadius: 10, padding: "12px 14px", fontSize: 13, color: T.dim, lineHeight: 1.6 }}>
          <strong style={{ color: T.white }}>{opInfo.label}:</strong> {opInfo.desc}
        </div>
        <div style={{ background: "rgba(255,122,0,0.05)", border: `1px solid rgba(255,122,0,0.15)`, borderRadius: 10, padding: "12px 14px", fontSize: 12.5, color: T.muted, lineHeight: 1.6 }}>
          Boolean operations are the core of vector logo construction. Every complex shape — Airbnb's Bélo, the Apple bite, the FedEx arrow — is built from simple primitives combined with these four operations.
        </div>
      </div>
    </div>
  );
}

// ── Brand Fit ──
const QUESTIONS = [
  { id: "emotion",   q: "What emotion do you want to trigger first?",    opts: ["Trust & Stability", "Energy & Action", "Care & Warmth", "Creativity & Play"] },
  { id: "audience",  q: "Who is your primary audience?",                  opts: ["B2B / Enterprise", "Young Adults", "Families & Kids", "Creatives & Artists"] },
  { id: "industry",  q: "What is your industry?",                          opts: ["Tech / Finance", "Sport / Fitness", "Health / Wellness", "Food / Lifestyle"] },
];

const RECS = {
  "Trust & Stability-B2B / Enterprise-Tech / Finance":     { shape: "Rectangle", radius: "4–8px",   color: T.blue,  why: "Rectangles + tight radius = rational, reliable, trustworthy. Every major bank and enterprise SaaS uses this exact system." },
  "Trust & Stability-B2B / Enterprise-Sport / Fitness":    { shape: "Octagon",   radius: "0–4px",   color: T.muted, why: "Structured shape with performance edge. Think MMA, competitive athletics — controlled aggression." },
  "Trust & Stability-B2B / Enterprise-Health / Wellness":  { shape: "Circle",    radius: "50%",     color: T.green, why: "Circle signals safety and care even in a B2B context. Medical software, EHRs, and health platforms need warmth without losing authority." },
  "Trust & Stability-B2B / Enterprise-Food / Lifestyle":   { shape: "Rectangle", radius: "8–12px",  color: T.muted, why: "Food brands targeting businesses (delivery, corporate catering) need approachability with structure." },
  "Trust & Stability-Young Adults-Tech / Finance":          { shape: "Rounded Rect", radius: "12–16px", color: T.blue, why: "Young adult fintech (Revolut, Monzo) balances trust with friendliness. More radius than enterprise, same rectangular foundation." },
  "Trust & Stability-Young Adults-Sport / Fitness":         { shape: "Triangle",  radius: "0px",    color: T.red,  why: "Young sports audiences want edge and aspiration. Triangle points upward = ambition." },
  "Trust & Stability-Young Adults-Health / Wellness":       { shape: "Circle",    radius: "50%",    color: T.green, why: "Mental health apps targeting young adults need maximum softness. Headspace, Calm — all circles and blobs." },
  "Trust & Stability-Young Adults-Food / Lifestyle":        { shape: "Rounded Rect", radius: "16px", color: T.brand, why: "Consumer food apps need warmth. Rounded rects + your brand colour = welcoming without being childish." },
  "Energy & Action-B2B / Enterprise-Tech / Finance":        { shape: "Diamond",   radius: "0–2px",  color: T.brand, why: "Diamond rotated square gives enterprise energy — not a startup blob, not a boring rect. Distinctive." },
  "Energy & Action-B2B / Enterprise-Sport / Fitness":       { shape: "Triangle",  radius: "0px",    color: T.red,   why: "B2B sports (equipment, analytics, infrastructure) needs the same aspiration signal as consumer brands." },
  "Energy & Action-Young Adults-Tech / Finance":            { shape: "Slash/Diagonal", radius: "0px", color: T.brand, why: "Diagonal shapes and angles (like Revolut's 15° system) give fintech targeting young adults a sense of forward motion." },
  "Energy & Action-Young Adults-Sport / Fitness":           { shape: "Triangle",  radius: "0px",    color: T.red,   why: "Classic: Adidas, Nike angles, Puma. Sharp = speed. Triangle pointing up = performance and aspiration." },
  "Care & Warmth-Families & Kids-Health / Wellness":        { shape: "Circle",    radius: "50%",    color: T.green, why: "Maximum safety signal. Every corner rounded away. No threat cues at all." },
  "Care & Warmth-Families & Kids-Food / Lifestyle":         { shape: "Organic",   radius: "50%+",   color: "#FF9900", why: "Blob shapes, mascots, and organic forms dominate family food brands. Imperfection = handmade = trustworthy for parents." },
  "Care & Warmth-Young Adults-Health / Wellness":           { shape: "Organic",   radius: "50%",    color: T.green, why: "Organic asymmetric shapes for wellness apps — Headspace's blob system is the gold standard." },
  "Creativity & Play-Creatives & Artists-Tech / Finance":   { shape: "Organic",   radius: "varies", color: T.brand, why: "Creative tools (Figma, Notion) blend organic and geometric. The shape system itself becomes the expression." },
  "Creativity & Play-Creatives & Artists-Food / Lifestyle": { shape: "Organic",   radius: "varies", color: "#FF9900", why: "Artisan food, indie coffee, creative lifestyle brands use irregular organic shapes to signal handcraft and personality." },
  "Creativity & Play-Families & Kids-Food / Lifestyle":     { shape: "Organic",   radius: "50%+",   color: T.green, why: "Playful blobs, bright fills, maximum radius. Think Oatly, innocent drinks — organic shapes = joyful." },
};

const DEFAULT_REC = { shape: "Circle + Rounded Rect", radius: "16–24px", color: T.brand, why: "A balanced combination works for most brand scenarios: circle as the primary mark, rounded rectangles for UI. Approachable, modern, flexible." };

function BrandFit() {
  const [answers, setAnswers] = useState({});
  const allAnswered = QUESTIONS.every(q => answers[q.id]);
  const key = allAnswered ? `${answers.emotion}-${answers.audience}-${answers.industry}` : null;
  const rec = key ? (RECS[key] || DEFAULT_REC) : null;

  return (
    <div className="sl-content-grid">
      {/* LEFT: Q1 + Q2 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {QUESTIONS.slice(0, 2).map(q => (
          <div key={q.id}>
            <div style={{ fontSize: 13, color: T.white, fontWeight: 600, marginBottom: 10 }}>{q.q}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {q.opts.map(opt => (
                <button key={opt} onClick={() => setAnswers({ ...answers, [q.id]: opt })} style={{ padding: "10px 14px", background: answers[q.id] === opt ? "rgba(255,122,0,.12)" : T.panel, border: `1px solid ${answers[q.id] === opt ? T.brand : T.border}`, borderRadius: 10, color: answers[q.id] === opt ? T.brand : T.muted, cursor: "pointer", textAlign: "left", fontSize: 13, fontWeight: answers[q.id] === opt ? 700 : 400 }}>{opt}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: Q3 + Result */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {QUESTIONS.slice(2).map(q => (
          <div key={q.id}>
            <div style={{ fontSize: 13, color: T.white, fontWeight: 600, marginBottom: 10 }}>{q.q}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {q.opts.map(opt => (
                <button key={opt} onClick={() => setAnswers({ ...answers, [q.id]: opt })} style={{ padding: "10px 14px", background: answers[q.id] === opt ? "rgba(255,122,0,.12)" : T.panel, border: `1px solid ${answers[q.id] === opt ? T.brand : T.border}`, borderRadius: 10, color: answers[q.id] === opt ? T.brand : T.muted, cursor: "pointer", textAlign: "left", fontSize: 13, fontWeight: answers[q.id] === opt ? 700 : 400 }}>{opt}</button>
              ))}
            </div>
          </div>
        ))}

        {allAnswered && rec && (
          <div style={{ background: "rgba(255,122,0,.06)", border: `1px solid rgba(255,122,0,.25)`, borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 10, color: T.dim, letterSpacing: 2, marginBottom: 10 }}>YOUR SHAPE SYSTEM RECOMMENDATION</div>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{ flexShrink: 0, textAlign: "center" }}>
                <svg viewBox="0 0 80 80" width={70} height={70}>
                  <rect width={80} height={80} fill={CV_PANEL} rx={10} />
                  <circle cx={40} cy={40} r={26} fill={rec.color} opacity={0.9} />
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 800, color: T.white, fontSize: 18, marginBottom: 4 }}>{rec.shape}</div>
                <div style={{ fontSize: 12, color: T.brand, fontWeight: 700, marginBottom: 8 }}>Border radius: {rec.radius}</div>
                <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>{rec.why}</div>
              </div>
            </div>
            <button onClick={() => setAnswers({})} style={{ padding: "8px 16px", background: "transparent", border: `1px solid ${T.border}`, borderRadius: 8, color: T.dim, cursor: "pointer", fontSize: 12 }}>Start over</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Suggestions ──
const SUGGESTION_CARDS = [
  { cat: "HEALTHCARE", title: "Hospital & Clinic Brand", icon: "🏥", sk: "circle_rect", shape: "Circle + Rounded Rect", radius: "16–24px", tip: "Circles signal safety and care. Zero sharp corners — nothing that reads as pain or danger. Pair with soft blue or green fills." },
  { cat: "FINTECH", title: "Neo-Bank UI", icon: "💳", sk: "rect_md", shape: "Rounded Rectangle", radius: "8–12px", tip: "Trust through rectangles, warmth through radius. Slightly more rounded than traditional banks to feel modern. Think Revolut, Monzo." },
  { cat: "EDTECH", title: "Children's Learning App", icon: "🎒", sk: "organic_circle", shape: "Organic + Circle", radius: "50%+", tip: "Maximum softness. Blob shapes, no angles, high radius everywhere. Sharp corners trigger fear responses in children." },
  { cat: "SAAS", title: "B2B SaaS Platform", icon: "📊", sk: "rect_sharp", shape: "Rectangle", radius: "4–6px", tip: "Structure and reliability. Tight radius signals precision. Use rectangles for cards, tables, and data components. Think Linear, Notion." },
  { cat: "LUXURY", title: "Luxury Fashion & Jewellery", icon: "💎", sk: "rect_zero", shape: "Sharp Rectangle", radius: "0–2px", tip: "Zero or near-zero radius = exclusivity. Luxury brands use sharp edges to signal precision and craftsmanship. Hermès, Cartier." },
  { cat: "FOOD & BEVERAGE", title: "FMCG Packaging", icon: "🛒", sk: "organic", shape: "Organic / Rounded", radius: "20–32px", tip: "Approachable and appetising. Organic shapes suggest freshness and natural ingredients. High radius for mass-market appeal." },
  { cat: "SPORT", title: "Athleisure & Performance", icon: "⚡", sk: "triangle", shape: "Triangle / Diagonal", radius: "0px", tip: "Sharp angles = speed and energy. Triangles point upward — aspiration. Diagonal cuts (like Adidas stripes) create forward motion." },
  { cat: "CREATIVE", title: "Agency Portfolio", icon: "✏️", sk: "mixed", shape: "Mixed / Asymmetric", radius: "varies", tip: "No single rule — the shape system IS the personality. Break one convention intentionally. Circles for approachability, triangles for tension." },
  { cat: "E-COMMERCE", title: "Marketplace UI", icon: "🛍️", sk: "rect_lg", shape: "Rounded Rectangle", radius: "10–16px", tip: "Product cards, CTAs, and filters all use consistent rounded rects. Enough radius to feel friendly without being playful." },
  { cat: "MENTAL HEALTH", title: "Wellness App", icon: "🧘", sk: "organic_blob", shape: "Organic / Circle", radius: "50%", tip: "Organic blobs and full circles only. No triangles, no sharp edges. Every shape must feel safe. Headspace and Calm are the benchmarks." },
  { cat: "LEGAL", title: "Law Firm & Consultancy", icon: "⚖️", sk: "rect_zero", shape: "Rectangle", radius: "0–4px", tip: "Authority through structure. Minimal radius. Rectangles dominate — symmetry and order signal reliability. Dark colours increase weight." },
  { cat: "MUSIC", title: "Audio & Music Brand", icon: "🎵", sk: "circle_wave", shape: "Circle / Wave", radius: "50%", tip: "Circles reference vinyl, sound waves, and headphones. Organic wave shapes for streaming and discovery. Spotify's blob system is the reference." },
  { cat: "TRAVEL", title: "Hospitality & Travel", icon: "✈️", sk: "organic", shape: "Organic + Rounded", radius: "16–20px", tip: "Freedom through organic shapes, trust through rounded rects. Avoid sharp angles — they feel restrictive. Airbnb's Bélo is the gold standard." },
  { cat: "REAL ESTATE", title: "Property Platform", icon: "🏠", sk: "arch", shape: "Rectangle + Arch", radius: "4–8px", tip: "Rectangles mirror architecture — buildings, windows, doors. Arch shapes (rounded tops) reference doorways and feel welcoming." },
  { cat: "GAMING", title: "Gaming Brand & UI", icon: "🎮", sk: "diamond", shape: "Diamond / Sharp Rect", radius: "0–4px", tip: "Sharp, angular, high tension. Diamond and hexagon shapes dominate gaming — they feel technical and premium. Dark fills, high contrast." },
  { cat: "NON-PROFIT", title: "NGO & Social Impact", icon: "🌍", sk: "circle", shape: "Circle / Organic", radius: "50%", tip: "Community and inclusion through circles. Organic shapes signal grassroots and human connection. Avoid corporate rectangles." },
  { cat: "STARTUP", title: "Tech Startup Logo", icon: "🚀", sk: "boolean_demo", shape: "Geometric Primitive", radius: "varies", tip: "Build from one primitive: a circle, a square, or a triangle. Apply one Boolean operation. The simpler the construction, the stronger the mark." },
  { cat: "RESTAURANT", title: "F&B Restaurant Brand", icon: "🍽️", sk: "organic_circle", shape: "Organic / Circle", radius: "20–40px", tip: "Warmth and appetite through curves. Fine dining uses sharp rectangles for exclusivity. Fast casual and cafes use rounds for approachability." },
  { cat: "SUSTAINABILITY", title: "Green & Eco Brand", icon: "🌱", sk: "leaf", shape: "Organic / Leaf", radius: "50%+", tip: "Nature is organic — no hard corners. Leaf shapes, circles, and flowing forms. Sharp geometry feels industrial, which contradicts the brand promise." },
  { cat: "PERSONAL BRAND", title: "Designer Portfolio", icon: "👤", sk: "mixed", shape: "Your choice — intentional", radius: "your personality", tip: "Your shape system IS your signature. Pick one dominant shape that reflects how you work: circles = collaborative, rectangles = structured, organics = creative." },
];

function ShapeViz({ sk }) {
  const f = T.brand, f2 = "#FF9A33", bg = CV_PANEL;
  const S = {
    circle:        <><circle cx="60" cy="50" r="32" fill={f} /></>,
    circle_rect:   <><circle cx="38" cy="50" r="22" fill={f} /><rect x="64" y="30" width="44" height="40" rx="12" fill={f} opacity={0.6} /></>,
    rect_md:       <><rect x="18" y="26" width="84" height="48" rx="10" fill={f} /></>,
    rect_sharp:    <><rect x="18" y="26" width="84" height="48" rx="4" fill={f} /></>,
    rect_zero:     <><rect x="18" y="26" width="84" height="48" rx="0" fill={f} /></>,
    rect_lg:       <><rect x="18" y="26" width="84" height="48" rx="16" fill={f} /></>,
    triangle:      <><polygon points="60,12 102,88 18,88" fill={f} /></>,
    organic:       <><path d="M60,18 C78,14 98,28 96,50 C94,70 76,88 54,84 C32,80 16,64 20,44 C24,24 42,22 60,18 Z" fill={f} /></>,
    organic_circle:<><path d="M38,20 C52,14 68,22 66,42 C64,56 52,66 36,62 C20,58 14,44 20,32 C24,24 30,22 38,20 Z" fill={f} /><circle cx="78" cy="56" r="22" fill={f} opacity={0.6} /></>,
    organic_blob:  <><path d="M60,16 C80,12 100,26 98,52 C96,74 78,92 54,88 C30,84 12,68 16,46 C20,24 40,20 60,16 Z" fill={f} /></>,
    circle_wave:   <><circle cx="44" cy="46" r="28" fill={f} /><path d="M68,30 Q82,46 68,62 Q82,50 96,62 Q82,46 96,30 Q82,42 68,30 Z" fill={f} opacity={0.55} /></>,
    arch:          <><rect x="22" y="50" width="76" height="38" rx="4" fill={f} /><path d="M22,50 Q60,10 98,50 Z" fill={f} /></>,
    diamond:       <><polygon points="60,10 98,50 60,90 22,50" fill={f} /></>,
    leaf:          <><path d="M60,16 C88,16 96,40 96,56 C96,72 80,88 60,88 C60,88 24,72 24,50 C24,28 40,16 60,16 Z" fill={f} /><line x1="60" y1="88" x2="60" y2="16" stroke={bg} strokeWidth="2" opacity={0.3} /></>,
    boolean_demo:  <><circle cx="44" cy="50" r="28" fill={f} /><rect x="50" y="24" width="44" height="44" rx="4" fill={bg} stroke={f} strokeWidth="2" /></>,
    mixed:         <><circle cx="36" cy="44" r="22" fill={f} opacity={0.7} /><polygon points="76,16 98,62 54,62" fill={f2} opacity={0.85} /></>,
  };
  return (
    <svg viewBox="0 0 120 100" width="100%" style={{ maxHeight: 90, display: "block" }}>
      <rect width="120" height="100" fill={bg} rx="10" />
      {S[sk] || S.circle}
    </svg>
  );
}

function SuggestionsSection() {
  const [open, setOpen] = useState(null);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setSuggestionsOpen(!suggestionsOpen)}
        style={{ width: "100%", padding: "14px 18px", background: suggestionsOpen ? "rgba(255,122,0,0.1)" : T.panel2, border: `1px solid ${suggestionsOpen ? T.brand : T.border}`, borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: suggestionsOpen ? 16 : 0, transition: "all 0.15s" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 16 }}>⬡</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: suggestionsOpen ? T.brand : T.white }}>Shape Guides — 20 Industries</div>
            <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>20 industry guides — tap any card to see the shape and full guide</div>
          </div>
        </div>
        <span style={{ fontSize: 18, color: suggestionsOpen ? T.brand : T.dim, transition: "transform 0.15s", display: "inline-block", transform: suggestionsOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
      </button>

      {suggestionsOpen && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SUGGESTION_CARDS.map((card, i) => (
            <div key={i} style={{ background: T.panel2, border: `1px solid ${open === i ? T.brand : T.border}`, borderRadius: 14, overflow: "hidden", transition: "border-color .15s" }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", background: "none", border: "none", padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{card.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: T.brand, letterSpacing: 2, fontWeight: 700, marginBottom: 3 }}>{card.cat}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.white }}>{card.title}</div>
                </div>
                <div style={{ fontSize: 16, color: open === i ? T.brand : T.dim, flexShrink: 0 }}>{open === i ? "↑" : "↓"}</div>
              </button>
              {open === i && (
                <div style={{ borderTop: `1px solid ${T.border}`, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ background: T.panel, borderRadius: 12, padding: 12 }}>
                    <ShapeViz sk={card.sk} />
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1, background: T.panel, borderRadius: 10, padding: "10px 14px" }}>
                      <div style={{ fontSize: 10, color: T.dim, letterSpacing: 2, marginBottom: 4 }}>SHAPE</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.white }}>{card.shape}</div>
                    </div>
                    <div style={{ flex: 1, background: T.panel, borderRadius: 10, padding: "10px 14px" }}>
                      <div style={{ fontSize: 10, color: T.dim, letterSpacing: 2, marginBottom: 4 }}>BORDER RADIUS</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.brand }}>{card.radius}</div>
                    </div>
                  </div>
                  <div style={{ background: T.panel, borderRadius: 10, padding: "12px 14px", fontSize: 13, color: T.muted, lineHeight: 1.65 }}>{card.tip}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main ──
const TABS = [
  { id: "builder", label: "Shape Builder" },
  { id: "boolean", label: "Boolean Lab" },
  { id: "fit",     label: "Brand Fit" },
];

export default function ShapeLab() {
  const [tab, setTab] = useState("builder");
  const topRef = useRef(null);

  return (
    <div ref={topRef} style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'Inter',system-ui,sans-serif", padding: "28px 18px 80px" }}>
      <style>{`
        .sl-wrap { max-width: 500px; margin: 0 auto; }
        .sl-content-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 860px) {
          .sl-wrap { max-width: 1100px; }
          .sl-content-grid { grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; }
        }
      `}</style>

      <div className="sl-wrap">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: T.brand, fontWeight: 700, marginBottom: 8 }}>PM GRAPHICS · FREE TOOL</div>
          <h1 style={{ fontSize: 34, fontFamily: "Georgia,serif", margin: "0 0 8px", color: T.white, lineHeight: 1.2 }}>ShapeLab</h1>
          <p style={{ fontSize: 14, color: T.muted, margin: 0, lineHeight: 1.6 }}>
            Build shapes, combine with Boolean logic, and find the perfect shape system for your brand — free, no sign-in.
          </p>
        </div>

        {/* Sub-tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24, background: T.panel, borderRadius: 12, padding: 5 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "9px 6px", background: tab === t.id ? T.brand : "transparent", border: "none", borderRadius: 9, color: tab === t.id ? "#101010" : T.muted, cursor: "pointer", fontSize: 12, fontWeight: tab === t.id ? 700 : 400, transition: "all .15s" }}>{t.label}</button>
          ))}
        </div>

        {/* Tab content */}
        <Card style={{ marginBottom: 32 }}>
          {tab === "builder" && (
            <>
              <div style={{ marginBottom: 20 }}>
                <Tag>SHAPE BUILDER</Tag>
                <div style={{ fontSize: 13, color: T.muted, marginTop: 6 }}>Pick a shape, customise it, understand what it communicates.</div>
              </div>
              <ShapeBuilder />
            </>
          )}
          {tab === "boolean" && (
            <>
              <div style={{ marginBottom: 20 }}>
                <Tag>BOOLEAN LAB</Tag>
                <div style={{ fontSize: 13, color: T.muted, marginTop: 6 }}>Combine two shapes using Union, Subtract, Intersect, or Exclude.</div>
              </div>
              <BooleanLab />
            </>
          )}
          {tab === "fit" && (
            <>
              <div style={{ marginBottom: 20 }}>
                <Tag>BRAND FIT</Tag>
                <div style={{ fontSize: 13, color: T.muted, marginTop: 6 }}>Answer 3 questions. Get your shape system recommendation.</div>
              </div>
              <BrandFit />
            </>
          )}
        </Card>

        {/* Industry guides */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 1, background: T.border }} />
          <div style={{ fontSize: 11, color: T.dim, letterSpacing: 2 }}>INDUSTRY GUIDES</div>
          <div style={{ flex: 1, height: 1, background: T.border }} />
        </div>
        <SuggestionsSection />
      </div>
    </div>
  );
}
