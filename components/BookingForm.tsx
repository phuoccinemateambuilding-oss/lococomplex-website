"use client";

import { useState, useId, useRef } from "react";
import dynamic from "next/dynamic";
import { Warning } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/site";
import { track, reportFormConversion } from "@/lib/gtag";
import { isOfficialHost, officialOrigin } from "@/lib/official-host";
import { FormSuccessModal } from "./FormSuccessModal";
import { CountryCodeSelect } from "./CountryCodeSelect";
import { DEFAULT_COUNTRY, formatIntlPhone } from "@/lib/countryCodes";
import { kiemTraSo, thongBaoLoiSo } from "@/lib/phone-check";
import { suKien, useOSoDienThoai } from "@/lib/o-so-dien-thoai";
import type { DonVuaDat } from "./XacNhanDatBan";

// Màn "Còn 1 bước cuối" (28/10/2026) — chỉ tải sau khi gửi form
const XacNhanDatBan = dynamic(
  () => import("./XacNhanDatBan").then((m) => ({ default: m.XacNhanDatBan })),
  { ssr: false },
);

interface BookingFormProps {
  locale?: "vi" | "en";
  t: {
    formName: string;
    formPhone: string;
    formDate: string;
    formTime: string;
    formGuests: string;
    formMessage: string;
    formSubmit: string;
    formSuccess?: string;
    formError?: string;
  };
}

type Status = "idle" | "submitting" | "success" | "error";

const TIME_SLOTS = ["22:00", "22:30", "23:00", "23:30", "00:00", "00:30", "01:00", "01:30", "02:00", "03:00"];

const today = new Date().toISOString().split("T")[0];

