import { isAuthenticated } from "@/lib/auth";

const DEFAULT_PACKAGES = [
  {
    id: "Starter",
    name: "Starter",
    price: "₹4,999",
    features: [
      "Logo Design (2 concepts)",
      "Business Card Design",
      "Social Media Kit (3 templates)",
      "2 Revision Rounds",
      "Final files in PNG & PDF"
    ].join("\n"),
    description: "Perfect for small businesses and personal brands just getting started."
  },
  {
    id: "Professional",
    name: "Professional",
    price: "₹12,999",
    features: [
      "Everything in Starter",
      "Brand Style Guide (colors, fonts, tone)",
      "Letterhead & Email Signature",
      "Social Media Kit (8 templates)",
      "Event Backdrop / Banner (1 design)",
      "4 Revision Rounds",
      "Source files included"
    ].join("\n"),
    description: "Full brand identity for growing businesses ready to make a strong impression."
  },
  {
    id: "Enterprise",
    name: "Enterprise",
    price: "Custom",
    features: [
      "Everything in Professional",
      "Full Brand Identity System",
      "Unlimited Revisions",
      "Video Editing & Reels",
      "Monthly retainer available",
      "Priority support & turnaround",
      "Dedicated project manager"
    ].join("\n"),
    description: "Full-service design partnership for brands that demand the best."
  }
];

export async function GET(request) {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const readKey = process.env.AIRTABLE_READ_API_KEY;
    const tableName = "Site Settings";

    if (!baseId || !readKey) {
      return Response.json(DEFAULT_PACKAGES);
    }

    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${readKey}`,
      },
      next: { revalidate: 0 }, // Disable server cache for real-time admin view
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[GET /api/admin/packages] Airtable error:", errText);
      return Response.json(DEFAULT_PACKAGES);
    }

    const data = await res.json();
    const records = data.records || [];

    const settings = {};
    records.forEach((rec) => {
      const key = rec.fields.Key;
      const val = rec.fields.Value;
      if (key && val !== undefined) {
        settings[key] = val;
      }
    });

    const packages = DEFAULT_PACKAGES.map((pkg) => {
      const priceKey = `Price${pkg.name}`;
      const featuresKey = `Features${pkg.name}`;
      return {
        ...pkg,
        price: settings[priceKey] !== undefined ? settings[priceKey] : pkg.price,
        features: settings[featuresKey] !== undefined ? settings[featuresKey] : pkg.features,
      };
    });

    return Response.json(packages);
  } catch (err) {
    console.error("GET Admin Packages Error:", err);
    return Response.json(DEFAULT_PACKAGES);
  }
}

export async function PUT(request) {
  try {
    const user = isAuthenticated(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const baseId = process.env.AIRTABLE_BASE_ID;
    const writeKey = process.env.AIRTABLE_WRITE_API_KEY;
    const tableName = "Site Settings";

    if (!baseId || !writeKey) {
      return Response.json({ error: "Airtable credentials are missing" }, { status: 500 });
    }

    const body = await request.json();
    const { id, name, price, features } = body;

    const pkgName = name || id;

    if (!pkgName || !DEFAULT_PACKAGES.some(p => p.name === pkgName)) {
      return Response.json({ error: "Invalid package name. Only Starter, Professional, and Enterprise can be modified." }, { status: 400 });
    }

    // Fetch existing records to check if they exist
    const getUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
    const getRes = await fetch(getUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${writeKey}`,
      },
    });

    if (!getRes.ok) {
      const errText = await getRes.text();
      console.error("[PUT /api/admin/packages] Failed to fetch settings records:", errText);
      return Response.json({ error: "Failed to connect to Airtable settings" }, { status: 502 });
    }

    const getData = await getRes.json();
    const records = getData.records || [];

    const priceKey = `Price${pkgName}`;
    const featuresKey = `Features${pkgName}`;

    const updates = [
      { key: priceKey, val: price },
      { key: featuresKey, val: features }
    ];

    for (const update of updates) {
      if (update.val === undefined) continue;

      const existing = records.find(r => r.fields.Key === update.key);
      if (existing) {
        const patchUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${existing.id}`;
        await fetch(patchUrl, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${writeKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: { Value: update.val }
          })
        });
      } else {
        const postUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
        await fetch(postUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${writeKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            records: [
              { fields: { Key: update.key, Value: update.val } }
            ]
          })
        });
      }
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("PUT Admin Packages Error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  // Mock addition on server side since layout is fixed
  return Response.json({ success: true, id: "NewMockPackage" });
}

export async function DELETE(request) {
  // Mock deletion on server side since layout is fixed
  return Response.json({ success: true });
}
