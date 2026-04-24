"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "framer-motion";
import { HighlightBrand } from "./HighlightBrand";

const GALLERY_IMAGES = Array.from({ length: 33 }, (_, i) => ({
  src: `/assets/loco/gallery/gallery-${String(i + 1).padStart(2, "0")}.jpg`,
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
          <h2 className="font-display-vn text-3xl leading-[1.15] pb-[0.08em] heading-uppercase text-cream md:text-4xl lg:text-5xl">
            <HighlightBrand text={dict.h2} />
          </h2>
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
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 25vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-midnight-deep/0 transition duration-300 group-hover:bg-midnight-deep/30" />
            </motion.button>
          ))}
        </div>

        {/* Mobile horizontal snap */}
        <div className="relative -mx-5 md:hidden">
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 [scrollbar-width:none]">
            {GALLERY_IMAGES.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setLightbox(i)}
                className="relative min-w-[78%] snap-start overflow-hidden rounded-2xl"
                style={{ aspectRatio: "4/3" }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="78vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
          <p className="mt-3 text-center font-[family-name:var(--font-space-mono)] text-xs text-white/60">
            {dict.swipeHint}
          </p>
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
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-white hover:text-white"
            >
              <ArrowLeft weight="bold" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Tiếp"
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-white hover:text-white"
            >
              <ArrowRight weight="bold" className="h-5 w-5" />
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
              <Image
                src={GALLERY_IMAGES[lightbox].src}
                alt={GALLERY_IMAGES[lightbox].alt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
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
