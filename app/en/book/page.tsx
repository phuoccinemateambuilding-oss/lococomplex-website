import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingShell } from "@/components/landing/LandingShell";
import { LandingHero } from "@/components/landing/LandingHero";
import { LazyMount } from "@/components/LazyMount";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import dynamic from "next/dynamic";

const SocialProof = dynamic(() => import("@/components/landing/SocialProof").then(m => m.SocialProof));
const LandingGallery = dynamic(() => import("@/components/landing/LandingGallery").then(m => m.LandingGallery));
const FormCtaBanner = dynamic(() => import("@/components/landing/FormCtaBanner").then(m => m.FormCtaBanner));
const LandingReservationForm = dynamic(() => import("@/components/landing/LandingReservationForm").then(m => m.LandingReservationForm), {
  loading: () => <div id="form" className="min-h-[600px]" aria-hidden="true" />,
});
const LandingFaq = dynamic(() => import("@/components/landing/LandingFaq").then(m => m.LandingFaq));
const ReservationJsonLd = dynamic(() => import("@/components/landing/ReservationJsonLd").then(m => m.ReservationJsonLd));

export const metadata: Metadata = {
  title: "Book LOCO Complex — NEWTRO Entertainment Complex · 11 Nam Quoc Cang, District 1",
  description:
    "Book LOCO Complex online — NEWTRO-style entertainment complex at 11 Nam Quoc Cang, District 1, Saigon. 2-floor club: Heatroom (EDM, Top 40, House) + Hip-hop. Open 10:00 PM – 5:00 AM. Hotline 091 4271 564.",
  alternates: {
    canonical: "/en/book",
    languages: {
      vi: "/dat-ban",
      en: "/en/book",
      "x-default": "/dat-ban",
    },
  },
  openGraph: {
    title: "Book LOCO Complex — NEWTRO Entertainment Complex · District 1, Saigon",
    description:
      "Book LOCO Complex — 2-floor club Heatroom + Hip-hop at 11 Nam Quoc Cang, D.1. Open 10:00 PM – 5:00 AM. Hotline 091 4271 564.",
    url: "/en/book",
  },
};

export default function BookPage() {
  const locale = "en";
  const t = getDict(locale);
  const d = t.datban;

  return (
    <>
      <ReservationJsonLd locale={locale} />
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/en" }, { name: "Book", path: "/en/book" }]} />
      <LandingHeader dict={d.header} />
      <LandingShell stickyDict={d.sticky} footerText={d.footer} locale={locale}>
        <LandingHero dict={d.hero} locale={locale} />
        <LazyMount minHeight="500px" id="social-lazy">
          <SocialProof dict={d.social} />
        </LazyMount>
        <LazyMount minHeight="600px" id="gallery-lazy">
          <LandingGallery dict={d.gallery} />
        </LazyMount>
        <FormCtaBanner dict={d.banner} />
        <LandingReservationForm dict={d.form} locale={locale} />
        <LazyMount minHeight="400px" id="faq-lazy">
          <LandingFaq dict={d.faq} />
        </LazyMount>
      </LandingShell>
    </>
  );
}
