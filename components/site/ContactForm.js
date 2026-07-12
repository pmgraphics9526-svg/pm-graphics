"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export default function ContactForm({ settings }) {
  const contactEmail = settings?.ContactEmail || "pmgraphics9526@gmail.com";
  const location = settings?.Location || "Jorhat, Assam -785001";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "Branding & Logo Design",
    projectScale: "Standard",
    message: ""
  });

  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const projectTypes = [
    "Branding & Logo Design",
    "Flyer / Poster Design",
    "Backdrop / Stage Design",
    "Video Editing",
    "Full Project (Multiple Services)"
  ];

  const projectScales = [
    "Quick Turnaround",
    "Standard",
    "Large/Ongoing Project"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("send_failed");
      setStatus("success");
      setFormData({ name: "", email: "", projectType: "Branding & Logo Design", projectScale: "Standard", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section 
      id="contact" 
      className="section-spacing container"
      style={{
        pointerEvents: "auto",
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "48px",
      }}
    >
      <div className="contact-layout">
        {/* Left column: Contact info & statement */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--stack-lg)" }}>
          <div className="font-label-caps" style={{ color: "var(--accent)" }}>GET IN TOUCH</div>
          
          <h2 className="font-headline-lg" style={{ textTransform: "uppercase" }}>
            Let&apos;s forge something unforgettable.
          </h2>
          
          <p className="font-body-lg" style={{ color: "var(--text-secondary)", maxWidth: "500px" }}>
            Got a project in mind? Let&apos;s connect and bring your vision to life with creative design that speaks for itself.
          </p>

          <div 
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginTop: "24px",
              borderTop: "1px solid rgba(255, 106, 0, 0.08)",
              paddingTop: "24px",
            }}
          >
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Direct Inquiry</div>
              <a href={`mailto:${contactEmail}`} style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary)", transition: "color 0.2s" }} onMouseEnter={(e)=>e.currentTarget.style.color="var(--accent)"} onMouseLeave={(e)=>e.currentTarget.style.color="var(--text-primary)"}>
               {contactEmail}
              </a>
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Location</div>
              <div style={{ fontSize: "18px", fontWeight: "600", color: "var(--text-primary)" }}>{location}</div>
            </div>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="glass-card" style={{ padding: "clamp(24px, 5vw, 40px)" }}>
          {status === "error" && (
            <div style={{ marginBottom: "16px", padding: "12px 16px", borderRadius: "12px", background: "rgba(255,60,60,0.08)", border: "1px solid rgba(255,60,60,0.3)", color: "#ff6b6b", fontSize: "14px", fontFamily: "var(--font-inter)" }}>
              Something went wrong. Please try again or email us directly at {contactEmail}
            </div>
          )}
          {status === "success" ? (
            <div 
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: "var(--stack-md)",
                minHeight: "350px",
                animation: "successPop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards"
              }}
            >
              <CheckCircle size={64} style={{ color: "var(--accent)" }} />
              <h3 className="font-headline-md" style={{ textTransform: "uppercase" }}>Inquiry Received</h3>
              <p className="font-body-md" style={{ color: "var(--text-secondary)", maxWidth: "320px" }}>
                Thank you for reaching out. We review every brief within 24 hours and will follow up to schedule a strategy session.
              </p>
              <button 
                onClick={() => setStatus("idle")} 
                className="btn-secondary"
                style={{ marginTop: "16px", fontSize: "14px" }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="form-row">
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label htmlFor="name" style={{ fontSize: "12px", textTransform: "uppercase", fontFamily: "var(--font-display)", letterSpacing: "0.05em", color: "var(--text-primary)" }}>Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    className="input-field"
                    disabled={status === "loading"}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label htmlFor="email" style={{ fontSize: "12px", textTransform: "uppercase", fontFamily: "var(--font-display)", letterSpacing: "0.05em", color: "var(--text-primary)" }}>Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@email.com"
                    className="input-field"
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="form-row">
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label htmlFor="projectType" style={{ fontSize: "12px", textTransform: "uppercase", fontFamily: "var(--font-display)", letterSpacing: "0.05em", color: "var(--text-primary)" }}>Project Type</label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="input-field"
                    style={{ appearance: "none", cursor: "pointer" }}
                    disabled={status === "loading"}
                  >
                    {projectTypes.map((type, idx) => (
                      <option key={idx} value={type} style={{ backgroundColor: "var(--background)", color: "var(--text-primary)" }}>{type}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label htmlFor="projectScale" style={{ fontSize: "12px", textTransform: "uppercase", fontFamily: "var(--font-display)", letterSpacing: "0.05em", color: "var(--text-primary)" }}>Project Scale</label>
                  <select
                    id="projectScale"
                    name="projectScale"
                    value={formData.projectScale}
                    onChange={handleInputChange}
                    className="input-field"
                    style={{ appearance: "none", cursor: "pointer" }}
                    disabled={status === "loading"}
                  >
                    {projectScales.map((scale, idx) => (
                      <option key={idx} value={scale} style={{ backgroundColor: "var(--background)", color: "var(--text-primary)" }}>{scale}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label htmlFor="message" style={{ fontSize: "12px", textTransform: "uppercase", fontFamily: "var(--font-display)", letterSpacing: "0.05em", color: "var(--text-primary)" }}>Project Brief *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Outline your timeline, goals, and visual aspirations..."
                  className="input-field"
                  style={{ borderRadius: "20px", resize: "none" }}
                  disabled={status === "loading"}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={status === "loading"}
                style={{
                  alignSelf: "flex-start",
                  width: "100%",
                  justifyContent: "center",
                  padding: "16px 28px",
                  marginTop: "8px"
                }}
              >
                {status === "loading" ? (
                  <span className="spinner"></span>
                ) : (
                  <>
                    INITIATE PROJECT
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

    </section>
  );
}