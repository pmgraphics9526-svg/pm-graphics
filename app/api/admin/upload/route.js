import { isAuthenticated } from "@/lib/auth";

export async function POST(request) {
  try {
    // Check authentication first to secure the endpoint
    const user = isAuthenticated(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Build form data to forward to tmpfiles.org
    const externalFormData = new FormData();
    externalFormData.append("file", file);

    const uploadRes = await fetch("https://tmpfiles.org/api/v1/upload", {
      method: "POST",
      body: externalFormData,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error("[POST /api/admin/upload] tmpfiles.org failed:", errText);
      return Response.json({ error: "Failed to upload image to temp host" }, { status: 502 });
    }

    const data = await uploadRes.json();
    const uploadUrl = data.data?.url;

    if (!uploadUrl) {
      console.error("[POST /api/admin/upload] Missing URL in response data:", data);
      return Response.json({ error: "Invalid response from temp host" }, { status: 502 });
    }

    // Convert page URL to raw file direct download link
    const downloadUrl = uploadUrl.replace("tmpfiles.org/", "tmpfiles.org/dl/");

    return Response.json({ url: downloadUrl });
  } catch (err) {
    console.error("[POST /api/admin/upload] Server error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
