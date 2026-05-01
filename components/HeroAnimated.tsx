"use client";

import type { ReactNode, CSSProperties } from "react";
import { buildSrcSet, thumbSrc } from "@/lib/srcset";

export function FadeSlideUp({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const style: CSSProperties = {
    animation: "loco-fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
    animationDelay: `${delay}s`,
  };
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

export function FloatingImage({
  src,
  alt,
  className,
  delay = 0,
}: {
  src: string;
  alt: string;
  className: string;
  delay?: number;
}) {
  const wrapStyle: CSSProperties = {
    animation: "loco-fade-in 0.6s ease-out both",
    animationDelay: `${delay}s`,
  };
  const innerStyle: CSSProperties = {
    animation: "loco-float 4s ease-in-out infinite",
    animationDelay: `${delay * 2}s`,
  };
  return (
    <div className={className} style={wrapStyle}>
      <div className="w-full h-full" style={innerStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbSrc(src)}
          srcSet={buildSrcSet(src)}
          sizes="(min-width: 1024px) 360px, 0px"
          alt={alt}
          width="360"
          height="420"
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

export function PulseText({ children, className }: { children: ReactNode; className: string }) {
  return <div className={className}>{children}</div>;
}
