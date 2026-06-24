import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { password, recaptchaToken } = body;

    if (!password) {
      return Response.json({ error: "Password is required" }, { status: 400 });
    }

    // Google reCAPTCHA v3 verification
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (recaptchaSecret) {
      if (!recaptchaToken) {
        return Response.json({ error: "Security validation is required." }, { status: 400 });
      }

      try {
        const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `secret=${encodeURIComponent(recaptchaSecret)}&response=${encodeURIComponent(recaptchaToken)}`,
        });

        const verifyData = await verifyRes.json();
        if (!verifyData.success || verifyData.score < 0.5) {
          console.error("reCAPTCHA validation failed:", verifyData);
          return Response.json(
            { error: "Security check failed. Please try again or ensure your browser is not blocking Google services." },
            { status: 403 }
          );
        }
      } catch (verifyError) {
        console.error("reCAPTCHA verification error:", verifyError);
        return Response.json({ error: "Security verification server error." }, { status: 500 });
      }
    } else {
      console.warn("reCAPTCHA secret key is not set. Bypassing validation.");
    }


    const envPasswordHash = process.env.ADMIN_PASSWORD;
    console.log("--- DEBUG AUTH START ---");
    console.log("Received password length:", password?.length);
    console.log("Raw envPasswordHash:", envPasswordHash);
    console.log("envPasswordHash type:", typeof envPasswordHash);
    console.log("envPasswordHash length:", envPasswordHash?.length);
    if (envPasswordHash) {
      console.log("envPasswordHash character codes:", Array.from(envPasswordHash).map(c => c.charCodeAt(0)));
    }
    
    if (!envPasswordHash) {
      console.error("ADMIN_PASSWORD is not set in environment variables");
      return Response.json(
        { error: "Server authentication is misconfigured. Please check environment variables." },
        { status: 500 }
      );
    }

    // Compare password with hash
    let isValid = false;
    try {
      isValid = bcrypt.compareSync(password, envPasswordHash);
      console.log("Bcrypt comparison result:", isValid);
    } catch (compareError) {
      console.error("Bcrypt comparison error:", compareError);
    }
    console.log("--- DEBUG AUTH END ---");

    if (!isValid) {
      return Response.json({ error: "Wrong password" }, { status: 401 });
    }

    // Create token
    const token = signToken({ role: "admin" });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
      sameSite: "lax",
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Login API Error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
