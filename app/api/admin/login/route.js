import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

// Simple in-memory rate limit store
const loginAttempts = new Map();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export async function POST(request) {
  try {
    const body = await request.json();
    const { password, recaptchaToken } = body;

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
               request.headers.get("x-real-ip") || 
               "127.0.0.1";

    const now = Date.now();
    const record = loginAttempts.get(ip) || { attempts: 0, lockUntil: 0 };

    if (record.lockUntil > now) {
      const remainingMs = record.lockUntil - now;
      const remainingMins = Math.ceil(remainingMs / (60 * 1000));
      return Response.json(
        { error: `Too many attempts. Try again in ${remainingMins} minute${remainingMins > 1 ? "s" : ""}.` },
        { status: 429 }
      );
    }

    if (record.lockUntil > 0 && record.lockUntil <= now) {
      record.attempts = 0;
      record.lockUntil = 0;
      loginAttempts.set(ip, record);
    }

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
    } catch (compareError) {
      console.error("Bcrypt comparison error:", compareError);
    }

    if (!isValid) {
      record.attempts += 1;
      if (record.attempts >= MAX_FAILED_ATTEMPTS) {
        record.lockUntil = now + LOCKOUT_DURATION;
      }
      loginAttempts.set(ip, record);

      if (record.lockUntil > now) {
        return Response.json(
          { error: "Too many attempts. Try again in 15 minutes." },
          { status: 429 }
        );
      }

      const remainingAttempts = MAX_FAILED_ATTEMPTS - record.attempts;
      return Response.json(
        { error: `Wrong password. ${remainingAttempts} attempt${remainingAttempts > 1 ? "s" : ""} remaining.` },
        { status: 401 }
      );
    }

    // On successful login: Reset attempts
    loginAttempts.delete(ip);

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
