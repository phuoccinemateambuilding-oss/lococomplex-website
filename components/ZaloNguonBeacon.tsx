"use client";

import { useEffect } from "react";

/**
 * Ghi dấu "khách bấm nút Zalo / WhatsApp từ web này" → Omni Inbox gắn nguồn cho hội thoại.
 *
 * ⚠️ TÁCH HOÀN TOÀN khỏi các tracker conversion (Tel/Zalo/Form) — file này KHÔNG import gtag,
 * KHÔNG chặn điều hướng. sendBeacon là bắn-rồi-quên: endpoint sập hay CSP chặn cũng không ảnh
 * hưởng gì tới khách lẫn đo chuyển đổi. Danh tính venue = header Origin trình duyệt tự đóng dấu.
 *
 * Từ 2026-08-29 beacon mang thêm NGUỒN KHÁCH do TrafficSource ghi trong cookie (nc_src):
 * Omni không chỉ biết "bấm Zalo từ khu13saigon.com" mà biết luôn "khách đó tới web từ Google Ads".
 * Nhờ vậy đơn chốt trong chat Zalo vẫn quy được về đúng kênh marketing thay vì nhãn chung "Chat Zalo".
 *
 * Riêng WHATSAPP có thêm TIN MỒI (24/08): link wa.me chưa có ?text= thì tự gắn câu soạn sẵn
 * "Hi! I'd like to book a table at <venue>." — tin ĐẦU của khách tự khai venue (số WhatsApp dùng
 * chung nhiều venue nên đây là attribution chắc chắn nhất; khách xoá tin mồi thì còn beacon).
 */
const OMNI_CLICK_URL = "https://omni-inbox-psi.vercel.app/api/zalo-click";

/** hostname (bỏ www.) → tên venue cho tin mồi WhatsApp. Không có trong map → câu chung. */
const TEN_VENUE: Record<string, string> = {
  "empireclub.com.vn": "Empire Club",
  "khu13saigon.com": "Khu 13",
  "papisaigon.com": "PAPI Club Saigon",
  "districtk.com.vn": "District K",
  "lococomplex.com.vn": "LOCO Complex",
  "zionskyloungesaigon.com": "Zion Sky Lounge",
  "thewannsaigon.com.vn": "The Wann",
  "neighborhoodsaigon.com": "Neighborhood Saigon",
  "draveclub.com.vn": "D-Rave Club",
  "palmora.com.vn": "Palmora",
  "karaokektv.com.vn": "Karaoke KTV",
  "b40saigon.com": "B40 Saigon",
  "cineclubsaigon.com": "Cine Club Saigon",
  "weekndsaigon.com": "Weeknd Saigon",
  "fetticlubsaigon.com": "Fetti Social Club",
  "canalisclub.com.vn": "Canalis Club",
  "ktvtrungson.com": "KTV Trung Son",
  "empire-club-website.vercel.app": "Empire Club",
  "fetti-socialclub.vercel.app": "Fetti Social Club",
};

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
        'a[href*="zalo.me"], a[href*="wa.me"], a[href*="api.whatsapp.com"]',
      ) as HTMLAnchorElement | null;
      if (!a) return;
      try {
        const laWa = /wa\.me|api\.whatsapp\.com/.test(a.href);
        const so = laWa
          ? (a.href.match(/wa\.me\/(\d+)/)?.[1] ?? a.href.match(/phone=(\d+)/)?.[1] ?? "")
          : (a.href.match(/zalo\.me\/(\d[\d.\s-]*)/)?.[1] ?? "").replace(/\D/g, "");
        if (laWa && !/[?&]text=/.test(a.href)) {
          // Gắn tin mồi TRƯỚC khi trình duyệt đi theo link (đổi href trong click handler là
          // hợp lệ — điều hướng dùng href tại thời điểm hành động mặc định chạy).
          const ten = TEN_VENUE[location.hostname.replace(/^www\./, "")];
          const moi = ten ? `Hi! I'd like to book a table at ${ten}.` : "Hi! I'd like to book a table.";
          a.href += (a.href.includes("?") ? "&" : "?") + "text=" + encodeURIComponent(moi);
        }
        navigator.sendBeacon?.(
          OMNI_CLICK_URL,
          JSON.stringify({
            p: location.pathname,
            z: so,
            k: laWa ? "wa" : "zalo",
            s: docCookie("nc_src") || undefined, // nguồn: google_ads | tiktok | facebook...
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
