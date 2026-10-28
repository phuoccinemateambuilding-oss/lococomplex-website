"use client";

import { useEffect } from "react";

/**
 * Ghi dấu "khách bấm nút liên hệ trên web này" (Zalo · WhatsApp · Gọi · Messenger) → Omni Inbox biết
 * khách nhắn tới từ web nào, đến web qua kênh nào (Google Ads, tìm kiếm, Fanpage…). Hiện trên Omni +
 * báo vào topic Telegram của khách.
 *
 * ⚠️ TÁCH HOÀN TOÀN khỏi các tracker chuyển đổi Google — file này KHÔNG import gtag, KHÔNG chặn điều
 * hướng. sendBeacon bắn-rồi-quên về CHÍNH web này (/api/nguon-click), máy chủ web chuyển lên Omni.
 * Từ 28/10/2026 không gửi thẳng địa chỉ Omni nữa: địa chỉ cũ chết 16/10 làm mất nguồn khách 12 ngày.
 *
 * Nút WhatsApp chưa có câu soạn sẵn thì gắn "Hi! I'd like to book a table at <TEN>." — tin đầu của
 * khách tự khai quán (số WhatsApp dùng chung nhiều quán). TEN phải trùng tên quán trong Omni
 * (Omni Inbox/web/src/lib/web-quan.ts); để trống thì dùng câu chung.
 */
const TEN = "LOCO";

/** Dấu nguồn khách do TrafficSource ghi lúc khách vào web (cookie 90 ngày). */
function docCookie(ten: string): string {
  try {
    const m = document.cookie.match(new RegExp("(?:^|;\\s*)" + ten + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : "";
  } catch {
    return "";
  }
}

export function ZaloNguonBeacon() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.(
        'a[href*="zalo.me"], a[href*="wa.me"], a[href*="whatsapp.com"], a[href^="tel:"], a[href*="m.me"], a[href*="messenger.com"]',
      ) as HTMLAnchorElement | null;
      if (!a) return;
      try {
        const href = a.href;
        const k = /\/\/(www\.)?wa\.me\/|api\.whatsapp\.com/.test(href) ? "wa"
          : /^tel:/i.test(href) ? "tel"
          : /\/\/(www\.)?m\.me\/|messenger\.com/.test(href) ? "mess"
          : /zalo\.me/.test(href) ? "zalo" : "";
        if (!k) return;
        const so = k === "wa" ? (href.match(/wa\.me\/(\d+)/)?.[1] ?? href.match(/phone=(\d+)/)?.[1] ?? "")
          : k === "tel" ? href.replace(/^tel:/i, "").replace(/\D/g, "")
          : k === "zalo" ? (href.match(/zalo\.me\/(\d[\d.\s-]*)/)?.[1] ?? "").replace(/\D/g, "")
          : "";
        if (k === "wa" && !/[?&]text=/.test(href)) {
          // Gắn tin mồi TRƯỚC khi trình duyệt đi theo link (đổi href trong click handler là hợp lệ —
          // điều hướng dùng href tại thời điểm hành động mặc định chạy).
          const moi = TEN ? `Hi! I'd like to book a table at ${TEN}.` : "Hi! I'd like to book a table.";
          a.href += (href.includes("?") ? "&" : "?") + "text=" + encodeURIComponent(moi);
        }
        navigator.sendBeacon?.(
          "/api/nguon-click",
          JSON.stringify({
            p: location.pathname,
            z: so,
            k,
            s: docCookie("nc_src") || undefined, // nguồn gần nhất: google_ads | google_organic | facebook…
            s1: docCookie("nc_src1") || undefined, // nguồn lần đầu vào web
            d: docCookie("nc_srcd").slice(0, 300) || undefined, // dấu vết thô để đối soát
          }),
        );
      } catch { /* beacon là gia vị — không bao giờ được làm phiền khách */ }
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);
  return null;
}

export default ZaloNguonBeacon;
