import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";
import Reveal from "@/components/Reveal";
import ImageSlider from "@/components/ImageSlider";
import { galleryImages, spaceImages } from "@/lib/images";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "Gallery — Space & Moments · LOCO Complex",
  description:
    "Space albums for both club floors (Heatroom · Hip-hop) and nightlife moments at LOCO Complex — 11 Nam Quoc Cang, District 1, Saigon.",
  keywords: [
    "LOCO Complex gallery",
    "LOCO Heatroom interior",
    "club District 1 photos",
    "entertainment venue Saigon images",
  ],
  alternates: {
    canonical: "/en/gallery",
    languages: { vi: "/hinh-anh", en: "/en/gallery", "x-default": "/hinh-anh" },
  },
  openGraph: {
    title: "Gallery — LOCO Complex Space & Moments",
    description: "2 club floors · BITES F&B · nightlife moments in District 1 Saigon.",
    url: "/en/gallery",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "LOCO Complex gallery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery — LOCO Complex",
    description: "Space + nightlife moments",
    images: ["/og.jpg"],
  },
};

export default function GalleryPage() {
  const locale = "en";
  const t = getDict(locale);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/en" },
          { name: "Gallery", path: "/en/gallery" },
        ]}
      />
      <Navbar locale={locale} t={t.nav} currentPath="/en/gallery" />
      <main className="flex-1 pt-24">
        <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-32">
          <Reveal>
            <p className="font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.2em] text-ink/70 mb-4">
              {t.gallery.eyebrow}
            </p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-ink mb-16">
              {t.gallery.heading}
            </h1>
          </Reveal>

          <div className="mb-20">
            <Reveal>
              <ImageSlider images={spaceImages} title="Space" />
            </Reveal>
          </div>

          <div>
            <Reveal>
              <ImageSlider images={galleryImages} title="Moments" />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer locale={locale} t={{ footer: t.footer, nav: t.nav }} />
      <FloatingContacts />
    </>
  );
}
