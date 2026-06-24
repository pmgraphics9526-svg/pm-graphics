export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, projectType, projectScale, message } = body;

    if (!name?.trim() || !message?.trim()) {
      return Response.json({ error: "Name and message are required." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Invalid email address." }, { status: 400 });
    }

    const baseId = process.env.AIRTABLE_BASE_ID;
    const writeKey = process.env.AIRTABLE_WRITE_API_KEY;
    const tableName = "Contact Messages";

    if (!baseId || !writeKey) {
      console.warn("[POST /api/contact] Missing Airtable configuration. Logging form payload as fallback:");
      console.log({
        Name: name,
        Email: email,
        ProjectType: projectType,
        ProjectScale: projectScale,
        ProjectBrief: message,
        SubmittedDate: new Date().toISOString()
      });
      // Fallback: If Web3Forms key is set, we still try Web3Forms
      const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
      if (accessKey) {
        try {
          await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              access_key: accessKey,
              subject: `New inquiry from ${name} — ${projectType}`,
              from_name: "PM Graphics Portfolio",
              name,
              email,
              message: `Project Type: ${projectType}\nProject Scale: ${projectScale}\n\n${message}`,
            }),
          });
        } catch (err) {
          console.error("[POST /api/contact] Web3Forms fallback warning:", err);
        }
      }
      return Response.json({ ok: true });
    }

    // Write to Airtable table 'Contact Messages'
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
              Email: email,
              ProjectType: projectType,
              ProjectScale: projectScale,
              ProjectBrief: message,
              SubmittedDate: new Date().toISOString(),
            },
          },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[POST /api/contact] Airtable error:", errText);
      return Response.json({ error: "Failed to save contact message to Airtable." }, { status: 502 });
    }

    // Optional: send Web3Forms email if configured
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (accessKey) {
      try {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `New inquiry from ${name} — ${projectType}`,
            from_name: "PM Graphics Portfolio",
            name,
            email,
            message: `Project Type: ${projectType}\nProject Scale: ${projectScale}\n\n${message}`,
          }),
        });
      } catch (err) {
        console.error("[POST /api/contact] Web3Forms delivery warning:", err);
      }
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/contact] Unexpected error:", err);
    return Response.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
