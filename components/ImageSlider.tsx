"use client";

import { useRef } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { useLightbox } from "@/components/Lightbox";

interface ImageSliderProps {
  images: { src: string; alt: string }[];
  title: string;
}

export default function ImageSlider({ images, title }: ImageSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { open, LightboxPortal } = useLightbox(images);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-ink">{title}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink/15 text-ink/60 transition-colors hover:border-loco-red hover:text-loco-red active:scale-95"
            aria-label="Previous"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink/15 text-ink/60 transition-colors hover:border-loco-red hover:text-loco-red active:scale-95"
            aria-label="Next"
          >
            <CaretRight size={20} weight="bold" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => open(i)}
            className="shrink-0 snap-start overflow-hidden rounded-2xl cursor-zoom-in"
            style={{ width: "clamp(280px, 35vw, 420px)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
            />
          </button>
        ))}
      </div>

      <LightboxPortal />
    </div>
  );
}
