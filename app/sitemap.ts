import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const now = new Date();

  const routes = [
    // VI (default)
    { url: `${base}/`, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${base}/hinh-anh`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/menu`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}/lien-he`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${base}/faq`, changeFrequency: "monthly" as const, priority: 0.7 },
    // EN
    { url: `${base}/en`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/en/gallery`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${base}/en/menu`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/en/contact`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${base}/en/faq`, changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  return routes.map((r) => ({ ...r, lastModified: now }));
}
