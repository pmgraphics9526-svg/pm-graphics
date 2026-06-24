import { isAuthenticated } from "@/lib/auth";

export async function GET(request) {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME || "Testimonials";
    const readKey = process.env.AIRTABLE_READ_API_KEY;

    if (!baseId || !readKey) {
      return Response.json({ error: "Airtable credentials are missing" }, { status: 500 });
    }

    let allRecords = [];
    let offset = "";
    let hasMore = true;

    while (hasMore) {
      let url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?pageSize=100`;
      if (offset) {
        url += `&offset=${offset}`;
      }

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${readKey}`,
        },
        next: { revalidate: 0 }, // Disable server cache for real-time admin view
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("[GET /api/admin/testimonials] Airtable error:", errText);
        return Response.json({ error: "Failed to fetch testimonials from Airtable" }, { status: 500 });
      }

      const data = await res.json();
      allRecords = allRecords.concat(data.records || []);
      
      if (data.offset) {
        offset = data.offset;
      } else {
        hasMore = false;
      }
    }

    const mappedTestimonials = allRecords.map((rec) => ({
      id: rec.id, // Return Airtable record ID for management action targets
      name: rec.fields.Name || "Anonymous",
      text: rec.fields.Review || "",
      rating: Number(rec.fields.Rating) || 5,
      status: rec.fields.Status || "Pending",
      createdAt: rec.createdTime,
    }));

    // Sort by createdTime descending (newest first)
    mappedTestimonials.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return Response.json(mappedTestimonials);
  } catch (err) {
    console.error("GET Admin Testimonials Error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = isAuthenticated(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME || "Testimonials";
    const writeKey = process.env.AIRTABLE_WRITE_API_KEY;

    if (!baseId || !writeKey) {
      return Response.json({ error: "Airtable write credentials are missing" }, { status: 500 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return Response.json({ error: "ID and status are required" }, { status: 400 });
    }

    if (status !== "Approved" && status !== "Rejected" && status !== "Pending") {
      return Response.json({ error: "Invalid status value" }, { status: 400 });
    }

    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${id}`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${writeKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Status: status,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Airtable PATCH Testimonial error:", errText);
      return Response.json({ error: "Failed to update testimonial status in Airtable" }, { status: 502 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("PUT Admin Testimonials Error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  return PUT(request);
}
