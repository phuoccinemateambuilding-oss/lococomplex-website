"use client";

import { motion } from "framer-motion";
import { Star } from "@phosphor-icons/react/dist/ssr";
import { HighlightBrand } from "./HighlightBrand";

type Review = { text: string; author: string; source: string };

type Dsocial = {
  h2: string;
  sub: string;
  reviews: Review[];
};

export function SocialProof({ dict }: { dict: Dsocial }) {
  return (
    <section
      id="about"
      className="relative scroll-mt-20 py-14 md:scroll-mt-24 md:py-20"
    >
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="font-display text-2xl leading-[1.15] pb-[0.08em] heading-uppercase text-cream whitespace-nowrap md:text-3xl lg:text-4xl">
            <HighlightBrand text={dict.h2} />
          </h2>
          <p className="mt-3 text-sm text-white/50 md:text-base">{dict.sub}</p>
        </motion.div>

        {/* Review cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {dict.reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-midnight/80 to-burgundy/30 p-6 backdrop-blur-sm"
            >
              {/* Quote mark */}
              <div className="mb-4 font-[family-name:var(--font-caveat)] text-5xl leading-none text-loco-yellow/40">
                "
              </div>

              {/* Review text */}
              <p className="mb-5 flex-1 text-sm leading-relaxed text-white/80 md:text-base">
                {review.text}
              </p>

              {/* Divider */}
              <div className="mb-4 h-px bg-white/10" />

              {/* Author + stars */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-sm font-bold text-cream heading-uppercase">
                    {review.author}
                  </p>
                  <p className="font-[family-name:var(--font-space-mono)] text-xs text-white/40">
                    {review.source}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} weight="fill" className="h-3.5 w-3.5 text-loco-yellow" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
