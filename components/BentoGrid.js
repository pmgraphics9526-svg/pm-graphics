"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { projects as fallbackProjects } from "@/components/projectsData";

const getCategoryCover = (category) => {
  switch (category) {
    case "BRANDING":
      return "/projects/branding.png";
    case "BACKDROPS":
      return "/projects/backdrops/backdrop1.jpg";
    case "FLYERS":
      return "/projects/Flyers.png";
    case "VIDEOS EDITING":
      return "/projects/Videos Editing.png";
    default:
      return "/projects/pm logo.png";
  }
};

const getProjectImages = (project, apiImages) => {
  // Use explicitly curated images array when set — skips API matching
  if (project.images && project.images.length > 0) {
    return project.images;
  }

  const categoryFiles = apiImages[project.category] || [];
  const title = project.title.toLowerCase();
  let matchedFiles = [];

  if (project.category === "BRANDING") {
    if (title.includes("b&s") || title.includes("dance")) {
      matchedFiles = categoryFiles.filter(f => f.toLowerCase().includes("b&s"));
    } else if (title.includes("aawca") || title.includes("aawdca")) {
      matchedFiles = categoryFiles.filter(f => f.toLowerCase().includes("aawdca") || f.toLowerCase().includes("aawca"));
    } else if (title.includes("fabrication") || title.includes("balaji") || title.includes("bf")) {
      matchedFiles = categoryFiles.filter(f => f.toLowerCase().includes("bf "));
    } else if (title.includes("c.k") || title.includes("international")) {
      matchedFiles = categoryFiles.filter(f => f.toLowerCase().includes("ck"));
    } else if (title.includes("fitzone") || title.includes("gym")) {
      matchedFiles = categoryFiles.filter(f => f.toLowerCase().includes("fitzone"));
    } else if (title.includes("greenleaf") || title.includes("organic")) {
      matchedFiles = categoryFiles.filter(f => f.toLowerCase().includes("greenleaf"));
    } else if (title.includes("royal") || title.includes("feast")) {
      matchedFiles = categoryFiles.filter(f => f.toLowerCase().includes("royal"));
    } else if (title.includes("dark bean")) {
      matchedFiles = categoryFiles.filter(f => f.toLowerCase().includes("dark bean"));
    }
  } else if (project.category === "FLYERS") {
    matchedFiles = categoryFiles;
  }

  if (matchedFiles.length === 0) {
    if (categoryFiles.length > 0) {
      matchedFiles = [categoryFiles[0]];
    } else {
      matchedFiles = [getCategoryCover(project.category)];
    }
  }

  return matchedFiles;
};

