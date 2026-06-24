"use client";

import { CheckCircle } from "lucide-react";

const cleanPrice = (priceStr) => {
  if (!priceStr) return "";
  if (priceStr.length <= 15) return priceStr;

  // Look for currency symbols followed by numbers (e.g., ₹5,000, $100, etc.)
  const match = priceStr.match(/[₹$]\s*[0-9,]+/);
  if (match) {
    return match[0];
  }

  // Look for plain numbers with optional commas (e.g. 5,000 or 12000) and prepend ₹
  const numberMatch = priceStr.match(/[0-9,]+/);
  if (numberMatch) {
    return "₹" + numberMatch[0];
  }

  // Check for "Custom" tag
  if (/custom/i.test(priceStr)) {
    return "Custom";
  }

  return "Custom";
};

export default function PricingSection({ settings }) {
  // Fallbacks if not set in settings or if settings is not loaded yet
  const priceStarter = cleanPrice(settings?.PriceStarter || "₹4,999");
  const featuresStarterRaw = settings?.FeaturesStarter || [
    "Logo Design (2 concepts)",
    "Business Card Design",
    "Social Media Kit (3 templates)",
    "2 Revision Rounds",
    "Final files in PNG & PDF"
  ].join("\n");

  const priceProfessional = cleanPrice(settings?.PriceProfessional || "₹12,999");
  const featuresProfessionalRaw = settings?.FeaturesProfessional || [
    "Everything in Starter",
    "Brand Style Guide (colors, fonts, tone)",
    "Letterhead & Email Signature",
    "Social Media Kit (8 templates)",
    "Event Backdrop / Banner (1 design)",
    "4 Revision Rounds",
    "Source files included"
  ].join("\n");

  const priceEnterprise = cleanPrice(settings?.PriceEnterprise || "Custom");
  const featuresEnterpriseRaw = settings?.FeaturesEnterprise || [
    "Everything in Professional",
    "Full Brand Identity System",
    "Unlimited Revisions",
    "Video Editing & Reels",
    "Monthly retainer available",
    "Priority support & turnaround",
    "Dedicated project manager"
  ].join("\n");

  // Parse feature lists from newline separated strings
  const featuresStarter = featuresStarterRaw.split("\n").map(f => f.trim()).filter(Boolean);
  const featuresProfessional = featuresProfessionalRaw.split("\n").map(f => f.trim()).filter(Boolean);
  const featuresEnterprise = featuresEnterpriseRaw.split("\n").map(f => f.trim()).filter(Boolean);

  const tiers = [
    {
      name: "Starter",
      price: priceStarter,
      note: "One-time",
      description: "Perfect for small businesses and personal brands just getting started.",
      features: featuresStarter,
      cta: "GET STARTED",
      featured: false,
    },
    {
      name: "Professional",
      price: priceProfessional,
      note: "One-time",
      description: "Full brand identity for growing businesses ready to make a strong impression.",
      features: featuresProfessional,
      cta: "MOST POPULAR",
      featured: true,
    },
    {
      name: "Enterprise",
      price: priceEnterprise,
      note: "Let's talk",
      description: "Full-service design partnership for brands that demand the best.",
      features: featuresEnterprise,
      cta: "CONTACT US",
      featured: false,
    },
  ];
  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (!el) return;
    const offset = 100;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section
      id="pricing"
      className="section-spacing container"
      style={{ pointerEvents: "auto" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--stack-md)", marginBottom: "56px" }}>
        <div className="font-label-caps" style={{ color: "var(--accent)" }}>PACKAGES</div>
        <h2
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontWeight: "800",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            fontSize: "clamp(1.8rem, 3.5vw, 44px)",
            color: "var(--text-primary)",
          }}
        >
          TRANSPARENT PRICING.
        </h2>
      </div>

      <div className="pricing-grid">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className="glass-card"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              padding: "clamp(28px, 4vw, 40px)",
              position: "relative",
              border: "1px solid var(--glass-border)",
              boxShadow: "none",
            }}
          >


            <div>
              <div
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: tier.featured ? "var(--accent)" : "var(--text-secondary)",
                  marginBottom: "8px",
                }}
              >
                {tier.name}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  fontSize: "clamp(2rem, 4vw, 2.75rem)",
                  fontWeight: "800",
                  letterSpacing: "-0.04em",
                  color: "var(--text-primary)",
                  lineHeight: 1,
                }}
              >
                {tier.price}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px", fontFamily: "var(--font-inter)" }}>
                {tier.note}
              </div>
            </div>

            <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", lineHeight: 1.7, color: "var(--text-secondary)" }}>
              {tier.description}
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", flexGrow: 1 }}>
              {tier.features.map((feat) => (
                <li key={feat} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13.5px", color: "var(--text-primary)", fontFamily: "var(--font-inter)", lineHeight: 1.5 }}>
                  <CheckCircle size={15} style={{ color: "var(--accent)", flexShrink: 0, marginTop: "2px" }} />
                  {feat}
                </li>
              ))}
            </ul>

            <button
              onClick={scrollToContact}
              className={tier.featured ? "btn-primary" : "btn-secondary"}
              style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}
            >
              {tier.cta}
            </button>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--stack-lg);
          align-items: stretch;
        }
        .pricing-grid > .glass-card {
          align-self: stretch;
          height: 100%;
        }
        @media (max-width: 1024px) {
          .pricing-grid {
            grid-template-columns: 1fr;
            max-width: 520px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}
