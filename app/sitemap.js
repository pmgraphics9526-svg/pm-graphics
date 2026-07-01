export default function sitemap() {
  const base = "https://pmgraphics.in";
  return [
    { url: base,            lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/terms`,   lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];
}
