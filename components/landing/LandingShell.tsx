"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { StickyCtaBarMobile } from "./StickyCtaBarMobile";
import FloatingContacts from "@/components/FloatingContacts";
import { routeMap, type Locale } from "@/lib/i18n";

type Dsticky = { call: string; zalo: string; book: string; whatsapp: string; wechat: string };

export function LandingShell({
  stickyDict,
  footerText,
  locale,
  children,
}: {
  stickyDict: Dsticky;
  footerText: string;
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <>
      <main className="relative bg-midnight-deep pb-20 md:pb-0">{children}</main>
      <footer className="relative z-10 border-t border-white/10 bg-midnight-deep px-5 py-8 pb-44 text-center md:px-10 md:py-12">
        <p className="mx-auto max-w-[700px] text-xs leading-relaxed text-white/50 md:text-sm">
          {footerText}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
          <Link href={routeMap.privacy[locale]} className="hover:text-loco-red transition-colors">
            {locale === "vi" ? "Chính sách bảo mật" : "Privacy Policy"}
          </Link>
          <Link href={routeMap.terms[locale]} className="hover:text-loco-red transition-colors">
            {locale === "vi" ? "Điều khoản sử dụng" : "Terms of Use"}
          </Link>
          <p>© {new Date().getFullYear()} LOCO Complex</p>
        </div>
      </footer>
      <StickyCtaBarMobile dict={stickyDict} />
      <FloatingContacts />
    </>
  );
}
