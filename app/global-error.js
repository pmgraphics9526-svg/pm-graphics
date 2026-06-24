"use client";

import { useEffect } from "react";

export default function GlobalError({ error, unstable_retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          backgroundColor: "#0B0B0B",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          padding: "40px 24px",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
          color: "#FFFFFF",
        }}
      >
        <div style={{ fontSize: "48px" }}>⚠</div>
        <h1 style={{ fontSize: "24px", fontWeight: "700", margin: 0 }}>Something went wrong</h1>
        <p style={{ color: "#888888", maxWidth: "360px", lineHeight: 1.6, margin: 0 }}>
          An unexpected error occurred. Please try refreshing the page.
        </p>
        <button
          onClick={() => unstable_retry()}
          style={{
            background: "#FF6A00",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "9999px",
            padding: "14px 32px",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
