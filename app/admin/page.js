"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey) return;

    const scriptId = "recaptcha-script";
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [siteKey]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let recaptchaToken = "";
    if (siteKey) {
      try {
        if (!window.grecaptcha) {
          throw new Error("reCAPTCHA library not loaded");
        }
        await new Promise((resolve) => window.grecaptcha.ready(resolve));
        recaptchaToken = await window.grecaptcha.execute(siteKey, {
          action: "login",
        });
      } catch (recaptchaErr) {
        console.error("reCAPTCHA error:", recaptchaErr);
        setError("Security check failed. Please refresh the page or disable content blockers.");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, recaptchaToken }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#000000",
        padding: "20px",
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "32px 24px",
          border: "1px solid rgba(255, 107, 0, 0.3)",
          boxShadow: "0 0 40px rgba(255, 107, 0, 0.15), inset 0 0 24px rgba(255, 107, 0, 0.03)",
          borderRadius: "20px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "12px",
              fontWeight: "700",
              color: "#FF6B00",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            PM GRAPHICS
          </div>
          <h1
            className="font-headline-lg"
            style={{
              color: "#ffffff",
              textTransform: "uppercase",
              fontSize: "22px",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Admin Portal
          </h1>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", textAlign: "left" }}>
            <label
              htmlFor="password"
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "rgba(255, 255, 255, 0.7)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Enter Password
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{
                  width: "100%",
                  borderColor: "rgba(255, 107, 0, 0.2)",
                  backgroundColor: "#0B0B0B",
                  borderRadius: "12px",
                  padding: "12px 48px 12px 16px",
                  fontSize: "14px",
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  background: "none",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.5)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                  borderRadius: "6px",
                  transition: "color 0.2s, background-color 0.2s",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(255, 107, 0, 0.8)";
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {showPassword ? (
                  // Eye-Off Icon (Crossed Eye)
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                ) : (
                  // Eye Icon (Open Eye)
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                color: "#FF6B00",
                fontSize: "13px",
                fontWeight: "600",
                textAlign: "left",
                backgroundColor: "rgba(255, 107, 0, 0.1)",
                border: "1px solid rgba(255, 107, 0, 0.2)",
                padding: "8px 12px",
                borderRadius: "8px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: "100%",
              justifyContent: "center",
              borderRadius: "12px",
              padding: "12px",
              fontSize: "14px",
              backgroundColor: "#FF6B00",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

