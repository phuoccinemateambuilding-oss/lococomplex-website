"use client";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

export const AW_CONTAINER = "AW-18120563170";
export const AW_TEL = "AW-18120563170/v4rJCIms66McEOKzx8BD";
export const AW_FORM = "AW-18120563170/XmBzCI-s66McEOKzx8BD";
export const AW_ZALO = "AW-18120563170/YaVBCIys66McEOKzx8BD";

export const VAL_TEL = 300000;
export const VAL_FORM = 200000;
export const VAL_ZALO = 150000;

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
  console.info("[ads] event", name, params);
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
    if (name === "form_success") {
      console.info("[ads] conversion form fired", { send_to: AW_FORM, value: VAL_FORM });
      window.gtag("event", "conversion", {
        send_to: AW_FORM,
        value: VAL_FORM,
        currency: "VND",
        ...params,
      });
    }
  } else {
    console.warn("[ads] window.gtag NOT a function — gtag.js chưa load hoặc bị block bởi ad-blocker");
  }
}

type ConversionCallbackParams = {
  send_to: string;
  value: number;
  currency: "VND";
  event_callback?: () => void;
};

export function reportCallConversion(navigateTo?: string) {
  if (typeof window === "undefined") return true;
  let navigated = false;
  const callback = () => {
    if (navigated) return;
    navigated = true;
    if (navigateTo) window.location.href = navigateTo;
  };
  if (typeof window.gtag === "function") {
    const params: ConversionCallbackParams = {
      send_to: AW_TEL,
      value: VAL_TEL,
      currency: "VND",
      event_callback: callback,
    };
    console.info("[ads] conversion tel fired", { send_to: AW_TEL, value: VAL_TEL });
    window.gtag("event", "conversion", params);
    window.setTimeout(callback, 1500);
    return false;
  }
  console.warn("[ads] tel: window.gtag NOT available, fallback navigate");
  return true;
}

export function reportZaloConversion(navigateTo?: string) {
  if (typeof window === "undefined") return true;
  let navigated = false;
  const callback = () => {
    if (navigated) return;
    navigated = true;
    if (navigateTo) window.location.href = navigateTo;
  };
  if (typeof window.gtag === "function") {
    const params: ConversionCallbackParams = {
      send_to: AW_ZALO,
      value: VAL_ZALO,
      currency: "VND",
      event_callback: callback,
    };
    console.info("[ads] conversion zalo fired", { send_to: AW_ZALO, value: VAL_ZALO });
    window.gtag("event", "conversion", params);
    window.setTimeout(callback, 1500);
    return false;
  }
  console.warn("[ads] zalo: window.gtag NOT available, fallback navigate");
  return true;
}
