"use client";

import { motion } from "framer-motion";

type Dbanner = { h2: string; sub: string };

export function FormCtaBanner({ dict }: { dict: Dbanner }) {
  return (
    <section className="relative overflow-hidden py-12 md:py-16">
      {/* Decorative geometric */}
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-loco-red/30 to-transparent"
      />
      <div
        aria-hidden
        className="absolute -left-8 top-1/2 h-32 w-32 -translate-y-1/2 rotate-45 border border-loco-red/10"
      />
      <div
        aria-hidden
        className="absolute -right-8 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full border border-loco-yellow/10"
      />

      <div className="relative mx-auto max-w-4xl px-5 text-center md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 font-display text-3xl uppercase leading-[1.4] tracking-wide text-cream md:text-4xl lg:text-5xl md:leading-[1.25]"
        >
          {dict.h2}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm text-white/50 md:text-base"
        >
          {dict.sub}
        </motion.p>
      </div>
    </section>
  );
}
