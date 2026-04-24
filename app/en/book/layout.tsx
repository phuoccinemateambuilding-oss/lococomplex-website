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
  };
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
