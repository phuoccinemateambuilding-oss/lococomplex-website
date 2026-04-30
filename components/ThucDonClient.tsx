"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarPlus, MagnifyingGlassPlus, Sparkle, Gift } from "@phosphor-icons/react/dist/ssr";
import { MenuLightbox } from "./MenuLightbox";
import { buildSrcSet, thumbSrc } from "@/lib/srcset";

const COVER_SRC = "/assets/loco/menu/menu-cover.jpg";
const COVER_W = 1489;
const COVER_H = 1600;

const MENU_SLIDES: { src: string; alt: string }[] = [
  { src: "/assets/loco/menu/menu-07.webp", alt: "Trang menu LOCO Complex — Cocktail & nước giải khát" },
  { src: "/assets/loco/menu/menu-08.webp", alt: "Trang menu LOCO Complex — đồ uống & Soju" },
  { src: "/assets/loco/menu/menu-01.webp", alt: "Trang menu LOCO Complex — Snack & ăn chơi" },
  { src: "/assets/loco/menu/menu-04.webp", alt: "Trang menu LOCO Complex — Steamboat & Salad" },
  { src: "/assets/loco/menu/menu-02.webp", alt: "Trang menu LOCO Complex — Tacos, Cá & Cua" },
  { src: "/assets/loco/menu/menu-09.webp", alt: "Trang menu LOCO Complex — Set & món đặc sắc" },
  { src: "/assets/loco/menu/menu-10.webp", alt: "Trang menu LOCO Complex — Zượu Mơ & Whisky" },
  { src: "/assets/loco/menu/menu-03.webp", alt: "Trang menu LOCO Complex — Mâm Phúc Lộc Thọ & set mâm" },
  { src: "/assets/loco/menu/menu-05.webp", alt: "Trang menu LOCO Complex — Tequila signature" },
  { src: "/assets/loco/menu/menu-06.webp", alt: "Trang menu LOCO Complex — Vodka & Liqueur" },
  { src: "/assets/loco/menu/menu-11.webp", alt: "Trang menu LOCO Complex — Tequila, Gin & Rum cao cấp" },
];

export function ThucDonClient() {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const openAt = (i: number) => {
    setStartIndex(i);
    setOpen(true);
  };

  return (
    <main className="relative min-h-[100dvh] bg-midnight-deep text-cream">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,195,48,0.08),transparent_60%)]" />

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[1100px] flex-col items-center px-5 py-10 md:px-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-block font-[family-name:var(--font-space-mono)] text-[10px] font-bold uppercase tracking-[0.3em] text-loco-yellow md:text-xs">
            Thực đơn · LOCO Complex
          </span>
          <h1 className="mt-3 font-display-vn text-[28px] font-extrabold leading-[1.15] tracking-tight text-cream md:text-4xl lg:text-5xl">
            MENU LOCO COMPLEX
          </h1>
          <div className="mx-auto mt-4 h-[3px] w-16 rounded-full bg-loco-yellow" />
        </motion.div>

        <motion.button
          type="button"
          onClick={() => openAt(0)}
          aria-label="Mở album menu chi tiết"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="group relative mt-8 block w-full max-w-[520px] overflow-hidden rounded-[28px] border border-loco-yellow/25 bg-midnight shadow-[0_24px_70px_-20px_rgba(245,195,48,0.35)] transition-transform hover:-translate-y-1 active:translate-y-0"
        >
          <div className="relative w-full" style={{ aspectRatio: `${COVER_W} / ${COVER_H}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbSrc(COVER_SRC, COVER_W)}
              srcSet={buildSrcSet(COVER_SRC, COVER_W)}
              sizes="(max-width: 768px) 92vw, 520px"
              alt="Bìa thực đơn LOCO Complex — make impossible"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
          <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 py-5 text-[11px] font-bold uppercase tracking-[0.32em] text-loco-yellow opacity-90 transition-opacity group-hover:opacity-100 md:text-xs">
            <MagnifyingGlassPlus size={16} weight="bold" />
            Bấm để xem chi tiết
          </span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-10 w-full max-w-[680px] text-center"
        >
          <p className="font-display-vn text-[15px] font-extrabold leading-[1.45] tracking-tight text-loco-yellow drop-shadow-[0_2px_18px_rgba(245,195,48,0.35)] sm:text-lg md:text-2xl">
            <Sparkle size={16} weight="fill" className="mr-1.5 inline-block align-[-2px] text-loco-yellow" />
            <span className="whitespace-nowrap">Đặt bàn giữ chỗ trước miễn phí</span>
          </p>
          <div className="mx-auto my-3 flex items-center justify-center gap-3 text-loco-yellow/60">
            <span className="h-px w-10 bg-loco-yellow/40" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">·</span>
            <span className="h-px w-10 bg-loco-yellow/40" />
          </div>
          <p className="font-display-vn text-[12.5px] font-semibold leading-[1.55] text-cream sm:text-base md:text-lg">
            <Gift size={14} weight="fill" className="mr-1.5 inline-block align-[-2px] text-hot-pink" />
            <span className="whitespace-nowrap">Để nhận ưu đãi đặt trước trên tổng Bill</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="mt-8 flex w-full max-w-[640px] flex-col items-stretch gap-3 sm:flex-row sm:justify-center sm:gap-4"
        >
          <Link
            href="/dat-ban#menu"
            className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-loco-yellow/70 bg-transparent px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.22em] text-loco-yellow transition hover:bg-loco-yellow/10 active:translate-y-[1px] md:text-sm"
          >
            <ArrowLeft size={16} weight="bold" className="transition-transform group-hover:-translate-x-1" />
            Quay lại trang chính
          </Link>
          <Link
            href="/dat-ban#form"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-loco-yellow px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.22em] text-midnight shadow-[0_12px_32px_-8px_rgba(245,195,48,0.6)] transition hover:bg-loco-yellow/90 active:translate-y-[1px] md:text-sm"
          >
            <CalendarPlus size={16} weight="fill" />
            Đặt bàn ngay
          </Link>
        </motion.div>

        <p className="mt-10 max-w-[420px] text-center text-[11px] leading-relaxed text-cream/45 md:mt-12">
          Dành cho khách từ 18 tuổi trở lên · LOCO Complex · 11 Nam Quốc Cang, Q.1, TP.HCM
        </p>
      </div>

      <MenuLightbox
        slides={MENU_SLIDES}
        open={open}
        initialIndex={startIndex}
        onClose={() => setOpen(false)}
      />
    </main>
  );
}
