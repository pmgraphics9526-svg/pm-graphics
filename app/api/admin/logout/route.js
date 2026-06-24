import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_token");
    return Response.json({ success: true });
  } catch (err) {
    console.error("Logout API Error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
