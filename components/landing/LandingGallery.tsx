"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { buildSrcSet, thumbSrc } from "@/lib/srcset";
import { X, ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "framer-motion";
import { HighlightBrand } from "./HighlightBrand";

const GALLERY_INDEXES = [1, 3, 4, 5, 14, 17, 20, 25, 26, 29, 30, 31, 32, 33];
const GALLERY_IMAGES = GALLERY_INDEXES.map((n, i) => ({
  src: `/assets/loco/gallery/gallery-${String(n).padStart(2, "0")}.jpg`,
  alt: `LOCO Complex — ảnh ${i + 1}`,
}));

type Dgallery = { h2: string; sub: string; swipeHint: string };

export function LandingGallery({ dict }: { dict: Dgallery }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = useCallback(() => {
    setLightbox((i) => (i == null ? null : (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length));
  }, []);

  const next = useCallback(() => {
    setLightbox((i) => (i == null ? null : (i + 1) % GALLERY_IMAGES.length));
  }, []);

  const close = useCallback(() => setLightbox(null), []);

  const touchStartX = useRef<number | null>(null);
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    touchStartX.current = null;
  }, [next, prev]);

  useEffect(() => {
    if (lightbox == null) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, prev, next, close]);

  return (
    <section id="gallery" className="relative scroll-mt-20 border-t border-white/5 bg-midnight-deep py-14 md:scroll-mt-24 md:py-20">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <span className="font-[family-name:var(--font-space-mono)] text-[10px] uppercase tracking-[0.3em] text-loco-yellow font-semibold block mb-2">
            LOCO Complex
          </span>
          <h2 className="font-display-vn text-3xl leading-[1.15] pb-[0.08em] heading-uppercase text-cream md:text-4xl lg:text-5xl">
            <HighlightBrand text={dict.h2} />
          </h2>
          <div className="gold-divider max-w-[100px] mx-auto mt-4" />
          <p className="mt-3 text-sm text-white/70 md:text-base">{dict.sub}</p>
        </motion.div>

        {/* Desktop grid */}
        <div className="hidden gap-3 md:grid md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {GALLERY_IMAGES.map((img, i) => (
            <motion.button
              key={img.src}
              type="button"
              onClick={() => setLightbox(i)}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 12) * 0.03 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbSrc(img.src)}
                srcSet={buildSrcSet(img.src)}
                sizes="(min-width: 1024px) 25vw, 33vw"
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-midnight-deep/0 transition duration-300 group-hover:bg-midnight-deep/30" />
            </motion.button>
          ))}
        </div>

        {/* Mobile 1-col full-width stack */}
        <div className="flex flex-col gap-3 md:hidden">
          {GALLERY_IMAGES.map((img, i) => (
            <motion.button
              key={img.src}
              type="button"
              onClick={() => setLightbox(i)}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: Math.min(i * 0.04, 0.2), duration: 0.45 }}
              className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-midnight-deep/40 active:opacity-85 transition-opacity"
              style={{ aspectRatio: "4/3" }}
              aria-label={img.alt}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbSrc(img.src)}
                srcSet={buildSrcSet(img.src)}
                sizes="100vw"
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox != null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-midnight-deep/95 backdrop-blur-md"
            onClick={close}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Đóng"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-white hover:text-white"
            >
              <X weight="bold" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Trước"
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-white hover:text-white p-1.5 md:p-2"
            >
              <ArrowLeft weight="bold" className="h-4 w-4 md:h-5 md:w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Tiếp"
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-white hover:text-white p-1.5 md:p-2"
            >
              <ArrowRight weight="bold" className="h-4 w-4 md:h-5 md:w-5" />
            </button>
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative h-[80vh] w-[90vw] max-w-5xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={GALLERY_IMAGES[lightbox].src}
                srcSet={buildSrcSet(GALLERY_IMAGES[lightbox].src)}
                sizes="90vw"
                alt={GALLERY_IMAGES[lightbox].alt}
                decoding="async"
                className="absolute inset-0 h-full w-full object-contain"
              />
            </motion.div>
            <p className="absolute bottom-4 font-[family-name:var(--font-space-mono)] text-xs text-white/65">
              {lightbox + 1} / {GALLERY_IMAGES.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
