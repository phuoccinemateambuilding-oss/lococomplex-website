"use client";

import { Phone, ArrowDown, MapPin, Clock } from "@phosphor-icons/react/dist/ssr";
import { FadeSlideUp, FloatingImage } from "@/components/HeroAnimated";
import GeometricShape from "@/components/GeometricShape";
import StickerTag from "@/components/StickerTag";
import { BRAND } from "@/lib/brand";
import { track } from "@/lib/gtag";
import { thumbSrc } from "@/lib/srcset";

type Dhero = {
  eyebrow: string;
  wordmarkAlt: string;
  heading: string;
  subheading: string;
  h2: string;
  tagline: string;
  desc: string;
  intro: string;
  ctaBook: string;
  ctaCall: string;
  ctaGallery: string;
  trust: string;
  hoursLabel: string;
  addressLabel: string;
};

// Desktop-only BG grid (5 cols × 1 row = 5 PASS images, lazy + 800w webp).
// Mobile dùng CSS gradient + GeometricShape — zero ảnh BG để bảo vệ LCP.
const BG_GRID = [
  "/assets/loco/gallery/gallery-31.jpg",
  "/assets/loco/space/space-06.jpg",
  "/assets/loco/gallery/gallery-25.jpg",
  "/assets/loco/gallery/gallery-32.jpg",
  "/assets/loco/space/space-05.jpg",
];

