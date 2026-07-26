import crypto from "crypto";

// Verifies a completed Razorpay Checkout payment server-side. Never trust a
// client-side "success" callback alone — Razorpay's documented method is to
// recompute the HMAC-SHA256 signature of `${order_id}|${payment_id}` using
// the account's key_secret, and compare it byte-for-byte to the signature
// Checkout returned. Any mismatch (wrong secret, tampered ids, a forged
// signature) must be rejected.
//
// Requires RAZORPAY_KEY_SECRET in .env.local (see create-order/route.ts for
// details on TEST vs LIVE keys).

export async function POST(request: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    console.error("[POST /api/verify-payment] Missing RAZORPAY_KEY_SECRET in environment.");
    return Response.json({ verified: false, error: "Payment is not configured on this server." }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body ?? {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json({ verified: false, error: "Missing payment details." }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const providedBuffer = Buffer.from(String(razorpay_signature), "hex");
    // timingSafeEqual throws on mismatched lengths, so guard that first —
    // a length mismatch is itself just "not verified", not an error.
    const verified = expectedBuffer.length === providedBuffer.length && crypto.timingSafeEqual(expectedBuffer, providedBuffer);

    if (!verified) {
      console.warn("[POST /api/verify-payment] Signature mismatch for order", razorpay_order_id);
      return Response.json({ verified: false, error: "Payment signature verification failed." }, { status: 400 });
    }

    return Response.json({ verified: true });
  } catch (err) {
    console.error("[POST /api/verify-payment] Unexpected error:", err);
    return Response.json({ verified: false, error: "Unexpected server error." }, { status: 500 });
  }
}
