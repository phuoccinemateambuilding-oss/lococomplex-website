import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import { FaqPage } from "@/components/FaqPage";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";

const title = "Câu hỏi thường gặp — LOCO Complex | Giờ mở cửa, giá, đặt bàn";
const description =
  "10 câu hỏi thường gặp về LOCO Complex: giờ mở cửa 18:00 – 00:00, địa chỉ 11 Nam Quốc Cang Quận 1, giá bàn VIP, dress code, đặt bàn, sự kiện riêng. Hotline 0866 433 754.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "faq LOCO Complex",
    "câu hỏi LOCO Complex",
    "giờ mở cửa LOCO Complex",
    "dress code LOCO Complex",
    "giá LOCO Complex",
    "đặt bàn LOCO Complex",
    "LOCO Complex sự kiện",
    "LOCO Heatroom giờ mở",
  ],
  alternates: {
    canonical: "/faq",
    languages: { vi: "/faq", en: "/en/faq", "x-default": "/faq" },
  },
  openGraph: {
    title,
    description,
    url: "/faq",
    locale: "vi_VN",
    type: "website",
  },
};

export default function Page() {
  const locale = "vi";
  const t = getDict(locale);

  return (
    <>
      <Navbar locale={locale} t={t.nav} currentPath="/faq" />
      <FaqPage locale={locale} />
      <Footer locale={locale} t={{ footer: t.footer, nav: t.nav }} />
      <FloatingContacts />
    </>
  );
}
