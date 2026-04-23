import { getDict } from "@/lib/i18n";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingShell } from "@/components/landing/LandingShell";
import { LandingHero } from "@/components/landing/LandingHero";
import { SocialProof } from "@/components/landing/SocialProof";
import { LandingGallery } from "@/components/landing/LandingGallery";
import { FormCtaBanner } from "@/components/landing/FormCtaBanner";
import { LandingReservationForm } from "@/components/landing/LandingReservationForm";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { ReservationJsonLd } from "@/components/landing/ReservationJsonLd";

export default function DatBanPage() {
  const locale = "vi";
  const t = getDict(locale);
  const d = t.datban;

  return (
    <>
      <ReservationJsonLd locale={locale} />
      <LandingHeader dict={d.header} />
      <LandingShell stickyDict={d.sticky} footerText={d.footer}>
        <LandingHero dict={d.hero} locale={locale} />
        <SocialProof dict={d.social} />
        <LandingGallery dict={d.gallery} />
        <FormCtaBanner dict={d.banner} />
        <LandingReservationForm dict={d.form} locale={locale} />
        <LandingFaq dict={d.faq} />
      </LandingShell>
    </>
  );
}
