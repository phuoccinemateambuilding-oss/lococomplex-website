"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CalendarCheck } from "@phosphor-icons/react/dist/ssr";
import { BRAND } from "@/lib/brand";

type Dsticky = {
  call: string;
  zalo: string;
  book: string;
  whatsapp: string;
  wechat: string;
};

function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...a: unknown[]) => void; dataLayer?: unknown[] };
  w.gtag?.("event", event, params);
  w.dataLayer?.push({ event, ...params });
}

export function StickyCtaBarMobile({ dict }: { dict: Dsticky }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const threshold = typeof window !== "undefined" ? window.innerHeight * 0.6 : 400;
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* WhatsApp + WeChat floating above sticky bar — transparent container, only buttons have bg */}
      <div className="pointer-events-none flex flex-col items-end gap-3 px-5 pb-3">
        <a
          href={BRAND.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { cta_location: "sticky_mobile" })}
          aria-label={dict.whatsapp}
          className="pointer-events-auto h-[54px] w-[54px] overflow-hidden rounded-full shadow-lg transition-transform hover:scale-110"
        >
          <Image
            src="/assets/icons/whatsapp.webp"
            alt="WhatsApp"
            width={54}
            height={54}
            className="h-full w-full object-cover"
            unoptimized
          />
        </a>
        <a
          href={BRAND.wechatUrl}
          onClick={() => track("wechat_click", { cta_location: "sticky_mobile" })}
          aria-label={dict.wechat}
          className="pointer-events-auto h-[54px] w-[54px] overflow-hidden rounded-full shadow-lg transition-transform hover:scale-110"
        >
          <Image
            src="/assets/icons/wechat.webp"
            alt="WeChat"
            width={54}
            height={54}
            className="h-full w-full object-cover"
            unoptimized
          />
        </a>
      </div>

      <div className="grid grid-cols-3 gap-1 border-t border-loco-red/30 bg-midnight-deep/95 p-2 backdrop-blur-md">
        <a
          href={`tel:${BRAND.phoneTel}`}
          className="flex flex-col items-center justify-center gap-1 rounded-xl bg-loco-red/15 py-2 text-[11px] font-bold uppercase tracking-wider text-loco-red"
        >
          <Image
            src="/assets/icons/hotline.png"
            alt="Gọi điện"
            width={22}
            height={22}
            className="object-contain"
            unoptimized
          />
          {dict.call}
        </a>
        <a
          href={BRAND.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 rounded-xl bg-[#0068FF] py-2 text-[11px] font-bold uppercase tracking-wider text-white"
        >
          <Image
            src="/assets/icons/zalo.png"
            alt="Zalo"
            width={22}
            height={22}
            className="object-contain"
            unoptimized
          />
          {dict.zalo}
        </a>
        <button
          type="button"
          onClick={() => {
            track("cta_click", { cta_location: "sticky_mobile_book" });
            document.getElementById("form")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="flex flex-col items-center justify-center gap-1 rounded-xl bg-loco-red py-2 text-[11px] font-bold uppercase tracking-wider text-white"
        >
          <CalendarCheck weight="fill" className="h-5 w-5" />
          {dict.book}
        </button>
      </div>
    </div>
  );
}
