"use client";

import { useState, useId } from "react";
import { Warning } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/site";
import { track } from "@/lib/gtag";
import { FormSuccessModal } from "./FormSuccessModal";

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

const TIME_SLOTS = ["18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];

const today = new Date().toISOString().split("T")[0];

export default function BookingForm({ locale = "vi", t }: BookingFormProps) {
  const fid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [values, setValues] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    party: "2",
    note: "",
    bot_field: "",
  });

  const set = (field: keyof typeof values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setValues((v) => ({ ...v, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    track("form_submit", { cta_location: "booking_form" });
    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      const ok = res.ok && data.ok;
      setStatus(ok ? "success" : "error");
      if (ok) {
        track("form_success", {
          cta_location: "booking_form",
          guests: Number(values.party) || 0,
        });
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
    setValues({ name: "", phone: "", date: "", time: "", party: "2", note: "", bot_field: "" });
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
        <input
          id={`${fid}-phone`}
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          pattern="[0-9+\s]{9,}"
          value={values.phone}
          onChange={set("phone")}
          className={inputClass}
        />
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
    <FormSuccessModal
      open={status === "success"}
      onClose={handleClose}
      locale={locale}
      intent="booking"
    />
    </>
  );
}
