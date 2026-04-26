"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Crown, Users, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { track } from "@/lib/gtag";

export type TierKey =
  | "b-standard"
  | "standing-f1"
  | "sofa-l"
  | "vip-sofa"
  | "svip-sofa"
  | "standing-heatroom"
  | "premium-heatroom"
  | "vip-heatroom";

type TierItemBase = {
  key: string;
  name: string;
  floor: string;
  capacity: string;
  price: string;
  features: string[];
  highlight?: boolean;
};

type Dtiers = {
  h2: string;
  sub: string;
  notePill: string;
  footnote: string;
  highlightBadge: string;
  capacityLabel: string;
  ctaSelect: string;
  floor1Label: string;
  floor1Sub: string;
  floor2Label: string;
  floor2Sub: string;
  items: TierItemBase[];
};

const TIER_IMAGES: Record<string, string> = {
  "b-standard": "/assets/loco/gallery/gallery-31.jpg",
  "standing-f1": "/assets/loco/gallery/gallery-30.jpg",
  "sofa-l": "/assets/loco/gallery/gallery-04.jpg",
  "vip-sofa": "/assets/loco/gallery/gallery-25.jpg",
  "svip-sofa": "/assets/loco/gallery/gallery-32.jpg",
  "standing-heatroom": "/assets/loco/gallery/gallery-26.jpg",
  "premium-heatroom": "/assets/loco/gallery/gallery-29.jpg",
  "vip-heatroom": "/assets/loco/gallery/gallery-33.jpg",
};

const FALLBACK_IMAGE = "/assets/loco/gallery/gallery-31.jpg";

function selectTier(key: string) {
  track("tier_select", { tier: key });
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    url.searchParams.set("tier", key);
    window.history.replaceState({}, "", url.toString());
    window.dispatchEvent(new CustomEvent("loco-tier-change", { detail: { tier: key } }));
    document.getElementById("form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

type TierWithImage = TierItemBase & { image: string };

function TierCard({
  tier,
  index,
  highlightBadge,
  ctaSelect,
}: {
  tier: TierWithImage;
  index: number;
  highlightBadge: string;
  ctaSelect: string;
}) {
  const priceLines = tier.price.split("·").map((s) => s.trim()).filter(Boolean);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
      className={`relative flex flex-col overflow-hidden rounded-3xl border bg-midnight/70 backdrop-blur-sm transition ${
        tier.highlight
          ? "border-loco-red/60 shadow-[0_0_40px_rgba(226,58,44,0.25)] lg:scale-[1.02]"
          : "border-white/10 hover:border-white/25"
      }`}
    >
      {tier.highlight && (
        <div className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-loco-red px-3 py-1 font-[family-name:var(--font-space-mono)] text-[10px] font-bold uppercase tracking-widest text-white">
          <Crown weight="fill" className="h-3 w-3" />
          {highlightBadge}
        </div>
      )}

      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={tier.image}
          alt={`LOCO Complex — ${tier.name}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/95 via-midnight/30 to-transparent" />
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-midnight/80 px-2.5 py-1 backdrop-blur-sm">
          <span className="font-[family-name:var(--font-space-mono)] text-[10px] uppercase tracking-widest text-loco-yellow">
            {tier.floor}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 font-display-vn text-lg uppercase leading-tight tracking-wider text-cream md:text-xl">
          {tier.name}
        </h3>

        <div className="mb-3 inline-flex items-center gap-1.5 self-start rounded-full border border-white/15 bg-midnight/40 px-2.5 py-1">
          <Users weight="fill" className="h-3.5 w-3.5 text-loco-yellow" />
          <span className="font-[family-name:var(--font-space-mono)] text-xs text-white/80">
            {tier.capacity}
          </span>
        </div>

        <div className="mb-4 flex flex-col gap-0.5">
          {priceLines.map((line, idx) => (
            <p
              key={idx}
              className={`font-[family-name:var(--font-space-mono)] font-bold ${
                idx === 0 ? "text-base text-loco-yellow md:text-lg" : "text-xs text-loco-yellow/75 md:text-sm"
              }`}
            >
              {line}
            </p>
          ))}
        </div>

        <ul className="mb-5 flex flex-1 flex-col gap-2">
          {tier.features.map((f, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-white/75 md:text-sm">
              <CheckCircle weight="fill" className="mt-0.5 h-4 w-4 shrink-0 text-loco-yellow" />
              {f}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => selectTier(tier.key)}
          className={`mt-auto inline-flex h-11 w-full items-center justify-center rounded-full text-xs font-bold uppercase tracking-wider transition ${
            tier.highlight
              ? "bg-loco-red text-white hover:bg-loco-red/85"
              : "border border-loco-red/60 text-loco-red hover:bg-loco-red/10"
          }`}
        >
          {ctaSelect}
        </button>
      </div>
    </motion.article>
  );
}

function FloorHeading({ label, sub }: { label: string; sub: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-4"
    >
      <span className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-loco-red/40" />
      <div className="text-center">
        <h3 className="font-display-vn text-2xl uppercase tracking-wider text-cream md:text-3xl">
          {label}
        </h3>
        <p className="mt-1 font-[family-name:var(--font-space-mono)] text-[10px] uppercase tracking-widest text-loco-yellow/80 md:text-xs">
          {sub}
        </p>
      </div>
      <span className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-loco-red/40" />
    </motion.div>
  );
}

export function LandingTiers({ dict }: { dict: Dtiers }) {
  const items: TierWithImage[] = dict.items.map((it) => ({
    ...it,
    image: TIER_IMAGES[it.key] ?? FALLBACK_IMAGE,
  }));

  const floor1 = items.filter((it) => it.floor.includes("Tầng 1") || it.floor.toLowerCase().includes("floor 1"));
  const floor2 = items.filter((it) => it.floor.includes("Tầng 2") || it.floor.toLowerCase().includes("floor 2"));

  return (
    <section id="tiers" className="relative scroll-mt-20 border-t border-white/5 bg-midnight py-14 md:scroll-mt-24 md:py-20">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center"
        >
          <h2 className="font-display-vn text-3xl leading-[1.15] pb-[0.08em] heading-uppercase text-cream md:text-4xl lg:text-5xl">
            {dict.h2}
          </h2>
          <p className="mt-3 text-sm text-white/70 md:text-base">{dict.sub}</p>
          <p className="mt-5 inline-block rounded-full border border-loco-yellow/40 bg-loco-yellow/10 px-5 py-2 text-xs text-loco-yellow md:text-sm">
            {dict.notePill}
          </p>
        </motion.div>

        {/* Floor 1 — Hip-hop */}
        <div className="mt-12">
          <FloorHeading label={dict.floor1Label} sub={dict.floor1Sub} />
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {floor1.map((tier, i) => (
              <TierCard
                key={tier.key}
                tier={tier}
                index={i}
                highlightBadge={dict.highlightBadge}
                ctaSelect={dict.ctaSelect}
              />
            ))}
          </div>
        </div>

        {/* Floor 2 — Heatroom */}
        <div className="mt-14">
          <FloorHeading label={dict.floor2Label} sub={dict.floor2Sub} />
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {floor2.map((tier, i) => (
              <TierCard
                key={tier.key}
                tier={tier}
                index={i}
                highlightBadge={dict.highlightBadge}
                ctaSelect={dict.ctaSelect}
              />
            ))}
          </div>
        </div>

        <p className="mt-10 text-center font-[family-name:var(--font-space-mono)] text-xs text-white/50 md:text-sm">
          {dict.footnote}
        </p>
      </div>
    </section>
  );
}
