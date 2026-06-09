import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingShell } from "@/components/landing/LandingShell";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingAbout } from "@/components/landing/LandingAbout";
import { LandingMenuTeaser } from "@/components/landing/LandingMenuTeaser";
import { LazyMount } from "@/components/LazyMount";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import dynamic from "next/dynamic";

const LandingGallery = dynamic(() => import("@/components/landing/LandingGallery").then(m => m.LandingGallery));
const LandingReservationForm = dynamic(() => import("@/components/landing/LandingReservationForm").then(m => m.LandingReservationForm), {
  loading: () => <div id="form" className="min-h-[600px]" aria-hidden="true" />,
});
const SocialProof = dynamic(() => import("@/components/landing/SocialProof").then(m => m.SocialProof));
const LandingFaq = dynamic(() => import("@/components/landing/LandingFaq").then(m => m.LandingFaq));
const ReservationJsonLd = dynamic(() => import("@/components/landing/ReservationJsonLd").then(m => m.ReservationJsonLd));

export const metadata: Metadata = {
  title: "Đặt bàn LOCO Complex — Khu Giải Trí NEWTRO · 11 Nam Quốc Cang, Quận 1",
  description:
    "Đặt bàn LOCO Complex online — khu phức hợp giải trí NEWTRO tại 11 Nam Quốc Cang, Quận 1, Sài Gòn. 2 tầng club: Heatroom (EDM, Top 40, House) + Hip-hop. Mở cửa 22:00 – 05:00. Hotline 0332 073 354.",
  alternates: {
    canonical: "/dat-ban",
    languages: {
      vi: "/dat-ban",
      en: "/en/book",
      "x-default": "/dat-ban",
    },
  },
  openGraph: {
    title: "Đặt bàn LOCO Complex — Khu Giải Trí NEWTRO · Quận 1, Sài Gòn",
    description:
      "Đặt bàn LOCO Complex — 2 tầng club Heatroom + Hip-hop tại 11 Nam Quốc Cang, Q.1. Mở cửa 22:00 – 05:00. Hotline 0332 073 354.",
    url: "/dat-ban",
  },
};

export default function DatBanPage() {
  const locale = "vi";
  const t = getDict(locale);
  const d = t.datban;

  return (
    <>
      <ReservationJsonLd locale={locale} />
      <BreadcrumbJsonLd items={[{ name: "Trang chủ", path: "/" }, { name: "Đặt bàn", path: "/dat-ban" }]} />
      <LandingHeader dict={d.header} />
      <LandingShell stickyDict={d.sticky} footerText={d.footer} locale={locale}>
        <LandingHero dict={d.hero} locale={locale} />
        <LandingAbout />
        <LazyMount minHeight="960px" id="menu-lazy" rootMargin="100px">
          <LandingMenuTeaser />
        </LazyMount>
        <LazyMount minHeight="600px" id="gallery-lazy">
          <LandingGallery dict={d.gallery} />
        </LazyMount>
        <LandingReservationForm dict={d.form} locale={locale} />
        <LazyMount minHeight="500px" id="social-lazy">
          <SocialProof dict={d.social} />
        </LazyMount>
        <LazyMount minHeight="400px" id="faq-lazy">
          <LandingFaq dict={d.faq} />
        </LazyMount>
      </LandingShell>
    </>
  );
}
