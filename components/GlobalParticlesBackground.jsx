"use client";

import { useEffect, useRef } from "react";

/* Palette for the Void & Fire theme */
const P = {
  orange:      "255,106,0",
  lightOrange: "255,130,30",
  fireOrange:  "255,69,0",
  darkOrange:  "180,60,0",
  amber:       "245,158,11",
  yellow:      "255,180,50",
};

export default function GlobalParticlesBackground() {
  const canvasRef          = useRef(null);
  const isVisibleRef       = useRef(true);
  const animationFrameRef  = useRef(null);
  const mouseHistoryRef    = useRef([]);
  const mouseRef           = useRef({ x: null, y: null, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W = (canvas.width  = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    /* ─── Ambient orange particles ─── */
    const particles = [];
    const count = Math.min(40, Math.floor(W / 30));
    for (let i = 0; i < count; i++) {
      particles.push({
        x:          Math.random() * W,
        y:          Math.random() * H,
        size:       Math.random() * 2.2 + 0.6,
        speedY:     -(Math.random() * 0.4 + 0.1),
        speedX:     Math.random() * 0.25 - 0.125,
        phase:      Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.012 + 0.004,
        opacity:    Math.random() * 0.45 + 0.15,
        maxOpacity: Math.random() * 0.5 + 0.2,
        col:        [P.orange, P.lightOrange, P.darkOrange][Math.floor(Math.random() * 3)],
      });
    }

    /* ─── Design-tool floating elements ─── */
    const designEls = [];

    // Color palette swatches (row of 5 circles)
    for (let i = 0; i < 5; i++) {
      designEls.push({
        type: "swatches",
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.12,
        opacity: Math.random() * 0.28 + 0.1,
        scale: Math.random() * 0.5 + 0.7,
        phase: Math.random() * Math.PI * 2, phaseSpeed: 0.006 + Math.random() * 0.006,
      });
    }

    // Bezier handle pairs
    for (let i = 0; i < 5; i++) {
      designEls.push({
        type: "bezier",
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.1,
        opacity: Math.random() * 0.22 + 0.08,
        scale: Math.random() * 0.6 + 0.8,
        phase: Math.random() * Math.PI * 2, phaseSpeed: 0.005 + Math.random() * 0.008,
      });
    }

    // Artboard outlines
    for (let i = 0; i < 4; i++) {
      const w = 48 + Math.random() * 32;
      designEls.push({
        type: "artboard",
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.1,
        opacity: Math.random() * 0.2 + 0.07,
        w, h: w * 0.65,
        phase: Math.random() * Math.PI * 2, phaseSpeed: 0.004 + Math.random() * 0.006,
      });
    }

    // Typography "Aa" glyphs
    for (let i = 0; i < 5; i++) {
      designEls.push({
        type: "glyph",
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.14, vy: (Math.random() - 0.5) * 0.1,
        opacity: Math.random() * 0.18 + 0.06,
        size: 14 + Math.random() * 12,
        char: ["Aa", "Bb", "Rr", "Gg", "Tt"][i],
        phase: Math.random() * Math.PI * 2, phaseSpeed: 0.005 + Math.random() * 0.007,
      });
    }

    // Mini layer stacks
    for (let i = 0; i < 4; i++) {
      designEls.push({
        type: "layers",
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.1,
        opacity: Math.random() * 0.2 + 0.07,
        scale: Math.random() * 0.5 + 0.7,
        phase: Math.random() * Math.PI * 2, phaseSpeed: 0.004 + Math.random() * 0.006,
      });
    }

    /* ─── Draw helpers ─── */
    const drawSwatches = (x, y, op, sc) => {
      const palette = [
        `rgba(${P.orange},`, `rgba(${P.lightOrange},`,
        `rgba(${P.fireOrange},`,   `rgba(${P.amber},`,
        `rgba(${P.yellow},`,
      ];
      const r = 5.5 * sc;
      const gap = 14 * sc;
      palette.forEach((col, i) => {
        ctx.beginPath();
        ctx.arc(x + i * gap, y, r, 0, Math.PI * 2);
        ctx.fillStyle = col + op + ")";
        ctx.fill();
        ctx.strokeStyle = `rgba(255,255,255,${op * 0.8})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    };

    const drawBezier = (x, y, op, sc, t) => {
      const wave = Math.sin(t) * 8 * sc;
      const p1x = x, p1y = y + wave;
      const p2x = x + 55 * sc, p2y = y + 18 * sc - wave;
      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.bezierCurveTo(
        p1x + 15 * sc, p1y - 18 * sc,
        p2x - 15 * sc, p2y + 18 * sc,
        p2x, p2y
      );
      ctx.strokeStyle = `rgba(${P.orange},${op})`;
      ctx.lineWidth = 1.2 * sc;
      ctx.stroke();
      // anchor dots
      [[p1x, p1y], [p2x, p2y]].forEach(([px, py]) => {
        ctx.beginPath();
        ctx.arc(px, py, 3.5 * sc, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${P.orange},${op * 0.9})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255,255,255,${op})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      // control handles
      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.lineTo(p1x + 15 * sc, p1y - 18 * sc);
      ctx.strokeStyle = `rgba(${P.lightOrange},${op * 0.5})`;
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawArtboard = (x, y, w, h, op) => {
      ctx.strokeStyle = `rgba(${P.orange},${op})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = `rgba(${P.orange},${op * 0.25})`;
      ctx.font = `600 7px Inter, sans-serif`;
      ctx.fillText("Artboard", x + 2, y - 4);
    };

    const drawGlyph = (x, y, op, sz, ch) => {
      ctx.fillStyle = `rgba(${P.orange},${op})`;
      ctx.font = `700 ${sz}px 'Space Grotesk', sans-serif`;
      ctx.fillText(ch, x, y);
    };

    const drawLayers = (x, y, op, sc) => {
      const h = 8 * sc, gap = 10 * sc, w = 36 * sc;
      for (let i = 0; i < 3; i++) {
        const iy = y + i * gap;
        ctx.strokeStyle = `rgba(${P.orange},${op * (1 - i * 0.2)})`;
        ctx.lineWidth = 0.9;
        ctx.strokeRect(x + i * 4 * sc, iy, w, h);
        ctx.fillStyle = `rgba(${P.orange},${op * 0.06})`;
        ctx.fillRect(x + i * 4 * sc, iy, w, h);
      }
    };

    /* ─── Mouse events ─── */
    const onMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
      mouseHistoryRef.current.push({ x: e.clientX, y: e.clientY, t: Date.now() });
      if (mouseHistoryRef.current.length > 28) mouseHistoryRef.current.shift();
    };
    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    /* ─── Resize ─── */
    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    let time = 0;

    /* ─── Animate ─── */
    const animate = () => {
      if (!isVisibleRef.current) return;
      ctx.clearRect(0, 0, W, H);
      time += 0.012;

      /* 1 – Ambient particles */
      for (const p of particles) {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.phase) * 0.1;
        p.phase += p.phaseSpeed;
        p.opacity = Math.abs(Math.sin(p.phase * 0.5)) * p.maxOpacity;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;

        // soft glow halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.col},${p.opacity * 0.06})`;
        ctx.fill();
        // core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.col},${p.opacity})`;
        ctx.fill();
      }

      /* 2 – Design elements */
      for (const el of designEls) {
        el.x += el.vx; el.y += el.vy;
        el.phase += el.phaseSpeed;
        const pulse = 0.5 + Math.sin(el.phase) * 0.1;
        const op = (el.opacity * pulse).toFixed(3);

        // wrap edges
        if (el.x < -100) el.x = W + 100;
        if (el.x > W + 100) el.x = -100;
        if (el.y < -100) el.y = H + 100;
        if (el.y > H + 100) el.y = -100;

        ctx.save();
        if (el.type === "swatches") drawSwatches(el.x, el.y, op, el.scale);
        else if (el.type === "bezier") drawBezier(el.x, el.y, op, el.scale, el.phase);
        else if (el.type === "artboard") drawArtboard(el.x, el.y, el.w, el.h, op);
        else if (el.type === "glyph") drawGlyph(el.x, el.y, op, el.size, el.char);
        else if (el.type === "layers") drawLayers(el.x, el.y, op, el.scale);
        ctx.restore();
      }

      /* 3 – Orange cursor trail */
      const history = mouseHistoryRef.current;
      const now = Date.now();
      while (history.length > 0 && now - history[0].t > 400) history.shift();

      if (history.length > 1) {
        for (let i = 1; i < history.length; i++) {
          const a = history[i - 1], b = history[i];
          const age = i / history.length;
          // glow pass
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${P.orange},${age * 0.3})`;
          ctx.lineWidth = age * 10 + 1;
          ctx.lineCap = "round";
          ctx.shadowBlur = age * 14;
          ctx.shadowColor = `rgba(${P.orange},${age * 0.7})`;
          ctx.stroke();
          ctx.shadowBlur = 0;
          // bright core
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${P.lightOrange},${age * 0.85})`;
          ctx.lineWidth = age * 4 + 0.5;
          ctx.stroke();
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([e]) => {
        const was = isVisibleRef.current;
        isVisibleRef.current = e.isIntersecting;
        if (isVisibleRef.current && !was)
          animationFrameRef.current = requestAnimationFrame(animate);
      },
      { threshold: 0.01 }
    );
    observer.observe(canvas);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        zIndex: -1,
        backgroundColor: "#0B0B0B",
        pointerEvents: "none",
      }}
    />
  );
}
