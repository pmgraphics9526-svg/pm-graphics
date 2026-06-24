"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 50, suffix: "+", label: "Projects Delivered" },
  { value: 35, suffix: "+", label: "Happy Clients" },
  { value: 3,  suffix: "+", label: "Years Experience" },
  { value: 98, suffix: "%", label: "Satisfaction Rate" },
];

function useCountUp(target, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

function StatCard({ value, suffix, label, active, delay }) {
  const count = useCountUp(value, 1800, active);
  return (
    <div
      className="glass-card"
      style={{
        textAlign: "center",
        padding: "40px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-space-grotesk)",
          fontSize: "clamp(2.5rem, 6vw, 4rem)",
          fontWeight: "800",
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: "var(--text-primary)",
        }}
      >
        {count}
        <span style={{ color: "var(--accent)" }}>{suffix}</span>
      </div>
      <div
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "13px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--text-secondary)",
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default function StatsSection() {
  const [active, setActive] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="container"
      style={{
        marginTop: "var(--section-gap)",
        marginBottom: "var(--section-gap)",
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "var(--stack-lg)",
        }}
        className="stats-grid"
      >
        {STATS.map((stat, i) => (
          <StatCard key={stat.label} {...stat} active={active} delay={i * 100} />
        ))}
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}
