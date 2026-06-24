import { db } from "@/lib/firebase-admin";
import { isAuthenticated } from "@/lib/auth";

const DEFAULT_TESTIMONIALS = [
  {
    id: "pre-1",
    name: "Rahul Sharma",
    text: "PM Graphics completely transformed our brand. The logo design was clean, bold, and exactly what we needed.",
    rating: 5,
    status: "Approved"
  },
  {
    id: "pre-2",
    name: "Priya Das",
    text: "The event backdrop designed by PM Graphics was stunning. Everyone at the event was impressed.",
    rating: 5,
    status: "Approved"
  },
  {
    id: "pre-3",
    name: "Amit Bora",
    text: "Best flyer designer I have worked with. Fast delivery and premium quality every time.",
    rating: 5,
    status: "Approved"
  },
  {
    id: "pre-4",
    name: "Sneha Gogoi",
    text: "Our YouTube channel intro looks so professional now. Highly recommend PM Graphics.",
    rating: 5,
    status: "Approved"
  },
  {
    id: "pre-5",
    name: "Rajan Paul",
    text: "The branding package was worth every penny. Our business looks so much more credible now.",
    rating: 5,
    status: "Approved"
  },
  {
    id: "pre-6",
    name: "Meghna Singh",
    text: "PM Graphics understood our vision perfectly and delivered beyond expectations.",
    rating: 5,
    status: "Approved"
  },
  {
    id: "pre-7",
    name: "Deepak Nath",
    text: "The social media flyers got us so many compliments. Will definitely work again.",
    rating: 5,
    status: "Approved"
  },
  {
    id: "pre-8",
    name: "Kabita Devi",
    text: "Very professional and creative. The event graphics were the highlight of our ceremony.",
    rating: 5,
    status: "Approved"
  }
];

export async function GET(request) {
  try {
    const snapshot = await db.collection("testimonials").get();
    let testimonialsList = [];

    snapshot.forEach((doc) => {
      testimonialsList.push({ id: doc.id, ...doc.data() });
    });

    if (testimonialsList.length === 0) {
      console.log("Firestore testimonials collection is empty. Seeding default testimonials...");
      for (const t of DEFAULT_TESTIMONIALS) {
        const docId = t.id;
        const data = {
          name: t.name,
          text: t.text,
          rating: t.rating,
          status: t.status,
          createdAt: new Date().toISOString()
        };
        await db.collection("testimonials").doc(docId).set(data);
        testimonialsList.push({ id: docId, ...data });
      }
    } else {
      // Sort by createdAt descending
      testimonialsList.sort((a, b) => {
        const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt).getTime() || 0;
        const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt).getTime() || 0;
        return timeB - timeA;
      });
    }

    return Response.json(testimonialsList);
  } catch (err) {
    console.error("GET Testimonials API Error:", err);
    return Response.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = isAuthenticated(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return Response.json({ error: "ID and status are required" }, { status: 400 });
    }

    if (status !== "Approved" && status !== "Rejected" && status !== "Pending") {
      return Response.json({ error: "Invalid status value" }, { status: 400 });
    }

    await db.collection("testimonials").doc(id).update({ status });

    return Response.json({ success: true });
  } catch (err) {
    console.error("PUT Testimonials API Error:", err);
    return Response.json({ error: "Failed to update testimonial status" }, { status: 500 });
  }
}
export async function POST(request) {
  return PUT(request);
}
