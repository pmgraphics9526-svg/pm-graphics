"use client";

import React from "react";
import Link from "next/link";
import { Lock, ArrowRight, Palette, LayoutTemplate, BookOpen, Award, Compass, Clock, ChevronDown } from "lucide-react";

// Theme Variables based on Hero Section
const theme = {
  cream: "#FFFCF9",
  ink: "#1B1410",
  inkSoft: "#5B4E46",
  orange500: "#FF8A47",
  orange600: "#FF6E2E",
  orange700: "#E85A1B",
  orange100: "#FFE6D4",
  orange50: "#FFF6EF",
  white: "#FFFFFF",
};

export default function CourseLevels() {
  const [expandedLevel, setExpandedLevel] = React.useState(null);
  const [expandedModule, setExpandedModule] = React.useState(null);

  const handleLevelClick = (levelIndex) => {
    if (expandedLevel === levelIndex) {
      setExpandedLevel(null);
      setExpandedModule(null);
    } else {
      setExpandedLevel(levelIndex);
      setExpandedModule(null);
    }
  };

  const handleModuleClick = (moduleCode) => {
    if (expandedModule === moduleCode) {
      setExpandedModule(null);
    } else {
      setExpandedModule(moduleCode);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: theme.cream, color: theme.ink, fontFamily: "var(--font-inter), sans-serif", paddingTop: "60px", paddingBottom: "60px" }}>
      <div style={{ maxWidth: "var(--container-max-width, 1440px)", margin: "0 auto", padding: "0 var(--container-padding, 56px)" }}>
        
        {/* Header Section */}
        <div style={{ 
          textAlign: "center", 
          marginBottom: "60px", 
          position: "relative",
          padding: "40px 20px"
        }}>
          {/* Subtle glow behind header */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "300px",
            height: "300px",
            background: `radial-gradient(circle, ${theme.orange100} 0%, rgba(255, 230, 212, 0) 70%)`,
            filter: "blur(40px)",
            zIndex: 0,
            pointerEvents: "none"
          }} />
          
          <div style={{ position: "relative", zIndex: 1 }}>
            <span style={{ 
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: theme.orange50,
              border: `1px solid ${theme.orange100}`,
              color: theme.orange700,
              fontSize: "12.5px",
              fontWeight: 700,
              letterSpacing: ".06em",
              textTransform: "uppercase",
              padding: "8px 16px",
              borderRadius: "999px",
              marginBottom: "22px"
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: theme.orange600 }}></span>
              Curriculum Overview
            </span>
            <h1 className="font-display" style={{ marginBottom: "16px", color: theme.ink, fontSize: "48px", fontFamily: "var(--font-fraunces), serif", letterSpacing: "-0.02em" }}>
              Your Learning Path
            </h1>
            <p style={{ 
              fontSize: "16.5px", 
              color: theme.inkSoft, 
              maxWidth: "600px", 
              margin: "0 auto",
              lineHeight: 1.7
            }}>
              Master design fundamentals, UI/UX principles, and advanced techniques through an interactive, level-based journey.
            </p>
          </div>
        </div>

        {/* Premium Interactive Learning Roadmap */}
        <div style={{ position: "relative", maxWidth: "100%", margin: "48px auto 0 auto" }}>
          {/* Vertical dashed connector line */}
          <div style={{
            position: "absolute",
            left: "40px",
            top: "36px",
            bottom: "36px",
            width: "2px",
            borderLeft: `2.5px dashed ${theme.orange100}`,
            zIndex: 0
          }} />

          {/* ========================================================================= */}
          {/* LEVEL 01: FOUNDATION */}
          {/* ========================================================================= */}
          <div style={{ position: "relative", marginBottom: "32px", paddingLeft: "60px" }}>
            {/* Step node */}
            <div style={{
              position: "absolute",
              left: "20px",
              top: "16px",
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: expandedLevel === 1 
                ? `linear-gradient(135deg, ${theme.orange600} 0%, ${theme.orange700} 100%)` 
                : theme.white,
              border: `4px solid ${theme.cream}`,
              boxShadow: expandedLevel === 1 
                ? `0 0 0 3px ${theme.orange100}, 0 4px 10px rgba(232,90,27,0.3)` 
                : `0 0 0 3px rgba(27,20,16,0.04)`,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: expandedLevel === 1 ? "#FFF" : theme.orange700,
              fontSize: "13px",
              fontWeight: "800",
              transition: "all 0.3s ease"
            }}>01</div>

            {/* Level Card */}
            <div 
              style={{
                background: expandedLevel === 1 
                  ? "linear-gradient(135deg, #FF6E2E 0%, #E85A1B 100%)" 
                  : theme.white,
                borderRadius: "20px",
                padding: "36px",
                boxShadow: expandedLevel === 1 
                  ? "0 14px 40px rgba(232, 90, 27, 0.15)" 
                  : "0 10px 30px rgba(27,20,16,0.03)",
                border: expandedLevel === 1 
                  ? "1px solid rgba(255, 255, 255, 0.1)" 
                  : "1px solid rgba(27,20,16,0.06)",
                display: "flex",
                gap: "24px",
                alignItems: "center",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "pointer"
              }}
              onClick={() => handleLevelClick(1)}
              onMouseEnter={(e) => {
                if (expandedLevel !== 1) {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = theme.orange500;
                  e.currentTarget.style.boxShadow = "0 18px 40px -10px rgba(27,20,16,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (expandedLevel !== 1) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(27,20,16,0.06)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(27,20,16,0.03)";
                }
              }}
            >
              {/* Icon Container */}
              <div style={{
                backgroundColor: expandedLevel === 1 ? "rgba(255, 255, 255, 0.2)" : theme.orange50,
                color: expandedLevel === 1 ? "#FFFFFF" : theme.orange700,
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.3s ease"
              }}>
                <BookOpen size={26} strokeWidth={1.8} />
              </div>

              {/* Text Area */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12.5px", fontWeight: "800", color: expandedLevel === 1 ? "rgba(255,255,255,0.9)" : theme.orange600, letterSpacing: "1px" }}>LEVEL 01</span>
                  <span style={{ fontSize: "12px", fontWeight: "700", padding: "3px 12px", borderRadius: "999px", background: expandedLevel === 1 ? "rgba(255,255,255,0.25)" : "#DCFCE7", color: expandedLevel === 1 ? "#FFFFFF" : "#15803D" }}>Free</span>
                  <span style={{ fontSize: "13px", color: expandedLevel === 1 ? "rgba(255,255,255,0.85)" : theme.inkSoft, display: "flex", alignItems: "center", gap: "4px" }}>
                    42 Topics
                  </span>
                </div>
                <h3 style={{ fontSize: "24px", fontWeight: "700", color: expandedLevel === 1 ? "#FFFFFF" : theme.ink, fontFamily: "var(--font-fraunces), serif", margin: "0 0 8px 0" }}>Foundation</h3>
                <p style={{ fontSize: "15px", color: expandedLevel === 1 ? "rgba(255,255,255,0.9)" : theme.inkSoft, lineHeight: 1.6, margin: 0 }}>
                  Modules M1–M4. Master visual composition, shape relationships, color theory, and professional typographic layouts.
                </p>
              </div>

              {/* Arrow Indicator */}
              <ChevronDown 
                size={20} 
                style={{ 
                  color: expandedLevel === 1 ? "#FFFFFF" : theme.inkSoft, 
                  transform: expandedLevel === 1 ? "rotate(180deg)" : "rotate(0deg)", 
                  transition: "transform 0.3s ease",
                  marginLeft: "8px"
                }} 
              />
            </div>

            {/* Level 01 Nested Modules Accordion */}
            <div style={{
              maxHeight: expandedLevel === 1 ? "4000px" : "0px",
              opacity: expandedLevel === 1 ? 1 : 0,
              overflow: "hidden",
              transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease-in-out",
              pointerEvents: expandedLevel === 1 ? "auto" : "none",
              marginTop: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}>
              
              {/* ==================== MODULE M1 ==================== */}
              <div style={{ borderLeft: `3px solid ${theme.orange100}`, paddingLeft: "24px" }}>
                {/* Module Bar */}
                <div 
                  style={{
                    background: theme.orange50,
                    border: expandedModule === "M1" ? `1px solid ${theme.orange500}` : `1px solid ${theme.orange100}`,
                    borderRadius: "14px",
                    padding: "20px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "all 0.25s ease"
                  }}
                  onClick={(e) => { e.stopPropagation(); handleModuleClick("M1"); }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.orange500;
                    e.currentTarget.style.background = "rgba(255, 110, 46, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    if (expandedModule !== "M1") {
                      e.currentTarget.style.borderColor = theme.orange100;
                      e.currentTarget.style.background = theme.orange50;
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "900", color: theme.orange700, letterSpacing: "1px" }}>M1</span>
                    <h4 style={{ fontSize: "16px", fontWeight: "700", color: theme.ink, margin: 0 }}>Colour Theory</h4>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "13px", color: theme.inkSoft, fontWeight: "500" }}>11 Lessons</span>
                    <ChevronDown 
                      size={18} 
                      style={{ 
                        color: theme.orange700, 
                        transform: expandedModule === "M1" ? "rotate(180deg)" : "rotate(0deg)", 
                        transition: "transform 0.3s ease" 
                      }} 
                    />
                  </div>
                </div>

                {/* Module M1 Lessons Grid */}
                <div style={{
                  maxHeight: expandedModule === "M1" ? "1200px" : "0px",
                  opacity: expandedModule === "M1" ? 1 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-in-out",
                  pointerEvents: expandedModule === "M1" ? "auto" : "none"
                }}>
                  <div className="lesson-grid" style={{ marginTop: "16px" }}>
                    <Link href="/learning-tools/level-1/colour-wheel" className="lesson-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: theme.orange600, letterSpacing: "0.5px" }}>CT01</span>
                        <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "conic-gradient(#FF5252, #FF9800, #FFEB3B, #4CAF50, #2196F3, #9C27B0, #FF5252)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
                      </div>
                      <h4 style={{ fontSize: "13.5px", fontWeight: "700", color: theme.ink, margin: "6px 0", lineHeight: 1.3 }}>Colour Wheel</h4>
                      <div style={{ fontSize: "11.5px", fontWeight: "700", color: theme.orange600, display: "flex", alignItems: "center", gap: "3px" }}>
                        Start Lesson <ArrowRight size={11} />
                      </div>
                    </Link>

                    <Link href="/learning-tools/level-1/hue-saturation-value" className="lesson-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: theme.orange600, letterSpacing: "0.5px" }}>CT02</span>
                        <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "conic-gradient(#FF5252, #FF9800, #FFEB3B, #4CAF50, #2196F3, #9C27B0, #FF5252)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
                      </div>
                      <h4 style={{ fontSize: "13.5px", fontWeight: "700", color: theme.ink, margin: "6px 0", lineHeight: 1.3 }}>Hue Saturation Value</h4>
                      <div style={{ fontSize: "11.5px", fontWeight: "700", color: theme.orange600, display: "flex", alignItems: "center", gap: "3px" }}>
                        Start Lesson <ArrowRight size={11} />
                      </div>
                    </Link>

                    <Link href="/learning-tools/level-1/tint-tone-shade" className="lesson-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: theme.orange600, letterSpacing: "0.5px" }}>CT03</span>
                        <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "conic-gradient(#FF5252, #FF9800, #FFEB3B, #4CAF50, #2196F3, #9C27B0, #FF5252)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
                      </div>
                      <h4 style={{ fontSize: "13.5px", fontWeight: "700", color: theme.ink, margin: "6px 0", lineHeight: 1.3 }}>Tint Tone Shade</h4>
                      <div style={{ fontSize: "11.5px", fontWeight: "700", color: theme.orange600, display: "flex", alignItems: "center", gap: "3px" }}>
                        Start Lesson <ArrowRight size={11} />
                      </div>
                    </Link>

                    <Link href="/learning-tools/level-1/warm-vs-cool" className="lesson-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: theme.orange600, letterSpacing: "0.5px" }}>CT04</span>
                        <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "conic-gradient(#FF5252, #FF9800, #FFEB3B, #4CAF50, #2196F3, #9C27B0, #FF5252)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
                      </div>
                      <h4 style={{ fontSize: "13.5px", fontWeight: "700", color: theme.ink, margin: "6px 0", lineHeight: 1.3 }}>Warm vs Cool</h4>
                      <div style={{ fontSize: "11.5px", fontWeight: "700", color: theme.orange600, display: "flex", alignItems: "center", gap: "3px" }}>
                        Start Lesson <ArrowRight size={11} />
                      </div>
                    </Link>

                    <Link href="/learning-tools/level-1/colour-harmony" className="lesson-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: theme.orange600, letterSpacing: "0.5px" }}>CT05</span>
                        <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "conic-gradient(#FF5252, #FF9800, #FFEB3B, #4CAF50, #2196F3, #9C27B0, #FF5252)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
                      </div>
                      <h4 style={{ fontSize: "13.5px", fontWeight: "700", color: theme.ink, margin: "6px 0", lineHeight: 1.3 }}>Colour Harmony</h4>
                      <div style={{ fontSize: "11.5px", fontWeight: "700", color: theme.orange600, display: "flex", alignItems: "center", gap: "3px" }}>
                        Start Lesson <ArrowRight size={11} />
                      </div>
                    </Link>

                    <Link href="/learning-tools/level-1/sixty-thirty-ten" className="lesson-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: theme.orange600, letterSpacing: "0.5px" }}>CT06</span>
                        <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "conic-gradient(#FF5252, #FF9800, #FFEB3B, #4CAF50, #2196F3, #9C27B0, #FF5252)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
                      </div>
                      <h4 style={{ fontSize: "13.5px", fontWeight: "700", color: theme.ink, margin: "6px 0", lineHeight: 1.3 }}>60·30·10 Rule</h4>
                      <div style={{ fontSize: "11.5px", fontWeight: "700", color: theme.orange600, display: "flex", alignItems: "center", gap: "3px" }}>
                        Start Lesson <ArrowRight size={11} />
                      </div>
                    </Link>

                    <Link href="/learning-tools/level-1/colour-psychology" className="lesson-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: theme.orange600, letterSpacing: "0.5px" }}>CT07</span>
                        <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "conic-gradient(#FF5252, #FF9800, #FFEB3B, #4CAF50, #2196F3, #9C27B0, #FF5252)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
                      </div>
                      <h4 style={{ fontSize: "13.5px", fontWeight: "700", color: theme.ink, margin: "6px 0", lineHeight: 1.3 }}>Colour Psychology</h4>
                      <div style={{ fontSize: "11.5px", fontWeight: "700", color: theme.orange600, display: "flex", alignItems: "center", gap: "3px" }}>
                        Start Lesson <ArrowRight size={11} />
                      </div>
                    </Link>

                    <Link href="/learning-tools/level-1/temperature-and-contrast" className="lesson-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: theme.orange600, letterSpacing: "0.5px" }}>CT08</span>
                        <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "conic-gradient(#FF5252, #FF9800, #FFEB3B, #4CAF50, #2196F3, #9C27B0, #FF5252)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
                      </div>
                      <h4 style={{ fontSize: "13.5px", fontWeight: "700", color: theme.ink, margin: "6px 0", lineHeight: 1.3 }}>Temperature &amp; Contrast</h4>
                      <div style={{ fontSize: "11.5px", fontWeight: "700", color: theme.orange600, display: "flex", alignItems: "center", gap: "3px" }}>
                        Start Lesson <ArrowRight size={11} />
                      </div>
                    </Link>

                    <Link href="/learning-tools/level-1/simultaneous-contrast" className="lesson-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: theme.orange600, letterSpacing: "0.5px" }}>CT09</span>
                        <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "conic-gradient(#FF5252, #FF9800, #FFEB3B, #4CAF50, #2196F3, #9C27B0, #FF5252)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
                      </div>
                      <h4 style={{ fontSize: "13.5px", fontWeight: "700", color: theme.ink, margin: "6px 0", lineHeight: 1.3 }}>Simultaneous Contrast</h4>
                      <div style={{ fontSize: "11.5px", fontWeight: "700", color: theme.orange600, display: "flex", alignItems: "center", gap: "3px" }}>
                        Start Lesson <ArrowRight size={11} />
                      </div>
                    </Link>

                    <Link href="/learning-tools/level-1/rgb-cmyk-hex-pantone" className="lesson-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: theme.orange600, letterSpacing: "0.5px" }}>CT10</span>
                        <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "conic-gradient(#FF5252, #FF9800, #FFEB3B, #4CAF50, #2196F3, #9C27B0, #FF5252)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
                      </div>
                      <h4 style={{ fontSize: "13.5px", fontWeight: "700", color: theme.ink, margin: "6px 0", lineHeight: 1.3 }}>RGB CMYK HEX Pantone</h4>
                      <div style={{ fontSize: "11.5px", fontWeight: "700", color: theme.orange600, display: "flex", alignItems: "center", gap: "3px" }}>
                        Start Lesson <ArrowRight size={11} />
                      </div>
                    </Link>

                    <Link href="/learning-tools/level-1/colour-accessibility" className="lesson-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: theme.orange600, letterSpacing: "0.5px" }}>CT11</span>
                        <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "conic-gradient(#FF5252, #FF9800, #FFEB3B, #4CAF50, #2196F3, #9C27B0, #FF5252)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
                      </div>
                      <h4 style={{ fontSize: "13.5px", fontWeight: "700", color: theme.ink, margin: "6px 0", lineHeight: 1.3 }}>Colour Accessibility</h4>
                      <div style={{ fontSize: "11.5px", fontWeight: "700", color: theme.orange600, display: "flex", alignItems: "center", gap: "3px" }}>
                        Start Lesson <ArrowRight size={11} />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* ==================== MODULE M2 ==================== */}
              <div style={{ borderLeft: `3px solid ${theme.orange100}`, paddingLeft: "24px" }}>
                <div 
                  style={{
                    background: theme.orange50,
                    border: expandedModule === "M2" ? `1px solid ${theme.orange500}` : `1px solid ${theme.orange100}`,
                    borderRadius: "14px",
                    padding: "20px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "all 0.25s ease"
                  }}
                  onClick={(e) => { e.stopPropagation(); handleModuleClick("M2"); }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.orange500;
                    e.currentTarget.style.background = "rgba(255, 110, 46, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    if (expandedModule !== "M2") {
                      e.currentTarget.style.borderColor = theme.orange100;
                      e.currentTarget.style.background = theme.orange50;
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "900", color: theme.orange700, letterSpacing: "1px" }}>M2</span>
                    <h4 style={{ fontSize: "16px", fontWeight: "700", color: theme.ink, margin: 0 }}>Typography</h4>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "13px", color: theme.inkSoft, fontWeight: "500" }}>5 Live · 4 Coming Soon</span>
                    <ChevronDown 
                      size={18} 
                      style={{ 
                        color: theme.orange700, 
                        transform: expandedModule === "M2" ? "rotate(180deg)" : "rotate(0deg)", 
                        transition: "transform 0.3s ease" 
                      }} 
                    />
                  </div>
                </div>

                <div style={{
                  maxHeight: expandedModule === "M2" ? "1200px" : "0px",
                  opacity: expandedModule === "M2" ? 1 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-in-out",
                  pointerEvents: expandedModule === "M2" ? "auto" : "none"
                }}>
                    <div className="lesson-grid" style={{ marginTop: "16px" }}>
                    {/* ── T01–T05: LIVE ── */}
                    {[
                      { code: "T01", title: "What is Typography",       slug: "what-is-typography" },
                      { code: "T02", title: "Typeface vs Font",          slug: "typeface-vs-font" },
                      { code: "T03", title: "Serif vs Sans-Serif",       slug: "serif-vs-sans-serif" },
                      { code: "T04", title: "Type Scale & Hierarchy",    slug: "type-scale-hierarchy" },
                      { code: "T05", title: "Leading Tracking Kerning",  slug: "leading-tracking-kerning" },
                    ].map((lesson, idx) => (
                      <Link key={idx} href={`/learning-tools/level-1/${lesson.slug}`} className="lesson-card" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                          <span style={{ fontSize: "11px", fontWeight: "800", color: theme.orange600, letterSpacing: "0.5px" }}>{lesson.code}</span>
                          <div style={{ fontSize: "11px", fontWeight: "900", color: theme.orange700, width: "16px", height: "16px", borderRadius: "50%", background: theme.orange50, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${theme.orange100}` }}>A</div>
                        </div>
                        <h4 style={{ fontSize: "13.5px", fontWeight: "700", color: theme.ink, margin: "6px 0", lineHeight: 1.3 }}>{lesson.title}</h4>
                        <div style={{ fontSize: "11.5px", fontWeight: "700", color: theme.orange600, display: "flex", alignItems: "center", gap: "3px" }}>
                          Start Lesson <ArrowRight size={11} />
                        </div>
                      </Link>
                    ))}
                    {/* ── T06–T09: LOCKED ── */}
                    {[
                      { code: "T06", title: "Line Length & Readability" },
                      { code: "T07", title: "Font Pairing" },
                      { code: "T08", title: "Type in UI Design" },
                      { code: "T09", title: "Type Personality" },
                    ].map((lesson, idx) => (
                      <div key={idx} className="lesson-card" style={{ opacity: 0.55, cursor: "default", pointerEvents: "none" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                          <span style={{ fontSize: "11px", fontWeight: "800", color: theme.orange600, letterSpacing: "0.5px" }}>{lesson.code}</span>
                          <Lock size={11} color={theme.inkSoft} />
                        </div>
                        <h4 style={{ fontSize: "13.5px", fontWeight: "700", color: theme.ink, margin: "6px 0", lineHeight: 1.3 }}>{lesson.title}</h4>
                        <div style={{ fontSize: "11px", fontWeight: "600", color: theme.inkSoft }}>
                          Coming Soon
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ==================== MODULE M3 ==================== */}
              <div style={{ borderLeft: `3px solid ${theme.orange100}`, paddingLeft: "24px" }}>
                <div 
                  style={{
                    background: theme.orange50,
                    border: expandedModule === "M3" ? `1px solid ${theme.orange500}` : `1px solid ${theme.orange100}`,
                    borderRadius: "14px",
                    padding: "20px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "all 0.25s ease"
                  }}
                  onClick={(e) => { e.stopPropagation(); handleModuleClick("M3"); }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.orange500;
                    e.currentTarget.style.background = "rgba(255, 110, 46, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    if (expandedModule !== "M3") {
                      e.currentTarget.style.borderColor = theme.orange100;
                      e.currentTarget.style.background = theme.orange50;
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "900", color: theme.orange700, letterSpacing: "1px" }}>M3</span>
                    <h4 style={{ fontSize: "16px", fontWeight: "700", color: theme.ink, margin: 0 }}>Shape &amp; Form</h4>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "13px", color: theme.inkSoft, fontWeight: "500" }}>12 Lessons</span>
                    <ChevronDown 
                      size={18} 
                      style={{ 
                        color: theme.orange700, 
                        transform: expandedModule === "M3" ? "rotate(180deg)" : "rotate(0deg)", 
                        transition: "transform 0.3s ease" 
                      }} 
                    />
                  </div>
                </div>

                <div style={{
                  maxHeight: expandedModule === "M3" ? "1200px" : "0px",
                  opacity: expandedModule === "M3" ? 1 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-in-out",
                  pointerEvents: expandedModule === "M3" ? "auto" : "none"
                }}>
                  <div className="lesson-grid" style={{ marginTop: "16px" }}>
                    {[
                      { code: "S01", title: "Basic Shapes" },
                      { code: "S02", title: "Geometric vs Organic" },
                      { code: "S03", title: "Positive & Negative Space" },
                      { code: "S04", title: "Shape Psychology" },
                      { code: "S05", title: "Gestalt Principles" },
                      { code: "S06", title: "Form & Depth 2D to 3D" },
                      { code: "S07", title: "Shape Hierarchy & Scale" },
                      { code: "S08", title: "Shape in Composition" },
                      { code: "S09", title: "Abstraction & Simplification" },
                      { code: "S10", title: "Boolean Shape Relationships" },
                      { code: "S11", title: "Visual Weight & Balance" },
                      { code: "S12", title: "Shape in Branding" }
                    ].map((lesson, idx) => (
                      <div key={idx} className="lesson-card" style={{ opacity: 0.55, cursor: "default", pointerEvents: "none" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                          <span style={{ fontSize: "11px", fontWeight: "800", color: theme.orange600, letterSpacing: "0.5px" }}>{lesson.code}</span>
                          <Lock size={11} color={theme.inkSoft} />
                        </div>
                        <h4 style={{ fontSize: "13.5px", fontWeight: "700", color: theme.ink, margin: "6px 0", lineHeight: 1.3 }}>{lesson.title}</h4>
                        <div style={{ fontSize: "11px", fontWeight: "600", color: theme.inkSoft }}>
                          Coming Soon
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ==================== MODULE M4 ==================== */}
              <div style={{ borderLeft: `3px solid ${theme.orange100}`, paddingLeft: "24px" }}>
                <div 
                  style={{
                    background: theme.orange50,
                    border: expandedModule === "M4" ? `1px solid ${theme.orange500}` : `1px solid ${theme.orange100}`,
                    borderRadius: "14px",
                    padding: "20px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "all 0.25s ease"
                  }}
                  onClick={(e) => { e.stopPropagation(); handleModuleClick("M4"); }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.orange500;
                    e.currentTarget.style.background = "rgba(255, 110, 46, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    if (expandedModule !== "M4") {
                      e.currentTarget.style.borderColor = theme.orange100;
                      e.currentTarget.style.background = theme.orange50;
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "900", color: theme.orange700, letterSpacing: "1px" }}>M4</span>
                    <h4 style={{ fontSize: "16px", fontWeight: "700", color: theme.ink, margin: 0 }}>Layout &amp; Composition</h4>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "13px", color: theme.inkSoft, fontWeight: "500" }}>10 Lessons</span>
                    <ChevronDown 
                      size={18} 
                      style={{ 
                        color: theme.orange700, 
                        transform: expandedModule === "M4" ? "rotate(180deg)" : "rotate(0deg)", 
                        transition: "transform 0.3s ease" 
                      }} 
                    />
                  </div>
                </div>

                <div style={{
                  maxHeight: expandedModule === "M4" ? "1200px" : "0px",
                  opacity: expandedModule === "M4" ? 1 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-in-out",
                  pointerEvents: expandedModule === "M4" ? "auto" : "none"
                }}>
                  <div className="lesson-grid" style={{ marginTop: "16px" }}>
                    {[
                      { code: "L01", title: "Grid Systems" },
                      { code: "L02", title: "Rule of Thirds" },
                      { code: "L03", title: "Visual Hierarchy" },
                      { code: "L04", title: "White Space" },
                      { code: "L05", title: "Alignment & Proximity" },
                      { code: "L06", title: "Contrast & Emphasis" },
                      { code: "L07", title: "Balance" },
                      { code: "L08", title: "Repetition & Pattern" },
                      { code: "L09", title: "Focal Point & Visual Flow" },
                      { code: "L10", title: "Composition in Real Brands" }
                    ].map((lesson, idx) => (
                      <div key={idx} className="lesson-card" style={{ opacity: 0.55, cursor: "default", pointerEvents: "none" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                          <span style={{ fontSize: "11px", fontWeight: "800", color: theme.orange600, letterSpacing: "0.5px" }}>{lesson.code}</span>
                          <Lock size={11} color={theme.inkSoft} />
                        </div>
                        <h4 style={{ fontSize: "13.5px", fontWeight: "700", color: theme.ink, margin: "6px 0", lineHeight: 1.3 }}>{lesson.title}</h4>
                        <div style={{ fontSize: "11px", fontWeight: "600", color: theme.inkSoft }}>
                          Coming Soon
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* LEVEL 02: INTERMEDIATE */}
          {/* ========================================================================= */}
          <div style={{ position: "relative", marginBottom: "32px", paddingLeft: "60px" }}>
            {/* Step node */}
            <div style={{
              position: "absolute",
              left: "20px",
              top: "16px",
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: expandedLevel === 2 
                ? `linear-gradient(135deg, ${theme.orange600} 0%, ${theme.orange700} 100%)` 
                : theme.white,
              border: `4px solid ${theme.cream}`,
              boxShadow: expandedLevel === 2 
                ? `0 0 0 3px ${theme.orange100}, 0 4px 10px rgba(232,90,27,0.3)` 
                : `0 0 0 3px rgba(27,20,16,0.04)`,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: expandedLevel === 2 ? "#FFF" : theme.orange700,
              fontSize: "13px",
              fontWeight: "800",
              transition: "all 0.3s ease"
            }}>02</div>

            {/* Level Card */}
            <div 
              style={{
                background: expandedLevel === 2 
                  ? "linear-gradient(135deg, #FF6E2E 0%, #E85A1B 100%)" 
                  : theme.white,
                borderRadius: "20px",
                padding: "36px",
                boxShadow: expandedLevel === 2 
                  ? "0 14px 40px rgba(232, 90, 27, 0.15)" 
                  : "0 10px 30px rgba(27,20,16,0.03)",
                border: expandedLevel === 2 
                  ? "1px solid rgba(255, 255, 255, 0.1)" 
                  : "1px solid rgba(27,20,16,0.06)",
                display: "flex",
                gap: "24px",
                alignItems: "center",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "pointer"
              }}
              onClick={() => handleLevelClick(2)}
              onMouseEnter={(e) => {
                if (expandedLevel !== 2) {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = theme.orange500;
                  e.currentTarget.style.boxShadow = "0 18px 40px -10px rgba(27,20,16,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (expandedLevel !== 2) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(27,20,16,0.06)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(27,20,16,0.03)";
                }
              }}
            >
              {/* Icon Container */}
              <div style={{
                backgroundColor: expandedLevel === 2 ? "rgba(255, 255, 255, 0.2)" : theme.orange50,
                color: expandedLevel === 2 ? "#FFFFFF" : theme.orange700,
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.3s ease"
              }}>
                <Palette size={26} strokeWidth={1.8} />
              </div>

              {/* Text Area */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12.5px", fontWeight: "800", color: expandedLevel === 2 ? "rgba(255,255,255,0.9)" : theme.orange600, letterSpacing: "1px" }}>LEVEL 02</span>
                  <span style={{ fontSize: "12px", fontWeight: "700", padding: "3px 12px", borderRadius: "999px", background: expandedLevel === 2 ? "rgba(255,255,255,0.25)" : "rgba(27,20,16,0.06)", color: expandedLevel === 2 ? "rgba(255,255,255,0.7)" : theme.inkSoft }}>Coming Soon</span>
                </div>
                <h3 style={{ fontSize: "24px", fontWeight: "700", color: expandedLevel === 2 ? "#FFFFFF" : theme.ink, fontFamily: "var(--font-fraunces), serif", margin: "0 0 8px 0" }}>Intermediate</h3>
                <p style={{ fontSize: "15px", color: expandedLevel === 2 ? "rgba(255,255,255,0.9)" : theme.inkSoft, lineHeight: 1.6, margin: 0 }}>
                  Modules M5–M8. Step up your design execution with branding projects, user experience models, print handoffs, and motion visuals.
                </p>
              </div>

              {/* Arrow Indicator */}
              <ChevronDown 
                size={20} 
                style={{ 
                  color: expandedLevel === 2 ? "#FFFFFF" : theme.inkSoft, 
                  transform: expandedLevel === 2 ? "rotate(180deg)" : "rotate(0deg)", 
                  transition: "transform 0.3s ease",
                  marginLeft: "8px"
                }} 
              />
            </div>

            {/* Level 02 Nested Modules Accordion */}
            <div style={{
              maxHeight: expandedLevel === 2 ? "2000px" : "0px",
              opacity: expandedLevel === 2 ? 1 : 0,
              overflow: "hidden",
              transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease-in-out",
              pointerEvents: expandedLevel === 2 ? "auto" : "none",
              marginTop: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}>
              {[
                { code: "M5", title: "Branding & Identity", desc: "Unlock the Intermediate path to access branding identity templates, briefs, and client guidelines." },
                { code: "M6", title: "UI/UX Fundamentals", desc: "Unlock the Intermediate path to access wireframing frameworks, user journey mapping, and Figma components." },
                { code: "M7", title: "Print & Digital Production", desc: "Unlock the Intermediate path to access printing layouts, ICC profile mappings, and package design assets." },
                { code: "M8", title: "Motion & Visual Storytelling", desc: "Unlock the Intermediate path to access keyframe animation parameters, storyboards, and video transitions." }
              ].map((module, idx) => (
                <div key={idx} style={{ borderLeft: `3px solid ${theme.orange100}`, paddingLeft: "24px" }}>
                  <div 
                    style={{
                      background: theme.orange50,
                      border: expandedModule === module.code ? `1px solid ${theme.orange500}` : `1px solid ${theme.orange100}`,
                      borderRadius: "14px",
                      padding: "20px 24px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "all 0.25s ease"
                    }}
                    onClick={(e) => { e.stopPropagation(); handleModuleClick(module.code); }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = theme.orange500;
                      e.currentTarget.style.background = "rgba(255, 110, 46, 0.08)";
                    }}
                    onMouseLeave={(e) => {
                      if (expandedModule !== module.code) {
                        e.currentTarget.style.borderColor = theme.orange100;
                        e.currentTarget.style.background = theme.orange50;
                      }
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "900", color: theme.orange700, letterSpacing: "1px" }}>{module.code}</span>
                      <h4 style={{ fontSize: "16px", fontWeight: "700", color: theme.ink, margin: 0 }}>{module.title}</h4>
                    </div>
                    <ChevronDown 
                      size={18} 
                      style={{ 
                        color: theme.orange700, 
                        transform: expandedModule === module.code ? "rotate(180deg)" : "rotate(0deg)", 
                        transition: "transform 0.3s ease" 
                      }} 
                    />
                  </div>

                  <div style={{
                    maxHeight: expandedModule === module.code ? "400px" : "0px",
                    opacity: expandedModule === module.code ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-in-out",
                    pointerEvents: expandedModule === module.code ? "auto" : "none"
                  }}>
                    <div style={{
                      backgroundColor: theme.white,
                      border: `1.5px dashed ${theme.orange100}`,
                      borderRadius: "16px",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      gap: "12px",
                      marginTop: "12px"
                    }}>
                      <Lock size={20} color={theme.orange500} />
                      <span style={{ fontSize: "13px", fontWeight: "700", color: theme.orange700, letterSpacing: "1px" }}>CURRICULUM LOCKED</span>
                      <p style={{ fontSize: "12.5px", color: theme.inkSoft, margin: 0, maxWidth: "420px" }}>
                        {module.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* LEVEL 03: ADVANCED */}
          {/* ========================================================================= */}
          <div style={{ position: "relative", marginBottom: "20px", paddingLeft: "60px" }}>
            {/* Step node */}
            <div style={{
              position: "absolute",
              left: "20px",
              top: "16px",
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: expandedLevel === 3 
                ? `linear-gradient(135deg, ${theme.orange600} 0%, ${theme.orange700} 100%)` 
                : theme.white,
              border: `4px solid ${theme.cream}`,
              boxShadow: expandedLevel === 3 
                ? `0 0 0 3px ${theme.orange100}, 0 4px 10px rgba(232,90,27,0.3)` 
                : `0 0 0 3px rgba(27,20,16,0.04)`,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: expandedLevel === 3 ? "#FFF" : theme.orange700,
              fontSize: "13px",
              fontWeight: "800",
              transition: "all 0.3s ease"
            }}>03</div>

            {/* Level Card */}
            <div 
              style={{
                background: expandedLevel === 3 
                  ? "linear-gradient(135deg, #FF6E2E 0%, #E85A1B 100%)" 
                  : theme.white,
                borderRadius: "20px",
                padding: "36px",
                boxShadow: expandedLevel === 3 
                  ? "0 14px 40px rgba(232, 90, 27, 0.15)" 
                  : "0 10px 30px rgba(27,20,16,0.03)",
                border: expandedLevel === 3 
                  ? "1px solid rgba(255, 255, 255, 0.1)" 
                  : "1px solid rgba(27,20,16,0.06)",
                display: "flex",
                gap: "24px",
                alignItems: "center",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "pointer"
              }}
              onClick={() => handleLevelClick(3)}
              onMouseEnter={(e) => {
                if (expandedLevel !== 3) {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = theme.orange500;
                  e.currentTarget.style.boxShadow = "0 18px 40px -10px rgba(27,20,16,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (expandedLevel !== 3) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(27,20,16,0.06)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(27,20,16,0.03)";
                }
              }}
            >
              {/* Icon Container */}
              <div style={{
                backgroundColor: expandedLevel === 3 ? "rgba(255, 255, 255, 0.2)" : theme.orange50,
                color: expandedLevel === 3 ? "#FFFFFF" : theme.orange700,
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.3s ease"
              }}>
                <LayoutTemplate size={26} strokeWidth={1.8} />
              </div>

              {/* Text Area */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12.5px", fontWeight: "800", color: expandedLevel === 3 ? "rgba(255,255,255,0.9)" : theme.orange600, letterSpacing: "1px" }}>LEVEL 03</span>
                  <span style={{ fontSize: "12px", fontWeight: "700", padding: "3px 12px", borderRadius: "999px", background: expandedLevel === 3 ? "rgba(255,255,255,0.25)" : "rgba(27,20,16,0.06)", color: expandedLevel === 3 ? "rgba(255,255,255,0.7)" : theme.inkSoft }}>Coming Soon</span>
                </div>
                <h3 style={{ fontSize: "24px", fontWeight: "700", color: expandedLevel === 3 ? "#FFFFFF" : theme.ink, fontFamily: "var(--font-fraunces), serif", margin: "0 0 8px 0" }}>Advanced</h3>
                <p style={{ fontSize: "15px", color: expandedLevel === 3 ? "rgba(255,255,255,0.9)" : theme.inkSoft, lineHeight: 1.6, margin: 0 }}>
                  Modules M9–M11. Perfect your design system architecture, portfolio assets, freelance workflows, and high-impact agency deliverables.
                </p>
              </div>

              {/* Arrow Indicator */}
              <ChevronDown 
                size={20} 
                style={{ 
                  color: expandedLevel === 3 ? "#FFFFFF" : theme.inkSoft, 
                  transform: expandedLevel === 3 ? "rotate(180deg)" : "rotate(0deg)", 
                  transition: "transform 0.3s ease",
                  marginLeft: "8px"
                }} 
              />
            </div>

            {/* Level 03 Nested Modules Accordion */}
            <div style={{
              maxHeight: expandedLevel === 3 ? "2000px" : "0px",
              opacity: expandedLevel === 3 ? 1 : 0,
              overflow: "hidden",
              transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease-in-out",
              pointerEvents: expandedLevel === 3 ? "auto" : "none",
              marginTop: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}>
              {[
                { code: "M9", title: "Portfolio & Presentation", desc: "Unlock the Premium path to access design showreels, agency portfolio templates, and resume guides." },
                { code: "M10", title: "Freelance & Client Management", desc: "Unlock the Premium path to access client onboarding forms, invoice models, and pricing strategies." },
                { code: "M11", title: "Design Systems at Scale", desc: "Unlock the Premium path to access visual token dictionaries, component libraries, and visual audits." }
              ].map((module, idx) => (
                <div key={idx} style={{ borderLeft: `3px solid ${theme.orange100}`, paddingLeft: "24px" }}>
                  <div 
                    style={{
                      background: theme.orange50,
                      border: expandedModule === module.code ? `1px solid ${theme.orange500}` : `1px solid ${theme.orange100}`,
                      borderRadius: "14px",
                      padding: "20px 24px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "all 0.25s ease"
                    }}
                    onClick={(e) => { e.stopPropagation(); handleModuleClick(module.code); }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = theme.orange500;
                      e.currentTarget.style.background = "rgba(255, 110, 46, 0.08)";
                    }}
                    onMouseLeave={(e) => {
                      if (expandedModule !== module.code) {
                        e.currentTarget.style.borderColor = theme.orange100;
                        e.currentTarget.style.background = theme.orange50;
                      }
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "900", color: theme.orange700, letterSpacing: "1px" }}>{module.code}</span>
                      <h4 style={{ fontSize: "16px", fontWeight: "700", color: theme.ink, margin: 0 }}>{module.title}</h4>
                    </div>
                    <ChevronDown 
                      size={18} 
                      style={{ 
                        color: theme.orange700, 
                        transform: expandedModule === module.code ? "rotate(180deg)" : "rotate(0deg)", 
                        transition: "transform 0.3s ease" 
                      }} 
                    />
                  </div>

                  <div style={{
                    maxHeight: expandedModule === module.code ? "400px" : "0px",
                    opacity: expandedModule === module.code ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-in-out",
                    pointerEvents: expandedModule === module.code ? "auto" : "none"
                  }}>
                    <div style={{
                      backgroundColor: theme.white,
                      border: `1.5px dashed ${theme.orange100}`,
                      borderRadius: "16px",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      gap: "12px",
                      marginTop: "12px"
                    }}>
                      <Lock size={20} color={theme.orange500} />
                      <span style={{ fontSize: "13px", fontWeight: "700", color: theme.orange700, letterSpacing: "1px" }}>CURRICULUM LOCKED</span>
                      <p style={{ fontSize: "12.5px", color: theme.inkSoft, margin: 0, maxWidth: "420px" }}>
                        {module.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
