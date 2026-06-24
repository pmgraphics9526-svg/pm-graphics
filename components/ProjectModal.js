"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { X, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const IMAGES_PER_PAGE = 6;

export default function ProjectModal({ project, onClose }) {
  const [pageIndex, setPageIndex] = useState(0);
  const onCloseRef = useRef(onClose);
  const totalPagesRef = useRef(1);

  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  const imageList = (project.images && project.images.length > 0)
    ? project.images
    : (project.image ? [project.image] : []);

  const totalPages = Math.ceil(imageList.length / IMAGES_PER_PAGE);

  // Safe ref assignment inside useEffect
  useEffect(() => {
    totalPagesRef.current = totalPages;
  }, [totalPages]);

  const currentPageImages = imageList.slice(
    pageIndex * IMAGES_PER_PAGE,
    (pageIndex + 1) * IMAGES_PER_PAGE
  );
  const hasMultiplePages = totalPages > 1;
  const showGrid = imageList.length > 1;

  const goToPrev = useCallback(() => {
    setPageIndex(p => Math.max(0, p - 1));
  }, []);

  const goToNext = useCallback(() => {
    setPageIndex(p => Math.min(totalPagesRef.current - 1, p + 1));
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCloseRef.current();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToPrev, goToNext]);

  if (!project) return null;

  const navBtnBase = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 18px",
    borderRadius: "9999px",
    border: "1px solid",
    fontSize: "13px",
    fontWeight: "600",
    fontFamily: "var(--font-display)",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  return (
    <div
      onClick={onClose}
      className="project-modal"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(15px)",
        WebkitBackdropFilter: "blur(15px)",
        zIndex: 200,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "24px",
        overflowY: "auto",
        animation: "modalFadeIn 0.3s ease-out forwards",
        pointerEvents: "auto"
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "1000px",
          backgroundColor: "rgba(19,19,19,0.95)",
          backdropFilter: "blur(var(--glass-blur-high))",
          WebkitBackdropFilter: "blur(var(--glass-blur-high))",
          border: "1px solid rgba(255,106,0,0.2)",
          borderRadius: "32px",
          padding: "clamp(24px, 5vw, 48px)",
          boxShadow: "0 30px 60px rgba(255,106,0,0.15), inset 0 1px 1px rgba(255,255,255,0.05)",
          position: "relative",
          animation: "modalSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
          marginTop: "auto",
          marginBottom: "auto",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            background: "rgba(255,106,0,0.08)",
            border: "1px solid rgba(255,106,0,0.2)",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-primary)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--accent)";
            e.currentTarget.style.color = "#FFFFFF";
            e.currentTarget.style.borderColor = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255,106,0,0.08)";
            e.currentTarget.style.color = "var(--text-primary)";
            e.currentTarget.style.borderColor = "rgba(255,106,0,0.2)";
          }}
        >
          <X size={20} />
        </button>

        {/* ── Info section ── */}
        {project.hideDetails ? (
          /* Plain text only — no cards, no metadata */
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--accent)", marginBottom: "8px" }}>
              {project.category}
            </div>
            <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#FFFFFF", textTransform: "uppercase", margin: 0 }}>
              {project.title}
            </h3>
          </div>
        ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--stack-lg)", paddingRight: "48px" }}>
          <div className="portfolio-tag" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
            {project.category}
          </div>

          <h3
            className="font-headline-lg"
            style={{ color: "var(--text-primary)", textTransform: "uppercase", marginTop: "-8px", fontSize: "24px", fontWeight: "700" }}
          >
            {project.title}
          </h3>

          {/* Meta row — hidden if hideDetails is true */}
          {!project.hideDetails && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", borderTop: "1px solid rgba(255,106,0,0.1)", paddingTop: "16px" }}>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Client</div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>
                  {project.client || project.title}
                </div>
              </div>
              {project.year && (
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={11} /> Year
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>{project.year}</div>
                </div>
              )}
            </div>
          )}

          {/* Details 2-col — hidden if hideDetails is true */}
          {!project.hideDetails && (
            <div className="modal-details-grid">
              {project.details && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <h4 className="font-label-caps" style={{ color: "var(--text-primary)" }}>Overview</h4>
                  <p className="font-body-md" style={{ color: "var(--text-secondary)", margin: 0 }}>{project.details}</p>
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <h4 className="font-label-caps" style={{ color: "var(--text-primary)" }}>Scope of Work</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {project.scope.map((item, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "13px",
                        color: "var(--text-primary)",
                        backgroundColor: "rgba(255,106,0,0.07)",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        border: "1px solid rgba(255,106,0,0.15)"
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Video (if any) ── */}
        {project.videoUrl && (
          <div style={{ marginTop: "32px", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,106,0,0.18)" }}>
            <video
              src={project.videoUrl}
              controls
              style={{ width: "100%", display: "block", backgroundColor: "#000" }}
            />
          </div>
        )}

        {/* ── Image section ── */}
        {imageList.length > 0 && (
          <div style={{ marginTop: "32px" }}>

            {showGrid ? (
              /* 6-image grid with pagination */
              <>
                <div className="project-image-grid">
                  {currentPageImages.map((src, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "relative",
                        aspectRatio: "1",
                        borderRadius: "12px",
                        overflow: "hidden",
                        backgroundColor: "rgba(255,106,0,0.05)",
                        border: "1px solid rgba(255,106,0,0.12)",
                      }}
                    >
                      <Image
                        src={src}
                        alt={`${project.title} — image ${pageIndex * IMAGES_PER_PAGE + idx + 1}`}
                        fill
                        sizes="(max-width: 600px) 33vw, 280px"
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination controls */}
                {hasMultiplePages && (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "16px",
                    flexWrap: "wrap",
                    gap: "12px"
                  }}>
                    <button
                      onClick={goToPrev}
                      disabled={pageIndex === 0}
                      style={{
                        ...navBtnBase,
                        borderColor: pageIndex === 0 ? "rgba(255,106,0,0.15)" : "var(--accent)",
                        color: pageIndex === 0 ? "rgba(255,106,0,0.35)" : "var(--accent)",
                        backgroundColor: "transparent",
                        opacity: pageIndex === 0 ? 0.5 : 1,
                        cursor: pageIndex === 0 ? "default" : "pointer",
                      }}
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>

                    <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}>
                      {pageIndex * IMAGES_PER_PAGE + 1}–{Math.min((pageIndex + 1) * IMAGES_PER_PAGE, imageList.length)} of {imageList.length} images
                    </span>

                    <button
                      onClick={goToNext}
                      disabled={pageIndex === totalPages - 1}
                      style={{
                        ...navBtnBase,
                        borderColor: pageIndex === totalPages - 1 ? "rgba(255,106,0,0.15)" : "var(--accent)",
                        color: pageIndex === totalPages - 1 ? "rgba(255,106,0,0.35)" : "var(--accent)",
                        backgroundColor: "transparent",
                        opacity: pageIndex === totalPages - 1 ? 0.5 : 1,
                        cursor: pageIndex === totalPages - 1 ? "default" : "pointer",
                      }}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                )}

                {/* Image count label (no pagination needed) */}
                {!hasMultiplePages && (
                  <div style={{ textAlign: "right", marginTop: "8px", fontSize: "12px", color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}>
                    {imageList.length} image{imageList.length > 1 ? "s" : ""}
                  </div>
                )}
              </>
            ) : (
              /* Single image — large view */
              <div style={{
                borderRadius: "20px",
                overflow: "hidden",
                position: "relative",
                height: "clamp(250px, 40vh, 420px)",
                width: "100%",
                border: "1px solid rgba(255,106,0,0.18)",
                backgroundColor: "rgba(255,106,0,0.04)"
              }}>
                {imageList[0] ? (
                  <Image
                    src={imageList[0]}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    style={{ objectFit: "contain" }}
                  />
                ) : (
                  <div style={{
                    width: "100%", height: "100%",
                    background: "linear-gradient(135deg, #131313 0%, #201f1f 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px", color: "rgba(255,106,0,0.4)",
                    fontWeight: "600", fontFamily: "var(--font-display)",
                    letterSpacing: "0.05em", textTransform: "uppercase"
                  }}>
                    PM GRAPHICS
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <style jsx global>{`
          @keyframes modalFadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes modalSlideUp {
            from { opacity: 0; transform: translateY(40px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .modal-details-grid {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          @media (min-width: 640px) {
            .modal-details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 32px;
              align-items: start;
            }
          }
          .project-image-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          @media (min-width: 640px) {
            .project-image-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
