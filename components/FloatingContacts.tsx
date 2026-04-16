"use client";

import { PhoneCall } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/site";

export default function FloatingContacts() {
  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col gap-3 md:right-6 md:bottom-6">
      {/* Phone button with pulse */}
      <a
        href={site.phoneTel}
        aria-label="Call"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#E23A2C] text-white shadow-lg transition-transform hover:scale-110"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 animate-ping rounded-full bg-[#E23A2C] opacity-30" />
        <PhoneCall size={24} weight="fill" className="relative z-10" />
      </a>

      {/* Zalo button */}
      <a
        href={site.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Zalo"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#4A90D9] text-xs font-bold text-white shadow-lg transition-transform hover:scale-110"
      >
        Zalo
      </a>
    </div>
  );
}
