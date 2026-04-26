"use client";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
  }
}

const AW_CONVERSION = process.env.NEXT_PUBLIC_AW_CONVERSION_LABEL || "";

type EventName =
  | "form_submit"
  | "form_success"
  | "form_error"
  | "tel_click"
  | "zalo_click"
  | "cta_click"
  | "tier_select";

export function track(name: EventName, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
    if (name === "form_success" && AW_CONVERSION) {
      window.gtag("event", "conversion", {
        send_to: AW_CONVERSION,
        value: 200000,
        currency: "VND",
        ...params,
      });
    }
  }
}
