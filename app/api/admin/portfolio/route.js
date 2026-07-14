import { isAuthenticated } from "@/lib/auth";
import { bucket } from "@/lib/firebase-admin";

async function deleteStorageFileIfOwned(url) {
  if (!url || !url.includes("storage.googleapis.com")) return;
  try {
    const marker = `storage.googleapis.com/${bucket.name}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return;
    const path = decodeURIComponent(url.slice(idx + marker.length));
    await bucket.file(path).delete({ ignoreNotFound: true });
  } catch (err) {
    console.error("Storage cleanup failed (non-fatal):", err);
  }
}

export async function GET(request) {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const readKey = process.env.AIRTABLE_READ_API_KEY;
    const tableName = "Portfolio";

    if (!baseId || !readKey) {
      return Response.json({ error: "Airtable credentials are missing" }, { status: 500 });
    }

    let allRecords = [];
    let offset = "";
    let hasMore = true;

    while (hasMore) {
      let url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?pageSize=100`;
      if (offset) {
        url += `&offset=${offset}`;
      }

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${readKey}`,
        },
        next: { revalidate: 0 }, // Disable server cache for real-time admin view
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("[GET /api/admin/portfolio] Airtable error:", errText);
        return Response.json({ error: "Failed to fetch from Airtable" }, { status: 500 });
      }

      const data = await res.json();
      allRecords = allRecords.concat(data.records || []);
      
      if (data.offset) {
        offset = data.offset;
      } else {
        hasMore = false;
      }
    }

    const mappedProjects = allRecords.map((rec) => {
      const f = rec.fields;
      let images = [];
      if (f.Images && Array.isArray(f.Images) && f.Images.length > 0) {
        images = f.Images.map((img) => img.url);
      } else if (f.ImagePathList) {
        images = f.ImagePathList.split(",").map((img) => img.trim()).filter(Boolean);
      }

      const scope = f.Scope ? f.Scope.split(",").map((s) => s.trim()).filter(Boolean) : [];

      return {
        id: rec.id, // Return Airtable record ID for deletion and edit keys
        numericId: f.Id ? Number(f.Id) : 0,
        title: f.Title || "",
        category: f.Category || "BRANDING",
        imageUrl: images[0] || "",
        client: f.Client || "",
        description: f.Description || "",
        year: f.Year || "",
        scope: scope,
        details: f.Details || "",
        createdAt: rec.createdTime,
      };
    });

    // Sort by numeric ID descending (newest first), falling back to creation time descending
    mappedProjects.sort((a, b) => {
      const aId = a.numericId || 0;
      const bId = b.numericId || 0;
      if (aId !== bId) {
        return bId - aId;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return Response.json(mappedProjects);
  } catch (err) {
    console.error("GET Admin Portfolio Error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = isAuthenticated(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const baseId = process.env.AIRTABLE_BASE_ID;
    const writeKey = process.env.AIRTABLE_WRITE_API_KEY;
    const tableName = "Portfolio";

    if (!baseId || !writeKey) {
      return Response.json({ error: "Airtable write credentials are missing" }, { status: 500 });
    }

    const body = await request.json();
    const { title, category, imageUrl, description, client, year, scope, details } = body;

    if (!title || !category || !imageUrl) {
      return Response.json({ error: "Title, category, and image URL are required" }, { status: 400 });
    }

    // Determine the next numeric Id
    let nextId = 1;
    try {
      const getRes = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?pageSize=100&fields[]=Id`, {
        headers: { Authorization: `Bearer ${writeKey}` },
      });
      if (getRes.ok) {
        const getData = await getRes.json();
        const ids = (getData.records || [])
          .map(r => Number(r.fields.Id))
          .filter(id => !isNaN(id));
        if (ids.length > 0) {
          nextId = Math.max(...ids) + 1;
        }
      }
    } catch (e) {
      console.warn("Failed to determine next numeric Id, defaulting to 1:", e);
    }

    const scopeStr = Array.isArray(scope) ? scope.join(", ") : scope || "";

    const res = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${writeKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Id: nextId,
              Title: title,
              Category: category,
              ImagePathList: imageUrl,
              Images: [
                {
                  url: imageUrl
                }
              ],
              Description: description || "",
              Client: client || title,
              Year: Number(year) || new Date().getFullYear(),
              Scope: scopeStr,
              Details: details || "",
            },
          },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Airtable POST error:", errText);
      return Response.json({ error: "Failed to save to Airtable" }, { status: 502 });
    }

    const data = await res.json();
    const createdRecord = data.records?.[0];

    return Response.json({ success: true, id: createdRecord?.id });
  } catch (err) {
    console.error("POST Admin Portfolio Error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = isAuthenticated(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const baseId = process.env.AIRTABLE_BASE_ID;
    const writeKey = process.env.AIRTABLE_WRITE_API_KEY;
    const tableName = "Portfolio";

    if (!baseId || !writeKey) {
      return Response.json({ error: "Airtable write credentials are missing" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id"); // Airtable record ID (e.g. recXXXXX)

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    let imageUrlToClean = null;
    try {
      const getRes = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${id}`, {
        headers: { Authorization: `Bearer ${writeKey}` },
      });
      if (getRes.ok) {
        const record = await getRes.json();
        imageUrlToClean = record.fields?.ImagePathList || record.fields?.Images?.[0]?.url || null;
      }
    } catch (e) {
      console.warn("Failed to fetch record before delete (continuing):", e);
    }

    const res = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${writeKey}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Airtable DELETE error:", errText);
      return Response.json({ error: "Failed to delete from Airtable" }, { status: 502 });
    }

    await deleteStorageFileIfOwned(imageUrlToClean);

    return Response.json({ success: true });
  } catch (err) {
    console.error("DELETE Admin Portfolio Error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = isAuthenticated(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const baseId = process.env.AIRTABLE_BASE_ID;
    const writeKey = process.env.AIRTABLE_WRITE_API_KEY;
    const tableName = "Portfolio";

    if (!baseId || !writeKey) {
      return Response.json({ error: "Airtable write credentials are missing" }, { status: 500 });
    }

    const body = await request.json();
    const { id, title, category, imageUrl, description, client, year, scope, details } = body;

    if (!id || !title || !category) {
      return Response.json({ error: "ID, Title, and Category are required" }, { status: 400 });
    }

    let oldImageUrl = null;
    if (imageUrl) {
      try {
        const getRes = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${id}`, {
          headers: { Authorization: `Bearer ${writeKey}` },
        });
        if (getRes.ok) {
          const record = await getRes.json();
          oldImageUrl = record.fields?.ImagePathList || record.fields?.Images?.[0]?.url || null;
        }
      } catch (e) {
        console.warn("Failed to fetch record before update (continuing):", e);
      }
    }

    const scopeStr = Array.isArray(scope) ? scope.join(", ") : scope || "";

    const fields = {
      Title: title,
      Category: category,
      Description: description || "",
      Client: client || title,
      Year: Number(year) || new Date().getFullYear(),
      Scope: scopeStr,
      Details: details || "",
    };

    if (imageUrl) {
      fields.ImagePathList = imageUrl;
      fields.Images = [
        {
          url: imageUrl
        }
      ];
    }

    const res = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${writeKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Airtable PATCH portfolio error:", errText);
      return Response.json({ error: "Failed to update project in Airtable" }, { status: 502 });
    }

    if (imageUrl && oldImageUrl && oldImageUrl !== imageUrl) {
      await deleteStorageFileIfOwned(oldImageUrl);
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("PUT Admin Portfolio Error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