const FLOAT_TOP_RIGHT = "/assets/loco/space/space-06.jpg";
const FLOAT_BOTTOM_LEFT = "/assets/loco/gallery/gallery-31.jpg";
const FLOAT_BOTTOM_RIGHT = "/assets/loco/gallery/gallery-30.jpg";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function LandingHero({ dict, locale }: { dict: Dhero; locale: "vi" | "en" }) {
  return (
    <section
      id="top"
      className="relative min-h-[100dvh] overflow-hidden bg-ink scroll-mt-0"
    >
      {/* Mobile BG — pure CSS gradient + geometric blob (zero image, protect LCP) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 md:hidden bg-[radial-gradient(ellipse_at_top_right,_rgba(233,30,140,0.22)_0%,_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(74,144,217,0.18)_0%,_transparent_60%),linear-gradient(to_bottom,_#0A0A0A_0%,_#1a0a08_100%)]"
      />

      {/* Desktop BG grid — 5 PASS images, lazy + 800w webp, opacity 0.15 */}
      <div className="hidden md:grid absolute inset-0 grid-cols-5 gap-1 opacity-15">
        {BG_GRID.map((src, i) => (
          <div key={i} className="overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbSrc(src, 800)}
              alt=""
              className="w-full h-full object-cover"
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              width="800"
              height="600"
            />
          </div>
        ))}
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 flex flex-col justify-center min-h-[100dvh] py-28 md:py-32">
        <div className="grid md:grid-cols-[1.1fr_1fr] gap-10 items-center">
          {/* LEFT — text content */}
          <div className="flex flex-col gap-5">
            <FadeSlideUp delay={0.1}>
              <span className="font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.25em] text-baby-blue">
                {dict.eyebrow}
              </span>
            </FadeSlideUp>

            <FadeSlideUp delay={0.2}>
              <h1 className="font-[family-name:var(--font-bebas-neue)] text-[6.5rem] leading-[0.8] text-white md:text-[14rem] md:drop-shadow-[0_0_60px_rgba(226,58,44,0.3)]">
                <span className="sr-only">
                  {locale === "vi"
                    ? "LOCO Complex — Đặt bàn online tại 11 Nam Quốc Cang, Quận 1, Sài Gòn"
                    : "LOCO Complex — Book online at 11 Nam Quoc Cang, District 1, Saigon"}
                </span>
                <span aria-hidden="true">{dict.heading}</span>
              </h1>
              <span className="block font-[family-name:var(--font-caveat)] text-5xl text-hot-pink md:text-6xl mt-1">
                {dict.subheading}
              </span>
            </FadeSlideUp>

            <FadeSlideUp delay={0.35}>
              <p className="text-base md:text-lg text-white/70 max-w-[48ch] leading-relaxed">
                {dict.desc}
              </p>
            </FadeSlideUp>

            {/* CTAs */}
            <FadeSlideUp delay={0.45} className="flex flex-wrap items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  scrollTo("form");
                  track("cta_click", { cta_name: "hero_book", cta_location: "hero" });
                }}
                className="inline-flex h-14 items-center gap-2 rounded-full bg-loco-red px-8 text-sm font-bold uppercase tracking-wider text-white shadow-[0_8px_40px_-5px_rgba(226,58,44,0.5)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_50px_-5px_rgba(226,58,44,0.6)]"
              >
                {dict.ctaBook}
              </button>
              <a
                href={`tel:${BRAND.phoneTel}`}
                onClick={() => track("tel_click", { cta_location: "hero" })}
                className="inline-flex h-14 items-center gap-2 rounded-full border border-white/30 bg-ink/40 px-6 font-[family-name:var(--font-space-mono)] text-sm font-bold text-white/80 backdrop-blur transition hover:border-white/60 hover:text-white"
              >
                <Phone weight="fill" className="h-4 w-4" />
                {dict.ctaCall}
              </a>
              <button
                type="button"
                onClick={() => {
                  scrollTo("gallery");
                  track("cta_click", { cta_name: "hero_gallery", cta_location: "hero" });
                }}
                className="inline-flex h-14 items-center gap-2 rounded-full px-5 text-sm font-bold uppercase tracking-wider text-white/60 underline-offset-4 transition hover:text-white hover:underline"
              >
                {dict.ctaGallery}
                <ArrowDown className="h-4 w-4" />
              </button>
            </FadeSlideUp>

            {/* Info cards — Hours + Address */}
            <FadeSlideUp delay={0.55} className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[560px]">
              <div className="flex items-start gap-3 rounded-2xl border border-loco-yellow/30 bg-ink/60 px-4 py-3 backdrop-blur-sm">
                <Clock weight="fill" className="mt-0.5 h-5 w-5 shrink-0 text-loco-yellow" />
                <div>
                  <p className="font-[family-name:var(--font-space-mono)] text-[10px] uppercase tracking-widest text-white/65">
                    {dict.hoursLabel}
                  </p>
                  <p className="font-[family-name:var(--font-space-mono)] text-sm font-bold text-loco-yellow">
                    {BRAND.hours[locale]}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/15 bg-ink/60 px-4 py-3 backdrop-blur-sm">
                <MapPin weight="fill" className="mt-0.5 h-5 w-5 shrink-0 text-baby-blue" />
                <div>
                  <p className="font-[family-name:var(--font-space-mono)] text-[10px] uppercase tracking-widest text-white/65">
                    {dict.addressLabel}
                  </p>
                  <p className="text-sm leading-snug text-white/85">
                    {BRAND.address[locale]}
                  </p>
                </div>
              </div>
            </FadeSlideUp>

            {/* Trust badge */}
            <FadeSlideUp delay={0.65}>
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-loco-yellow/20 bg-loco-yellow/5 px-4 py-2">
                <span className="text-base">⭐</span>
                <span className="font-[family-name:var(--font-space-mono)] text-xs text-loco-yellow/80">
                  {dict.trust}
                </span>
              </div>
            </FadeSlideUp>
          </div>

          {/* RIGHT — floating venue photos (desktop only) */}
          <div className="relative hidden md:block min-h-[560px]">
            <FloatingImage
              src={FLOAT_TOP_RIGHT}
              alt={dict.wordmarkAlt}
              className="absolute right-0 top-[3%] w-[360px] h-[420px] overflow-hidden rounded-[2rem] shadow-2xl ring-4 ring-white/10 rotate-[3deg]"
              delay={0.3}
            />
            <FloatingImage
              src={FLOAT_BOTTOM_LEFT}
              alt={dict.wordmarkAlt}
              className="absolute left-0 bottom-[5%] w-[280px] h-[320px] overflow-hidden rounded-2xl shadow-xl ring-4 ring-white/10 -rotate-[4deg]"
              delay={0.5}
            />
            <FloatingImage
              src={FLOAT_BOTTOM_RIGHT}
              alt={dict.wordmarkAlt}
              className="absolute right-[30px] bottom-[0%] w-[180px] h-[200px] overflow-hidden rounded-xl shadow-lg ring-2 ring-white/10 rotate-[6deg]"
              delay={0.7}
            />

            <GeometricShape variant="circle" size={100} className="absolute right-[-20px] top-[-10px] rotate-[12deg] drop-shadow-2xl" />
            <GeometricShape variant="asterisk" size={60} className="absolute bottom-16 right-[-8px] rotate-[25deg] drop-shadow-xl" />

            <StickerTag text="NEWTRO" color="pink" className="absolute left-[28%] top-[2%] rotate-[-5deg] shadow-lg" />
            <StickerTag text="2 FLOORS" color="yellow" className="absolute bottom-[12%] left-[30%] rotate-[4deg] shadow-lg" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-5 w-5 text-white/30" />
      </div>
    </section>
  );
}
