"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { buildSrcSet, thumbSrc } from "@/lib/srcset";

export function FadeSlideUp({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 20, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FloatingImage({ src, alt, className, delay = 0 }: { src: string; alt: string; className: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      <motion.div
        className="w-full h-full"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay * 2 }}
      >
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
      </motion.div>
    </motion.div>
  );
}

export function PulseText({ children, className }: { children: ReactNode; className: string }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
