"use client";

import { useEffect } from "react";
import { reportZaloConversion, track } from "@/lib/gtag";

export function ZaloClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      if (!target) return;
      const anchor = target.closest(
        'a[href*="zalo.me"], a[href*="zaloapp.com"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      const ctaLocation =
        anchor.getAttribute("data-cta-location") ||
        (anchor.closest("[data-cta-location]") as HTMLElement | null)?.dataset
          .ctaLocation ||
        "zalo_click";

      track("zalo_click", { cta_location: ctaLocation, href });

      if (e.defaultPrevented) return;

      const target_attr = (anchor.getAttribute("target") || "").toLowerCase();
      const opensNewTab =
        target_attr === "_blank" ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.button !== 0;

      if (opensNewTab) {
        reportZaloConversion();
        return;
      }

      const proceed = reportZaloConversion(href);
      if (!proceed) {
        e.preventDefault();
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
