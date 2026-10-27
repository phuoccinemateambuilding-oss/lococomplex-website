"use client";

import { useState } from "react";
import { formatIntlPhone } from "@/lib/countryCodes";
import { chiSo, dinhDangOSoVN, kiemTraSo, type LoiSo } from "@/lib/phone-check";

/**
 * Ô số điện thoại của form đặt bàn (28/10/2026, bản Canalis sếp đã duyệt): đang chọn +84 thì tự chia nhóm
 * "0912 345 678" + giữ đúng vị trí con trỏ, rời ô là báo lỗi độ dài / đầu số / số "cho có".
 * Dùng: const so = useOSoDienThoai(country); <input value={so.value} onChange={so.onChange} onBlur={so.onBlur} />
 * Đổi mã nước: so.doiMaNuoc(iso). Gửi form: kiemTraSo(formatIntlPhone(iso, raw)) → lỗi thì so.setLoi(loi).
 */
export function useOSoDienThoai(country: string) {
  const [value, setValue] = useState("");
  const [loi, setLoi] = useState<LoiSo | null>(null);

  const loiCua = (iso: string, raw: string): LoiSo | null => (raw.trim() ? kiemTraSo(formatIntlPhone(iso, raw)) : null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    let raw = el.value;
    if (country !== "VN") {
      setValue(raw);
      if (loi && !loiCua(country, raw)) setLoi(null);
      return;
    }
    const caret = el.selectionStart ?? raw.length;
    let soTruoc = chiSo(raw.slice(0, caret)).length;
    // Xoá lùi đúng dấu cách giữa hai nhóm → xoá luôn chữ số đứng trước nó (không thì phím xoá "đứng im").
    if ((e.nativeEvent as InputEvent).inputType === "deleteContentBackward" && chiSo(raw) === chiSo(value) && soTruoc > 0) {
      const d = chiSo(raw);
      raw = d.slice(0, soTruoc - 1) + d.slice(soTruoc);
      soTruoc -= 1;
    }
    const doiMa = /^\s*(\+|00|84)/.test(raw); // +84… / 84… vừa được đổi về 0… → con trỏ về cuối
    const next = dinhDangOSoVN(raw);
    setValue(next);
    if (loi && !loiCua(country, next)) setLoi(null);
    requestAnimationFrame(() => {
      if (document.activeElement !== el) return;
      let i = 0;
      if (doiMa) i = next.length;
      else for (let dem = 0; i < next.length && dem < soTruoc; i++) if (/\d/.test(next[i])) dem++;
      el.setSelectionRange(i, i);
    });
  };

  const onBlur = () => setLoi(loiCua(country, value));

  const doiMaNuoc = (iso: string) => {
    if (iso === "VN") setValue((v) => dinhDangOSoVN(v));
    setLoi(null);
  };

  const reset = () => {
    setValue("");
    setLoi(null);
  };

  return { value, loi, setLoi, onChange, onBlur, doiMaNuoc, reset };
}

/** Sự kiện thường (KHÔNG phải chuyển đổi Ads) — gọi gtag thẳng để khỏi phụ thuộc kiểu sự kiện của từng web. */
export function suKien(name: string, params: Record<string, unknown> = {}): void {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", name, params);
  } catch {
    /* gtag chưa tải — bỏ qua */
  }
}
