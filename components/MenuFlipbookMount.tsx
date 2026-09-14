"use client";

import dynamic from "next/dynamic";

type Locale = "vi" | "en";

// react-pageflip truy cập window/document → BẮT BUỘC ssr:false, chỉ mount phía client
const MenuFlipbook = dynamic(() => import("./MenuFlipbook"), {
  ssr: false,
  loading: () => (
    <div className="mf-root">
      <div className="mf-stage" style={{ color: "var(--mf-ink)", fontWeight: 700, letterSpacing: ".08em" }}>
        Đang tải thực đơn…
      </div>
    </div>
  ),
});

export function MenuFlipbookMount({ locale = "vi" }: { locale?: Locale }) {
  return <MenuFlipbook locale={locale} />;
}
