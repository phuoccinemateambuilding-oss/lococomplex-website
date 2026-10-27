// Kiểm + định dạng số điện thoại khách gõ ở form đặt bàn — dùng chung cho form (trình duyệt)
// và API sửa số (máy chủ), nên KHÔNG import gì của trình duyệt hay Node.
//
// Vì sao (28/10/2026): nhiều đơn web không liên lạc được — số gõ nhầm vẫn qua vì form chỉ đếm
// đủ 10 chữ số, còn số bàn / đầu số không có thật cũng lọt. Kiểm ngay khi khách còn trên trang
// rẻ hơn nhiều so với lễ tân gọi vào số sai rồi mất khách.

import { ghepMaNuoc } from "@/lib/countryCodes";

export type LoiSo = "do-dai" | "dau-so" | "rac" | "do-dai-qt";

// Đầu số di động Việt Nam đang cấp (sau đợt chuyển 11 số → 10 số năm 2018):
// 032–039 · 052–059 · 070, 076–079 · 081–089 · 090–099. Cố ý nới (05x, 09x lấy cả dải)
// vì chặn nhầm một số thật là mất đơn, còn lọt một số lạ thì lễ tân vẫn gọi thử được.
const DI_DONG_VN = /^0(3[2-9]|5[2-9]|7[06-9]|8[1-9]|9\d)\d{7}$/;

export const chiSo = (s: string) => String(s || "").replace(/\D/g, "");

/** Số "cho có": 7 số thuê bao (sau đầu số 0xx) trùng hết hoặc chạy dãy — 0999999999, 0912345678, 0987654321. */
function laSoRac(local: string): boolean {
  const d = local.slice(3);
  if (/^(\d)\1+$/.test(d)) return true;
  let tang = true;
  let giam = true;
  for (let i = 1; i < d.length; i++) {
    const a = Number(d[i - 1]);
    const b = Number(d[i]);
    if (b !== (a + 1) % 10) tang = false;
    if (b !== (a + 9) % 10) giam = false;
  }
  return tang || giam;
}

/** intl = dạng form gửi đi ("+84 912345678", "+65 82682708"). null = hợp lệ. */
export function kiemTraSo(intl: string): LoiSo | null {
  const d = chiSo(intl);
  if (intl.trim().startsWith("+84")) {
    const local = "0" + d.slice(2);
    if (local.length !== 10) return "do-dai";
    if (!DI_DONG_VN.test(local)) return "dau-so";
    if (laSoRac(local)) return "rac";
    return null;
  }
  return d.length < 7 || d.length > 15 ? "do-dai-qt" : null;
}

export function thongBaoLoiSo(loi: LoiSo, locale: "vi" | "en"): string {
  const vi: Record<LoiSo, string> = {
    "do-dai": "Số di động Việt Nam gồm 10 chữ số, bắt đầu bằng số 0.",
    "dau-so": "Đầu số chưa đúng — số di động bắt đầu bằng 03, 05, 07, 08 hoặc 09.",
    rac: "Số này có vẻ chưa đúng, bạn kiểm tra lại giúp nhé.",
    "do-dai-qt": "Số điện thoại chưa đủ — bạn kiểm tra lại mã nước và số.",
  };
  const en: Record<LoiSo, string> = {
    "do-dai": "Vietnamese mobile numbers have 10 digits, starting with 0.",
    "dau-so": "Please check the prefix — Vietnamese mobiles start with 03, 05, 07, 08 or 09.",
    rac: "This number doesn't look right — please double-check.",
    "do-dai-qt": "Please check the country code and number.",
  };
  return (locale === "en" ? en : vi)[loi];
}

/** Gom nhóm cho dễ soát: 0912345678 → "0912 345 678"; thiếu số 0 đầu (912345678) → "912 345 678". */
function gomNhomVN(d: string): string {
  const n = d.startsWith("0") ? [4, 3, 3] : [3, 3, 3];
  const out: string[] = [];
  let i = 0;
  for (const len of n) {
    if (i >= d.length) break;
    out.push(d.slice(i, i + len));
    i += len;
  }
  if (i < d.length) out[out.length - 1] += d.slice(i); // gõ thừa số: giữ nguyên để khách thấy mà xoá
  return out.join(" ");
}

/**
 * Định dạng ô số khi đang chọn mã +84: tự đổi "+84 912…" / "84912…" (trình duyệt tự điền hay
 * dán từ danh bạ) về "0912 …" rồi chia nhóm. Khách gõ "+" mã nước khác thì để nguyên — đó là số
 * nước ngoài, ghepMaNuoc lo phần ghép mã.
 */
export function dinhDangOSoVN(raw: string): string {
  const t = raw.trimStart();
  let d = chiSo(t);
  if (t.startsWith("+") || t.startsWith("00")) {
    if (t.startsWith("00")) d = d.slice(2);
    if (!d.startsWith("84")) return raw;
    d = "0" + d.slice(2).replace(/^0+/, "");
  } else if (d.startsWith("84") && d.length >= 11) {
    d = "0" + d.slice(2).replace(/^0+/, "");
  }
  return gomNhomVN(d.slice(0, 12));
}

/** Số đã lưu ("+84 912345678") → dạng đọc cho khách soát: "0912 345 678"; số nước ngoài giữ nguyên. */
export function hienThiSo(intl: string): string {
  const t = intl.trim();
  if (!t.startsWith("+84")) return t;
  return gomNhomVN("0" + chiSo(t).slice(2));
}

/** Ô "sửa số" chỉ có một ô chữ (không có ô chọn mã nước): số trong nước tính theo +84. */
export function chuanHoaSoSua(raw: string): string {
  return ghepMaNuoc("+84", raw);
}
