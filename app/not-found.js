import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--background)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        padding: "40px 24px",
        textAlign: "center",
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: "clamp(6rem, 20vw, 160px)",
          fontWeight: "800",
          color: "transparent",
          WebkitTextStroke: "2px rgba(255,106,0,0.4)",
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        404
      </div>

      <h1
        style={{
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: "clamp(1.2rem, 3vw, 1.75rem)",
          fontWeight: "700",
          color: "#FFFFFF",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        Page Not Found
      </h1>

      <p style={{ color: "#888888", maxWidth: "400px", lineHeight: 1.6, fontSize: "16px" }}>
        This page doesn&apos;t exist or was moved. Head back to the portfolio.
      </p>

      <Link
        href="/"
        style={{
          marginTop: "8px",
          background: "var(--accent)",
          color: "#FFFFFF",
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontWeight: "700",
          fontSize: "14px",
          padding: "14px 32px",
          borderRadius: "9999px",
          textDecoration: "none",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          display: "inline-block",
          transition: "opacity 0.2s",
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}