export default function BookingForm({ locale = "vi", t }: BookingFormProps) {
  const fid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [values, setValues] = useState({
    name: "",
    country: DEFAULT_COUNTRY,
    phone: "",
    date: "",
    time: "",
    party: "2",
    note: "",
    bot_field: "",
  });
  // Ô số tự chia nhóm + kiểm đầu số (28/10/2026); don = đơn vừa gửi → màn "Còn 1 bước cuối"
  const so = useOSoDienThoai(values.country);
  const oSoRef = useRef<HTMLInputElement>(null);
  const [don, setDon] = useState<DonVuaDat | null>(null);

  const set = (field: keyof typeof values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setValues((v) => ({ ...v, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    const fullPhone = formatIntlPhone(values.country, so.value);
    // Chặn số sai ngay trên form (28/10/2026): độ dài, đầu số di động VN, số "cho có"
    const loiSo = kiemTraSo(fullPhone);
    if (loiSo) {
      so.setLoi(loiSo);
      oSoRef.current?.focus();
      suKien("form_phone_invalid", { loi: loiSo });
      return;
    }
    setStatus("submitting");
    track("form_submit", { cta_location: "booking_form" });
    const payload = { ...values, phone: fullPhone, locale };
    try {
      if (!isOfficialHost(window.location.hostname)) {
        // Form đang chạy trên website sao chép → gửi đơn thẳng về tên miền chính thay vì máy chủ bản chép.
        // no-cors + text/plain để trình duyệt cho gửi sang tên miền khác (không đọc được phản hồi).
        await fetch(`${officialOrigin()}/api/reserve`, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          body: JSON.stringify({ ...payload, site: window.location.hostname }),
        });
        setDon(null);
        setStatus("success");
        return;
      }
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // flow 2: màn cảm ơn có bước soát số → máy chủ giữ card Telegram tới khi khách xong bước đó
        body: JSON.stringify({ ...payload, flow: 2 }),
      });
      const data = (await res.json().catch(() => ({ ok: false }))) as { ok?: boolean; bookingId?: string; suaToken?: string | null };
      const ok = res.ok && data.ok;
      setDon(
        ok && data.bookingId
          ? { bk: String(data.bookingId), phone: fullPhone, token: data.suaToken || null, name: values.name, date: values.date, time: values.time, party: values.party }
          : null,
      );
      setStatus(ok ? "success" : "error");
      if (ok) {
        await reportFormConversion(fullPhone, values.name, Number(values.party) || 0);
      } else {
        track("form_error", { cta_location: "booking_form" });
      }
    } catch {
      setStatus("error");
      track("form_error", { cta_location: "booking_form" });
    }
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl border-2 border-ink/10 bg-white focus:border-loco-red focus:outline-none transition-colors text-base min-h-[48px]";

  function handleClose() {
    setStatus("idle");
    setValues({ name: "", country: DEFAULT_COUNTRY, phone: "", date: "", time: "", party: "2", note: "", bot_field: "" });
    so.reset();
    setDon(null);
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Honeypot — ẩn với user, bot sẽ tự điền */}
      <input
        type="text"
        name="bot_field"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={values.bot_field}
        onChange={set("bot_field")}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      <div>
        <label htmlFor={`${fid}-name`} className="block text-sm font-normal text-ink mb-1.5">{t.formName} *</label>
        <input
          id={`${fid}-name`}
          type="text"
          required
          autoComplete="name"
          value={values.name}
          onChange={set("name")}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor={`${fid}-phone`} className="block text-sm font-normal text-ink mb-1.5">{t.formPhone} *</label>
        <div className="flex gap-2">
          <CountryCodeSelect
            value={values.country}
            onChange={(e) => {
              set("country")(e);
              so.doiMaNuoc(e.target.value);
            }}
            ariaLabel={locale === "vi" ? "Mã quốc gia" : "Country code"}
            className="w-[110px] shrink-0 px-2 py-3 rounded-xl border-2 border-ink/10 bg-white focus:border-loco-red focus:outline-none transition-colors text-base min-h-[48px] text-center"
          />
          <input
            ref={oSoRef}
            id={`${fid}-phone`}
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            pattern="[0-9+\s]{9,}"
            value={so.value}
            onChange={so.onChange}
            onBlur={so.onBlur}
            aria-invalid={so.loi ? true : undefined}
            aria-describedby={so.loi ? "phone-error" : undefined}
            className={`${inputClass} flex-1 min-w-0`}
          />
        </div>
        {so.loi && (
          <p id="phone-error" role="alert" className="mt-1.5 text-[12.5px] font-semibold leading-snug text-loco-red">
            {thongBaoLoiSo(so.loi, locale)}
          </p>
        )}
        <p className="mt-1.5 text-[12px] font-medium leading-snug text-ink">
          {locale === "en"
            ? "💬 Your confirmation is sent via Zalo/WhatsApp — please use a number with Zalo or WhatsApp."
            : "💬 Xác nhận đặt bàn gửi qua Zalo/WhatsApp — hãy dùng số có Zalo hoặc WhatsApp."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${fid}-date`} className="block text-sm font-normal text-ink mb-1.5">{t.formDate} *</label>
          <input
            id={`${fid}-date`}
            type="date"
            required
            min={today}
            value={values.date}
            onChange={set("date")}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`${fid}-time`} className="block text-sm font-normal text-ink mb-1.5">{t.formTime} *</label>
          <select
            id={`${fid}-time`}
            required
            value={values.time}
            onChange={set("time")}
            className={inputClass}
          >
            <option value="">{locale === "vi" ? "Chọn giờ" : "Select time"}</option>
            {TIME_SLOTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={`${fid}-party`} className="block text-sm font-normal text-ink mb-1.5">{t.formGuests} *</label>
        <input
          id={`${fid}-party`}
          type="number"
          required
          min={1}
          max={50}
          inputMode="numeric"
          value={values.party}
          onChange={set("party")}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor={`${fid}-note`} className="block text-sm font-normal text-ink mb-1.5">{t.formMessage}</label>
        <textarea
          id={`${fid}-note`}
          rows={3}
          value={values.note}
          onChange={set("note")}
          className="w-full px-4 py-3 rounded-xl border-2 border-ink/10 bg-white focus:border-loco-red focus:outline-none transition-colors resize-none text-base"
        />
      </div>

      {status === "error" && (
        <div className="flex items-start gap-3 bg-red-50 border-2 border-loco-red/40 rounded-xl p-4 text-sm">
          <Warning size={20} weight="fill" className="text-loco-red mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-loco-red">
              {t.formError ?? (locale === "vi" ? "Gửi thất bại." : "Submission failed.")}
            </p>
            <p className="text-ink/70 mt-0.5">
              {locale === "vi" ? "Vui lòng gọi " : "Please call "}
              <a href={site.phoneTel} className="font-bold text-loco-red hover:underline">
                {site.phone}
              </a>
            </p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-loco-red text-white font-bold py-4 rounded-full text-lg hover:bg-loco-red/90 active:scale-[0.98] transition-all min-h-[48px] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting"
          ? (locale === "vi" ? "Đang gửi…" : "Sending…")
          : t.formSubmit}
      </button>
    </form>
    {status === "success" && don ? (
      // Màn "Còn 1 bước cuối" (28/10/2026): soát / sửa số Zalo-WhatsApp, card Telegram gửi sau bước này
      <XacNhanDatBan
        don={don}
        locale={locale}
        onClose={handleClose}
        api="/api/reserve"
        venue="LOCO Complex"
        zaloUrl="https://zalo.me/0905806518"
        whatsappUrl="https://wa.me/84905806518"
        accent="#D63427"
      />
    ) : (
      <FormSuccessModal
        open={status === "success"}
        onClose={handleClose}
        locale={locale}
        intent="booking"
      />
    )}
    </>
  );
}
