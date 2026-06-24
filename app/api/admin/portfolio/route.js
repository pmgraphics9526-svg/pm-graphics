import { db } from "@/lib/firebase-admin";
import { isAuthenticated } from "@/lib/auth";
import { projects as defaultProjects } from "@/components/projectsData";

export async function GET(request) {
  try {
    const snapshot = await db.collection("projects").get();
    let projectsList = [];

    snapshot.forEach((doc) => {
      projectsList.push({ id: doc.id, ...doc.data() });
    });

    if (projectsList.length === 0) {
      console.log("Firestore projects collection is empty. Seeding default projects...");
      for (const p of defaultProjects) {
        const docId = String(p.id);
        const projectData = {
          title: p.title || "",
          category: p.category || "BRANDING",
          imageUrl: p.image || "",
          client: p.client || "",
          description: p.description || "",
          year: p.year || "",
          scope: p.scope || [],
          details: p.details || "",
          createdAt: new Date().toISOString(),
        };
        await db.collection("projects").doc(docId).set(projectData);
        projectsList.push({ id: docId, ...projectData });
      }
    }

    // Sort by createdAt descending
    projectsList.sort((a, b) => {
      const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt).getTime() || 0;
      const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt).getTime() || 0;
      return timeB - timeA;
    });

    return Response.json(projectsList);
  } catch (err) {
    console.error("GET Portfolio API Error:", err);
    return Response.json({ error: "Failed to fetch portfolio projects" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = isAuthenticated(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, category, imageUrl, description, client, year, scope, details } = body;

    if (!title || !category || !imageUrl) {
      return Response.json({ error: "Title, category, and image URL are required" }, { status: 400 });
    }

    const projectData = {
      title,
      category: category.toUpperCase(),
      imageUrl,
      description: description || "",
      client: client || title,
      year: year || new Date().getFullYear().toString(),
      scope: scope || [],
      details: details || "",
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("projects").add(projectData);

    return Response.json({ success: true, id: docRef.id });
  } catch (err) {
    console.error("POST Portfolio API Error:", err);
    return Response.json({ error: "Failed to add project" }, { status: 500 });
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
      return Response.json({ error: "Project ID is required" }, { status: 400 });
    }

    await db.collection("projects").doc(id).delete();

    return Response.json({ success: true });
  } catch (err) {
    console.error("DELETE Portfolio API Error:", err);
    return Response.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
