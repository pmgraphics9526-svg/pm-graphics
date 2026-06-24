import Link from "next/link";

export const metadata = {
  title: "Terms of Service — PM Graphics",
  description: "Terms of service for PM Graphics design studio.",
};

export default function TermsOfService() {
  return (
    <div style={{ backgroundColor: "var(--background)", minHeight: "100vh", color: "#FFFFFF", fontFamily: "var(--font-inter), sans-serif" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "80px 24px 120px" }}>
        <Link href="/" style={{ color: "var(--accent)", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.1em", textDecoration: "none", display: "inline-block", marginBottom: "48px" }}>
          ← Back to Portfolio
        </Link>

        <h1 style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "-0.03em", marginBottom: "16px" }}>
          Terms of Service
        </h1>
        <p style={{ color: "#888888", marginBottom: "48px", fontSize: "14px" }}>Last updated: June 2026</p>

        {[
          {
            title: "Services",
            body: "PM Graphics provides graphic design services including but not limited to branding and identity design, event visuals, flyers and print design, and video editing. All service scopes and deliverables are agreed upon in writing before work begins.",
          },
          {
            title: "Payments",
            body: "Projects require a 50% deposit before work begins. The remaining balance is due upon delivery of final files. We accept bank transfer and UPI payments.",
          },
          {
            title: "Revisions",
            body: "Each project package includes a defined number of revision rounds as agreed in the project brief. Additional revisions beyond the included rounds are billed at our standard hourly rate.",
          },
          {
            title: "Intellectual Property",
            body: "Upon receipt of full payment, all design rights and assets are transferred to the client. PM Graphics retains the right to display completed work in our portfolio unless otherwise agreed.",
          },
          {
            title: "Cancellations",
            body: "If a project is cancelled by the client after work has begun, the deposit is non-refundable. PM Graphics reserves the right to cancel a project and refund the deposit if unforeseen circumstances prevent delivery.",
          },
          {
            title: "Contact",
            body: "For any questions regarding these terms, please contact us at pmgraphics9526@gmail.com.",
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
