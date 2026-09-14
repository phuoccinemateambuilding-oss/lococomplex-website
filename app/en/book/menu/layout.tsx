import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const META_TITLE = "Flip Through the LOCO Complex Menu — 5 Pages";
const META_DESCRIPTION =
  "Flip through the LOCO Complex menu: signature cocktails, snacks, whisky, sparkling and Special Menu combos. 11 Nam Quoc Cang, District 1. Free reservation.";

export const metadata: Metadata = {
  title: { absolute: META_TITLE },
  description: META_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/en/book/menu`,
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
    url: `${SITE_URL}/en/book/menu`,
    siteName: "LOCO Complex",
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/assets/loco/menu-book/loco-menu-01.webp`,
        width: 1200,
        height: 1820,
        alt: "LOCO Complex menu — page 1 / 5",
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

export default function BookMenuLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
