"use client";

import Image from "next/image";
import { WhatsappLogo, WechatLogo } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/site";

export default function FloatingContacts() {
  return (
    <div className="fixed right-4 bottom-4 z-40 hidden flex-col gap-3 md:flex md:right-6 md:bottom-6">
      {/* WhatsApp button */}
      <a
        href={site.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg neon-box-green transition-transform hover:scale-110"
      >
        <WhatsappLogo size={30} weight="fill" className="text-white" />
      </a>

      {/* WeChat button */}
      <a
        href={site.wechatUrl}
        aria-label="Chat WeChat"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#07C160] shadow-lg neon-box-wechat transition-transform hover:scale-110"
      >
        <WechatLogo size={30} weight="fill" className="text-white" />
      </a>

      {/* Zalo button */}
      <a
        href={site.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Zalo"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0068FF] shadow-lg transition-transform hover:scale-110"
      >
        <Image
          src="/assets/icons/zalo.png"
          alt="Zalo"
          width={28}
          height={28}
          className="object-contain"
        />
      </a>

      {/* Phone button with pulse */}
      <a
        href={site.phoneTel}
        aria-label="Gọi điện"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#E23A2C] shadow-lg transition-transform hover:scale-110"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#E23A2C] opacity-30" />
        <Image
          src="/assets/icons/hotline.png"
          alt="Gọi điện"
          width={28}
          height={28}
          className="relative z-10 object-contain"
        />
      </a>
    </div>
  );
}
