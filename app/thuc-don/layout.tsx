import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

const META_TITLE = "Thực đơn — LOCO Complex";
const META_DESCRIPTION =
  "Thực đơn LOCO Complex — bộ menu BITES F&B của khu giải trí NEWTRO tại 11 Nam Quốc Cang, Quận 1. Snack, refreshments, đồ uống signature. Đặt bàn giữ chỗ trước miễn phí.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/thuc-don`,
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    type: "website",
    title: META_TITLE,
    description: META_DESCRIPTION,
    url: `${SITE_URL}/thuc-don`,
    siteName: "LOCO Complex",
    locale: "vi_VN",
    images: [
      {
        url: `${SITE_URL}/og.jpg`,
        width: 1200,
        height: 630,
        alt: "Thực đơn LOCO Complex — make impossible · Quận 1, Sài Gòn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [`${SITE_URL}/og.jpg`],
  },
};

export default function ThucDonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
