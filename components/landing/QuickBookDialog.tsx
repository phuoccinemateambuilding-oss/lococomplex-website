"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import {
  User,
  Phone,
  UsersThree,
  Calendar,
  Clock,
  X,
  ArrowDown,
  ShieldCheck,
  CalendarCheck,
  SpinnerGap,
} from "@phosphor-icons/react/dist/ssr";
import { BRAND } from "@/lib/brand";
import { track, reportFormConversion } from "@/lib/gtag";
import { isOfficialHost, officialOrigin } from "@/lib/official-host";
import { OPEN_QUICK_BOOK_EVENT, QUICK_BOOK_ACK_EVENT } from "@/lib/quick-book";
import { ZaloIcon } from "./ZaloIcon";
import { FormSuccessModal } from "../FormSuccessModal";
import { CountryCodeSelect } from "../CountryCodeSelect";
import { DEFAULT_COUNTRY, formatIntlPhone } from "@/lib/countryCodes";
import { kiemTraSo, thongBaoLoiSo } from "@/lib/phone-check";
import { suKien, useOSoDienThoai } from "@/lib/o-so-dien-thoai";
import type { DonVuaDat } from "../XacNhanDatBan";

// Form đặt bàn NHANH 5 ô bắt buộc (tên · SĐT · số khách · ngày · giờ đến, như B40) — bật tại chỗ khi bấm
// nút "Đặt bàn" ở hero, header, thanh dính đáy. Đề xuất #2 ads-ops 28/10/2026, anh Phước duyệt.
// Tên + giờ là của khách thật (nhân viên cần để giữ bàn) — KHÔNG điền tên tạm hay giờ cố định.
//
// Gửi CÙNG endpoint + CÙNG luồng với form dài LandingReservationForm (/api/reserve, flow 2 → màn "Còn 1 bước cuối"),
// cùng cách đếm chuyển đổi (track form_submit trước fetch, reportFormConversion khi thành công). Form dài #form giữ nguyên.
// Bấm Gọi / Zalo trong form được TelClickTracker / ZaloClickTracker ở layout đếm như mọi nút khác.

const XacNhanDatBan = dynamic(
  () => import("../XacNhanDatBan").then((m) => ({ default: m.XacNhanDatBan })),
  { ssr: false },
);

const COPY = {
  vi: {
    kicker: "Đặt nhanh · 1 phút",
    title: "Giữ bàn tại LOCO",
    promise: "Xác nhận trong 15 phút qua Zalo / điện thoại · Giữ chỗ miễn phí",
    name: "Tên người đặt",
    namePh: "Tên của bạn",
    phone: "Số điện thoại (có Zalo / WhatsApp)",
    party: "Số khách",
    partyPh: "Chọn",
    date: "Ngày đến",
    time: "Giờ đến",
    timePh: "Chọn giờ",
    submit: "Giữ bàn ngay",
    sending: "Đang gửi…",
    or: "Hoặc liên hệ ngay",
    call: "Gọi Hotline",
    full: "Muốn ghi chú sinh nhật, yêu cầu riêng? Điền form đầy đủ",
    close: "Đóng",
    country: "Mã quốc gia",
    nameRequired: "Vui lòng nhập tên người đặt",
    partyRequired: "Vui lòng chọn số khách",
    dateRequired: "Vui lòng chọn ngày đến",
    timeRequired: "Vui lòng chọn giờ đến",
    error: "Gửi chưa thành công — vui lòng thử lại hoặc gọi hotline",
    consentPre: "Gửi thông tin là bạn đồng ý với ",
    consentLink: "Chính sách bảo mật",
  },
  en: {
    kicker: "Quick booking · 1 minute",
    title: "Hold a table at LOCO",
    promise: "Confirmed within 15 minutes via Zalo / phone · Free reservation",
    name: "Your name",
    namePh: "Your name",
    phone: "Phone (with Zalo / WhatsApp)",
    party: "Guests",
    partyPh: "Select",
    date: "Date",
    time: "Arrival time",
    timePh: "Select",
    submit: "Hold my table",
    sending: "Sending…",
    or: "Or reach us now",
    call: "Call Hotline",
    full: "Need a note (birthday, special request)? Use the full form",
    close: "Close",
    country: "Country code",
    nameRequired: "Please enter your name",
    partyRequired: "Please select the number of guests",
    dateRequired: "Please pick a date",
    timeRequired: "Please select your arrival time",
    error: "Something went wrong — please retry or call the hotline",
    consentPre: "By sending, you agree to our ",
    consentLink: "Privacy Policy",
  },
} as const;

