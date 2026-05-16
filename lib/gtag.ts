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
const AW_FORM_CONVERSION = "AW-18120563170/XmBzCI-s66McEOKzx8BD";
const AW_TEL_CONVERSION  = "AW-18120563170/v4rJCIms66McEOKzx8BD";
const AW_ZALO_CONVERSION = "AW-18120563170/YaVBCIys66McEOKzx8BD";

export const VAL_TEL  = 300000;
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
  } else {
    console.warn("[ads] window.gtag NOT a function — gtag.js chưa load hoặc bị block bởi ad-blocker");
  }
}

async function sha256(input: string): Promise<string> {
  const normalized = input.trim().toLowerCase();
  const buf = new TextEncoder().encode(normalized);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizePhoneVN(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("84")) return "+" + digits;
  if (digits.startsWith("0")) return "+84" + digits.slice(1);
  return "+84" + digits;
}

function splitName(fullName: string): { fn: string; ln: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { fn: parts[0], ln: "" };
  return { fn: parts[parts.length - 1], ln: parts.slice(0, -1).join(" ") };
}

export async function reportFormConversion(
  rawPhone: string,
  rawName: string,
  size: number,
): Promise<void> {
  if (typeof window === "undefined") return;
  track("form_success", { size });
  if (typeof window.gtag !== "function") return;
  try {
    const phoneE164 = normalizePhoneVN(rawPhone);
    const { fn, ln } = splitName(rawName);
    const [phoneHash, fnHash, lnHash] = await Promise.all([
      sha256(phoneE164),
      sha256(fn),
      ln ? sha256(ln) : Promise.resolve(""),
    ]);
    window.gtag("event", "conversion", {
      send_to: AW_FORM_CONVERSION,
      value: VAL_FORM,
      currency: "VND",
      transport_type: "beacon",
      user_data: {
        sha256_phone_number: phoneHash,
        sha256_first_name: fnHash,
        sha256_last_name: lnHash,
        address: { country: "VN" },
      },
    });
  } catch {
    window.gtag("event", "conversion", {
      send_to: AW_FORM_CONVERSION,
      value: VAL_FORM,
      currency: "VND",
      transport_type: "beacon",
    });
  }
}

export function reportCallConversion(): void {
  if (typeof window === "undefined") return;
  track("tel_click", { value: VAL_TEL, currency: "VND" });
  if (typeof window.gtag === "function") {
    console.info("[ads] conversion tel fired", { send_to: AW_TEL_CONVERSION, value: VAL_TEL });
    window.gtag("event", "conversion", {
      send_to: AW_TEL_CONVERSION,
      value: VAL_TEL,
      currency: "VND",
      transport_type: "beacon",
    });
  } else {
    console.warn("[ads] tel: window.gtag NOT available — chỉ fire dataLayer");
  }
}

export function reportZaloConversion(_url?: string): boolean {
  if (typeof window === "undefined") return true;
  track("zalo_click");
  if (typeof window.gtag === "function") {
    console.info("[ads] conversion zalo fired", { send_to: AW_ZALO_CONVERSION, value: VAL_ZALO });
    window.gtag("event", "conversion", {
      send_to: AW_ZALO_CONVERSION,
      value: VAL_ZALO,
      currency: "VND",
      transport_type: "beacon",
    });
  } else {
    console.warn("[ads] zalo: window.gtag NOT available — chỉ fire dataLayer");
  }
  // Beacon đảm bảo fire bất kể navigation. KHÔNG preventDefault — để native <a target="_blank"> handle.
  return true;
}
