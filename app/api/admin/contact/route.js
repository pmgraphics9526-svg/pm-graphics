import { db } from "@/lib/firebase-admin";
import { isAuthenticated } from "@/lib/auth";

const DEFAULT_CONTACT = {
  email: "pmgraphics9526@gmail.com",
  phone: "+91-9101811613",
  location: "Jorhat, Assam -785001"
};

export async function GET(request) {
  try {
    const docSnap = await db.collection("settings").doc("contact").get();

    if (docSnap.exists) {
      return Response.json(docSnap.data());
    } else {
      return Response.json(DEFAULT_CONTACT);
    }
  } catch (err) {
    console.error("GET Contact API Error:", err);
    return Response.json({ error: "Failed to fetch contact info" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = isAuthenticated(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, phone, location } = body;

    const data = {
      email: email || "",
      phone: phone || "",
      location: location || ""
    };

    await db.collection("settings").doc("contact").set(data);
    return Response.json({ success: true });
  } catch (err) {
    console.error("POST Contact API Error:", err);
    return Response.json({ error: "Failed to save contact info" }, { status: 500 });
  }
}
export async function PUT(request) {
  return POST(request);
}
