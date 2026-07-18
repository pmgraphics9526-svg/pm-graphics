"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, ArrowLeft } from "lucide-react";

const navItems = [
  { label: "Home", id: "home" },
  { label: "Portfolio", id: "work" },
  { label: "Services", id: "expertise" },
  { label: "Packages", id: "pricing" },
  { label: "About", id: "about" },
  { label: "Resources", id: "tools" },
];

export default function Navbar({ showBack = false, backHref = "/" }) {
  const router = useRouter();
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
    
    // Special handling for Tools link - navigate to tools hub
    if (id === "tools") {
      router.push("/tools");
      return;
    }
    
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
    } else {
      router.push(`/#${id}`);
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
      className="site-navbar-header"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 999,
        padding: scrolled ? "16px 0" : "24px 0",
        backgroundColor: "transparent",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        borderBottom: "1px solid transparent",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <nav
        className={showBack ? "has-back" : ""}
        style={{
          width: "92%",
          maxWidth: "1280px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Mobile Back Button (only on pages that pass showBack) */}
        {showBack && (
          <button
            onClick={() => {
              if (window.history.length > 1) window.history.back();
              else window.location.href = backHref;
            }}
            className="mobile-back-btn"
            aria-label="Go back"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              cursor: "pointer",
              padding: "4px",
              display: "none",
            }}
          >
            <ArrowLeft size={22} />
          </button>
        )}

        {/* Desktop back button + Brand Logo, grouped so space-between treats them as one block */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {showBack && (
            <button
              onClick={() => {
                if (window.history.length > 1) window.history.back();
                else window.location.href = backHref;
              }}
              className="desktop-back-btn"
              aria-label="Back to Tools"
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                width: "34px",
                height: "34px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "var(--text-secondary)",
                borderRadius: "9999px",
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={16} />
            </button>
          )}

          <div
            className="navbar-logo"
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
        </div>

        {/* Desktop Navigation */}
        <div
          style={{
            display: "none",
            alignItems: "center",
            gap: "6px",
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
            Let&apos;s Talk
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

      {/* Mobile Dropdown */}
      <div
        style={{
          position: "fixed",
          top: "70px",
          right: "5%",
          width: "auto",
          minWidth: "160px",
          maxHeight: mobileMenuOpen ? "80vh" : "0px",
          backgroundColor: "rgba(26, 26, 26, 0.55)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "12px",
          padding: mobileMenuOpen ? "16px 18px" : "0px 18px",
          zIndex: 99,
          opacity: mobileMenuOpen ? 1 : 0,
          visibility: mobileMenuOpen ? "visible" : "hidden",
          transform: mobileMenuOpen ? "scale(1)" : "scale(0.95)",
          transformOrigin: "top right",
          pointerEvents: mobileMenuOpen ? "auto" : "none",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
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
                fontWeight: "600",
                fontSize: "15px",
                letterSpacing: "-0.01em",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                padding: "2px 0",
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
            marginTop: "4px",
          }}
        >
          Let&apos;s Talk
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
          .desktop-back-btn {
            display: inline-flex !important;
          }
        }
        @media (max-width: 768px) {
          .desktop-back-btn {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .site-navbar-header {
            padding: 4px 0 !important;
            /* Soft blur (not a solid bar) so scrolled-under section headings
               don't visually merge with the PM GRAPHICS logo text */
            background-color: rgba(11, 11, 11, 0.4) !important;
            backdrop-filter: blur(14px) !important;
            -webkit-backdrop-filter: blur(14px) !important;
            border-bottom: 1px solid transparent !important;
          }
          .site-navbar-header nav {
            width: 90% !important;
            padding: 2px 16px !important;
            background-color: transparent !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            border: none !important;
            box-shadow: none !important;
            justify-content: space-between !important;
            gap: 0px !important;
          }
          .site-navbar-header nav.has-back {
            display: grid !important;
            grid-template-columns: 28px 1fr 28px !important;
            align-items: center !important;
          }
          .site-navbar-header nav.has-back .mobile-back-btn {
            display: inline-flex !important;
            justify-self: start !important;
          }
          .site-navbar-header nav.has-back .navbar-logo {
            justify-self: center !important;
          }
          .site-navbar-header nav.has-back .mobile-toggle {
            justify-self: end !important;
          }
        }
      `}</style>
    </header>
    </>
  );
}