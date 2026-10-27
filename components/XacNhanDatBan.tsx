"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { ChatCircleDots, Check, CheckCircle, PencilSimple, WarningCircle, WhatsappLogo, X } from "@phosphor-icons/react/dist/ssr";
import { chuanHoaSoSua, dinhDangOSoVN, hienThiSo, kiemTraSo, thongBaoLoiSo } from "@/lib/phone-check";
import { suKien } from "@/lib/o-so-dien-thoai";

/**
 * Màn "Còn 1 bước cuối" sau khi khách gửi form đặt bàn (28/10/2026, bản Canalis sếp đã duyệt, dùng chung mọi web).
 *
 * Khắc phục đơn web không liên lạc được (gõ nhầm số, số không có Zalo/WhatsApp). Xác nhận chỉ đi qua Zalo /
 * WhatsApp, nên màn này nói rõ khách còn 1 bước cuối và cho hai đường:
 *  1. Soát số vừa gõ + "Sửa số" ({api}/sua-so) → bấm "Xác nhận đúng số và đợi xác nhận" → tích xanh rồi tự đóng.
 *  2. Nhắn trước để nhận xác nhận ngay: WhatsApp mở sẵn tin có mã; Zalo không cho soạn sẵn tin nên dặn nhắn mã BK
 *     (bấm nút là chép mã).
 * Card Telegram của đơn được máy chủ giữ lại tới khi khách xong bước này ({api}/hoan-tat): bấm nút, bấm X, rời trang
 * (sang Zalo, khoá máy, đóng tab) hoặc để quá 3 phút — card luôn mang số cuối cùng.
 * Chỉ đóng bằng X hoặc nút xác nhận; bấm nền / Esc không tắt (bước quan trọng nhất của đơn web).
 * Hai nút nhắn tin mang data-khong-chuyen-doi: đơn đã tính 1 chuyển đổi form, không đếm thêm Zalo/WhatsApp.
 */

export type DonVuaDat = {
  bk: string;
  phone: string; // dạng form gửi đi: "+84 912345678"
  token: string | null; // vé sửa số (null = không cho sửa trên web)
  name: string;
  date: string;
  time: string;
  party: string;
};

type Locale = "vi" | "en";
type CachHoanTat = "nut" | "x" | "roi-trang" | "het-gio";

const CHU: Record<Locale, Record<string, string>> = {
  vi: {
    received: "Đã nhận yêu cầu đặt bàn",
    code: "Mã",
    lastStep: "Còn 1 bước cuối",
    need1: "Bạn cần nhận xác nhận qua",
    or1: "hoặc",
    phoneLabel: "Xác nhận gửi về Zalo/WhatsApp số",
    phoneNote: "Số này cần có Zalo hoặc WhatsApp — chưa đúng thì bấm Sửa số.",
    confirm: "Xác nhận đúng số và đợi xác nhận",
    or: "Hoặc",
    nowTitle: "Nhắn tin nhận xác nhận ngay — không cần đợi",
    zalo: "Nhắn Zalo",
    wa: "Nhắn WhatsApp",
    zaloHint: "Mở Zalo, nhắn mã {bk} là xong.",
    zaloCopied: "Đã chép mã {bk} — dán vào Zalo rồi gửi.",
    waHint: "Tin nhắn có sẵn mã {bk} — chỉ cần bấm gửi.",
    edit: "Sửa số",
    save: "Lưu",
    cancel: "Huỷ",
    saving: "Đang lưu…",
    saved: "Đã cập nhật — xác nhận sẽ gửi về số này.",
    expired: "Đã quá thời gian sửa trên web — bạn nhắn Zalo/WhatsApp kèm mã đặt bàn để đổi số nhé.",
    failed: "Chưa lưu được — bạn nhắn Zalo/WhatsApp kèm mã đặt bàn giúp nhé.",
    newPhone: "Số điện thoại mới",
    close: "Đóng",
    doneTitle: "Hoàn tất!",
    doneLine: "Xác nhận đặt bàn sẽ gửi qua Zalo/WhatsApp tới số",
    doneWait: "Mã đặt bàn {bk} · bạn chỉ cần chờ tin nhắn xác nhận.",
  },
  en: {
    received: "Booking request received",
    code: "Code",
    lastStep: "1 last step",
    need1: "You need to receive your confirmation via",
    or1: "or",
    phoneLabel: "Confirmation will be sent to Zalo/WhatsApp number",
    phoneNote: "This number needs Zalo or WhatsApp — if it's not right, tap Edit.",
    confirm: "Number is correct — I'll wait for confirmation",
    or: "Or",
    nowTitle: "Message us now for instant confirmation — no waiting",
    zalo: "Zalo",
    wa: "WhatsApp",
    zaloHint: "Open Zalo and send your code {bk}.",
    zaloCopied: "Code {bk} copied — paste it in Zalo and send.",
    waHint: "Your code {bk} is pre-filled — just tap send.",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    saving: "Saving…",
    saved: "Updated — your confirmation will be sent to this number.",
    expired: "Editing time has passed — please message us on Zalo/WhatsApp with your booking code.",
    failed: "Couldn't save — please message us on Zalo/WhatsApp with your booking code.",
    newPhone: "New phone number",
    close: "Close",
    doneTitle: "All set!",
    doneLine: "Your booking confirmation will be sent via Zalo/WhatsApp to",
    doneWait: "Booking code {bk} · just wait for our confirmation message.",
  },
};