export default function BentoGrid({ onSelectProject }) {
  const [projects, setProjects] = useState(fallbackProjects);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [categoryImages, setCategoryImages] = useState({
    BRANDING: [],
    EVENTS: [],
    FLYERS: [],
    "VIDEOS EDITING": []
  });

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setCategoryImages(data);
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      })
      .catch((err) => console.error("Error fetching portfolio from API:", err));
  }, []);

  // Set responsive visible slide count in React state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setVisibleCards(1);
      } else if (window.innerWidth <= 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + 1, filteredProjects.length - visibleCards)
    );
  };

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 12; // Max tilt 12 degrees
    const rotateY = ((x - centerX) / centerX) * 12; // Max tilt 12 degrees

    card.style.transition = "transform 0.1s ease, box-shadow 0.4s ease, opacity 0.4s ease";
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  };

  const categories = ["ALL", "BRANDING", "BACKDROPS", "FLYERS", "VIDEOS EDITING"];

  const featuredCategories = ["BRANDING", "BACKDROPS", "FLYERS", "VIDEOS EDITING"];
  const filteredProjects = activeFilter === "ALL"
    ? featuredCategories.map(cat => {
        const found = projects.find(p => p.category === cat);
        if (found) return found;
        return {
          id: `placeholder-${cat}`,
          title: `${cat} GALLERY`,
          category: cat,
          description: `Browse our full gallery of ${cat.toLowerCase()} projects.`,
        };
      })
    : projects.filter(p => p.category === activeFilter);

  return (
    <section id="work" className="section-spacing container" style={{ pointerEvents: "auto", marginTop: "40px" }}>
      {/* Title block */}
      <div 
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--stack-md)",
          marginBottom: "var(--stack-lg)"
        }}
      >
        <div className="font-label-caps" style={{ color: "var(--accent)" }}>SELECTED WORK</div>
        <h2 style={{ fontSize: "clamp(1.1rem, 4vw, 3.5rem)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "-0.02em", color: "var(--text-primary)", lineHeight: "1.2" }}>
          CRAFTING HIGH-IMPACT BRAND IDENTITIES & DIGITAL CONTENT
        </h2>
      </div>

      {/* Filter Tabs & Navigation Controls */}
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "48px"
        }}
      >
        {/* Filter Tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {categories.map((cat) => {
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveFilter(cat);
                  setCurrentIndex(0);
                }}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  background: isActive ? "var(--accent)" : "rgba(255,106,0,0.04)",
                  color: isActive ? "#FFFFFF" : "var(--text-secondary)",
                  border: "1px solid",
                  borderColor: isActive ? "var(--accent)" : "var(--glass-border)",
                  borderRadius: "9999px",
                  padding: "8px 18px",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.color = "var(--accent)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "var(--glass-border)";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
        
        {/* Navigation Controls (Only shown for non-ALL categories when there are more projects than visible cards) */}
        {activeFilter !== "ALL" && filteredProjects.length > visibleCards && (
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "1px solid rgba(255,106,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: currentIndex === 0 ? "rgba(255,106,0,0.02)" : "rgba(255,106,0,0.06)",
                color: currentIndex === 0 ? "rgba(255,255,255,0.2)" : "var(--text-primary)",
                cursor: currentIndex === 0 ? "default" : "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                if (currentIndex !== 0) {
                  e.currentTarget.style.backgroundColor = "var(--accent)";
                  e.currentTarget.style.color = "#FFFFFF";
                }
              }}
              onMouseLeave={(e) => {
                if (currentIndex !== 0) {
                  e.currentTarget.style.backgroundColor = "rgba(255,106,0,0.06)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }
              }}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= filteredProjects.length - visibleCards}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "1px solid rgba(255,106,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: currentIndex >= filteredProjects.length - visibleCards ? "rgba(255,106,0,0.02)" : "rgba(255,106,0,0.06)",
                color: currentIndex >= filteredProjects.length - visibleCards ? "rgba(255,255,255,0.2)" : "var(--text-primary)",
                cursor: currentIndex >= filteredProjects.length - visibleCards ? "default" : "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                if (currentIndex < filteredProjects.length - visibleCards) {
                  e.currentTarget.style.backgroundColor = "var(--accent)";
                  e.currentTarget.style.color = "#FFFFFF";
                }
              }}
              onMouseLeave={(e) => {
                if (currentIndex < filteredProjects.length - visibleCards) {
                  e.currentTarget.style.backgroundColor = "rgba(255,106,0,0.06)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }
              }}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Portfolio Grid OR Slider */}
      {activeFilter === "ALL" ? (
        <div className="portfolio-grid all-tabs">
          {filteredProjects.map((project) => {
            const coverImage = getCategoryCover(project.category);
            const categoryFiles = categoryImages[project.category] || [];
            const displayImages = categoryFiles.length > 0 ? categoryFiles : [coverImage];

            return (
              <div
                key={project.id}
                onClick={() => {
                  setActiveFilter(project.category);
                  setCurrentIndex(0);
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="glass-card portfolio-card portfolio-grid-item"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  position: "relative",
                  padding: "20px"
                }}
              >
                {/* Media Container */}
                <div 
                  className="media-container"
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "240px",
                    borderRadius: "20px",
                    overflow: "hidden",
                    backgroundColor: "rgba(255,106,0,0.05)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {coverImage ? (
                    <Image
                      src={coverImage}
                      alt={project.category}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      quality={80}
                      style={{
                        objectFit: "contain",
                        transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
                      }}
                      className="project-image"
                    />
                  ) : (
                    <div 
                      style={{
                        width: "100%",
                        height: "200px",
                        background: "linear-gradient(135deg, #131313 0%, #201f1f 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        color: "rgba(255,106,0,0.4)",
                        fontWeight: "600",
                        fontFamily: "var(--font-display)",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase"
                      }}
                    >
                      PM GRAPHICS
                    </div>
                  )}

                  {/* Accent Orange Hover Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "radial-gradient(circle at center, rgba(255,106,0,0.18) 0%, transparent 70%)",
                      opacity: 0,
                      transition: "opacity 0.4s ease",
                      pointerEvents: "none"
                    }}
                    className="project-overlay"
                  />

                  <div 
                    className="portfolio-tag"
                    style={{
                      position: "absolute",
                      top: "16px",
                      left: "16px",
                      zIndex: 2,
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      backgroundColor: "rgba(19,19,19,0.75)",
                      borderColor: "rgba(255,106,0,0.2)"
                    }}
                  >
                    {project.category}
                  </div>
                </div>

                {/* Text Information */}
                <div 
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    width: "100%",
                    gap: "16px"
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, minWidth: 0 }}>
                    <h3 
                      style={{ 
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "var(--text-primary)",
                        textTransform: "uppercase",
                        margin: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      {project.category}
                    </h3>
                    <p 
                      className="card-description"
                      style={{ 
                        fontSize: "13.5px",
                        lineHeight: "1.5",
                        color: "var(--text-secondary)",
                        margin: 0
                      }}
                    >
                      Click to explore all {project.category.toLowerCase()} projects.
                    </p>
                  </div>

                  <div 
                    className="arrow-circle"
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      border: "1px solid rgba(255,106,0,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(255,106,0,0.05)",
                      color: "var(--text-primary)",
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      flexShrink: 0
                    }}
                  >
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="portfolio-slider-container" style={{ overflow: "hidden", width: "100%" }}>
          <div
            className="portfolio-slider-track"
            style={{
              display: "flex",
              gap: `${visibleCards === 3 ? 24 : 16}px`,
              transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: `translateX(calc(-${currentIndex} * (100% + ${visibleCards === 3 ? 24 : 16}px) / ${visibleCards}))`,
              width: "100%"
            }}
          >
            {filteredProjects.map((project) => {
              const projectImages = getProjectImages(project, categoryImages);
              const projectCover = projectImages[0] || getCategoryCover(project.category);
              const projectWithMappedImages = {
                ...project,
                image: projectCover,
                images: projectImages
              };

              const gap = visibleCards === 3 ? 24 : 16;

              return (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(projectWithMappedImages)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="glass-card portfolio-card portfolio-slider-item"
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    position: "relative",
                    padding: "20px",
                    width: `calc((100% - ${gap * (visibleCards - 1)}px) / ${visibleCards})`,
                    flexShrink: 0
                  }}
                >
                  {/* Media Container */}
                  <div 
                    className="media-container"
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "240px",
                      borderRadius: "20px",
                      overflow: "hidden",
                      backgroundColor: "rgba(255,106,0,0.05)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    {projectCover ? (
                      <Image
                        src={projectCover}
                        alt={project.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={80}
                        style={{
                          objectFit: "contain",
                          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
                        }}
                        className="project-image"
                      />
                    ) : (
                      <div 
                        style={{
                          width: "100%",
                          height: "200px",
                          background: "linear-gradient(135deg, #131313 0%, #201f1f 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          color: "rgba(255,106,0,0.4)",
                          fontWeight: "600",
                          fontFamily: "var(--font-display)",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase"
                        }}
                      >
                        PM GRAPHICS
                      </div>
                    )}

                    {/* Accent Orange Hover Overlay */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "radial-gradient(circle at center, rgba(255,106,0,0.18) 0%, transparent 70%)",
                        opacity: 0,
                        transition: "opacity 0.4s ease",
                        pointerEvents: "none"
                      }}
                      className="project-overlay"
                    />

                    <div 
                      className="portfolio-tag"
                      style={{
                        position: "absolute",
                        top: "16px",
                        left: "16px",
                        zIndex: 2,
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        backgroundColor: "rgba(19,19,19,0.75)",
                        borderColor: "rgba(255,106,0,0.2)"
                      }}
                    >
                      {project.category}
                    </div>
                  </div>

                  {/* Text Information */}
                  <div 
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      width: "100%",
                      gap: "16px"
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, minWidth: 0 }}>
                      <h3 
                        style={{ 
                          fontSize: "18px",
                          fontWeight: "700",
                          color: "var(--text-primary)",
                          textTransform: "uppercase",
                          margin: 0,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        {project.title}
                      </h3>
                      <p 
                        className="card-description"
                        style={{ 
                          fontSize: "13.5px",
                          lineHeight: "1.5",
                          color: "var(--text-secondary)",
                          margin: 0
                        }}
                      >
                        {project.description}
                      </p>
                    </div>

                    <div 
                      className="arrow-circle"
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        border: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(255,106,0,0.05)",
                        color: "var(--text-primary)",
                        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                        flexShrink: 0
                      }}
                    >
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )/* Ended the replacement here */}

      <style jsx global>{`
        /* Clean, uniform, fixed-size card grid layout */
        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          width: 100%;
          padding-bottom: 32px;
        }

        .portfolio-grid.all-tabs {
          grid-template-columns: repeat(4, 1fr);
        }

        .portfolio-grid-item {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .portfolio-slider-item {
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 1024px) {
          .portfolio-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          .portfolio-grid.all-tabs {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }

        @media (max-width: 768px) {
          .portfolio-grid, .portfolio-grid.all-tabs {
            grid-template-columns: 1fr;
          }
          /* Compact mobile cards: smaller image, 2-line description, less padding */
          .portfolio-card {
            padding: 14px !important;
            gap: 12px !important;
          }
          .media-container {
            height: 160px !important;
          }
          .card-description {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            font-size: 13px !important;
          }
        }
        
        /* Interactive animations on hover */
        .portfolio-card {
          position: relative;
          overflow: hidden;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
          transform-style: preserve-3d;
        }

        .portfolio-card:hover {
          box-shadow: 0 15px 30px rgba(255,106,0,0.18), 0 5px 15px rgba(255,106,0,0.1) !important;
          border-color: rgba(255,106,0,0.4) !important;
        }

        /* Hover lift other items scaling down */
        .portfolio-grid:hover .portfolio-card:not(:hover),
        .portfolio-slider-track:hover .portfolio-card:not(:hover) {
          transform: scale(0.97) !important;
          opacity: 0.75 !important;
        }

        .portfolio-card:hover .project-image {
          transform: scale(1.04);
        }
        
        .portfolio-card:hover .project-overlay {
          opacity: 1 !important;
        }
        
        .portfolio-card:hover .arrow-circle {
          background-color: var(--accent) !important;
          border-color: var(--accent) !important;
          color: #FFFFFF !important;
          transform: rotate(45deg);
          box-shadow: 0 0 15px rgba(255,106,0,0.5);
        }
      `}</style>
    </section>
  );
}

