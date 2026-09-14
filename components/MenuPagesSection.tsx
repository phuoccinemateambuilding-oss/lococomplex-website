"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, MagnifyingGlassPlus } from "@phosphor-icons/react/dist/ssr";
import { MenuLightbox } from "./MenuLightbox";
import { MENU_TOTAL, MENU_PAGE_W, MENU_PAGE_H, menuPageSrc } from "@/lib/images";

type MenuPageCopy = { title: string; desc: string };

type Props = {
  locale: "vi" | "en";
  dict: {
    sectionsEyebrow: string;
    sectionsHeading: string;
    sectionsIntro: string;
    flipCta: string;
    zoomHint: string;
    note: string;
    pages: readonly MenuPageCopy[];
  };
};

/* Trang menu SEO — mỗi trang menu là 1 khối ảnh + tiêu đề + mô tả bằng CHỮ THẬT
   (Google không đọc được chữ trong ảnh menu, nên phần mô tả này mới là thứ được index). */
export function MenuPagesSection({ locale, dict }: Props) {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const flipHref = locale === "vi" ? "/dat-ban/menu" : "/en/book/menu";
  const pageWord = locale === "vi" ? "Trang" : "Page";

  const slides = dict.pages.map((p, i) => ({
    src: menuPageSrc(i + 1),
    alt: `${locale === "vi" ? "Thực đơn" : "Menu"} LOCO Complex — ${pageWord.toLowerCase()} ${i + 1} / ${MENU_TOTAL}: ${p.title}`,
  }));

  const openAt = (i: number) => {
    setStartIndex(i);
    setOpen(true);
  };

  return (
    <section id="thuc-don" className="bg-ink py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="max-w-3xl">
          <p className="font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.25em] text-loco-yellow mb-4">
            {dict.sectionsEyebrow}
          </p>
          <h2 className="font-bold text-4xl md:text-6xl tracking-tight text-white mb-6">
            {dict.sectionsHeading}
          </h2>
          <p className="text-white/70 leading-relaxed md:text-lg">{dict.sectionsIntro}</p>

          <Link
            href={flipHref}
            className="group mt-8 inline-flex items-center gap-3 rounded-full bg-loco-yellow px-8 py-3.5 text-xs uppercase tracking-[0.28em] text-ink font-bold hover:bg-loco-yellow/85 active:translate-y-[1px] transition-all"
          >
            <BookOpen size={16} weight="fill" />
            {dict.flipCta}
            <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <ol className="mt-14 space-y-10 md:space-y-14">
          {dict.pages.map((p, i) => (
            <li
              key={p.title}
              className="grid gap-6 md:grid-cols-[minmax(0,320px)_1fr] md:gap-10 md:items-start"
            >
              <button
                type="button"
                onClick={() => openAt(i)}
                aria-label={`${dict.zoomHint} — ${pageWord} ${i + 1}: ${p.title}`}
                className="group relative block w-full max-w-[320px] overflow-hidden rounded-2xl ring-1 ring-white/10 bg-midnight transition-transform hover:scale-[1.015] active:scale-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${menuPageSrc(i + 1).replace(".webp", "-400.webp")}`}
                  srcSet={`${menuPageSrc(i + 1).replace(".webp", "-400.webp")} 400w, ${menuPageSrc(i + 1).replace(".webp", "-800.webp")} 800w, ${menuPageSrc(i + 1)} 1200w`}
                  sizes="(max-width: 768px) 88vw, 320px"
                  width={MENU_PAGE_W}
                  height={MENU_PAGE_H}
                  alt={slides[i].alt}
                  loading={i < 1 ? "eager" : "lazy"}
                  fetchPriority={i < 1 ? "high" : undefined}
                  decoding="async"
                  className="w-full h-auto object-cover"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-3 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-loco-yellow opacity-90 transition-opacity group-hover:opacity-100">
                  <MagnifyingGlassPlus size={14} weight="bold" />
                  {dict.zoomHint}
                </span>
              </button>

              <div>
                <p className="font-[family-name:var(--font-space-mono)] text-[11px] uppercase tracking-[0.28em] text-loco-yellow mb-2">
                  {pageWord} {i + 1} / {MENU_TOTAL}
                </p>
                <h3 className="font-bold text-2xl md:text-3xl text-white mb-3">{p.title}</h3>
                <p className="text-white/65 leading-relaxed max-w-[62ch]">{p.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-12 max-w-[70ch] text-sm text-white/45 leading-relaxed">{dict.note}</p>
      </div>

      <MenuLightbox slides={slides} open={open} initialIndex={startIndex} onClose={() => setOpen(false)} />
    </section>
  );
}