// Bảng màu cố định (không dùng token của từng web) để màn này đọc rõ trên mọi giao diện; chỉ viền + nút chính
// lấy màu nhận diện của quán. Không màu chữ nào để mờ (sếp chốt 28/10/2026).
const NEN = "#15131B";
const CHU_SANG = "#F4EFE6";
const VANG = "#FFD23F";
const DO_LOI = "#FF6B6B";

function hexA(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h.slice(0, 6), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/** Chữ trên nền màu quán: trắng hay gần đen, bên nào tương phản cao hơn. */
function chuTren(hex: string): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h.slice(0, 6), 16);
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const L = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  return 1.05 / (L + 0.05) >= (L + 0.05) / 0.0625 ? "#FFFFFF" : "#111111";
}

function tinNhan(venue: string, don: DonVuaDat, locale: Locale): string {
  const m = don.date.match(/^\d{4}-(\d{2})-(\d{2})$/);
  const ngay = m ? `${m[2]}/${m[1]}` : don.date;
  return locale === "en"
    ? `Hi ${venue}, I just booked a table on your website, code ${don.bk} — ${don.name}, ${don.time} on ${ngay}, ${don.party} guests. Please confirm, thank you!`
    : `Chào ${venue}, mình vừa đặt bàn trên website, mã ${don.bk} — ${don.name}, ${don.time} ngày ${ngay}, ${don.party} khách. Nhờ xác nhận giúp mình nhé!`;
}

/** Link WhatsApp + tin soạn sẵn; bỏ tham số text cũ (vd Empire có sẵn câu chào) để tin mang mã đơn. */
function waVoiTin(base: string, text: string): string {
  const [goc, q = ""] = base.split("?");
  const giu = q.split("&").filter((p) => p && !p.startsWith("text="));
  return `${goc}?${[...giu, `text=${encodeURIComponent(text)}`].join("&")}`;
}

