import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const GALLERY_COUNT = 33;
const MENU_COUNT = 5;

const galleryImages = Array.from(
  { length: GALLERY_COUNT },
  (_, i) => `${SITE_URL}/assets/loco/gallery/gallery-${String(i + 1).padStart(2, "0")}.jpg`
);

const menuImages = Array.from(
  { length: MENU_COUNT },
  (_, i) => `${SITE_URL}/assets/loco/menu-book/loco-menu-${String(i + 1).padStart(2, "0")}.webp`
);

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  // 19/10/2026 — trước dùng ngày build (new Date): mọi URL luôn 'vừa sửa' nên Google bỏ qua lastmod.
  // Giờ ghi ngày nội dung thật; sửa nội dung trang nào thì cập nhật đúng dòng đó.
  const routes: (MetadataRoute.Sitemap[number] & { changed: string })[] = [
    // VI (default)
    { url: `${base}/`, changeFrequency: "weekly", priority: 1.0, images: [`${base}/og.jpg`], changed: "2026-10-23" },
    { url: `${base}/hinh-anh`, changeFrequency: "weekly", priority: 0.8, images: galleryImages, changed: "2026-04-24" },
    { url: `${base}/menu`, changeFrequency: "monthly", priority: 0.7, images: menuImages, changed: "2026-09-15" },
    { url: `${base}/lien-he`, changeFrequency: "monthly", priority: 0.9, changed: "2026-08-23" },
    { url: `${base}/faq`, changeFrequency: "monthly", priority: 0.7, changed: "2026-10-01" },
    { url: `${base}/dat-ban`, changeFrequency: "monthly", priority: 1.0, images: [`${base}/og.jpg`], changed: "2026-10-10" },
    { url: `${base}/dat-ban/menu`, changeFrequency: "monthly", priority: 0.85, images: menuImages, changed: "2026-09-15" },
    { url: `${base}/chinh-sach-bao-mat`, changeFrequency: "yearly", priority: 0.3, changed: "2026-08-23" },
    { url: `${base}/dieu-khoan`, changeFrequency: "yearly", priority: 0.3, changed: "2026-09-17" },
    // EN
    { url: `${base}/en`, changeFrequency: "weekly", priority: 0.9, images: [`${base}/og.jpg`], changed: "2026-10-23" },
    { url: `${base}/en/gallery`, changeFrequency: "weekly", priority: 0.7, images: galleryImages, changed: "2026-04-24" },
    { url: `${base}/en/menu`, changeFrequency: "monthly", priority: 0.6, images: menuImages, changed: "2026-09-15" },
    { url: `${base}/en/contact`, changeFrequency: "monthly", priority: 0.8, changed: "2026-08-23" },
    { url: `${base}/en/faq`, changeFrequency: "monthly", priority: 0.6, changed: "2026-10-01" },
    { url: `${base}/en/book`, changeFrequency: "monthly", priority: 0.9, images: [`${base}/og.jpg`], changed: "2026-10-10" },
    { url: `${base}/en/book/menu`, changeFrequency: "monthly", priority: 0.75, images: menuImages, changed: "2026-09-15" },
    { url: `${base}/en/privacy`, changeFrequency: "yearly", priority: 0.3, changed: "2026-08-23" },
    { url: `${base}/en/terms`, changeFrequency: "yearly", priority: 0.3, changed: "2026-09-17" },
  ];

  return routes.map(({ changed, ...r }) => ({ ...r, lastModified: new Date(`${changed}T12:00:00+07:00`) }));
}
