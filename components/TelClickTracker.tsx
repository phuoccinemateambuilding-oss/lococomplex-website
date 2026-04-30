"use client";

import { useEffect } from "react";
import { reportCallConversion, track } from "@/lib/gtag";

export function TelClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      if (!target) return;
      const anchor = target.closest('a[href^="tel:"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      const ctaLocation =
        anchor.getAttribute("data-cta-location") ||
        (anchor.closest("[data-cta-location]") as HTMLElement | null)?.dataset
          .ctaLocation ||
        "tel_click";

      track("tel_click", { cta_location: ctaLocation, href });
      reportCallConversion();
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
