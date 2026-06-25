"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BentoGrid from "@/components/BentoGrid";
import ProjectModal from "@/components/ProjectModal";
import ContactForm from "@/components/ContactForm";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import GlobalParticlesBackground from "@/components/GlobalParticlesBackground";
import Preloader from "@/components/Preloader";
import ProcessSection from "@/components/ProcessSection";
import PricingSection from "@/components/PricingSection";
import { Palette, Sparkles, FileText, Video } from "lucide-react";

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentYear, setCurrentYear] = useState(2026);
  const [settings, setSettings] = useState(null);

  // Fetch Site Settings from API route
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch settings");
        return res.json();
      })
      .then((data) => setSettings(data))
      .catch((err) => console.error("Error loading settings:", err));
  }, []);

  // Fix: Hydration mismatch — only set year on client to avoid SSR conflicts
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentYear(new Date().getFullYear());
  }, []);

  // Listen for openProject custom events dispatched from Hero logo clicks
  useEffect(() => {
    const handler = (e) => {
      const { projects: allProjects } = require("@/components/projectsData");
      const project = allProjects.find(p => p.id === e.detail.projectId);
      if (project) setSelectedProject(project);
    };
    window.addEventListener("openProject", handler);
    return () => window.removeEventListener("openProject", handler);
  }, []);

  // Staggered scroll reveal animation observer for every section
  useEffect(() => {
    if (typeof window === "undefined") return;

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.05,
    };

    const sectionObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const configureSection = (section) => {
      if (
        !section ||
        section.nodeType !== Node.ELEMENT_NODE ||
        section.tagName !== "SECTION" ||
        section.classList.contains("section-reveal") ||
        section.closest("nav") ||
        section.closest("footer")
      ) {
        return;
      }

      section.classList.add("section-reveal");

      const query = "h1, h2, h3, h4, h5, h6, p, img, .portfolio-card, .glass-card, .testimonial-card, .btn-primary, .btn-secondary, .input-field, form > *";
      const candidates = Array.from(section.querySelectorAll(query));

      const filtered = candidates.filter((el) => {
        if (
          el.closest("nav") ||
          el.closest("footer") ||
          el.closest(".offer-ticker-container") ||
          el.closest(".project-modal")
        ) {
          return false;
        }
        const cardAncestor = el.parentElement?.closest(".portfolio-card, .glass-card, .testimonial-card");
        if (cardAncestor) {
          return false;
        }
        return true;
      });

      filtered.forEach((el, idx) => {
        el.classList.add("reveal-item");
        const delayIdx = Math.min(idx + 1, 9);
        el.classList.add(`reveal-delay-${delayIdx}`);
      });

      sectionObserver.observe(section);
    };

    const scanSections = (rootNode) => {
      if (!rootNode) return;
      if (rootNode.nodeType === Node.ELEMENT_NODE) {
        if (rootNode.tagName === "SECTION") {
          configureSection(rootNode);
        }
        const sections = rootNode.querySelectorAll("section");
        sections.forEach((sec) => configureSection(sec));
      }
    };

    // Scan initial sections
    scanSections(document.body);

    // MutationObserver to configure dynamically loaded sections or content (e.g., portfolio cards inside tabs)
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          scanSections(node);
          if (node.nodeType === Node.ELEMENT_NODE) {
            const parentSection = node.closest("section");
            if (parentSection && parentSection.classList.contains("section-reveal")) {
              parentSection.classList.remove("section-reveal");
              configureSection(parentSection);
            }
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      sectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  // Word splitting useEffect for word-level hover effects
  useEffect(() => {
    if (typeof window === "undefined") return;

    const splitTextIntoWords = (el) => {
      if (!el || el.classList.contains("word-split-done")) return;

      // Prevent word splitting inside dynamic React-managed sections to avoid hydration/Virtual DOM conflicts
      if (
        el.closest(".portfolio-card") ||
        el.closest(".testimonial-card") ||
        el.closest(".project-modal") ||
        el.closest(".offer-ticker-container") ||
        el.closest("nav") ||
        el.closest("footer")
      ) {
        return;
      }

      el.classList.add("word-split-done");

      const traverse = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          if (text.trim() === "") return;

          const words = text.split(/(\s+)/);
          const fragment = document.createDocumentFragment();

          words.forEach((word) => {
            if (word.trim() === "") {
              fragment.appendChild(document.createTextNode(word));
            } else {
              const span = document.createElement("span");
              span.className = "hover-word";
              span.textContent = word;
              fragment.appendChild(span);
            }
          });

          node.parentNode.replaceChild(fragment, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (
            node.tagName === "SVG" ||
            node.tagName === "BUTTON" ||
            node.classList.contains("hover-word") ||
            node.closest(".offer-ticker-container") ||
            node.closest("nav") ||
            node.closest(".project-modal") ||
            node.closest("footer") ||
            node.closest(".portfolio-card") ||
            node.closest(".testimonial-card")
          ) {
            return;
          }
          const children = Array.from(node.childNodes);
          children.forEach(traverse);
        }
      };

      traverse(el);
    };

    const scanAndSplit = (rootNode) => {
      if (!rootNode) return;
      
      const query = "h1, h2, h3, h4, h5, h6, p, .font-display, .capabilities-heading, .testimonial-card p";
      
      if (rootNode.nodeType === Node.ELEMENT_NODE) {
        if (rootNode.matches(query)) {
          splitTextIntoWords(rootNode);
        }
        const elements = rootNode.querySelectorAll(query);
        elements.forEach((el) => splitTextIntoWords(el));
      }
    };

    // Scan initial nodes
    scanAndSplit(document.body);

    // MutationObserver to catch dynamically added nodes (like bento grid tab contents or newly submitted testimonials)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          scanAndSplit(node);
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);


  const expertiseItems = [
    {
      icon: <Palette size={28} style={{ color: "var(--accent)" }} />,
      title: "Branding & Identity Design",
      description: "We craft powerful brand identities including logos, brand guidelines, color systems, and typography that make businesses stand out in competitive markets.",
      points: ["Logo Design", "Brand Style Guide", "Business Card & Letterhead", "Social Media Kit"]
    },
    {
      icon: <Sparkles size={28} style={{ color: "var(--accent)" }} />,
      title: "Event Visuals & Backdrops",
      description: "We design high-impact event graphics including stage backdrops, banners, flex boards, and promotional materials for ceremonies and live events.",
      points: ["Stage Backdrop Design", "Event Banners & Flex", "Invitation Cards", "Event Branding"]
    },
    {
      icon: <FileText size={28} style={{ color: "var(--accent)" }} />,
      title: "Flyers & Print Design",
      description: "We create premium promotional flyers, posters, and print materials that grab attention and communicate your message with clarity and style.",
      points: ["Social Media Flyers", "Promotional Posters", "Product Launch Graphics", "Seasonal Campaign Designs"]
    },
    {
      icon: <Video size={28} style={{ color: "var(--accent)" }} />,
      title: "Video Editing & Reels",
      description: "We produce cinematic video edits, short-form reels, and motion graphics for YouTube, Instagram, and brand campaigns.",
      points: ["Short Form Reels", "Event Highlight Videos", "YouTube Videos", "Brand Ad Cuts"]
    }
  ];

  return (
    <>
      {/* Intro preloader — slides up after 1.8s */}
      <Preloader />

      {/* Global Floating Orange Particles & Cursor Trail Background */}
      <GlobalParticlesBackground />

      {/* Floating Island Navigation */}
      <Navbar />

      <main style={{ minHeight: "100vh", backgroundColor: "transparent", color: "var(--on-surface)" }}>
        {/* Hero Section with HTML5 Canvas Embers */}
        <Hero />

        {/* Selected Work Bento Grid */}
        <BentoGrid onSelectProject={setSelectedProject} />

        {/* Expertise Section */}
        <section id="expertise" className="section-spacing container" style={{ pointerEvents: "auto" }}>
          <div 
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--stack-md)",
              marginBottom: "48px"
            }}
          >
            <div className="font-label-caps" style={{ color: "var(--accent)" }}>OUR CAPABILITIES</div>
            <h2 className="capabilities-heading">
              DESIGN THAT DRIVES RESULTS.
            </h2>
          </div>

          {/* Capabilities Grid */}
          <div className="capabilities-grid">
          {expertiseItems.map((item, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  padding: "32px 20px",
                  height: "400px",
                  border: "1px solid rgba(255,106,0,0.3)",
                  boxShadow: "0 0 24px rgba(255,106,0,0.1), inset 0 0 24px rgba(255,106,0,0.03)",
                  transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(255,106,0,0.7)";
                  e.currentTarget.style.boxShadow = "0 0 40px rgba(255,106,0,0.35), 0 8px 32px rgba(255,106,0,0.2), inset 0 0 32px rgba(255,106,0,0.07)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(255,106,0,0.3)";
                  e.currentTarget.style.boxShadow = "0 0 24px rgba(255,106,0,0.1), inset 0 0 24px rgba(255,106,0,0.03)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Icon wrapper */}
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    backgroundColor: "rgba(255,106,0,0.1)",
                    border: "1px solid rgba(255,106,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 16px rgba(255,106,0,0.15)",
                  }}
                >
                  {item.icon}
                </div>

                 <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <h3 className="font-headline-md" style={{ color: "var(--text-primary)", textTransform: "uppercase", fontSize: "13px", lineHeight: "1.3" }}>{item.title}</h3>
                  <p className="font-body-md" style={{ color: "var(--text-secondary)", fontSize: "13.5px", lineHeight: "1.5" }}>
                    {item.description}
                  </p>
                </div>

                {/* Point checklist */}
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    borderTop: "1px solid rgba(255,106,0,0.15)",
                    paddingTop: "16px",
                    marginTop: "auto"
                  }}
                >
                  {item.points.map((pt, pIdx) => (
                    <li
                      key={pIdx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13px",
                        color: "var(--text-primary)",
                        fontFamily: "var(--font-inter)"
                      }}
                    >
                      <span style={{ width: "4px", height: "4px", backgroundColor: "var(--accent)", borderRadius: "50%", flexShrink: 0, boxShadow: "0 0 6px rgba(255,106,0,0.8)" }}></span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* How We Work */}
        <ProcessSection />

        {/* About Founder Section */}
        <AboutSection />

        {/* Pricing Packages */}
        <PricingSection settings={settings} />

        {/* Contact Form Section */}
        <ContactForm settings={settings} />

        {/* Testimonials Section */}
        <TestimonialsSection />
      </main>

      {/* Footer */}
      <footer 
        style={{
          borderTop: "1px solid rgba(255,106,0,0.12)",
          backgroundColor: "#131313",
          padding: "60px 0 40px 0",
          pointerEvents: "auto"
        }}
      >
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          <div 
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "24px"
            }}
          >
            {/* Logo */}
            <div 
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "18px",
                fontWeight: "700",
                letterSpacing: "-0.03em",
                color: "rgba(255,255,255,0.95)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span style={{ width: "6px", height: "6px", backgroundColor: "var(--accent)", borderRadius: "50%" }}></span>
              PM GRAPHICS
            </div>

            {/* Social Links */}
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              {[
                { label: "Instagram", href: "https://www.instagram.com/pmgraphics__?igsh=OG9jNGRvYndwcWh6" },
                { label: "YouTube",   href: "https://youtube.com/@mrpaponv2?si=bweut68scOJ7_H7_" },
                { label: "Behance",   href: "https://www.behance.net/dancerkp" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontSize: "13px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "rgba(255,255,255,0.55)",
                    transition: "color 0.2s",
                    textDecoration: "none"
                  }}
                  onMouseEnter={(e)=>e.currentTarget.style.color="#FFFFFF"}
                  onMouseLeave={(e)=>e.currentTarget.style.color="rgba(255,255,255,0.55)"}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Copyright Row */}
          <div 
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "24px",
              fontSize: "12px",
              color: "rgba(255,255,255,0.45)",
              fontFamily: "var(--font-inter)"
            }}
          >
            <div suppressHydrationWarning>&copy; {currentYear} PM Graphics. All rights reserved.</div>
            <div style={{ display: "flex", gap: "16px" }}>
              <a href="/privacy" style={{ transition: "color 0.2s", textDecoration: "none", color: "rgba(255,255,255,0.45)" }} onMouseEnter={(e)=>e.currentTarget.style.color="#FFFFFF"} onMouseLeave={(e)=>e.currentTarget.style.color="rgba(255,255,255,0.45)"}>Privacy Policy</a>
              <a href="/terms" style={{ transition: "color 0.2s", textDecoration: "none", color: "rgba(255,255,255,0.45)" }} onMouseEnter={(e)=>e.currentTarget.style.color="#FFFFFF"} onMouseLeave={(e)=>e.currentTarget.style.color="rgba(255,255,255,0.45)"}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating elevation level 2 detailed project modal */}
      {selectedProject && (
        <ProjectModal 
          key={selectedProject.id}
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </>
  );
}
