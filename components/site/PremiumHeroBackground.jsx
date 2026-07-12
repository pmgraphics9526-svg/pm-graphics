"use client";

import { useEffect, useRef } from "react";

export default function PremiumHeroBackground() {
  const canvasRef         = useRef(null);
  const isVisibleRef      = useRef(true);
  const animFrameRef      = useRef(null);
  const mouseRef          = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    /* roundRect polyfill for older browsers */
    if (!ctx.roundRect) {
      ctx.roundRect = function(x, y, w, h, r) {
        const rad = Array.isArray(r) ? r[0] : (r || 0);
        ctx.beginPath();
        ctx.moveTo(x + rad, y);
        ctx.lineTo(x + w - rad, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
        ctx.lineTo(x + w, y + h - rad);
        ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
        ctx.lineTo(x + rad, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
        ctx.lineTo(x, y + rad);
        ctx.quadraticCurveTo(x, y, x + rad, y);
        ctx.closePath();
      };
    }
    const parent = canvas.parentElement;

    let W = (canvas.width  = parent?.offsetWidth  || window.innerWidth);
    let H = (canvas.height = parent?.offsetHeight || window.innerHeight);

    /* ── Particles ── */
    const PTS = [];
    const N = 20;
    for (let i = 0; i < N; i++) {
      PTS.push({
        x: Math.random() * W, y: Math.random() * H,
        size: Math.random() * 1.2 + 0.4,
        vy: -(Math.random() * 0.2 + 0.05),
        vx: Math.random() * 0.06 - 0.03,
        phase: Math.random() * Math.PI * 2,
        ps: Math.random() * 0.008 + 0.003,
        maxOp: Math.random() * 0.5 + 0.2,
        op: 0,
      });
    }

    /* ── Mouse ── */
    const onMouse = (e) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current.tx = ((e.clientX - r.left) / W) * 2 - 1;
      mouseRef.current.ty = ((e.clientY - r.top)  / H) * 2 - 1;
    };
    const onLeave = () => { mouseRef.current.tx = 0; mouseRef.current.ty = 0; };
    parent?.addEventListener("mousemove", onMouse);
    parent?.addEventListener("mouseleave", onLeave);

    const onResize = () => {
      W = canvas.width  = parent?.offsetWidth  || window.innerWidth;
      H = canvas.height = parent?.offsetHeight || window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    let time = 0;

    /* ─── Draw laptop mockup ─── */
    const drawLaptop = (cx, cy, sc) => {
      const sw = Math.min(360 * sc, W * 0.38); // screen width
      const sh = sw * 0.62;                     // screen height
      const sx = cx - sw / 2;
      const sy = cy - sh / 2;
      const r  = 10 * sc;

      /* screen glow */
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, sw * 0.75);
      grd.addColorStop(0, "rgba(255,106,0,0.15)");
      grd.addColorStop(1, "rgba(255,106,0,0.00)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.ellipse(cx, cy + sh * 0.1, sw * 0.75, sh * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();

      /* screen frame */
      ctx.save();
      ctx.shadowBlur  = 18;
      ctx.shadowColor = "rgba(255,106,0,0.22)";
      ctx.beginPath();
      ctx.roundRect(sx, sy, sw, sh, r);
      ctx.strokeStyle = "rgba(255,106,0,0.45)";
      ctx.lineWidth   = 1.5;
      ctx.stroke();
      ctx.restore();

      /* screen fill */
      ctx.beginPath();
      ctx.roundRect(sx, sy, sw, sh, r);
      const bg = ctx.createLinearGradient(sx, sy, sx, sy + sh);
      bg.addColorStop(0, "rgba(30,30,30,0.85)");
      bg.addColorStop(1, "rgba(18,18,18,0.85)");
      ctx.fillStyle = bg;
      ctx.fill();

      /* ── Inside screen: design workspace ── */
      const pad = 6 * sc;
      const inner = { x: sx + pad, y: sy + pad, w: sw - pad * 2, h: sh - pad * 2 };

      // Left toolbar strip
      const tbW = 22 * sc;
      ctx.fillStyle = "rgba(255,106,0,0.12)";
      ctx.beginPath();
      ctx.roundRect(inner.x, inner.y, tbW, inner.h, [6,0,0,6]);
      ctx.fill();
      // Tool dots
      const toolCols = ["255,106,0","255,130,30","255,69,0","180,60,0","255,180,50"];
      toolCols.forEach((c, i) => {
        ctx.beginPath();
        ctx.arc(inner.x + tbW / 2, inner.y + 14 * sc + i * 20 * sc, 4 * sc, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c},0.75)`;
        ctx.fill();
      });

      // Right layers panel
      const lpW = 52 * sc;
      ctx.fillStyle = "rgba(255,106,0,0.08)";
      ctx.beginPath();
      ctx.roundRect(inner.x + inner.w - lpW, inner.y, lpW, inner.h, [0,6,6,0]);
      ctx.fill();
      // Layer rows
      for (let i = 0; i < 5; i++) {
        const ly = inner.y + 12 * sc + i * 18 * sc;
        const lx = inner.x + inner.w - lpW + 5 * sc;
        const lw = lpW - 10 * sc;
        const lh = 10 * sc;
        ctx.fillStyle = i === 1
          ? "rgba(255,106,0,0.25)"
          : "rgba(255,106,0,0.1)";
        ctx.beginPath();
        ctx.roundRect(lx, ly, lw, lh, 2);
        ctx.fill();
        // Tiny color swatch
        ctx.beginPath();
        ctx.arc(lx + 5, ly + lh / 2, 3 * sc, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${toolCols[i % toolCols.length]},0.8)`;
        ctx.fill();
      }
      ctx.fillStyle = "rgba(255,106,0,0.7)";
      ctx.font = `${6 * sc}px Inter, sans-serif`;
      ctx.fillText("LAYERS", inner.x + inner.w - lpW + 5 * sc, inner.y + 7 * sc);

      // Main canvas area (centre of screen)
      const canvX = inner.x + tbW + 6 * sc;
      const canvW = inner.w - tbW - lpW - 12 * sc;
      const canvH = inner.h;

      // Canvas bg
      ctx.fillStyle = "rgba(11,11,11,0.9)";
      ctx.beginPath();
      ctx.roundRect(canvX, inner.y, canvW, canvH, 4);
      ctx.fill();
      // Subtle dot grid on canvas
      const gGap = 12 * sc;
      ctx.fillStyle = "rgba(255,106,0,0.22)";
      for (let gx = canvX + gGap; gx < canvX + canvW - gGap; gx += gGap) {
        for (let gy = inner.y + gGap; gy < inner.y + canvH - gGap; gy += gGap) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.8 * sc, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Animated bezier path on canvas
      const bx1 = canvX + 16 * sc;
      const bx2 = canvX + canvW - 16 * sc;
      const byM = inner.y + canvH * 0.48;
      const wave = Math.sin(time * 0.7) * 18 * sc;

      ctx.beginPath();
      ctx.moveTo(bx1, byM + wave);
      ctx.bezierCurveTo(
        canvX + canvW * 0.28, byM - 30 * sc + wave,
        canvX + canvW * 0.72, byM + 30 * sc - wave,
        bx2, byM - wave * 0.5
      );
      ctx.strokeStyle = "rgba(255,106,0,0.75)";
      ctx.lineWidth   = 1.5 * sc;
      ctx.stroke();

      // Anchor + control dots
      [[bx1, byM + wave], [bx2, byM - wave * 0.5]].forEach(([px, py]) => {
        ctx.beginPath();
        ctx.arc(px, py, 4 * sc, 0, Math.PI * 2);
        ctx.fillStyle = "#FF6A00";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Floating color swatches inside canvas
      const sw2Colors = ["#FF6A00","#FF8C00","#FF4500","#B43C00","#FFB900"];
      const swatchY   = inner.y + canvH - 16 * sc;
      const swatchX0  = canvX + 18 * sc;
      sw2Colors.forEach((c, i) => {
        ctx.beginPath();
        ctx.arc(swatchX0 + i * 14 * sc, swatchY, 5 * sc, 0, Math.PI * 2);
        ctx.fillStyle = c;
        ctx.globalAlpha = 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "rgba(255,255,255,0.8)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Top toolbar bar (title bar)
      ctx.fillStyle = "rgba(255,106,0,0.08)";
      ctx.fillRect(canvX, inner.y, canvW, 12 * sc);
      ctx.fillStyle = "rgba(255,106,0,0.5)";
      ctx.font = `${5.5 * sc}px Inter, sans-serif`;
      ctx.fillText("design.fig", canvX + 6 * sc, inner.y + 8.5 * sc);

      /* ── Keyboard base ── */
      const kW = sw + 20 * sc;
      const kH = 10 * sc;
      const kX = cx - kW / 2;
      const kY = sy + sh;
      ctx.beginPath();
      ctx.moveTo(kX, kY);
      ctx.lineTo(kX + kW, kY);
      ctx.lineTo(kX + kW - 14 * sc, kY + kH);
      ctx.lineTo(kX + 14 * sc, kY + kH);
      ctx.closePath();
      ctx.strokeStyle = "rgba(255,106,0,0.35)";
      ctx.lineWidth   = 1;
      ctx.stroke();
      const kGrd = ctx.createLinearGradient(kX, kY, kX, kY + kH);
      kGrd.addColorStop(0, "rgba(255,106,0,0.12)");
      kGrd.addColorStop(1, "rgba(255,106,0,0.02)");
      ctx.fillStyle = kGrd;
      ctx.fill();

      /* ── Floating design chips around laptop ── */
      const chips = [
        { dx: -sw * 0.55, dy: -sh * 0.5,  label: "Branding" },
        { dx:  sw * 0.55, dy: -sh * 0.3,  label: "Motion"   },
        { dx: -sw * 0.48, dy:  sh * 0.42, label: "Events"   },
        { dx:  sw * 0.52, dy:  sh * 0.5,  label: "Flyers"   },
      ];
      chips.forEach(({ dx, dy, label }, i) => {
        const float = Math.sin(time * 0.8 + i * 1.2) * 5 * sc;
        const chipX = cx + dx;
        const chipY = cy + dy + float;
        const chipW = 60 * sc, chipH = 20 * sc;
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(chipX - chipW / 2, chipY - chipH / 2, chipW, chipH, chipH / 2);
        ctx.fillStyle   = "rgba(19,19,19,0.85)";
        ctx.strokeStyle = "rgba(255,106,0,0.3)";
        ctx.lineWidth   = 1;
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.font = `600 ${7 * sc}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, chipX, chipY);
        ctx.restore();
      });
    };

    /* ── Main animate loop ── */
    const animate = () => {
      if (!isVisibleRef.current) return;

      // Dark "Void & Fire" background
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0B0B0B");
      bg.addColorStop(1, "#0E0E0E");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      time += 0.014;

      // Mouse parallax
      const m = mouseRef.current;
      m.x += (m.tx - m.x) * 0.05;
      m.y += (m.ty - m.y) * 0.05;
      ctx.save();
      ctx.translate(m.x * -14, m.y * -14);

      // Dot grid overlay (dark)
      const dotGap = 36;
      ctx.fillStyle = "rgba(255,106,0,0.05)";
      for (let gx = 0; gx <= W + dotGap; gx += dotGap) {
        for (let gy = 0; gy <= H + dotGap; gy += dotGap) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Laptop mockup and floating label chips drawing is removed to prevent overlap with the founder photo
      // drawLaptop(lapCX, lapCY, lapSC, time);

      // Orange plasma wave at bottom
      const drawWave = (off, colRgb, thick, speed, ph) => {
        ctx.beginPath();
        for (let x = -20; x <= W + 20; x += 8) {
          const y = H * 0.9
            + Math.sin(x * 0.0022 + time * speed + ph) * 40
            + Math.cos(x * 0.0012 - time * 0.6 * speed) * 20
            + off;
          x === -20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = colRgb;
        ctx.lineWidth   = thick;
        ctx.lineCap     = "round";
        ctx.lineJoin    = "round";
        ctx.stroke();
      };
      drawWave(8,  "rgba(255,106,0,0.03)",  50, 1.0, 0);
      drawWave(10, "rgba(255,106,0,0.015)", 80, 0.8, Math.PI * 0.4);
      drawWave(9,  "rgba(255,106,0,0.12)",   12, 1.0, 0);
      drawWave(7,  "rgba(255,130,30,0.15)",   5, 0.9, Math.PI * 0.25);
      drawWave(8,  "rgba(255,200,100,0.35)",  1.2, 1.0, 0);

      // Particles
      for (const p of PTS) {
        p.y += p.vy; p.x += p.vx + Math.sin(p.phase) * 0.06;
        p.phase += p.ps;
        p.op = Math.abs(Math.sin(p.phase * 0.5)) * p.maxOp;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,106,0,${p.op * 0.06})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,130,30,${p.op * 0.6})`;
        ctx.fill();
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(animate);
    };

    const obs = new IntersectionObserver(([e]) => {
      const was = isVisibleRef.current;
      isVisibleRef.current = e.isIntersecting;
      if (isVisibleRef.current && !was)
        animFrameRef.current = requestAnimationFrame(animate);
    }, { threshold: 0.05 });
    obs.observe(canvas);
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", onResize);
      parent?.removeEventListener("mousemove", onMouse);
      parent?.removeEventListener("mouseleave", onLeave);
      obs.disconnect();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0, left: 0,
        width: "100%", height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}
