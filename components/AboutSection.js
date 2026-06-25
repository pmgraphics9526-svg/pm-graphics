"use client";

import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about" className="section-spacing container" style={{ pointerEvents: "auto" }}>
      {/* Section Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--stack-lg)", marginBottom: "48px" }}>
        <div className="font-label-caps" style={{ color: "var(--accent)" }}>ABOUT</div>
        <h2 className="font-headline-lg" style={{ textTransform: "uppercase" }}>THE MIND BEHIND PM GRAPHICS</h2>
      </div>

      {/* 2-Column Content Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          gap: "48px",
          alignItems: "start"
        }}
        className="about-grid"
      >
        {/* Left Column: Image */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "100%",
              maxWidth: "380px",
              height: "480px",
              position: "relative",
            }}
          >
            <Image
              src="/projects/Founder.png"
              alt="Founder Portrait"
              fill
              sizes="(max-width: 768px) 100vw, 380px"
              style={{
                objectFit: "cover",
                borderRadius: "16px"
              }}
            />
          </div>
        </div>

        {/* Right Column: Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Biography */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <p className="font-body-lg" style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}>
              Papon is a passionate graphic designer and visual storyteller with 2+ years of experience in branding, event graphics, flyer design, and video editing. He founded PM Graphics with one goal — to help businesses and individuals stand out with powerful, purposeful design.
            </p>

            {/* Capability Cards Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
              <div
                className="about-capability-card"
                style={{
                  padding: "16px",
                  borderRadius: "16px",
                  backgroundColor: "rgba(26,26,26,0.5)",
                  border: "1px solid rgba(255,106,0,0.12)",
                  boxShadow: "0 4px 16px rgba(255,106,0,0.07)",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,106,0,0.07)";
                  e.currentTarget.style.borderColor = "rgba(255,106,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(26,26,26,0.5)";
                  e.currentTarget.style.borderColor = "rgba(255,106,0,0.12)";
                }}
              >
                <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", fontWeight: "600" }}>
                  Core Branding
                </div>
                <p style={{ margin: "8px 0 0 0", color: "var(--text-primary)", fontSize: "13px", lineHeight: "1.6" }}>
                  Identity systems, logotypes, and premium brand narratives.
                </p>
              </div>

              <div
                className="about-capability-card"
                style={{
                  padding: "16px",
                  borderRadius: "16px",
                  backgroundColor: "rgba(26,26,26,0.5)",
                  border: "1px solid rgba(255,106,0,0.12)",
                  boxShadow: "0 4px 16px rgba(255,106,0,0.07)",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,106,0,0.07)";
                  e.currentTarget.style.borderColor = "rgba(255,106,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(26,26,26,0.5)";
                  e.currentTarget.style.borderColor = "rgba(255,106,0,0.12)";
                }}
              >
                <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", fontWeight: "600" }}>
                  Marketing Flyers
                </div>
                <p style={{ margin: "8px 0 0 0", color: "var(--text-primary)", fontSize: "13px", lineHeight: "1.6" }}>
                  Sophisticated flyer systems for luxury launches and high-ticket experiences.
                </p>
              </div>

              <div
                className="about-capability-card"
                style={{
                  padding: "16px",
                  borderRadius: "16px",
                  backgroundColor: "rgba(26,26,26,0.5)",
                  border: "1px solid rgba(255,106,0,0.12)",
                  boxShadow: "0 4px 16px rgba(255,106,0,0.07)",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,106,0,0.07)";
                  e.currentTarget.style.borderColor = "rgba(255,106,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(26,26,26,0.5)";
                  e.currentTarget.style.borderColor = "rgba(255,106,0,0.12)";
                }}
              >
                <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", fontWeight: "600" }}>
                  Event Graphics
                </div>
                <p style={{ margin: "8px 0 0 0", color: "var(--text-primary)", fontSize: "13px", lineHeight: "1.6" }}>
                  Immersive stage visuals, backdrops, and experiential print collateral.
                </p>
              </div>

              <div
                className="about-capability-card"
                style={{
                  padding: "16px",
                  borderRadius: "16px",
                  backgroundColor: "rgba(26,26,26,0.5)",
                  border: "1px solid rgba(255,106,0,0.12)",
                  boxShadow: "0 4px 16px rgba(255,106,0,0.07)",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,106,0,0.07)";
                  e.currentTarget.style.borderColor = "rgba(255,106,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(26,26,26,0.5)";
                  e.currentTarget.style.borderColor = "rgba(255,106,0,0.12)";
                }}
              >
                <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", fontWeight: "600" }}>
                  Video Editing
                </div>
                <p style={{ margin: "8px 0 0 0", color: "var(--text-primary)", fontSize: "13px", lineHeight: "1.6" }}>
                  YouTube, reels, and digital clips with premium pacing and finish.
                </p>
              </div>
            </div>
          </div>

          {/* Metric Badges Row */}
          <div className="about-metrics" style={{ display: "flex", flexDirection: "row", gap: "16px", justifyContent: "flex-start", alignItems: "stretch" }}>
            {[
              { label: "Projects Delivered", value: "50+" },
              { label: "Years Experience", value: "2+" },
              { label: "Client Satisfaction", value: "100%" }
            ].map((item) => (
              <div
                key={item.label}
                className="metric-card"
                style={{
                  flex: "1",
                  minWidth: "140px",
                  padding: "16px",
                  borderRadius: "16px",
                  backgroundColor: "rgba(26,26,26,0.5)",
                  border: "1px solid rgba(255,106,0,0.12)",
                  boxShadow: "0 4px 16px rgba(255,106,0,0.07)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  justifyContent: "center",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,106,0,0.07)";
                  e.currentTarget.style.borderColor = "rgba(255,106,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(26,26,26,0.5)";
                  e.currentTarget.style.borderColor = "rgba(255,106,0,0.12)";
                }}
              >
                <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", lineHeight: "1.2" }}>
                  {item.value}
                </div>
                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-secondary)", lineHeight: "1.3" }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .about-metrics {
            flex-wrap: wrap !important;
          }
          .metric-card {
            min-width: 120px !important;
            flex: 1 1 calc(50% - 8px) !important;
          }
        }

        @media (max-width: 640px) {
          .about-grid {
            gap: 24px !important;
          }
          .about-capability-card {
            padding: 12px !important;
          }
          .about-metrics {
            flex-direction: column !important;
            gap: 12px !important;
          }
          .metric-card {
            min-width: unset !important;
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
