import { isAuthenticated } from "@/lib/auth";
import { bucket } from "@/lib/firebase-admin";
import { randomUUID } from "crypto";

export async function POST(request) {
  try {
    const user = isAuthenticated(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type?.startsWith("image/")) {
      return Response.json({ error: "Only image files are allowed" }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = (file.name?.split(".").pop() || "jpg").toLowerCase();
    const filename = `portfolio/${randomUUID()}.${ext}`;

    const blob = bucket.file(filename);
    await blob.save(buffer, {
      contentType: file.type,
      public: true,
      metadata: { cacheControl: "public, max-age=31536000" },
    });

    const downloadUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

    return Response.json({ url: downloadUrl });
  } catch (err) {
    console.error("[POST /api/admin/upload] Server error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
