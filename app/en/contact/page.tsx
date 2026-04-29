import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";
import Reveal from "@/components/Reveal";
import BookingForm from "@/components/BookingForm";
import StickerTag from "@/components/StickerTag";
import GeometricShape from "@/components/GeometricShape";
import { site } from "@/lib/site";
import { spaceImages, galleryImages } from "@/lib/images";

export const metadata: Metadata = {
  title: "Contact & Reserve — LOCO Complex · 0866 433 754",
  description:
    "Reserve a table at LOCO Complex via form, hotline 0866 433 754, or Zalo. 11 Nam Quoc Cang, Pham Ngu Lao Ward, District 1, HCMC. Open 6 PM – 12 AM.",
  keywords: [
    "book LOCO Complex",
    "LOCO Complex hotline",
    "LOCO Complex address",
    "reservation nightclub District 1",
    "LOCO Complex 11 Nam Quoc Cang",
  ],
  alternates: {
    canonical: "/en/contact",
    languages: { vi: "/lien-he", en: "/en/contact", "x-default": "/lien-he" },
  },
  openGraph: {
    title: "Contact & Reserve — LOCO Complex",
    description: "Hotline 0866 433 754 · Zalo · Reservation form. 11 Nam Quoc Cang, D.1.",
    url: "/en/contact",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "LOCO Complex reservation" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact LOCO Complex",
    description: "Reserve · Hotline 0866 433 754 · Zalo",
    images: ["/og.jpg"],
  },
};
import { PhoneCall, MapPin, Clock, Warning, WifiHigh, PawPrint, GameController, Lockers } from "@phosphor-icons/react/dist/ssr";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";

export default function ContactPage() {
  const locale = "en";
  const t = getDict(locale);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/en" },
          { name: "Contact", path: "/en/contact" },
        ]}
      />
      <Navbar locale={locale} t={t.nav} currentPath="/en/contact" />
      <main className="flex-1 pt-20">
        {/* Hero — cinematic */}
        <section className="relative min-h-[45vh] overflow-hidden bg-ink flex items-end">
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={spaceImages[2].src} alt="" className="w-full h-full object-cover opacity-25" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
          </div>
          <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 pb-16 pt-32 w-full">
            <Reveal>
              <p className="font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.25em] text-hot-pink mb-4">
                {t.contact.eyebrow}
              </p>
              <h1 className="font-bold text-6xl md:text-8xl tracking-tight text-white">
                {t.contact.heading}
              </h1>
              <p className="mt-4 text-white/50 text-lg max-w-[50ch]">
                {t.hero.desc}
              </p>
            </Reveal>
            <GeometricShape variant="circle" size={70} className="absolute right-10 bottom-10 rotate-[15deg] opacity-40 hidden md:block" />
          </div>
        </section>

        {/* Form + Info — dark bg for night club feel */}
        <section className="bg-ink py-24 md:py-32">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-start">
              {/* Form — white card on dark bg */}
              <Reveal>
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
                  <h2 className="font-bold text-2xl text-ink mb-6">{t.contact.heading}</h2>
                  <BookingForm locale="en" t={t.contact} />
                </div>
              </Reveal>

              {/* Right side — CTA + info */}
              <div className="space-y-6">
                {/* Phone CTA */}
                <Reveal delay={0.1}>
                  <div className="relative">
                    <StickerTag text={t.contact.callNow} color="red" className="absolute -top-4 right-4 z-10" />
                    <a
                      href={site.phoneTel}
                      className="block rounded-3xl overflow-hidden group"
                    >
                      <div className="relative p-8">
                        <div className="absolute inset-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={spaceImages[4].src} alt="" className="w-full h-full object-cover" aria-hidden="true" />
                          <div className="absolute inset-0 bg-loco-red/85 group-hover:bg-loco-red/80 transition-colors" />
                        </div>
                        <div className="relative text-white">
                          <PhoneCall size={36} weight="bold" className="mb-4" />
                          <p className="text-sm opacity-80 mb-1">{t.contact.orCall}</p>
                          <p className="font-[family-name:var(--font-bebas-neue)] text-5xl md:text-6xl tracking-tight">
                            {site.phone}
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                </Reveal>

                {/* Info cards */}
                <Reveal delay={0.2}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                      <MapPin size={24} weight="bold" className="text-electric-blue mb-3" />
                      <p className="font-semibold text-white text-sm mb-1">{t.contact.address}</p>
                      <p className="text-white/50 text-xs leading-relaxed">{site.address[locale]}</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                      <Clock size={24} weight="bold" className="text-loco-yellow mb-3" />
                      <p className="font-semibold text-white text-sm mb-1">{t.contact.openHours}</p>
                      <p className="text-white/50 text-xs">{site.hours[locale]}</p>
                    </div>
                  </div>
                </Reveal>

                {/* Services mini-grid */}
                <Reveal delay={0.25}>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { icon: WifiHigh, label: "WiFi" },
                      { icon: PawPrint, label: "Pet OK" },
                      { icon: GameController, label: "Game" },
                      { icon: Lockers, label: "Locker" },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex flex-col items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3">
                        <Icon size={20} weight="bold" className="text-teal" />
                        <span className="text-white/50 text-xs">{label}</span>
                      </div>
                    ))}
                  </div>
                </Reveal>

                {/* House rules */}
                <Reveal delay={0.3}>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                    <p className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                      <Warning size={18} weight="bold" className="text-loco-red" />
                      {t.contact.houseRules}
                    </p>
                    <ol className="space-y-2 text-sm text-white/50">
                      <li className="flex items-start gap-2">
                        <span className="font-mono text-xs text-loco-red font-bold mt-0.5">01</span>
                        {t.contact.rule1}
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-mono text-xs text-loco-red font-bold mt-0.5">02</span>
                        {t.contact.rule2}
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-mono text-xs text-loco-red font-bold mt-0.5">03</span>
                        {t.contact.rule3}
                      </li>
                    </ol>
                    <p className="mt-3 text-xs text-white/30">{t.contact.note}</p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Venue photos strip */}
        <section className="bg-ink pb-4">
          <div className="flex gap-2 overflow-hidden">
            {galleryImages.slice(0, 8).map((img) => (
              <div key={img.src} className="shrink-0 w-[200px] h-[140px] overflow-hidden rounded-xl opacity-60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt="" className="w-full h-full object-cover" aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer locale={locale} t={{ footer: t.footer, nav: t.nav }} />
      <FloatingContacts />
    </>
  );
}
