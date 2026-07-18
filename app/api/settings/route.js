export const revalidate = 300;

const DEFAULT_SETTINGS = {
  ContactEmail: "pmgraphics9526@gmail.com",
  Phone: "+91-9101811613",
  Location: "Jorhat, Assam -785001",
  PriceStarter: "₹4,999",
  FeaturesStarter: [
    "Logo Design (2 concepts)",
    "Business Card Design",
    "Social Media Kit (3 templates)",
    "2 Revision Rounds",
    "Final files in PNG & PDF"
  ].join("\n"),
  PriceProfessional: "₹12,999",
  FeaturesProfessional: [
    "Everything in Starter",
    "Brand Style Guide (colors, fonts, tone)",
    "Letterhead & Email Signature",
    "Social Media Kit (8 templates)",
    "Event Backdrop / Banner (1 design)",
    "4 Revision Rounds",
    "Source files included"
  ].join("\n"),
  PriceEnterprise: "Custom",
  FeaturesEnterprise: [
    "Everything in Professional",
    "Full Brand Identity System",
    "Unlimited Revisions",
    "Video Editing & Reels",
    "Monthly retainer available",
    "Priority support & turnaround",
    "Dedicated project manager"
  ].join("\n")
};

// In-memory cache — Next.js's fetch/ISR data cache only applies to
// production builds, not `next dev`, so without this every request
// (dev or a cold-cache prod hit) pays the full Airtable round-trip
// (commonly several seconds, sometimes 20s+ on a slow connection).
// Settings rarely change, so a 5-minute in-process cache is safe and
// makes repeat requests resolve in milliseconds in every environment.
const CACHE_TTL_MS = 5 * 60 * 1000;
let cache = { data: null, timestamp: 0 };

export async function GET() {
  const now = Date.now();
  if (cache.data && now - cache.timestamp < CACHE_TTL_MS) {
    return Response.json(cache.data);
  }

  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const readKey = process.env.AIRTABLE_READ_API_KEY;
    const tableName = "Site Settings";

    if (!baseId || !readKey) {
      console.warn("[GET /api/settings] Missing Airtable configuration. Falling back to default site settings.");
      return Response.json(DEFAULT_SETTINGS);
    }

    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${readKey}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[GET /api/settings] Airtable error:", errText);
      // Serve stale cache over a hard fallback if we have one
      if (cache.data) return Response.json(cache.data);
      return Response.json(DEFAULT_SETTINGS);
    }

    const data = await res.json();
    const records = data.records || [];

    // Convert array of [{fields: {Key: "ContactEmail", Value: "..."}}] to key-value object
    const settings = { ...DEFAULT_SETTINGS };
    records.forEach((rec) => {
      const key = rec.fields.Key;
      const value = rec.fields.Value;
      if (key && value !== undefined) {
        settings[key] = value;
      }
    });

    cache = { data: settings, timestamp: now };
    return Response.json(settings);
  } catch (err) {
    console.error("[GET /api/settings] Unexpected error:", err);
    // Serve stale cache over a hard fallback if we have one
    if (cache.data) return Response.json(cache.data);
    return Response.json(DEFAULT_SETTINGS);
  }
}
