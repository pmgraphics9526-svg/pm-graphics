import { isAuthenticated } from "@/lib/auth";

const DEFAULT_CONTACT = {
  email: "pmgraphics9526@gmail.com",
  phone: "+91-9101811613",
  location: "Jorhat, Assam -785001"
};

export async function GET(request) {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const readKey = process.env.AIRTABLE_READ_API_KEY;
    const tableName = "Site Settings";

    if (!baseId || !readKey) {
      return Response.json(DEFAULT_CONTACT);
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
      console.error("[GET /api/admin/contact] Airtable error:", errText);
      return Response.json(DEFAULT_CONTACT);
    }

    const data = await res.json();
    const records = data.records || [];

    const contact = {
      email: DEFAULT_CONTACT.email,
      phone: DEFAULT_CONTACT.phone,
      location: DEFAULT_CONTACT.location,
    };

    records.forEach((rec) => {
      const key = rec.fields.Key;
      const val = rec.fields.Value;
      if (key === "ContactEmail" && val !== undefined) contact.email = val;
      if (key === "Phone" && val !== undefined) contact.phone = val;
      if (key === "Location" && val !== undefined) contact.location = val;
    });

    return Response.json(contact);
  } catch (err) {
    console.error("GET Admin Contact Error:", err);
    return Response.json(DEFAULT_CONTACT);
  }
}

export async function POST(request) {
  try {
    const user = isAuthenticated(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const baseId = process.env.AIRTABLE_BASE_ID;
    const writeKey = process.env.AIRTABLE_WRITE_API_KEY;
    const tableName = "Site Settings";

    if (!baseId || !writeKey) {
      return Response.json({ error: "Airtable write credentials are missing" }, { status: 500 });
    }

    const body = await request.json();
    const { email, phone, location } = body;

    // Fetch existing records first to check if they exist
    const getUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
    const getRes = await fetch(getUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${writeKey}`,
      },
    });

    if (!getRes.ok) {
      const errText = await getRes.text();
      console.error("[POST /api/admin/contact] Failed to fetch settings records:", errText);
      return Response.json({ error: "Failed to connect to Airtable settings" }, { status: 502 });
    }

    const getData = await getRes.json();
    const records = getData.records || [];

    const updates = [
      { key: "ContactEmail", val: email },
      { key: "Phone", val: phone },
      { key: "Location", val: location }
    ];

    for (const update of updates) {
      if (update.val === undefined) continue;
      
      const existing = records.find(r => r.fields.Key === update.key);
      if (existing) {
        // Update existing record
        const patchUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${existing.id}`;
        await fetch(patchUrl, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${writeKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: {
              Value: update.val
            }
          })
        });
      } else {
        // Create new record
        const postUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
        await fetch(postUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${writeKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            records: [
              {
                fields: {
                  Key: update.key,
                  Value: update.val
                }
              }
            ]
          })
        });
      }
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("POST Admin Contact Error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  return POST(request);
}
