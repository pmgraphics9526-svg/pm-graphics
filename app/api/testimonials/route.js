const preWrittenReviews = [
  {
    id: "pre-1",
    name: "Rahul Sharma",
    text: "PM Graphics completely transformed our brand. The logo design was clean, bold, and exactly what we needed.",
    rating: 5,
  },
  {
    id: "pre-2",
    name: "Priya Das",
    text: "The event backdrop designed by PM Graphics was stunning. Everyone at the event was impressed.",
    rating: 5,
  },
  {
    id: "pre-3",
    name: "Amit Bora",
    text: "Best flyer designer I have worked with. Fast delivery and premium quality every time.",
    rating: 5,
  },
  {
    id: "pre-4",
    name: "Sneha Gogoi",
    text: "Our YouTube channel intro looks so professional now. Highly recommend PM Graphics.",
    rating: 5,
  },
  {
    id: "pre-5",
    name: "Rajan Paul",
    text: "The branding package was worth every penny. Our business looks so much more credible now.",
    rating: 5,
  },
  {
    id: "pre-6",
    name: "Meghna Singh",
    text: "PM Graphics understood our vision perfectly and delivered beyond expectations.",
    rating: 5,
  },
  {
    id: "pre-7",
    name: "Deepak Nath",
    text: "The social media flyers got us so many compliments. Will definitely work again.",
    rating: 5,
  },
  {
    id: "pre-8",
    name: "Kabita Devi",
    text: "Very professional and creative. The event graphics were the highlight of our ceremony.",
    rating: 5,
  },
];

export async function GET() {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME || "Testimonials";
    const readKey = process.env.AIRTABLE_READ_API_KEY;

    if (!baseId || !readKey) {
      console.warn("[GET /api/testimonials] Missing Airtable configuration. Falling back to pre-written reviews.");
      return Response.json({ records: preWrittenReviews });
    }

    const url = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=AND({Status}='Approved')`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${readKey}`,
      },
      next: { revalidate: 10 }, // Cache on server for 10 seconds
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[GET /api/testimonials] Airtable error:", errText);
      return Response.json({ error: "Failed to fetch testimonials from Airtable." }, { status: 502 });
    }

    const data = await res.json();
    const records = data.records || [];
    const reviews = records.map((rec) => ({
      id: rec.id,
      name: rec.fields.Name || "Anonymous",
      text: rec.fields.Review || "",
      rating: Number(rec.fields.Rating) || 5,
    }));

    return Response.json({ records: reviews });
  } catch (err) {
    console.error("[GET /api/testimonials] Unexpected error:", err);
    return Response.json({ error: "Server error." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, text, rating } = body;

    if (!name?.trim() || !text?.trim()) {
      return Response.json({ error: "Name and review text are required." }, { status: 400 });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return Response.json({ error: "Rating must be a number between 1 and 5." }, { status: 400 });
    }

    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME || "Testimonials";
    const writeKey = process.env.AIRTABLE_WRITE_API_KEY;

    if (!baseId || !writeKey) {
      console.log("[POST /api/testimonials] No Airtable config — dev mock record created:", {
        Name: name,
        Review: text,
        Rating: numericRating,
        Status: "Pending",
      });
      return Response.json({ ok: true });
    }

    const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${writeKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Name: name,
              Review: text,
              Rating: numericRating,
              Status: "Pending",
            },
          },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[POST /api/testimonials] Airtable error:", errText);
      return Response.json({ error: "Failed to write testimonial to Airtable." }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/testimonials] Unexpected error:", err);
    return Response.json({ error: "Server error." }, { status: 500 });
  }
}
