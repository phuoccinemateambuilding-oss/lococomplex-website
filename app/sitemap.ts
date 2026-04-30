import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const GALLERY_COUNT = 33;
const MENU_COUNT = 11;

const galleryImages = Array.from(
  { length: GALLERY_COUNT },
  (_, i) => `${SITE_URL}/assets/loco/gallery/gallery-${String(i + 1).padStart(2, "0")}.jpg`
);

const menuImages = Array.from(
  { length: MENU_COUNT },
  (_, i) => `${SITE_URL}/assets/loco/menu/menu-${String(i + 1).padStart(2, "0")}.webp`
);

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    // VI (default)
    { url: `${base}/`, changeFrequency: "weekly", priority: 1.0, images: [`${base}/og.jpg`] },
    { url: `${base}/hinh-anh`, changeFrequency: "weekly", priority: 0.8, images: galleryImages },
    { url: `${base}/menu`, changeFrequency: "monthly", priority: 0.7, images: menuImages },
    { url: `${base}/lien-he`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/faq`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/dat-ban`, changeFrequency: "monthly", priority: 1.0, images: [`${base}/og.jpg`] },
    { url: `${base}/chinh-sach-bao-mat`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/dieu-khoan`, changeFrequency: "yearly", priority: 0.3 },
    // EN
    { url: `${base}/en`, changeFrequency: "weekly", priority: 0.9, images: [`${base}/og.jpg`] },
    { url: `${base}/en/gallery`, changeFrequency: "weekly", priority: 0.7, images: galleryImages },
    { url: `${base}/en/menu`, changeFrequency: "monthly", priority: 0.6, images: menuImages },
    { url: `${base}/en/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/en/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/en/book`, changeFrequency: "monthly", priority: 0.9, images: [`${base}/og.jpg`] },
    { url: `${base}/en/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/en/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  return routes.map((r) => ({ ...r, lastModified: now }));
}
