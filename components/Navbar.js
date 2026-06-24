"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", id: "home" },
  { label: "Work", id: "work" },
  { label: "Expertise", id: "expertise" },
  { label: "About", id: "about" },
  { label: "Packages", id: "pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const ticking = useRef(false);
  const sectionCache = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      // Fix: Use requestAnimationFrame to throttle DOM queries and prevent layout thrashing
      if (!ticking.current) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);

          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          setScrollProgress(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0);

          if (window.scrollY < 100) {
            setActiveSection("home");
          } else {
            // Section tracking — cache references to avoid re-querying DOM
            if (sectionCache.current.length === 0 || sectionCache.current.some(el => el === null)) {
              sectionCache.current = navItems.map(item => document.getElementById(item.id));
            }
            const sections = sectionCache.current;
            const scrollPosition = window.scrollY + window.innerHeight / 3;

            for (let i = sections.length - 1; i >= 0; i--) {
              const section = sections[i];
              if (section) {
                const sectionTop = section.getBoundingClientRect().top + window.scrollY;
                if (scrollPosition >= sectionTop) {
                  setActiveSection(navItems[i].id);
                  break;
                }
              }
            }
          }
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Trigger scroll check on mount
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);
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
      setActiveSection(id);
    }
  };

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 100,
        padding: scrolled ? "16px 0" : "24px 0",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* Floating Island Container */}
      <nav
        style={{
          width: scrolled ? "fit-content" : "92%",
          maxWidth: "1280px",
          display: "flex",
          alignItems: "center",
          justifyContent: scrolled ? "center" : "space-between",
          gap: scrolled ? "32px" : "0px",
          padding: scrolled ? "10px 24px" : "14px 32px",
          backgroundColor: scrolled ? "rgba(19,19,19,0.75)" : "transparent",
          backdropFilter: scrolled ? "blur(28px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(28px)" : "none",
          border: scrolled ? "1px solid rgba(255,106,0,0.18)" : "1px solid transparent",
          borderRadius: scrolled ? "9999px" : "0px",
          boxShadow: scrolled ? "0 8px 32px rgba(255,106,0,0.15)" : "none",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Brand Logo */}
        <div 
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            fontWeight: "700",
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
            textTransform: "uppercase"
          }}
        >
          <span style={{ width: "6px", height: "6px", backgroundColor: "var(--accent)", borderRadius: "50%" }}></span>
          PM GRAPHICS
        </div>

        {/* Desktop Navigation */}
        <div 
          style={{
            display: "none",
            alignItems: "center",
            gap: "8px",
          }}
          className="desktop-menu"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  background: isActive ? "var(--accent)" : "transparent",
                  color: isActive ? "#FFFFFF" : "var(--text-secondary)",
                  fontFamily: "var(--font-display)",
                  fontWeight: "600",
                  fontSize: "14px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  padding: "8px 18px",
                  borderRadius: "9999px",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "#FFFFFF";
                    e.currentTarget.style.background = "rgba(255,106,0,0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--text-secondary)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {item.label}
              </button>
            );
          })}
          <button
            onClick={() => handleNavClick("contact")}
            className="btn-primary"
            style={{
              padding: "10px 22px",
              fontSize: "14px",
              marginLeft: "8px",
              backgroundColor: "var(--accent)",
              color: "#FFFFFF",
              border: "1px solid var(--accent)",
              fontWeight: "700",
              borderRadius: "9999px",
              fontFamily: "var(--font-display)"
            }}
          >
            LET&apos;S TALK
          </button>
        </div>



        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-primary)",
            cursor: "pointer",
            display: "block",
            padding: "4px"
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundColor: "rgba(11,11,11,0.98)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "24px",
          zIndex: 99,
          opacity: mobileMenuOpen ? 1 : 0,
          visibility: mobileMenuOpen ? "visible" : "hidden",
          transform: mobileMenuOpen ? "scale(1)" : "scale(0.95)",
          pointerEvents: mobileMenuOpen ? "auto" : "none",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Close button inside drawer */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            background: "transparent",
            border: "none",
            color: "var(--text-primary)",
            cursor: "pointer"
          }}
        >
          <X size={28} />
        </button>

        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                background: "transparent",
                color: isActive ? "var(--accent)" : "#FFFFFF",
                fontFamily: "var(--font-display)",
                fontWeight: "700",
                fontSize: "28px",
                letterSpacing: "-0.02em",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {item.label}
            </button>
          );
        })}
        
        <button
          onClick={() => handleNavClick("contact")}
          className="btn-primary"
          style={{
            marginTop: "24px",
            padding: "16px 36px",
            fontSize: "18px"
          }}
        >
          LET&apos;S TALK
        </button>
      </div>

      {/* Style injection for media queries */}
      <style jsx global>{`
        @media (min-width: 769px) {
          .desktop-menu {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          header {
            padding: 12px 0 !important;
          }
          header nav {
            width: 90% !important;
            padding: 10px 16px !important;
            background-color: rgba(19, 19, 19, 0.85) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 106, 0, 0.25) !important;
            border-radius: 9999px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
            justify-content: space-between !important;
            gap: 0px !important;
          }
        }
      `}</style>
    </header>
    </>
  );
}