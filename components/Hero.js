"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { 
  ArrowUpRight, 
  Sparkles, 
  Briefcase, 
  Users, 
  Award, 
  Palette, 
  Layers, 
  Video, 
  Smartphone,
  PhoneCall
} from "lucide-react";
import PremiumHeroBackground from "./PremiumHeroBackground";
import { projects } from "@/components/projectsData";

// Simple count-up hook for numbers
function useCountUp(target, duration = 1500, trigger = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
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
  }, [trigger, target, duration]);
  return count;
}

export default function Hero() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const countProjects = useCountUp(50, 1500, true);
  const countExperience = useCountUp(2, 1000, true);
  const countSatisfaction = useCountUp(100, 1500, true);



  const openProjectModal = (projectId) => {
    window.dispatchEvent(new CustomEvent("openProject", { detail: { projectId } }));
  };

  // Only BRANDING clients for Trusted By section
  const brandingClients = Array.from(
    new Set(projects.filter(p => p.category === "BRANDING").map(p => p.client).filter(Boolean))
  );

  return (
    <section
      id="home"
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: "transparent",
        paddingBottom: "8px",
      }}
    >
      {/* Premium Dark Hero Background Canvas with cinematic grain */}
      <PremiumHeroBackground />

      {/* Hero Content */}
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "var(--hero-grid-cols, 1.1fr 1fr)",
          alignItems: "center",
          gap: "48px",
          paddingTop: "130px",
          width: "100%",
        }}
      >
        {/* Left Column: Text & Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Badge Pill */}
          <div className="hero-badge">
            <Sparkles size={13} />
            BRAND IDENTITY & MOTION DESIGN STUDIO
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative" }}>
            <h1
              className="font-display"
              style={{
                fontFamily: "var(--font-space-grotesk), var(--font-display), sans-serif",
                color: "#FFFFFF",
                fontSize: "clamp(2.6rem, 5.2vw, 72px)",
                lineHeight: "1.0",
                letterSpacing: "-0.04em",
                fontWeight: "800",
                textTransform: "uppercase",
                animation: "slideInLeft 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards",
              }}
            >
              We Build Brands <br />
              <span style={{ color: "var(--accent)" }}>People Remember.</span>
            </h1>
            <p
              className="font-body-lg"
              style={{
                color: "var(--text-secondary)",
                maxWidth: "580px",
                lineHeight: "1.7",
                marginTop: "8px",
                animation: "slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards",
              }}
            >
              Helping startups and businesses stand out with strategic branding, logo design and engaging motion graphics.
            </p>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--stack-md)",
              animation: "slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards",
            }}
          >
            <button onClick={() => scrollToSection("work")} className="btn-primary" style={{ transition: "all 0.3s ease" }}>
              View Portfolio
              <ArrowUpRight size={18} />
            </button>
            <button onClick={() => scrollToSection("contact")} className="btn-secondary" style={{ transition: "all 0.3s ease" }}>
              Book a Free Call
              <PhoneCall size={16} />
            </button>
          </div>

          {/* Dynamic Stats Box */}
          <div className="hero-stats-box">
            <div className="hero-stat-item">
              <div className="hero-stat-val">
                <Briefcase size={20} />
                <span>{countProjects}+</span>
              </div>
              <div className="hero-stat-label">Projects Delivered</div>
            </div>

            <div className="hero-stat-item">
              <div className="hero-stat-val">
                <Award size={20} />
                <span>{countExperience}+</span>
              </div>
              <div className="hero-stat-label">Years Experience</div>
            </div>

            <div className="hero-stat-item">
              <div className="hero-stat-val">
                <Users size={20} />
                <span>{countSatisfaction}%</span>
              </div>
              <div className="hero-stat-label">Client Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Right Column: Founder Photo & Service Tags & Project Previews */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            position: "relative",
            animation: "slideIn 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          {/* Main Visual Container */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "500px",
              height: "460px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Layered dual-layer Ambient Glow behind the photo */}
            {/* Outer wide ambient glow */}
            <div
              style={{
                position: "absolute",
                width: "480px",
                height: "480px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255, 106, 0, 0.12) 0%, rgba(255, 106, 0, 0) 70%)",
                filter: "blur(50px)",
                zIndex: 0,
                pointerEvents: "none",
              }}
            />
            {/* Inner core focus glow */}
            <div
              style={{
                position: "absolute",
                width: "280px",
                height: "280px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255, 106, 0, 0.28) 0%, rgba(255, 106, 0, 0) 70%)",
                filter: "blur(25px)",
                zIndex: 0,
                pointerEvents: "none",
              }}
            />

            {/* Flipped Founder Image Wrapper */}
            <div 
              style={{ 
                transform: "scaleX(-1)", 
                width: "100%", 
                height: "100%", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center",
                zIndex: 2 
              }}
            >
              <Image
                src="/founder-bg-removed.png"
                alt="Founder of PM Graphics"
                width={520}
                height={520}
                priority
                style={{
                  width: "90%",
                  height: "90%",
                  objectFit: "contain",
                  animation: "floatLogo 6s ease-in-out infinite",
                }}
              />
            </div>

            {/* Bouncing/Floating Editing Icons Overlay */}
            <div className="floating-icons-container">
              {/* Premiere Pro - Left High Arc */}
              <div className="floating-ball-wrapper delay-p1">
                <div className="ball-x path-1-x delay-p1">
                  <div className="ball-y path-1-y delay-p1">
                    <Image
                      src="/projects/editing icons/vecteezy_adobe-premiere-pro-icon_46437285.png"
                      alt="Premiere Pro"
                      width={48}
                      height={48}
                      className="ball-img path-1-rot delay-p1"
                    />
                  </div>
                </div>
              </div>

              {/* After Effects - Right High Arc */}
              <div className="floating-ball-wrapper delay-p2">
                <div className="ball-x path-2-x delay-p2">
                  <div className="ball-y path-2-y delay-p2">
                    <Image
                      src="/projects/editing icons/vecteezy_adobe-after-effects-icon_46437267.png"
                      alt="After Effects"
                      width={48}
                      height={48}
                      className="ball-img path-2-rot delay-p2"
                    />
                  </div>
                </div>
              </div>

              {/* Photoshop - Left Low Arc */}
              <div className="floating-ball-wrapper delay-p3">
                <div className="ball-x path-3-x delay-p3">
                  <div className="ball-y path-3-y delay-p3">
                    <Image
                      src="/projects/editing icons/vecteezy_adobe-photoshop-logo-transparent-background_46437272.png"
                      alt="Photoshop"
                      width={48}
                      height={48}
                      className="ball-img path-3-rot delay-p3"
                    />
                  </div>
                </div>
              </div>

              {/* Illustrator - Right Low Arc */}
              <div className="floating-ball-wrapper delay-p4">
                <div className="ball-x path-4-x delay-p4">
                  <div className="ball-y path-4-y delay-p4">
                    <Image
                      src="/projects/editing icons/vecteezy_adobe-illustrator-icon_46437283.png"
                      alt="Illustrator"
                      width={48}
                      height={48}
                      className="ball-img path-4-rot delay-p4"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Service Cards */}
            {/* Card 1: Logo Design */}
            <div 
              className="hero-service-card" 
              style={{ 
                top: "16%", 
                left: "8%", 
                animation: "floatUp1 5s ease-in-out infinite" 
              }}
            >
              <div className="icon-wrapper">
                <Palette size={14} />
              </div>
              <div className="card-info">
                <span className="card-title">Logo Design</span>
                <span className="card-desc">Unique & Memorable Logo Creation</span>
              </div>
            </div>

            {/* Card 2: Motion Graphics */}
            <div 
              className="hero-service-card" 
              style={{ 
                top: "38%", 
                right: "-18%", 
                animation: "floatUp2 6s ease-in-out infinite" 
              }}
            >
              <div className="icon-wrapper">
                <Video size={14} />
              </div>
              <div className="card-info">
                <span className="card-title">Motion Graphics</span>
                <span className="card-desc">Engaging Animation & Visuals</span>
              </div>
            </div>

            {/* Card 3: Brand Identity */}
            <div 
              className="hero-service-card" 
              style={{ 
                bottom: "15%", 
                left: "0%", 
                animation: "floatUp3 5.5s ease-in-out infinite" 
              }}
            >
              <div className="icon-wrapper">
                <Layers size={14} />
              </div>
              <div className="card-info">
                <span className="card-title">Brand Identity</span>
                <span className="card-desc">Complete Visual Identity Systems</span>
              </div>
            </div>

            {/* Card 4: Social Media Design */}
            <div 
              className="hero-service-card" 
              style={{ 
                bottom: "8%", 
                right: "-5%", 
                animation: "floatUp4 6.5s ease-in-out infinite" 
              }}
            >
              <div className="icon-wrapper">
                <Smartphone size={14} />
              </div>
              <div className="card-info">
                <span className="card-title">Social Media Design</span>
                <span className="card-desc">Scroll-stopping Designs</span>
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Trusted By Client — 2 Row Text Layout */}
      <div className="trusted-section">
        <div className="trusted-title">Trusted by Businesses &amp; Creators Worldwide</div>
        <div className="trusted-chips-grid">
          <div className="trusted-row">
            {brandingClients.map((client, idx) => (
              <span key={idx} className="trusted-name">
                {client}{idx < brandingClients.length - 1 && <span className="trusted-dot"> · </span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative gradient overlay at the bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "15vh",
          background: "linear-gradient(to top, #0B0B0B, transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
    </section>
  );
}