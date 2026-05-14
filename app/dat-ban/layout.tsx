import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDict("vi");
  return {
    title: t.datban.metaTitle,
    description: t.datban.metaDescription,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${SITE_URL}/dat-ban`,
      languages: {
        vi: `${SITE_URL}/dat-ban`,
        en: `${SITE_URL}/en/book`,
      },
    },
    openGraph: {
      type: "website",
      title: t.datban.metaTitle,
      description: t.datban.metaDescription,
      url: `${SITE_URL}/dat-ban`,
      siteName: "LOCO Complex",
      locale: "vi_VN",
      alternateLocale: "en_US",
      images: [
        {
          url: `${SITE_URL}/og.jpg`,
          width: 1200,
          height: 630,
          alt: "LOCO Complex — Đặt bàn giữ chỗ miễn phí · 11 Nam Quốc Cang, Quận 1",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t.datban.metaTitle,
      description: t.datban.metaDescription,
      images: [`${SITE_URL}/og.jpg`],
    },
  };
}

export default function DatBanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
