import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDict("en");
  return {
    title: t.datban.metaTitle,
    description: t.datban.metaDescription,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${SITE_URL}/en/book`,
      languages: {
        vi: `${SITE_URL}/dat-ban`,
        en: `${SITE_URL}/en/book`,
      },
    },
    openGraph: {
      type: "website",
      title: t.datban.metaTitle,
      description: t.datban.metaDescription,
      url: `${SITE_URL}/en/book`,
      siteName: "LOCO Complex",
      locale: "en_US",
      alternateLocale: "vi_VN",
      images: [
        {
          url: `${SITE_URL}/og.jpg`,
          width: 1200,
          height: 630,
          alt: "LOCO Complex — Book a table · 11 Nam Quoc Cang, District 1, Saigon",
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

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
