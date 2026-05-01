import { getDict } from "@/lib/i18n";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingShell } from "@/components/landing/LandingShell";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingMenuTeaser } from "@/components/landing/LandingMenuTeaser";
import { LazyMount } from "@/components/LazyMount";
import dynamic from "next/dynamic";

const LandingGallery = dynamic(() => import("@/components/landing/LandingGallery").then(m => m.LandingGallery));
const LandingReservationForm = dynamic(() => import("@/components/landing/LandingReservationForm").then(m => m.LandingReservationForm), {
  loading: () => <div id="form" className="min-h-[600px]" aria-hidden="true" />,
});
const SocialProof = dynamic(() => import("@/components/landing/SocialProof").then(m => m.SocialProof));
const LandingFaq = dynamic(() => import("@/components/landing/LandingFaq").then(m => m.LandingFaq));
const ReservationJsonLd = dynamic(() => import("@/components/landing/ReservationJsonLd").then(m => m.ReservationJsonLd));

export default function DatBanPage() {
  const locale = "vi";
  const t = getDict(locale);
  const d = t.datban;

  return (
    <>
      <ReservationJsonLd locale={locale} />
      <LandingHeader dict={d.header} />
      <LandingShell stickyDict={d.sticky} footerText={d.footer} locale={locale}>
        <LandingHero dict={d.hero} locale={locale} />
        <LazyMount minHeight="600px" id="gallery-lazy">
          <LandingGallery dict={d.gallery} />
        </LazyMount>
        <LandingMenuTeaser />
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
