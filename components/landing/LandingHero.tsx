"use client";

import Image from "next/image";
import { Phone, ArrowDown, MapPin, Clock } from "@phosphor-icons/react/dist/ssr";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/brand";

type Dhero = {
  eyebrow: string;
  wordmarkAlt: string;
  h2: string;
  tagline: string;
  intro: string;
  ctaBook: string;
  ctaCall: string;
  ctaGallery: string;
  trust: string;
  hoursLabel: string;
  addressLabel: string;
};

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function LandingHero({ dict, locale }: { dict: Dhero; locale: "vi" | "en" }) {
  return (
    <section
      id="top"
      className="hero-warm-glow relative min-h-[100dvh] overflow-hidden scroll-mt-0"
    >
      {/* Hero background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/loco/space/space-01.jpg"
          alt="LOCO Complex interior"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-deep/80 via-midnight-deep/40 to-midnight-deep/90" />
      </div>

      {/* Decorative geometric shapes */}
      <div
        aria-hidden
        className="absolute right-[5%] top-[10%] h-24 w-24 rounded-full border-2 border-loco-red/20 md:h-40 md:w-40"
      />
      <div
        aria-hidden
        className="absolute left-[3%] bottom-[15%] h-16 w-16 rotate-45 border-2 border-loco-red/15 md:h-28 md:w-28"
      />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1500px] items-center px-5 pb-20 pt-28 md:px-10 md:pt-32 lg:grid lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        {/* Left — content */}
        <div className="flex flex-col">
          {/* Eyebrow chip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center self-start rounded-full border border-loco-yellow/40 bg-loco-yellow/10 px-4 py-1.5 font-[family-name:var(--font-space-mono)] text-xs text-loco-yellow"
          >
            {dict.eyebrow}
          </motion.div>

          {/* Wordmark H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mb-3 font-display leading-none tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)]"
            style={{ fontSize: "clamp(4.5rem, 20vw, 10rem)" }}
          >
            <span className="text-loco-red">LOCO</span>
            <br />
            <span className="text-white/90">COMPLEX</span>
          </motion.h1>
          <span className="sr-only">
            LOCO Complex — Entertainment complex tại 11 Nam Quốc Cang, Quận 1, TP.HCM
          </span>

          {/* H2 CTA headline — P3: max text-5xl */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="mb-3 font-display-vn text-4xl uppercase tracking-wider text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] md:text-5xl lg:text-6xl"
          >
            {dict.h2}
          </motion.h2>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-5 font-[family-name:var(--font-caveat)] text-xl italic text-white/85 md:text-2xl"
          >
            "{dict.tagline}"
          </motion.p>

          {/* Intro card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mb-8 max-w-[44ch] rounded-2xl border border-white/10 bg-midnight/60 px-5 py-4 backdrop-blur-sm"
          >
            <p className="text-sm leading-relaxed text-white/90 md:text-base">{dict.intro}</p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8 flex flex-wrap gap-3"
          >
            <button
              type="button"
              onClick={() => scrollTo("form")}
              className="inline-flex h-14 items-center gap-2 rounded-full bg-loco-red px-7 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-loco-red/85"
            >
              {dict.ctaBook}
            </button>
            <a
              href={`tel:${BRAND.phoneTel}`}
              className="inline-flex h-14 items-center gap-2 rounded-full border border-white/30 bg-midnight/50 px-6 font-[family-name:var(--font-space-mono)] text-sm font-bold text-white/80 backdrop-blur transition hover:border-white/60 hover:text-white"
            >
              <Phone weight="fill" className="h-4 w-4" />
              {dict.ctaCall}
            </a>
            <button
              type="button"
              onClick={() => scrollTo("gallery")}
              className="inline-flex h-14 items-center gap-2 rounded-full px-6 font-display text-sm uppercase tracking-wider text-white/60 underline-offset-4 transition hover:text-white hover:underline"
            >
              {dict.ctaGallery}
              <ArrowDown className="h-4 w-4" />
            </button>
          </motion.div>

          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.38 }}
            className="mb-6 flex flex-wrap gap-3"
          >
            <div className="inline-flex items-center gap-2 rounded-2xl border border-loco-yellow/30 bg-midnight/50 px-4 py-3 backdrop-blur-sm">
              <Clock weight="fill" className="h-4 w-4 text-loco-yellow" />
              <div>
                <p className="font-[family-name:var(--font-space-mono)] text-[10px] uppercase tracking-widest text-white/40">
                  {dict.hoursLabel}
                </p>
                <p className="font-[family-name:var(--font-space-mono)] text-xs font-bold text-loco-yellow">
                  {BRAND.hours[locale]}
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-midnight/50 px-4 py-3 backdrop-blur-sm">
              <MapPin weight="fill" className="h-4 w-4 text-white/50" />
              <div>
                <p className="font-[family-name:var(--font-space-mono)] text-[10px] uppercase tracking-widest text-white/40">
                  {dict.addressLabel}
                </p>
                <p className="font-[family-name:var(--font-space-mono)] text-xs text-white/70">
                  {BRAND.addressShort}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.44 }}
            className="inline-flex items-center gap-2 self-start rounded-full border border-loco-yellow/20 bg-loco-yellow/5 px-4 py-2"
          >
            <span className="text-base">⭐</span>
            <span className="font-[family-name:var(--font-space-mono)] text-xs text-loco-yellow/80">
              {dict.trust}
            </span>
          </motion.div>
        </div>

        {/* Right — hero image (desktop) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative hidden aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl lg:block"
        >
          <Image
            src="/assets/loco/space/space-01.jpg"
            alt={dict.wordmarkAlt}
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 0px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight-deep/60 to-transparent" />
          {/* Corner badge */}
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-midnight-deep/80 px-4 py-3 backdrop-blur-sm">
            <p className="font-[family-name:var(--font-space-mono)] text-xs text-white/60">
              {BRAND.address[locale]}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-5 w-5 text-white/30" />
      </div>
    </section>
  );
}
