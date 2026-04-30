"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react/dist/ssr";
import { buildSrcSet, thumbSrc } from "@/lib/srcset";

type Slide = { src: string; alt: string };

type Props = {
  slides: Slide[];
  open: boolean;
  initialIndex?: number;
  onClose: () => void;
};

const SWIPE_THRESHOLD = 60;

export function MenuLightbox({ slides, open, initialIndex = 0, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const total = slides.length;
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % total);
  }, [total]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, goPrev, goNext]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu-lightbox"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Album menu LOCO Complex"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Đóng"
            className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95 md:right-6 md:top-6 md:h-12 md:w-12"
          >
            <X size={22} weight="bold" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Trang trước"
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-loco-yellow text-midnight shadow-[0_8px_30px_rgba(245,195,48,0.45)] transition hover:scale-105 hover:bg-loco-yellow/90 active:scale-95 md:left-6 md:h-14 md:w-14"
          >
            <CaretLeft size={26} weight="bold" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Trang sau"
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-loco-yellow text-midnight shadow-[0_8px_30px_rgba(245,195,48,0.45)] transition hover:scale-105 hover:bg-loco-yellow/90 active:scale-95 md:right-6 md:h-14 md:w-14"
          >
            <CaretRight size={26} weight="bold" />
          </button>

          <div
            className="relative flex h-full w-full items-center justify-center px-4 py-16 md:px-24 md:py-20"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative h-full w-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbSrc(slides[index].src)}
                  srcSet={buildSrcSet(slides[index].src)}
                  sizes="100vw"
                  alt={slides[index].alt}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 select-none rounded-full bg-loco-yellow px-5 py-2 text-xs font-bold uppercase tracking-[0.28em] text-midnight shadow-[0_8px_24px_rgba(245,195,48,0.4)] md:bottom-7 md:text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-[family-name:var(--font-space-mono)]">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
