import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — PM Graphics",
  description: "Privacy policy for PM Graphics design studio.",
};

export default function PrivacyPolicy() {
  return (
    <div style={{ backgroundColor: "var(--background)", minHeight: "100vh", color: "#FFFFFF", fontFamily: "var(--font-inter), sans-serif" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "80px 24px 120px" }}>
        <Link href="/" style={{ color: "var(--accent)", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.1em", textDecoration: "none", display: "inline-block", marginBottom: "48px" }}>
          ← Back to Portfolio
        </Link>

        <h1 style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "-0.03em", marginBottom: "16px" }}>
          Privacy Policy
        </h1>
        <p style={{ color: "#888888", marginBottom: "48px", fontSize: "14px" }}>Last updated: June 2026</p>

        {[
          {
            title: "Information We Collect",
            body: "When you submit the contact form on this website, we collect the name, email address, and project details you provide. We do not collect any data automatically beyond standard web server logs.",
          },
          {
            title: "How We Use Your Information",
            body: "The information you provide through the contact form is used solely to respond to your inquiry and discuss potential projects. We do not sell, rent, or share your personal information with any third parties.",
          },
          {
            title: "Data Storage",
            body: "Contact form submissions are stored securely in our project management database (Airtable) and delivered to our email inbox. We maintain this information only to manage your inquiry and any subsequent projects.",
          },
          {
            title: "Cookies",
            body: "This website does not use tracking cookies or analytics scripts. No cookie consent banner is required.",
          },
          {
            title: "Contact",
            body: "If you have any questions about this privacy policy, please reach out at pmgraphics9526@gmail.com.",
          },
        ].map(({ title, body }) => (
          <div key={title} style={{ marginBottom: "40px" }}>
            <h2 style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "18px", fontWeight: "700", marginBottom: "12px", color: "var(--accent)" }}>{title}</h2>
            <p style={{ lineHeight: 1.8, color: "#CCCCCC", fontSize: "15px" }}>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
