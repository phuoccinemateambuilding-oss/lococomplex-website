import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";
import Reveal from "@/components/Reveal";
import MusicTag from "@/components/MusicTag";
import StickerTag from "@/components/StickerTag";
import GeometricShape from "@/components/GeometricShape";
import { routeMap } from "@/lib/i18n";
import { menuPageSrc, spaceImages, galleryImages } from "@/lib/images";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { MenuJsonLd } from "@/components/MenuJsonLd";
import { MenuPagesSection } from "@/components/MenuPagesSection";

export const metadata: Metadata = {
  title: { absolute: "LOCO Complex Menu — Drinks & Price List, District 1" },
  description:
    "The LOCO Complex menu: signature cocktails, snacks, whisky, vodka, gin, tequila, sparkling and Special Menu combos — 11 Nam Quoc Cang, District 1, Saigon.",
  keywords: [
    "LOCO Complex menu",
    "LOCO Complex price list",
    "LOCO Heatroom menu",
    "club menu District 1 Saigon",
    "LOCO Complex cocktails",
  ],
  alternates: {
    canonical: "/en/menu",
    languages: { vi: "/menu", en: "/en/menu", "x-default": "/menu" },
  },
  openGraph: {
    title: "LOCO Complex Menu — Drinks & Price List",
    description: "Signature cocktails, snacks, whisky, sparkling and Special Menu combos at LOCO Complex, District 1.",
    url: "/en/menu",
    locale: "en_US",
    type: "website",
    images: [{ url: "/assets/loco/menu-book/loco-menu-01.webp", width: 1200, height: 1820, alt: "LOCO Complex menu — page 1 / 5" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LOCO Complex Menu — Drinks & Price List",
    description: "Signature cocktails · Snacks · Whisky · Sparkling · Special Menu combos",
    images: ["/assets/loco/menu-book/loco-menu-01.webp"],
  },
};

export default function MenuPage() {
  const locale = "en";
  const t = getDict(locale);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/en" },
          { name: "Menu", path: "/en/menu" },
        ]}
      />
      <MenuJsonLd locale="en" pages={t.menuPage.pages} />
      <Navbar locale={locale} t={t.nav} currentPath="/en/menu" />
      <main className="flex-1 pt-20">
        {/* Hero — cinematic with venue photo */}
        <section className="relative min-h-[50vh] overflow-hidden bg-ink flex items-end">
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={spaceImages[0].src} alt="" className="w-full h-full object-cover opacity-30" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
          </div>
          <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 pb-16 pt-32 w-full">
            <Reveal>
              <p className="font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.25em] text-loco-yellow mb-4">
                {t.menuPage.eyebrow}
              </p>
              <h1 className="font-[family-name:var(--font-bebas-neue)] text-7xl md:text-9xl tracking-tight text-white">
                {t.menuPage.heading}
              </h1>
            </Reveal>
          </div>
        </section>

        {/* Two Floors — immersive cards with large photos */}
        <section className="bg-ink py-24 md:py-32">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <Reveal>
              <p className="font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.25em] text-baby-blue mb-4">
                {t.music.eyebrow}
              </p>
              <h2 className="font-bold text-4xl md:text-6xl tracking-tight text-white mb-16">
                {t.music.heading}
              </h2>
            </Reveal>

            {/* Floor 1 — full width hero-style */}
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl mb-8">
                <div className="absolute inset-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={spaceImages[5].src} alt="" className="w-full h-full object-cover" aria-hidden="true" />
                  <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-transparent" />
                </div>
                <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-12 min-h-[360px] items-center">
                  <div>
                    <div className="h-1.5 w-20 rounded-full bg-hot-pink mb-6" />
                    <h3 className="font-bold text-3xl md:text-4xl text-white mb-4">{t.music.floor1}</h3>
                    <p className="text-white/60 leading-relaxed mb-4 max-w-[45ch]">{t.music.floor1Desc}</p>
                    <p className="text-sm text-white/65 font-[family-name:var(--font-space-mono)] mb-2">{t.music.floor1Tables}</p>
                    <p className="text-hot-pink font-bold">{t.music.floor1Price}</p>
                    <div className="flex flex-wrap gap-2 mt-6">
                      <MusicTag genre="Hip-hop" className="border-white/20 text-white/70" />
                      <MusicTag genre="R&B" className="border-white/20 text-white/70" />
                    </div>
                  </div>
                </div>
                <StickerTag text="FLOOR 1" color="pink" className="absolute top-6 right-6 rotate-[3deg]" />
              </div>
            </Reveal>

            {/* Floor 2 */}
            <Reveal delay={0.1}>
              <div className="relative overflow-hidden rounded-3xl">
                <div className="absolute inset-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={spaceImages[6].src} alt="" className="w-full h-full object-cover" aria-hidden="true" />
                  <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-transparent" />
                </div>
                <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-12 min-h-[360px] items-center">
                  <div>
                    <div className="h-1.5 w-20 rounded-full bg-electric-blue mb-6" />
                    <h3 className="font-bold text-3xl md:text-4xl text-white mb-4">{t.music.floor2}</h3>
                    <p className="text-white/60 leading-relaxed mb-4 max-w-[45ch]">{t.music.floor2Desc}</p>
                    <p className="text-sm text-white/65 font-[family-name:var(--font-space-mono)] mb-2">{t.music.floor2Tables}</p>
                    <p className="text-electric-blue font-bold">{t.music.floor2Price}</p>
                    <div className="flex flex-wrap gap-2 mt-6">
                      <MusicTag genre="Top 40" className="border-white/20 text-white/70" />
                      <MusicTag genre="EDM" className="border-white/20 text-white/70" />
                      <MusicTag genre="House" className="border-white/20 text-white/70" />
                    </div>
                  </div>
                </div>
                <StickerTag text="FLOOR 2" color="blue" className="absolute top-6 right-6 rotate-[-2deg]" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* BITES F&B — dark section with accent photos */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={galleryImages[8].src} alt="" className="w-full h-full object-cover opacity-10" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-b from-paper via-paper/95 to-paper" />
          </div>
          <div className="relative max-w-[1400px] mx-auto px-6 md:px-10">
            <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 items-center">
              <Reveal>
                <div className="relative">
                  <StickerTag text="BITES" color="yellow" className="absolute -top-6 -left-2 z-10 shadow-lg" />
                  <GeometricShape variant="asterisk" size={50} className="absolute -top-4 right-8 rotate-[15deg] opacity-30" />
                  <h2 className="font-bold text-4xl md:text-6xl tracking-tight text-ink mt-8 mb-4">
                    {t.menuPage.bites}
                  </h2>
                  <p className="text-ink/70 text-lg max-w-[50ch] mb-8">{t.menuPage.bitesDesc}</p>
                  <div className="bg-ink rounded-2xl p-6 inline-block">
                    <h3 className="font-bold text-xl text-white mb-2">{t.menuPage.vip}</h3>
                    <p className="text-white/60 text-sm mb-4">{t.menuPage.vipDesc}</p>
                    <Link
                      href={routeMap.contact[locale]}
                      className="inline-flex items-center gap-2 bg-loco-red text-white font-bold px-6 py-3 rounded-full hover:bg-loco-red/90 transition-colors"
                    >
                      {t.menuPage.vipCta}
                    </Link>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((no) => (
                    <div key={no} className="aspect-square overflow-hidden rounded-2xl bg-ink">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={menuPageSrc(no).replace(".webp", "-400.webp")}
                        srcSet={`${menuPageSrc(no).replace(".webp", "-400.webp")} 400w, ${menuPageSrc(no).replace(".webp", "-800.webp")} 800w`}
                        sizes="(max-width: 768px) 42vw, 220px"
                        alt={`LOCO Complex menu — page ${no}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <MenuPagesSection locale="en" dict={t.menuPage} />
      </main>
      <Footer locale={locale} t={{ footer: t.footer, nav: t.nav }} />
      <FloatingContacts />
    </>
  );
}
