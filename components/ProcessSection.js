"use client";

const STEPS = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We start by deeply understanding your brand, goals, and audience. A focused brief session defines the direction before a single pixel is placed.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "Our studio crafts high-fidelity concepts built on a foundation of strategic thinking — clean, distinctive, and made to last.",
  },
  {
    number: "03",
    title: "Revisions",
    description:
      "You review and we refine. Feedback rounds are structured to keep momentum while ensuring the final work exceeds your expectations.",
  },
  {
    number: "04",
    title: "Delivery",
    description:
      "Final files are packaged and handed over in every format you need — print-ready, web-optimized, and future-proof.",
  },
];

export default function ProcessSection() {
  return (
    <section
      id="process"
      className="section-spacing container"
      style={{ pointerEvents: "auto" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--stack-md)", marginBottom: "56px" }}>
        <div className="font-label-caps" style={{ color: "var(--accent)" }}>OUR PROCESS</div>
        <h2
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontWeight: "800",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            fontSize: "clamp(1.4rem, 3.5vw, 44px)",
            color: "var(--text-primary)",
          }}
        >
          HOW WE WORK.
        </h2>
      </div>

      <div className="process-grid">
        {STEPS.map((step, i) => (
          <div
            key={step.number}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              position: "relative",
              paddingTop: "24px",
              borderTop: "1px solid rgba(255,106,0,0.1)",
            }}
          >
            {/* Connector line (hidden on last card) */}
            {i < STEPS.length - 1 && (
              <div
                className="process-connector"
                style={{
                  position: "absolute",
                  top: "36px",
                  right: 0,
                  width: "calc(100% - 56px)",
                  height: "1px",
                  background: "linear-gradient(to right, rgba(255,106,0,0.3), rgba(255,106,0,0))",
                  pointerEvents: "none",
                }}
              />
            )}

            <div
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: "800",
                color: "rgba(255,106,0,0.55)",
                WebkitTextStroke: "1.5px rgba(255,106,0,0.9)",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              {step.number}
            </div>

            <h3
              style={{
                fontFamily: "var(--font-display), sans-serif",
                fontSize: "18px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                color: "var(--text-primary)",
              }}
            >
              {step.title}
            </h3>

            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "14px",
                lineHeight: 1.7,
                color: "var(--text-secondary)",
              }}
            >
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
        }
        @media (max-width: 1024px) {
          .process-grid { grid-template-columns: repeat(2, 1fr); }
          .process-connector { display: none; }
        }
        @media (max-width: 600px) {
          .process-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
