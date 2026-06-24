import { db } from "@/lib/firebase-admin";
import { isAuthenticated } from "@/lib/auth";

const DEFAULT_PACKAGES = [
  {
    name: "Starter",
    price: "₹4,999",
    features: [
      "Logo Design (2 concepts)",
      "Business Card Design",
      "Social Media Kit (3 templates)",
      "2 Revision Rounds",
      "Final files in PNG & PDF"
    ].join("\n"),
    description: "Perfect for small businesses and personal brands just getting started."
  },
  {
    name: "Professional",
    price: "₹12,999",
    features: [
      "Everything in Starter",
      "Brand Style Guide (colors, fonts, tone)",
      "Letterhead & Email Signature",
      "Social Media Kit (8 templates)",
      "Event Backdrop / Banner (1 design)",
      "4 Revision Rounds",
      "Source files included"
    ].join("\n"),
    description: "Full brand identity for growing businesses ready to make a strong impression."
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Everything in Professional",
      "Full Brand Identity System",
      "Unlimited Revisions",
      "Video Editing & Reels",
      "Monthly retainer available",
      "Priority support & turnaround",
      "Dedicated project manager"
    ].join("\n"),
    description: "Full-service design partnership for brands that demand the best."
  }
];

export async function GET(request) {
  try {
    const snapshot = await db.collection("packages").get();
    let packagesList = [];

    snapshot.forEach((doc) => {
      packagesList.push({ id: doc.id, ...doc.data() });
    });

    if (packagesList.length === 0) {
      console.log("Firestore packages collection is empty. Seeding default packages...");
      for (const p of DEFAULT_PACKAGES) {
        const docRef = await db.collection("packages").add({
          ...p,
          createdAt: new Date().toISOString()
        });
        packagesList.push({ id: docRef.id, ...p });
      }
    }

    // Sort by createdAt ascending
    packagesList.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeA - timeB;
    });

    return Response.json(packagesList);
  } catch (err) {
    console.error("GET Packages API Error:", err);
    return Response.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = isAuthenticated(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, price, features, description } = body;

    if (!name || !price) {
      return Response.json({ error: "Name and Price are required" }, { status: 400 });
    }

    const packageData = {
      name,
      price,
      features: features || "",
      description: description || "",
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection("packages").add(packageData);

    return Response.json({ success: true, id: docRef.id });
  } catch (err) {
    console.error("POST Packages API Error:", err);
    return Response.json({ error: "Failed to add package" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = isAuthenticated(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, price, features, description } = body;

    if (!id || !name || !price) {
      return Response.json({ error: "ID, Name, and Price are required" }, { status: 400 });
    }

    const packageData = {
      name,
      price,
      features: features || "",
      description: description || ""
    };

    await db.collection("packages").doc(id).set(packageData, { merge: true });

    return Response.json({ success: true });
  } catch (err) {
    console.error("PUT Packages API Error:", err);
    return Response.json({ error: "Failed to update package" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = isAuthenticated(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Package ID is required" }, { status: 400 });
    }

    await db.collection("packages").doc(id).delete();

    return Response.json({ success: true });
  } catch (err) {
    console.error("DELETE Packages API Error:", err);
    return Response.json({ error: "Failed to delete package" }, { status: 500 });
  }
}
