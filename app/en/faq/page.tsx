import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import { FaqPage } from "@/components/FaqPage";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";

const title = "FAQ — LOCO Complex | Opening Hours, Prices, Reservations";
const description =
  "Top 10 questions about LOCO Complex: opening hours 6 PM – Midnight, address 11 Nam Quoc Cang District 1, VIP table prices, dress code, reservations, private events. Hotline +84 866 433 754.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "LOCO Complex FAQ",
    "LOCO Complex opening hours",
    "LOCO Complex dress code",
    "LOCO Complex VIP price",
    "LOCO Complex reservation",
    "LOCO Heatroom hours",
    "LOCO Complex District 1",
  ],
  alternates: {
    canonical: "/en/faq",
    languages: { vi: "/faq", en: "/en/faq", "x-default": "/faq" },
  },
  openGraph: {
    title,
    description,
    url: "/en/faq",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  const locale = "en";
  const t = getDict(locale);

  return (
    <>
      <Navbar locale={locale} t={t.nav} currentPath="/en/faq" />
      <FaqPage locale={locale} />
      <Footer locale={locale} t={{ footer: t.footer, nav: t.nav }} />
      <FloatingContacts />
    </>
  );
}
