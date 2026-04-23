"use client";

import { motion } from "framer-motion";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";

type FaqItem = { q: string; a: string };
type Dfaq = { h2: string; items: FaqItem[] };

export function LandingFaq({ dict }: { dict: Dfaq }) {
  return (
    <section id="faq" className="relative scroll-mt-20 border-t border-white/5 bg-midnight-deep py-14 md:scroll-mt-24 md:py-20">
      <div className="mx-auto max-w-[860px] px-5 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center font-display-vn text-2xl leading-[1.15] pb-[0.08em] heading-uppercase text-cream whitespace-nowrap md:text-3xl lg:text-4xl"
        >
          {dict.h2}
        </motion.h2>

        <div className="flex flex-col gap-3">
          {dict.items.map((item, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group rounded-2xl border border-white/10 bg-midnight/50 backdrop-blur-sm open:border-loco-red/30 open:bg-midnight/80"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
                <span className="font-display-vn text-sm font-bold uppercase tracking-wide text-white/80 group-open:text-cream md:text-base">
                  {item.q}
                </span>
                <CaretDown
                  weight="bold"
                  className="h-4 w-4 shrink-0 text-white/40 transition-transform duration-200 group-open:rotate-180 group-open:text-loco-red"
                />
              </summary>
              <div className="border-t border-white/10 px-5 py-4">
                <p className="text-sm leading-relaxed text-white/60">{item.a}</p>
              </div>
            </motion.details>
          ))}
        </div>

        {/* FAQ JSON-LD embedded inline */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: dict.items.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
}
