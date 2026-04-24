import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import HomePage from "@/components/HomePage";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "LOCO Complex — Entertainment & Music Venue · District 1, Saigon",
  description:
    "LOCO Complex — NEWTRO-style entertainment complex at 11 Nam Quoc Cang, District 1, Saigon. 2-floor club: Heatroom (EDM, Top 40, House) + Hip-hop. Dining by BITES. Open 6 PM – 12 AM. Book a table: 0866 433 754.",
  keywords: [
    "LOCO Complex",
    "LOCO Heatroom",
    "LOCO District 1",
    "LOCO Saigon",
    "entertainment complex District 1 Saigon",
    "nightclub Saigon",
    "music venue Ho Chi Minh City",
    "EDM club District 1",
    "Hip-hop club Saigon",
    "club Nam Quoc Cang",
  ],
  alternates: {
    canonical: "/en",
    languages: { vi: "/", en: "/en", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    title: "LOCO Complex — Entertainment & Music Venue · District 1, Saigon",
    description:
      "NEWTRO-style entertainment complex at 11 Nam Quoc Cang. 2-floor club (Heatroom · Hip-hop) + BITES F&B. Book: 0866 433 754.",
    siteName: "LOCO Complex",
    locale: "en_US",
    alternateLocale: "vi_VN",
    url: "/en",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "LOCO Complex District 1 Saigon" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LOCO Complex — District 1 Saigon",
    description: "NEWTRO entertainment · 2-floor club · BITES F&B · Book 0866 433 754",
    images: ["/og.jpg"],
  },
};

export default function Page() {
  const locale = "en";
  const t = getDict(locale);

  return (
    <>
      <JsonLd locale={locale} />
      <Navbar locale={locale} t={t.nav} currentPath="/en" />
      <main className="flex-1">
        <HomePage locale={locale} t={t} />
      </main>
      <Footer locale={locale} t={{ footer: t.footer, nav: t.nav }} />
      <FloatingContacts />
    </>
  );
}
