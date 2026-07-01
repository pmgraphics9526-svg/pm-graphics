export const revalidate = 300;

import { projects as fallbackProjects } from "@/components/projectsData";

export async function GET() {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const readKey = process.env.AIRTABLE_READ_API_KEY;
    const tableName = "Portfolio";

    if (!baseId || !readKey) {
      console.warn("[GET /api/portfolio] Missing Airtable configuration. Falling back to local projects data.");
      return Response.json(fallbackProjects);
    }

    let allRecords = [];
    let offset = "";
    let hasMore = true;

    // Fetch all pages from Airtable
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
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("[GET /api/portfolio] Airtable error:", errText);
        // If Airtable is failing or misconfigured, fallback to local projects
        return Response.json(fallbackProjects);
      }

      const data = await res.json();
      allRecords = allRecords.concat(data.records || []);
      
      if (data.offset) {
        offset = data.offset;
      } else {
        hasMore = false;
      }
    }

    // Filter out blank records that have no Title or no Category
    const validRecords = allRecords.filter(rec => rec.fields.Title && rec.fields.Category);

    if (validRecords.length === 0) {
      console.warn("[GET /api/portfolio] Airtable table has no valid records. Falling back to local data.");
      return Response.json(fallbackProjects);
    }

    // Map Airtable records back to the frontend project structure
    const mappedProjects = validRecords.map((rec, index) => {
      const f = rec.fields;

      // Extract image array: check attachments first, then fallback to ImagePathList text field
      let images = [];
      if (f.Images && Array.isArray(f.Images) && f.Images.length > 0) {
        images = f.Images.map((img) => img.url);
      } else if (f.ImagePathList) {
        images = f.ImagePathList.split(",")
          .map((img) => img.trim())
          .filter(Boolean);
      }

      const normalizeImagePath = (originalPath) => {
        if (!originalPath || typeof originalPath !== 'string') return originalPath;
        if (!originalPath.startsWith('/projects/')) return originalPath;
        
        const parts = originalPath.split('/');
        const normalizedParts = parts.map((part, index) => {
          if (index === 0) return part;
          if (index === 1 && part.toLowerCase() === 'projects') return 'projects';
          
          if (part.toUpperCase() === 'BRANDING') return 'BRANDING';
          if (part.toUpperCase() === 'FLYERS') return 'FLYERS';
          if (part.toLowerCase() === 'corporate') return 'Corporate';
          
          if (index === parts.length - 1) {
            const lastDot = part.lastIndexOf('.');
            if (lastDot !== -1) {
              const name = part.substring(0, lastDot).trim();
              const ext = part.substring(lastDot);
              return name.toLowerCase().replace(/ /g, '-') + ext;
            }
          }
          
          return part.trim().toLowerCase().replace(/ /g, '-');
        });
        
        return normalizedParts.join('/');
      };

      images = images.map(normalizeImagePath);

      // Map scope: split comma-separated text into array
      const scope = f.Scope
        ? f.Scope.split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      return {
        // Use an integer id if possible or generate one, but keep compatibility with logo-clicking (e.g. 6, 2, 3)
        // Since we lookup project by ID, we'll try to parse index or map it, or use record ID if no match.
        // For the logo click to work, B&S needs to be id: 6, AAWCA id: 2, BF id: 3.
        // Let's store an explicit 'Id' field in Airtable, and fallback to parsing from Title or using index!
        id: f.Id ? Number(f.Id) : (index + 1), 
        title: f.Title || "",
        category: f.Category || "",
        client: f.Client || "",
        image: images[0] || "",
        images: images,
        description: f.Description || "",
        year: f.Year || "",
        scope: scope,
        details: f.Details || "",
        hideDetails: !!f.HideDetails,
        videoUrl: f.VideoUrl || "",
        colSpan: f.ColSpan || "col-4"
      };
    });

    // Sort projects by ID descending (newest first)
    mappedProjects.sort((a, b) => b.id - a.id);

    return Response.json(mappedProjects);
  } catch (err) {
    console.error("[GET /api/portfolio] Unexpected error:", err);
    return Response.json(fallbackProjects);
  }
}
