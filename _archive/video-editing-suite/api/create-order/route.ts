// Creates a Razorpay order for the video-editor's "Auto Edit" feature —
// fixed price, 500 INR (50000 paise).
//
// Requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local. Use TEST
// MODE keys during development (Razorpay Dashboard -> Settings -> API Keys,
// with "Test Mode" toggled on — free and instant, no KYC needed). Before
// any production deploy, the same two variable names must also be added to
// the Vercel project's Environment Variables, using LIVE mode keys instead.

const AUTO_EDIT_AMOUNT_PAISE = 50000; // ₹500

export async function POST() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error("[POST /api/create-order] Missing RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET in environment.");
    return Response.json({ error: "Payment is not configured on this server." }, { status: 500 });
  }

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: AUTO_EDIT_AMOUNT_PAISE,
        currency: "INR",
        receipt: `auto-edit-${Date.now()}`,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[POST /api/create-order] Razorpay error:", data);
      return Response.json({ error: data?.error?.description || "Failed to create order." }, { status: 502 });
    }

    // key_id is a public identifier (safe client-side) — Razorpay's
    // Checkout.js requires it to open the modal.
    return Response.json({
      order_id: data.id,
      amount: data.amount,
      currency: data.currency,
      key_id: keyId,
    });
  } catch (err) {
    console.error("[POST /api/create-order] Unexpected error:", err);
    return Response.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