// API đếm khách bằng cách bỏ ký tự không phải số → value chỉ là số thuần ("30", không "30+")
const PARTY_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30];
// Cùng khung giờ với form dài (mở cửa 22:00 – 05:00)
const TIME_SLOTS = ["22:00", "22:30", "23:00", "23:30", "00:00", "00:30", "01:00", "01:30", "02:00", "03:00"];

function homNayVN(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
}

type Status = "idle" | "submitting" | "success" | "error";

export default function QuickBookDialog({ locale }: { locale: "vi" | "en" }) {
  const c = COPY[locale];
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [party, setParty] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bot, setBot] = useState("");
  const [today, setToday] = useState("");
  // Ô số tự chia nhóm + kiểm đầu số (như form dài); don = đơn vừa gửi → màn "Còn 1 bước cuối"
  const so = useOSoDienThoai(country);
  const [don, setDon] = useState<DonVuaDat | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    function onOpen(e: Event) {
      window.dispatchEvent(new Event(QUICK_BOOK_ACK_EVENT));
      triggerRef.current = document.activeElement;
      const t = homNayVN();
      setToday(t);
      setDate((d) => (d && d >= t ? d : t));
      setErr("");
      setStatus((s) => (s === "success" ? s : "idle"));
      setOpen(true);
      track("cta_click", { cta_name: "quick_form_open", cta_location: String((e as CustomEvent).detail?.source ?? "") });
    }
    window.addEventListener(OPEN_QUICK_BOOK_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_QUICK_BOOK_EVENT, onOpen);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    (triggerRef.current as HTMLElement | null)?.focus?.({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!open) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    // Chuột (desktop) → con trỏ vào ô tên luôn; cảm ứng → không bật bàn phím che mất form
    requestAnimationFrame(() => {
      if (window.matchMedia("(pointer: fine)").matches) nameRef.current?.focus();
      else panelRef.current?.focus();
    });
    return () => {
      document.body.style.overflow = orig;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    if (bot) return;
    const form = e.currentTarget;
    const nm = name.trim();
    if (nm.length < 2) {
      setErr(c.nameRequired);
      nameRef.current?.focus();
      return;
    }
    const fullPhone = formatIntlPhone(country, so.value);
    // Chặn số sai ngay trên form (như form dài): độ dài, đầu số di động VN, số "cho có"
    const loiSo = kiemTraSo(fullPhone);
    if (loiSo) {
      setErr("");
      so.setLoi(loiSo);
      document.getElementById("qb-phone")?.focus();
      suKien("form_phone_invalid", { loi: loiSo, form: "quick" });
      return;
    }
    const field = (n: string) => form.elements.namedItem(n) as HTMLElement | null;
    if (!party) {
      setErr(c.partyRequired);
      field("party")?.focus();
      return;
    }
    if (!date) {
      setErr(c.dateRequired);
      field("date")?.focus();
      return;
    }
    if (!time) {
      setErr(c.timeRequired);
      field("time")?.focus();
      return;
    }
    const payload = { name: nm, country, phone: fullPhone, date, time, party, note: "", bot_field: "" };
    setErr("");
    setStatus("submitting");
    track("form_submit", { cta_location: "landing_quick" });
    try {
      if (!isOfficialHost(window.location.hostname)) {
        // Form đang chạy trên website sao chép → gửi đơn thẳng về tên miền chính (giống form dài).
        await fetch(`${officialOrigin()}/api/reserve`, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          body: JSON.stringify({ ...payload, locale, site: window.location.hostname }),
        });
        setDon(null);
        setOpen(false);
        setStatus("success");
        return;
      }
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // flow 2: giống form dài — card Telegram gửi sau bước soát số trên màn cảm ơn
        body: JSON.stringify({ ...payload, locale, flow: 2 }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json().catch(() => ({}))) as { bookingId?: string; suaToken?: string | null };
      setDon(
        data.bookingId
          ? { bk: String(data.bookingId), phone: fullPhone, token: data.suaToken || null, name: nm, date, time, party }
          : null,
      );
      setOpen(false);
      setStatus("success");
      await reportFormConversion(fullPhone, nm, Number(party) || 0);
    } catch {
      setStatus("error");
      track("form_error", { cta_location: "landing_quick" });
    }
  }

  function reset() {
    setStatus("idle");
    setDon(null);
    setName("");
    setParty("");
    setTime("");
    so.reset();
  }

  const busy = status === "submitting";
  const labelCls =
    "mb-2 flex items-center gap-1.5 font-[family-name:var(--font-space-mono)] text-[0.65rem] font-bold uppercase tracking-[0.2em] text-loco-yellow/90";
  const inputCls =
    "block w-full min-w-0 min-h-[48px] appearance-none rounded-2xl border-2 border-white/20 bg-midnight/70 px-4 py-3 text-[16px] font-normal text-white placeholder:text-white/55 focus:border-loco-red focus:outline-none focus:ring-2 focus:ring-loco-red/40 hover:border-white/35 transition [color-scheme:dark] disabled:opacity-60";

  return (
    <>
      {status === "success" && don ? (
        // Màn "Còn 1 bước cuối": soát / sửa số Zalo-WhatsApp, card Telegram gửi sau bước này (như form dài)
        <XacNhanDatBan
          don={don}
          locale={locale}
          onClose={reset}
          api="/api/reserve"
          venue="LOCO Complex"
          zaloUrl={BRAND.zaloUrl}
          whatsappUrl={BRAND.whatsappUrl}
          accent="#D63427"
        />
      ) : (
        <FormSuccessModal open={status === "success"} onClose={reset} locale={locale} intent="booking" />
      )}
      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="qb-title"
            className="fixed inset-0 z-[90] flex items-end justify-center md:items-center md:p-6"
          >
            <div className="absolute inset-0 bg-midnight-deep/80 backdrop-blur-sm" onClick={close} aria-hidden="true" />
            <div
              ref={panelRef}
              tabIndex={-1}
              className="relative max-h-[94dvh] w-full overflow-y-auto rounded-t-3xl border-2 border-loco-red/40 bg-midnight px-5 pt-5 text-white shadow-[0_-18px_60px_-12px_rgba(214,52,39,0.45)] outline-none md:max-w-[460px] md:rounded-3xl md:p-8"
              style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
            >
              <button
                type="button"
                onClick={close}
                aria-label={c.close}
                className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <X size={20} weight="bold" />
              </button>

              <p className="font-[family-name:var(--font-space-mono)] text-[10px] font-bold uppercase tracking-[0.25em] text-loco-red">
                {c.kicker}
              </p>
              <h2 id="qb-title" className="mt-2 pr-10 font-display-vn text-2xl font-extrabold uppercase leading-tight text-cream">
                {c.title}
              </h2>
              <p className="mt-2 flex items-start gap-2 text-[13.5px] font-semibold leading-snug text-loco-yellow">
                <ShieldCheck weight="fill" size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                {c.promise}
              </p>

              <form onSubmit={onSubmit} noValidate className="mt-5">
                {/* honeypot chống bot */}
                <input
                  type="text"
                  name="bot_field"
                  value={bot}
                  onChange={(e) => setBot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <label htmlFor="qb-name" className={labelCls}>
                  <User size={13} weight="fill" aria-hidden="true" /> {c.name} <span className="text-loco-red">*</span>
                </label>
                <input
                  ref={nameRef}
                  id="qb-name"
                  name="name"
                  type="text"
                  required
                  maxLength={80}
                  autoComplete="name"
                  placeholder={c.namePh}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (err) setErr("");
                  }}
                  className={`${inputCls} mb-4`}
                  disabled={busy}
                />

                <label htmlFor="qb-phone" className={labelCls}>
                  <Phone size={13} weight="fill" aria-hidden="true" /> {c.phone} <span className="text-loco-red">*</span>
                </label>
                <div className="flex gap-2">
                  <CountryCodeSelect
                    name="dial_country"
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      so.doiMaNuoc(e.target.value);
                    }}
                    ariaLabel={c.country}
                    className="w-[104px] shrink-0 min-h-[48px] appearance-none rounded-2xl border-2 border-white/20 bg-midnight/70 px-2 py-3 text-center text-[16px] font-normal text-white focus:border-loco-red focus:outline-none focus:ring-2 focus:ring-loco-red/40 transition [color-scheme:dark]"
                  />
                  <input
                    id="qb-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    placeholder="09xx xxx xxx"
                    value={so.value}
                    onChange={so.onChange}
                    onBlur={so.onBlur}
                    aria-invalid={so.loi ? true : undefined}
                    aria-describedby={so.loi ? "qb-phone-error" : undefined}
                    className={`${inputCls} flex-1 ${so.loi ? "!border-red-400" : ""}`}
                    disabled={busy}
                  />
                </div>
                {so.loi && (
                  <p id="qb-phone-error" role="alert" className="mt-1.5 text-[12.5px] font-semibold leading-snug text-red-400">
                    {thongBaoLoiSo(so.loi, locale)}
                  </p>
                )}

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="min-w-0">
                    <label htmlFor="qb-party" className={labelCls}>
                      <UsersThree size={13} weight="fill" aria-hidden="true" /> {c.party} <span className="text-loco-red">*</span>
                    </label>
                    <select
                      id="qb-party"
                      name="party"
                      required
                      value={party}
                      onChange={(e) => {
                        setParty(e.target.value);
                        if (err) setErr("");
                      }}
                      className={inputCls}
                      disabled={busy}
                    >
                      <option value="" disabled>
                        {c.partyPh}
                      </option>
                      {PARTY_OPTIONS.map((n) => (
                        <option key={n} value={String(n)}>
                          {n === 30 ? "30+" : n}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="min-w-0">
                    <label htmlFor="qb-date" className={labelCls}>
                      <Calendar size={13} weight="fill" aria-hidden="true" /> {c.date} <span className="text-loco-red">*</span>
                    </label>
                    <input
                      id="qb-date"
                      name="date"
                      type="date"
                      required
                      min={today || undefined}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={`${inputCls} h-12`}
                      disabled={busy}
                    />
                  </div>
                </div>

                <div className="mt-4 min-w-0">
                  <label htmlFor="qb-time" className={labelCls}>
                    <Clock size={13} weight="fill" aria-hidden="true" /> {c.time} <span className="text-loco-red">*</span>
                  </label>
                  <select
                    id="qb-time"
                    name="time"
                    required
                    value={time}
                    onChange={(e) => {
                      setTime(e.target.value);
                      if (err) setErr("");
                    }}
                    className={inputCls}
                    disabled={busy}
                  >
                    <option value="" disabled>
                      {c.timePh}
                    </option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {(err || status === "error") && (
                  <p role="alert" className="mt-4 text-sm font-semibold text-red-400">
                    {err || c.error} ·{" "}
                    <a href={`tel:${BRAND.phoneTel}`} data-cta-location="quick_form_error" className="underline">
                      {BRAND.phoneDisplay}
                    </a>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-loco-red text-base font-bold uppercase tracking-wider text-white shadow-[0_12px_45px_-10px_rgba(214,52,39,0.65)] transition hover:bg-loco-red/90 disabled:opacity-60"
                >
                  {busy ? (
                    <>
                      <SpinnerGap weight="bold" className="h-5 w-5 animate-spin" />
                      {c.sending}
                    </>
                  ) : (
                    <>
                      <CalendarCheck weight="fill" className="h-5 w-5" />
                      {c.submit}
                    </>
                  )}
                </button>
                <p className="mt-2 text-center text-[11.5px] text-white/60">
                  {c.consentPre}
                  <a
                    href={locale === "en" ? "/en/privacy" : "/chinh-sach-bao-mat"}
                    target="_blank"
                    rel="noopener"
                    className="underline underline-offset-2 hover:text-loco-yellow"
                  >
                    {c.consentLink}
                  </a>
                  .
                </p>
              </form>

              {/* Không muốn điền? Gọi / Zalo ngay */}
              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="font-[family-name:var(--font-space-mono)] text-[10px] uppercase tracking-[0.22em] text-white/60">{c.or}</p>
                <div className="mt-2 grid grid-cols-2 gap-2.5">
                  <a
                    href={`tel:${BRAND.phoneTel}`}
                    data-cta-location="quick_form"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 border-loco-red/60 px-3 text-xs font-bold uppercase tracking-wider text-loco-red"
                  >
                    <Phone size={16} weight="fill" aria-hidden="true" /> {c.call}
                  </a>
                  <a
                    href={BRAND.zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cta-location="quick_form"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#0068FF] px-3 text-xs font-bold uppercase tracking-wider text-white"
                  >
                    <ZaloIcon size={18} />
                    Zalo
                  </a>
                </div>
                <a
                  href="#form"
                  onClick={(e) => {
                    // Đóng rồi cuộn thẳng tới form dài (không trả focus về nút ở hero kẻo trang bị kéo ngược lên)
                    e.preventDefault();
                    setOpen(false);
                    requestAnimationFrame(() => document.getElementById("form")?.scrollIntoView({ behavior: "smooth" }));
                  }}
                  className="mt-3 flex items-center justify-center gap-1.5 text-center text-[12.5px] font-semibold text-white/70 underline underline-offset-2 hover:text-loco-yellow"
                >
                  {c.full} <ArrowDown size={13} weight="bold" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
