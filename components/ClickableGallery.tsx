"use client";

import { useLightbox } from "@/components/Lightbox";

interface ClickableGalleryProps {
  images: { src: string; alt: string }[];
  columns?: string;
  aspect?: string;
}

export default function ClickableGallery({
  images,
  columns = "grid-cols-2 md:grid-cols-4",
  aspect = "aspect-square",
}: ClickableGalleryProps) {
  const { open, LightboxPortal } = useLightbox(images);

  return (
    <>
      <div className={`grid ${columns} gap-3 md:gap-4`}>
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => open(i)}
            className={`${aspect} overflow-hidden rounded-2xl cursor-zoom-in group`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              loading={i < 4 ? "eager" : "lazy"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </button>
        ))}
      </div>
      <LightboxPortal />
    </>
  );
}
