import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// Route chốt 2026-08-01: /dat-ban/menu (EN: /en/book/menu).
// BẮT BUỘC giữ layout này kể cả khi trông "thừa" — nó chặn app/dat-ban/layout.tsx
// (metadata + shell của landing) đè lên trang immersive position:fixed.
const META_TITLE = "Lật Xem Menu LOCO Complex — Thực đơn 5 Trang";
const META_DESCRIPTION =
  "Lật từng trang thực đơn LOCO Complex: cocktail signature, snack, whisky, sparkling và Special Menu combo. 11 Nam Quốc Cang, Quận 1. Đặt bàn giữ chỗ miễn phí.";

export const metadata: Metadata = {
  title: { absolute: META_TITLE },
  description: META_DESCRIPTION,
  keywords: [
    "menu LOCO Complex",
    "thực đơn LOCO Complex",
    "bảng giá LOCO Complex",
    "menu LOCO Heatroom",
    "giá bàn LOCO Quận 1",
    "menu club Quận 1",
  ],
  alternates: {
    canonical: `${SITE_URL}/dat-ban/menu`,
    languages: {
      vi: `${SITE_URL}/dat-ban/menu`,
      en: `${SITE_URL}/en/book/menu`,
      "x-default": `${SITE_URL}/dat-ban/menu`,
    },
  },
  openGraph: {
    type: "website",
    title: META_TITLE,
    description: META_DESCRIPTION,
    url: `${SITE_URL}/dat-ban/menu`,
    siteName: "LOCO Complex",
    locale: "vi_VN",
    images: [
      {
        url: `${SITE_URL}/assets/loco/menu-book/loco-menu-01.webp`,
        width: 1200,
        height: 1820,
        alt: "Thực đơn LOCO Complex — trang 1 / 5",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [`${SITE_URL}/assets/loco/menu-book/loco-menu-01.webp`],
  },
  robots: { index: true, follow: true },
};

export default function MenuLatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
