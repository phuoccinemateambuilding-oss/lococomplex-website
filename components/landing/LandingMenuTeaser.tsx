"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { buildSrcSet, thumbSrc } from "@/lib/srcset";

export function LandingMenuTeaser() {
  return (
    <section id="menu" className="relative scroll-mt-20 border-t border-white/5 bg-midnight py-14 md:scroll-mt-24 md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,195,48,0.05),transparent_60%)]" />
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="font-[family-name:var(--font-space-mono)] text-[10px] uppercase tracking-[0.3em] text-loco-yellow font-bold block mb-3">
            Thực đơn
          </span>
          <h2 className="font-display-vn text-3xl leading-[1.15] pb-[0.08em] heading-uppercase text-cream md:text-4xl lg:text-5xl">
            MENU LOCO COMPLEX
          </h2>
          <div className="gold-divider max-w-[100px] mx-auto mt-4" />
          <p className="mt-5 text-white/70 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            LOCO Complex tinh tuyển bộ thực đơn cao cấp dành cho đêm Sài Gòn — từ snack đến refreshments, phù hợp mọi dịp tụ họp và sự kiện riêng.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative mx-auto max-w-sm md:max-w-md overflow-hidden rounded-3xl border border-loco-yellow/20 bg-midnight-deep shadow-[0_20px_60px_-15px_rgba(245,195,48,0.15)]"
        >
          <div className="relative aspect-[858/922]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbSrc("/assets/loco/menu/menu-01.webp")}
              srcSet={buildSrcSet("/assets/loco/menu/menu-01.webp", 858)}
              sizes="(max-width: 768px) 90vw, 480px"
              alt="Thực đơn LOCO Complex — make impossible"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 text-center"
        >
          <Link
            href="/thuc-don"
            className="group inline-flex items-center gap-3 rounded-full bg-loco-yellow px-8 py-3.5 text-xs uppercase tracking-[0.28em] text-midnight font-bold hover:bg-loco-yellow/85 active:translate-y-[1px] transition-all"
          >
            <BookOpen size={16} weight="fill" />
            Xem Menu chi tiết
            <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
