"use client";

import { useEffect } from "react";

/**
 * Ghi nhận NGUỒN KHÁCH (2026-08-24) để API đặt bàn gửi kèm sang Nightclub CRM,
 * cuối tháng thống kê được tỷ lệ khách đến từ Google Ads / SEO / Fanpage / TikTok...
 *
 * Cách hoạt động: khi khách vừa vào site, đọc dấu vết trên đường link (gclid, utm,
 * fbclid...) và trang giới thiệu (referrer) rồi lưu vào cookie 90 ngày.
 * "Vào thẳng" KHÔNG ghi đè nguồn đã biết — khách xem quảng cáo hôm nay, ba hôm sau
 * gõ thẳng địa chỉ vào đặt bàn thì vẫn tính cho kênh đã đưa họ đến.
 */

const COOKIE_SRC = "nc_src"; // nguồn gần nhất khác "vào thẳng"
const COOKIE_FIRST = "nc_src1"; // nguồn lần đầu tiên biết được
const COOKIE_DETAIL = "nc_srcd"; // dấu vết thô để đối soát
const DAYS = 90;

function readCookie(name: string): string {
  const m = document.cookie.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"));
  if (!m) return "";
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return m[1];
  }
}

function writeCookie(name: string, value: string) {
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    "; path=/; max-age=" +
    DAYS * 86400 +
    "; SameSite=Lax";
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function detect(params: URLSearchParams, refHost: string): string {
  const p = (k: string) => (params.get(k) || "").trim().toLowerCase();
  // 1. Dấu click quảng cáo — chắc chắn nhất, Google/TikTok tự gắn
  if (p("gclid") || p("gbraid") || p("wbraid")) return "google_ads";
  if (p("ttclid")) return "tiktok";
  // 2. UTM mình tự gắn vào link rải ở bio TikTok / nút Fanpage / bài Instagram
  const us = p("utm_source");
  const um = p("utm_medium");
  const paid = /cpc|ppc|paid|^ads?$/.test(um);
  if (us) {
    if (us.includes("google")) return paid ? "google_ads" : "google_organic";
    if (us.includes("facebook") || us === "fb") return paid ? "facebook_ads" : "facebook";
    if (us.includes("instagram") || us === "ig") return "instagram";
    if (us.includes("tiktok")) return "tiktok";
    if (us.includes("youtube")) return "youtube";
    if (us.includes("zalo")) return "zalo";
    return "referral";
  }
  if (p("fbclid")) return "facebook";
  // 3. Trang giới thiệu
  if (refHost) {
    if (/(^|\.)google\./.test(refHost)) return "google_organic";
    if (/(^|\.)(bing|duckduckgo|coccoc|yahoo|yandex)\./.test(refHost)) return "search_other";
    if (refHost.includes("facebook") || refHost === "fb.com" || refHost === "fb.me")
      return "facebook";
    if (refHost.includes("instagram")) return "instagram";
    if (refHost.includes("tiktok")) return "tiktok";
    if (refHost.includes("youtube") || refHost === "youtu.be") return "youtube";
    if (refHost.includes("zalo")) return "zalo";
    return "referral";
  }
  return "direct";
}

export function TrafficSource() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const refHost = hostOf(document.referrer);
      const self = window.location.hostname.replace(/^www\./, "").toLowerCase();
      // Điều hướng trong chính site: không đụng cookie
      if (refHost && refHost === self) return;

      const src = detect(params, refHost);
      const first = readCookie(COOKIE_FIRST);
      if (!first) writeCookie(COOKIE_FIRST, src);

      const prev = readCookie(COOKIE_SRC);
      if (src !== "direct" || !prev) writeCookie(COOKIE_SRC, src);

      if (src !== "direct" || !readCookie(COOKIE_DETAIL)) {
        const utm = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
          .map((k) => {
            const v = params.get(k);
            return v ? k + "=" + v : "";
          })
          .filter(Boolean)
          .join("&");
        const detail = [
          utm,
          refHost ? "ref=" + refHost : "",
          "lp=" + window.location.pathname,
          first && first !== src ? "first=" + first : "",
        ]
          .filter(Boolean)
          .join(" | ")
          .slice(0, 400);
        writeCookie(COOKIE_DETAIL, detail);
      }
    } catch {
      // bắt nguồn là việc phụ — hỏng cũng không được ảnh hưởng trang
    }
  }, []);
  return null;
}
