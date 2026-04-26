import { getDict } from "@/lib/i18n";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingShell } from "@/components/landing/LandingShell";
import { LandingHero } from "@/components/landing/LandingHero";
import dynamic from "next/dynamic";

const SocialProof = dynamic(() => import("@/components/landing/SocialProof").then(m => m.SocialProof));
const LandingGallery = dynamic(() => import("@/components/landing/LandingGallery").then(m => m.LandingGallery));
const LandingTiers = dynamic(() => import("@/components/landing/LandingTiers").then(m => m.LandingTiers));
const LandingReservationForm = dynamic(() => import("@/components/landing/LandingReservationForm").then(m => m.LandingReservationForm));
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
        <SocialProof dict={d.social} />
        <LandingGallery dict={d.gallery} />
        <LandingTiers dict={d.tiers} />
        <LandingReservationForm dict={d.form} locale={locale} />
        <LandingFaq dict={d.faq} />
      </LandingShell>
    </>
  );
}
