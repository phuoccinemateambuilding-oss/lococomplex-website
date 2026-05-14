"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealCssProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * CSS-only scroll reveal — không dùng framer-motion.
 * Dùng IntersectionObserver + CSS transition để giảm JS bundle size
 * trong các section below-fold (LandingAbout, v.v.)
 */
export default function RevealCss({ children, className = "", delay = 0 }: RevealCssProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-50px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
        willChange: visible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
