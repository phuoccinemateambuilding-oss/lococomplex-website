"use client";

import { useState, useId } from "react";
import {
  CheckCircle,
  Warning,
  CalendarCheck,
  SpinnerGap,
  ShieldCheck,
  Phone,
} from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/lib/brand";
import { buildCalendarUrl } from "@/lib/calendarLink";
import { ZaloIcon } from "./ZaloIcon";
import { track } from "@/lib/gtag";

type Status = "idle" | "submitting" | "success" | "error";

type Dform = {
  h2: string;
  formTitle: string;
  formSub: string;
  fieldName: string;
  fieldPhone: string;
  fieldDate: string;
  fieldTime: string;
  fieldGuests: string;
  fieldNote: string;
  submitBtn: string;
  submittingBtn: string;
  successTitle: string;
  successSub: string;
  successCalendar: string;
  successZalo: string;
  successReset: string;
  errorTitle: string;
  errorSub: string;
  trustTitle: string;
  trust1: string;
  trust2: string;
  trust3: string;
  fallbackTitle: string;
  recapDate: string;
  recapTime: string;
  recapGuests: string;
  recapNote: string;
};

const TIME_SLOTS = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"];

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export function LandingReservationForm({ dict, locale }: { dict: Dform; locale: "vi" | "en" }) {
  const formId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [values, setValues] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    party: "",
    note: "",
    bot_field: "",
  });
  const [submitted, setSubmitted] = useState<typeof values | null>(null);

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (values.bot_field) return;
    setStatus("submitting");
    track("form_submit", { cta_location: "landing_form" });

    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSubmitted(values);
      setStatus("success");
      track("form_success", { cta_location: "landing_form" });
    } catch {
      setStatus("error");
      track("form_error", { cta_location: "landing_form" });
    }
  }

  function resetForm() {
    setStatus("idle");
    setValues({ name: "", phone: "", date: "", time: "", party: "", note: "", bot_field: "" });
    setSubmitted(null);
  }

  const calendarUrl = submitted
    ? buildCalendarUrl({ name: submitted.name, date: submitted.date, time: submitted.time, tier: "", party: submitted.party, note: submitted.note, locale })
    : "";

  const inputCls = "block w-full min-w-0 min-h-[48px] appearance-none rounded-2xl border border-white/15 bg-midnight/60 px-4 py-3 text-[16px] text-white placeholder:text-white/30 focus:border-loco-red/60 focus:outline-none focus:ring-1 focus:ring-loco-red/40 transition [color-scheme:dark]";
  const labelCls = "mb-1.5 block font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-widest text-white/50";

  return (
    <section id="form" className="relative scroll-mt-20 border-t border-white/5 bg-midnight py-10 md:scroll-mt-24 md:py-16">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
          {/* Form card */}
          <div className="rounded-3xl border border-white/15 bg-midnight/70 p-6 backdrop-blur-sm md:p-8">
            <AnimatePresence mode="wait">
              {status === "success" && submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center py-6 text-center"
                >
                  <CheckCircle weight="fill" className="mb-4 h-14 w-14 text-loco-yellow" />
                  <h3 className="mb-2 font-display-vn text-2xl uppercase tracking-wider text-cream">
                    {dict.successTitle}
                  </h3>
                  <p className="mb-8 text-sm text-white/60">{dict.successSub}</p>

                  {/* Recap */}
                  <div className="mb-8 grid w-full grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-midnight/60 p-4 text-left">
                    <div>
                      <p className="font-[family-name:var(--font-space-mono)] text-xs text-white/65 uppercase tracking-widest">{dict.recapDate}</p>
                      <p className="font-[family-name:var(--font-space-mono)] text-sm text-white">{submitted.date}</p>
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-space-mono)] text-xs text-white/65 uppercase tracking-widest">{dict.recapTime}</p>
                      <p className="font-[family-name:var(--font-space-mono)] text-sm text-white">{submitted.time}</p>
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-space-mono)] text-xs text-white/65 uppercase tracking-widest">{dict.recapGuests}</p>
                      <p className="font-[family-name:var(--font-space-mono)] text-sm text-white">{submitted.party}</p>
                    </div>
                    {submitted.note && (
                      <div className="col-span-2">
                        <p className="font-[family-name:var(--font-space-mono)] text-xs text-white/65 uppercase tracking-widest">{dict.recapNote}</p>
                        <p className="text-sm text-white/70">{submitted.note}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex w-full flex-col gap-3">
                    <a
                      href={calendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-loco-yellow/15 text-sm font-bold uppercase tracking-wider text-loco-yellow transition hover:bg-loco-yellow/25"
                    >
                      <CalendarCheck weight="fill" className="h-4 w-4" />
                      {dict.successCalendar}
                    </a>
                    <a
                      href={BRAND.zaloUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0068FF]/15 text-sm font-bold uppercase tracking-wider text-[#4CA6FF] transition hover:bg-[#0068FF]/25"
                    >
                      <ZaloIcon size={16} />
                      {dict.successZalo}
                    </a>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex h-12 w-full items-center justify-center rounded-full border border-white/20 text-sm font-bold uppercase tracking-wider text-white/60 transition hover:border-white/40 hover:text-white/80"
                    >
                      {dict.successReset}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  id={formId}
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <h3 className="mb-1 font-display-vn text-xl uppercase tracking-wider text-cream md:text-2xl">
                    {dict.formTitle}
                  </h3>
                  <p className="mb-6 text-sm text-white/50">{dict.formSub}</p>

                  {/* Honeypot */}
                  <input
                    name="bot_field"
                    tabIndex={-1}
                    value={values.bot_field}
                    onChange={set("bot_field")}
                    style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                    aria-hidden="true"
                  />

                  <div className="flex flex-col gap-4">
                    {/* Name */}
                    <div>
                      <label htmlFor={`${formId}-name`} className={labelCls}>{dict.fieldName}</label>
                      <input
                        id={`${formId}-name`}
                        type="text"
                        autoComplete="name"
                        required
                        value={values.name}
                        onChange={set("name")}
                        className={inputCls}
                        placeholder="Nguyen Van A"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor={`${formId}-phone`} className={labelCls}>{dict.fieldPhone}</label>
                      <input
                        id={`${formId}-phone`}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        required
                        pattern="[0-9+\s]{9,}"
                        value={values.phone}
                        onChange={set("phone")}
                        className={inputCls}
                        placeholder="0866 433 754"
                      />
                    </div>

                    {/* Date + Time */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label htmlFor={`${formId}-date`} className={labelCls}>{dict.fieldDate}</label>
                        <input
                          id={`${formId}-date`}
                          type="date"
                          required
                          min={todayStr()}
                          value={values.date}
                          onChange={set("date")}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label htmlFor={`${formId}-time`} className={labelCls}>{dict.fieldTime}</label>
                        <select
                          id={`${formId}-time`}
                          required
                          value={values.time}
                          onChange={set("time")}
                          className={inputCls}
                        >
                          <option value="" disabled>--:--</option>
                          {TIME_SLOTS.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Guests */}
                    <div>
                      <label htmlFor={`${formId}-party`} className={labelCls}>{dict.fieldGuests}</label>
                      <input
                        id={`${formId}-party`}
                        type="number"
                        inputMode="numeric"
                        required
                        min={1}
                        max={200}
                        value={values.party}
                        onChange={set("party")}
                        className={inputCls}
                        placeholder="2"
                      />
                    </div>

                    {/* Note */}
                    <div>
                      <label htmlFor={`${formId}-note`} className={labelCls}>{dict.fieldNote}</label>
                      <textarea
                        id={`${formId}-note`}
                        rows={3}
                        value={values.note}
                        onChange={set("note")}
                        className={`${inputCls} resize-none`}
                        placeholder={locale === "vi" ? "Sinh nhật, yêu cầu đặc biệt..." : "Birthday, special requests..."}
                      />
                    </div>

                    {/* Error state */}
                    {status === "error" && (
                      <div className="flex items-start gap-3 rounded-2xl border border-crimson/40 bg-crimson/10 p-4">
                        <Warning weight="fill" className="mt-0.5 h-5 w-5 shrink-0 text-crimson" />
                        <div>
                          <p className="text-sm font-semibold text-crimson">{dict.errorTitle}</p>
                          <p className="text-sm text-white/60">{dict.errorSub}</p>
                          <a href={`tel:${BRAND.phoneTel}`} className="mt-2 inline-flex items-center gap-1 font-[family-name:var(--font-space-mono)] text-sm font-bold text-loco-red">
                            <Phone weight="fill" className="h-4 w-4" />
                            {BRAND.phoneDisplay}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-loco-red text-sm font-bold uppercase tracking-wider text-white transition hover:bg-loco-red/85 disabled:opacity-60"
                    >
                      {status === "submitting" ? (
                        <>
                          <SpinnerGap weight="bold" className="h-4 w-4 animate-spin" />
                          {dict.submittingBtn}
                        </>
                      ) : dict.submitBtn}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Trust aside */}
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-white/10 bg-midnight/50 p-6 backdrop-blur-sm">
              <h3 className="mb-5 font-display-vn text-lg uppercase tracking-wider text-cream">{dict.trustTitle}</h3>
              <ul className="flex flex-col gap-4">
                {[dict.trust1, dict.trust2, dict.trust3].map((t, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                    <ShieldCheck weight="fill" className="mt-0.5 h-5 w-5 shrink-0 text-loco-yellow" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Fallback card */}
            <div className="rounded-3xl border border-white/10 bg-midnight/50 p-6 backdrop-blur-sm text-center">
              <p className="mb-3 font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-widest text-white/60">
                {dict.fallbackTitle}
              </p>
              <a
                href={`tel:${BRAND.phoneTel}`}
                onClick={() => track("tel_click", { cta_location: "landing_trust_aside" })}
                className="mb-3 block font-[family-name:var(--font-space-mono)] text-3xl font-bold text-loco-red transition hover:text-loco-red/80 md:text-4xl"
              >
                {BRAND.phoneDisplay}
              </a>
              <a
                href={BRAND.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("zalo_click", { cta_location: "landing_trust_aside" })}
                className="inline-flex items-center gap-2 rounded-full bg-[#0068FF] px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#0068FF]/85"
              >
                <ZaloIcon size={16} />
                Zalo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
