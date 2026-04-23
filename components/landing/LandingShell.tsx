"use client";

import type { ReactNode } from "react";
import { StickyCtaBarMobile } from "./StickyCtaBarMobile";

type Dsticky = { call: string; zalo: string; book: string };

export function LandingShell({
  stickyDict,
  footerText,
  children,
}: {
  stickyDict: Dsticky;
  footerText: string;
  children: ReactNode;
}) {
  return (
    <>
      <main className="relative pb-20 md:pb-0">{children}</main>
      <footer className="relative z-10 border-t border-white/10 bg-midnight-deep px-5 py-6 text-center md:px-10 md:py-8">
        <p className="mx-auto max-w-[700px] text-xs leading-relaxed text-white/50 md:text-sm">
          {footerText}
        </p>
      </footer>
      <StickyCtaBarMobile dict={stickyDict} />
    </>
  );
}