async function chepVaoBoNho(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    /* trình duyệt cũ / webview chặn clipboard API → cách cũ bên dưới */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

export function XacNhanDatBan({
  don,
  locale = "vi",
  onClose,
  api,
  venue,
  zaloUrl,
  whatsappUrl,
  accent = "#E11D1D",
}: {
  don: DonVuaDat;
  locale?: Locale;
  onClose: () => void;
  /** Route đặt bàn của web: "/api/reserve" | "/api/booking" | "/api/reservation" */
  api: string;
  venue: string;
  zaloUrl: string;
  whatsappUrl: string;
  /** Màu nhận diện của quán (#RRGGBB) cho viền popup + nút xác nhận */
  accent?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22 }}
      aria-modal="true"
      role="dialog"
      aria-label={CHU[locale].lastStep}
    >
      {/* Nền KHÔNG có onClick: bấm ra ngoài không tắt popup */}
      <div className="absolute inset-0 bg-[#06060A]/90 backdrop-blur-md" />
      <motion.div
        className="relative my-auto w-full max-w-[440px] rounded-[1.75rem] border-2 px-5 py-7 text-left sm:rounded-[2rem] sm:px-8 sm:py-8"
        style={{ background: NEN, color: CHU_SANG, borderColor: accent, boxShadow: `0 0 50px ${hexA(accent, 0.45)}` }}
        initial={{ scale: 0.85, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
      >
        <BuocXacNhan key={don.bk} don={don} locale={locale} onClose={onClose} api={api} venue={venue} zaloUrl={zaloUrl} whatsappUrl={whatsappUrl} accent={accent} />
      </motion.div>
    </motion.div>,
    document.body,
  );
}

function NutX({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/60 transition-colors hover:bg-white/15 sm:right-4 sm:top-4"
      style={{ color: CHU_SANG }}
    >
      <X size={18} weight="bold" />
    </button>
  );
}

function BuocXacNhan({
  don,
  locale,
  onClose,
  api,
  venue,
  zaloUrl,
  whatsappUrl,
  accent,
}: {
  don: DonVuaDat;
  locale: Locale;
  onClose: () => void;
  api: string;
  venue: string;
  zaloUrl: string;
  whatsappUrl: string;
  accent: string;
}) {
  const c = CHU[locale];
  const chuNut = chuTren(accent);
  const [phone, setPhone] = useState(don.phone);
  const [coVe, setCoVe] = useState(!!don.token);
  const [daChep, setDaChep] = useState(false);
  const [dangSua, setDangSua] = useState(false);
  const [nhap, setNhap] = useState("");
  const [loiSua, setLoiSua] = useState<string | null>(null);
  const [dangLuu, setDangLuu] = useState(false);
  const [daLuu, setDaLuu] = useState(false);
  const [xong, setXong] = useState(false); // khách đã bấm "Xác nhận đúng số" → màn tích xanh rồi tự đóng
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Vé mới nhất (đổi sau mỗi lần sửa số / gửi card) + hàng đợi: sửa số và gửi card chạy LẦN LƯỢT, không bao
  // giờ song song — gửi card đang chạy mà sửa số bằng vé cũ thì card ra số cũ.
  const veRef = useRef(don.token);
  const hangRef = useRef<Promise<unknown>>(Promise.resolve());
  const daGuiCardRef = useRef(false);
  const xepHang = <T,>(viec: () => Promise<T>): Promise<T> => {
    const p = hangRef.current.then(viec, viec);
    hangRef.current = p.catch(() => undefined);
    return p;
  };

  const hoanTat = (cach: CachHoanTat) =>
    xepHang(async () => {
      const ve = veRef.current;
      if (!ve) return;
      // Rời trang / hết giờ chỉ để card chắc chắn được gửi — card đã gửi rồi thì thôi
      if (daGuiCardRef.current && (cach === "roi-trang" || cach === "het-gio")) return;
      try {
        // keepalive: khách bấm xong là popup đóng / trang có thể đang rời đi — yêu cầu vẫn phải tới máy chủ
        const res = await fetch(`${api}/hoan-tat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: ve, cach }),
          keepalive: true,
        });
        const data = (await res.json().catch(() => ({}))) as { ok?: boolean; suaToken?: string | null };
        if (res.ok && data.ok) {
          daGuiCardRef.current = true;
          if (data.suaToken) veRef.current = data.suaToken;
        }
      } catch {
        /* lần gọi sau (X / nút / rời trang) sẽ thử lại */
      }
    });
  const hoanTatRef = useRef(hoanTat);
  hoanTatRef.current = hoanTat;

  useEffect(() => {
    const anTrang = () => {
      if (document.visibilityState === "hidden") void hoanTatRef.current("roi-trang");
    };
    const roiTrang = () => void hoanTatRef.current("roi-trang");
    const hetGio = window.setTimeout(() => void hoanTatRef.current("het-gio"), 3 * 60_000);
    document.addEventListener("visibilitychange", anTrang);
    window.addEventListener("pagehide", roiTrang);
    return () => {
      window.clearTimeout(hetGio);
      document.removeEventListener("visibilitychange", anTrang);
      window.removeEventListener("pagehide", roiTrang);
    };
  }, []);

  const dong = (cach: "nut" | "x") => {
    suKien("booking_finalize", { cach });
    void hoanTat(cach);
    // Bấm xác nhận: hiện tích xanh "Hoàn tất" cho khách yên tâm rồi mới đóng (sếp chốt 28/10/2026)
    if (cach === "nut") setXong(true);
    else onClose();
  };

  useEffect(() => {
    if (!xong) return;
    const t = window.setTimeout(() => onCloseRef.current(), 5000);
    return () => window.clearTimeout(t);
  }, [xong]);

  const voiMa = (s: string) => s.replace("{bk}", don.bk);
  const uuTienWa = locale === "en" || !phone.trim().startsWith("+84");
  const waHref = waVoiTin(whatsappUrl, tinNhan(venue, { ...don, phone }, locale));

  const bamZalo = () => {
    suKien("confirm_channel_click", { kenh: "zalo" });
    void chepVaoBoNho(don.bk).then(setDaChep);
  };
  const bamWa = () => suKien("confirm_channel_click", { kenh: "whatsapp" });

  const moSua = () => {
    setNhap(hienThiSo(phone));
    setLoiSua(null);
    setDaLuu(false);
    setDangSua(true);
  };

  const luu = async (e: React.FormEvent) => {
    e.preventDefault();
    const intl = chuanHoaSoSua(nhap);
    const loi = kiemTraSo(intl);
    if (loi) {
      setLoiSua(thongBaoLoiSo(loi, locale));
      return;
    }
    setDangLuu(true);
    setLoiSua(null);
    try {
      const { res, data } = await xepHang(async () => {
        const res = await fetch(`${api}/sua-so`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: veRef.current, phone: nhap }),
        });
        const data = (await res.json().catch(() => ({}))) as { ok?: boolean; phone?: string; suaToken?: string | null; reason?: string };
        if (res.ok && data.ok && data.suaToken) veRef.current = data.suaToken;
        return { res, data };
      });
      if (res.ok && data.ok && data.phone) {
        if (data.phone !== phone) suKien("form_phone_fixed");
        setPhone(data.phone);
        setCoVe(!!veRef.current);
        setDangSua(false);
        setDaLuu(true);
      } else {
        setLoiSua(data.reason === "het_han" ? c.expired : c.failed);
      }
    } catch {
      setLoiSua(c.failed);
    } finally {
      setDangLuu(false);
    }
  };

  const nutZalo = (
    <div key="zalo" className="flex flex-col gap-1.5">
      <a
        href={zaloUrl}
        target="_blank"
        rel="noopener"
        data-khong-chuyen-doi
        onClick={bamZalo}
        className="inline-flex min-h-[50px] w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#0068FF] px-2 py-3 text-[13px] font-bold text-white no-underline shadow-[0_10px_28px_-10px_rgba(0,104,255,0.9)] transition hover:brightness-110 active:scale-[0.98]"
      >
        <ChatCircleDots size={19} weight="fill" />
        {c.zalo}
      </a>
      <p className="text-[11.5px] leading-snug" style={{ color: daChep ? VANG : CHU_SANG, fontWeight: daChep ? 600 : 400 }}>
        {daChep ? `✓ ${voiMa(c.zaloCopied)}` : voiMa(c.zaloHint)}
      </p>
    </div>
  );
  const nutWa = (
    <div key="wa" className="flex flex-col gap-1.5">
      <a
        href={waHref}
        target="_blank"
        rel="noopener"
        data-khong-chuyen-doi
        onClick={bamWa}
        className="inline-flex min-h-[50px] w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#0F7D41] px-2 py-3 text-[13px] font-bold text-white no-underline shadow-[0_10px_28px_-10px_rgba(15,125,65,0.9)] transition hover:brightness-110 active:scale-[0.98]"
      >
        <WhatsappLogo size={19} weight="fill" />
        {c.wa}
      </a>
      <p className="text-[11.5px] leading-snug" style={{ color: CHU_SANG }}>
        {voiMa(c.waHint)}
      </p>
    </div>
  );

  return (
    <div className="flex flex-col items-center text-center">
      <NutX label={c.close} onClick={() => (xong ? onClose() : dong("x"))} />

      {xong ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center pb-1 pt-4"
          role="status"
        >
          <TichXanh />
          <h3 className="mt-5 text-[2rem] font-black uppercase leading-none tracking-wider" style={{ color: "#4ADE80" }}>
            {c.doneTitle}
          </h3>
          <p className="mt-4 max-w-[30ch] text-[16px] font-semibold leading-snug" style={{ color: CHU_SANG }}>
            {c.doneLine}
          </p>
          <p className="mt-2 text-[24px] font-bold tabular-nums tracking-[0.06em]" style={{ color: CHU_SANG }}>
            {hienThiSo(phone)}
          </p>
          <p className="mt-3 max-w-[32ch] text-[14px] leading-snug" style={{ color: CHU_SANG }}>
            {voiMa(c.doneWait)}
          </p>
          {/* vạch xanh đầy dần trong 5 giây (cảm giác "đang hoàn tất"), đầy thì popup tự đóng */}
          <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/15" aria-hidden="true">
            <motion.div
              className="h-full rounded-full bg-[#22C55E]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
            />
          </div>
        </motion.div>
      ) : (
        <>
          {/* Đã nhận — để nhỏ; điểm nhấn là "Còn 1 bước cuối" */}
          <p className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-8 text-[13px] font-semibold" style={{ color: CHU_SANG }}>
            <CheckCircle size={18} weight="fill" style={{ color: "#4ADE80" }} />
            {c.received}
            <span
              className="rounded-full border px-2.5 py-0.5 font-mono text-[12px] font-bold tracking-[0.1em]"
              style={{ color: VANG, borderColor: hexA(VANG, 0.4), background: hexA(VANG, 0.1) }}
            >
              {c.code} {don.bk}
            </span>
          </p>

          <motion.h3
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="mt-4 text-[1.85rem] font-black uppercase leading-none tracking-wider sm:text-[2.1rem]"
            style={{ color: VANG, textShadow: "0 0 22px rgba(255,210,63,0.45)" }}
          >
            {c.lastStep}
          </motion.h3>

          <p className="mt-3 max-w-[30ch] text-[16px] font-bold leading-snug sm:text-[17px]" style={{ color: CHU_SANG }}>
            {c.need1} <span className="whitespace-nowrap rounded-md bg-[#0068FF] px-1.5 py-px text-white">Zalo</span> {c.or1}{" "}
            <span className="whitespace-nowrap rounded-md bg-[#0F7D41] px-1.5 py-px text-white">WhatsApp</span>
          </p>

          {/* 1) Soát số → bấm xác nhận */}
          <div className="mt-5 w-full rounded-2xl border bg-black/50 px-4 py-4 text-left" style={{ borderColor: hexA(VANG, 0.4) }}>
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: VANG }}>
              {c.phoneLabel}
            </p>
            {dangSua ? (
              <form onSubmit={luu} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    aria-label={c.newPhone}
                    autoFocus
                    value={nhap}
                    onChange={(e) => {
                      setNhap(e.target.value);
                      if (loiSua) setLoiSua(null);
                    }}
                    onBlur={() => setNhap((v) => dinhDangOSoVN(v))}
                    className="min-h-[46px] min-w-0 flex-1 rounded-xl border px-3 py-2.5 text-[17px] font-semibold tracking-[0.06em] focus:outline-none"
                    style={{ background: NEN, color: CHU_SANG, borderColor: loiSua ? DO_LOI : "rgba(255,255,255,0.3)" }}
                  />
                  <button
                    type="submit"
                    disabled={dangLuu}
                    className="inline-flex min-h-[46px] shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 text-[13px] font-bold uppercase tracking-[0.12em] transition hover:brightness-110 disabled:opacity-60"
                    style={{ background: accent, color: chuNut }}
                  >
                    {dangLuu ? c.saving : c.save}
                  </button>
                </div>
                {loiSua && (
                  <p role="alert" className="text-[12.5px] font-semibold leading-snug" style={{ color: DO_LOI }}>
                    {loiSua}
                  </p>
                )}
                <button type="button" onClick={() => setDangSua(false)} className="text-[12px] underline underline-offset-4" style={{ color: CHU_SANG }}>
                  {c.cancel}
                </button>
              </form>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[20px] font-bold tabular-nums tracking-[0.06em] sm:text-[22px]" style={{ color: CHU_SANG }}>
                    {hienThiSo(phone)}
                  </span>
                  {coVe && (
                    <button
                      type="button"
                      onClick={moSua}
                      className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12.5px] font-bold transition-colors hover:bg-white/10"
                      style={{ color: VANG, borderColor: hexA(VANG, 0.5) }}
                    >
                      <PencilSimple size={14} weight="bold" />
                      {c.edit}
                    </button>
                  )}
                </div>
                {daLuu ? (
                  <p className="mt-2 flex items-center gap-1.5 text-[12.5px] font-semibold" style={{ color: VANG }}>
                    <Check size={14} weight="bold" /> {c.saved}
                  </p>
                ) : (
                  <p className="mt-2 flex items-start gap-1.5 text-[12.5px] leading-snug" style={{ color: CHU_SANG }}>
                    <WarningCircle size={15} weight="fill" className="mt-px shrink-0" style={{ color: VANG }} />
                    {c.phoneNote}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => dong("nut")}
                  className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full px-3 py-3.5 text-[14px] font-bold leading-tight transition hover:brightness-110 active:scale-[0.98]"
                  style={{ background: accent, color: chuNut, boxShadow: `0 12px 30px -10px ${hexA(accent, 0.8)}` }}
                >
                  <Check size={18} weight="bold" className="hidden shrink-0 sm:block" />
                  {c.confirm}
                </button>
              </>
            )}
          </div>

          {/* 2) Hoặc nhắn trước — nhận xác nhận ngay */}
          <div className="my-4 flex w-full items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-white/15" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: CHU_SANG }}>
              {c.or}
            </span>
            <span className="h-px flex-1 bg-white/15" />
          </div>
          <p className="mb-3 text-[13.5px] font-semibold" style={{ color: CHU_SANG }}>
            {c.nowTitle}
          </p>
          <div className="grid w-full grid-cols-2 gap-3 text-center">{uuTienWa ? [nutWa, nutZalo] : [nutZalo, nutWa]}</div>
        </>
      )}
    </div>
  );
}

/** Tích xanh "hoàn tất": vòng tròn bật ra, nét tích tự vẽ, quầng sáng loang 3 nhịp. */
function TichXanh() {
  return (
    <div className="relative h-28 w-28">
      <motion.span
        className="absolute inset-0 rounded-full bg-[#22C55E]"
        initial={{ scale: 0.7, opacity: 0.55 }}
        animate={{ scale: 1.75, opacity: 0 }}
        transition={{ duration: 1.3, delay: 0.35, repeat: 2, ease: "easeOut" }}
      />
      <motion.svg
        viewBox="0 0 112 112"
        className="relative h-28 w-28 drop-shadow-[0_0_24px_rgba(34,197,94,0.65)]"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 15 }}
        aria-hidden="true"
      >
        <circle cx="56" cy="56" r="52" fill="#16A34A" />
        <motion.path
          d="M33 58 L50 75 L81 41"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: 0.3, ease: "easeOut" }}
        />
      </motion.svg>
    </div>
  );
}
