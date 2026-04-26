"use client";

import { useState, useId, useEffect } from "react";
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
  h2Sub: string;
  h2Badge: string;
  requiredHint: string;
  formTitle: string;
  formSub: string;
  fieldName: string;
  fieldPhone: string;
  fieldTier: string;
  fieldTierPlaceholder: string;
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
  recapTier: string;
  recapGuests: string;
  recapNote: string;
  tiers: Record<string, string>;
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
    tier: "",
    date: "",
    time: "",
    party: "",
    note: "",
    bot_field: "",
  });
  const [submitted, setSubmitted] = useState<typeof values | null>(null);

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const initial = params.get("tier");
    if (initial && initial in dict.tiers) {
      setValues((v) => ({ ...v, tier: initial }));
    }
    const onTierChange = (e: Event) => {
      const detail = (e as CustomEvent<{ tier: string }>).detail;
      if (detail?.tier && detail.tier in dict.tiers) {
        setValues((v) => ({ ...v, tier: detail.tier }));
      }
    };
    window.addEventListener("loco-tier-change", onTierChange);
    return () => window.removeEventListener("loco-tier-change", onTierChange);
  }, [dict.tiers]);

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
    setValues({ name: "", phone: "", tier: "", date: "", time: "", party: "", note: "", bot_field: "" });
    setSubmitted(null);
  }

  const calendarUrl = submitted
    ? buildCalendarUrl({ name: submitted.name, date: submitted.date, time: submitted.time, tier: submitted.tier ? dict.tiers[submitted.tier] ?? "" : "", party: submitted.party, note: submitted.note, locale })
    : "";

  const inputCls = "block w-full min-w-0 min-h-[54px] appearance-none rounded-2xl border-2 border-white/20 bg-midnight/70 px-5 py-3.5 text-[16px] font-medium text-white placeholder:text-white/35 focus:border-loco-red focus:outline-none focus:ring-2 focus:ring-loco-red/40 hover:border-white/35 transition [color-scheme:dark]";
  const labelCls = "mb-2 flex items-center gap-1 font-[family-name:var(--font-space-mono)] text-[11px] font-bold uppercase tracking-[0.18em] text-loco-yellow/90";
  const requiredMark = <span className="text-loco-red" aria-hidden="true">*</span>;

  return (
    <section id="form" className="relative scroll-mt-20 overflow-hidden border-t border-loco-red/20 bg-midnight py-14 md:scroll-mt-24 md:py-20">
      {/* Radial accent backgrounds */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-20 h-[400px] w-[400px] rounded-full bg-loco-red/10 blur-[120px]" />
        <div className="absolute -bottom-32 -right-20 h-[400px] w-[400px] rounded-full bg-loco-yellow/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-5 md:px-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center md:mb-14"
        >
          <span className="inline-block rounded-full border border-loco-red/50 bg-loco-red/10 px-4 py-1.5 font-[family-name:var(--font-space-mono)] text-[11px] font-bold uppercase tracking-[0.2em] text-loco-red">
            {dict.h2Badge}
          </span>
          <h2 className="mt-4 font-display-vn text-3xl leading-[1.1] pb-[0.08em] heading-uppercase text-cream md:text-4xl lg:text-5xl">
            {dict.h2}
          </h2>
          <p className="mx-auto mt-3 max-w-[60ch] text-sm text-white/75 md:text-base">{dict.h2Sub}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-10">
          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl border-2 border-loco-red/40 bg-midnight/85 p-6 shadow-[0_20px_80px_-20px_rgba(226,58,44,0.4)] backdrop-blur-md md:p-9"
          >
            {/* Top accent strip */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-loco-red via-hot-pink to-loco-yellow" />
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
                    {submitted.tier && dict.tiers[submitted.tier] && (
                      <div className="col-span-2">
                        <p className="font-[family-name:var(--font-space-mono)] text-xs text-white/65 uppercase tracking-widest">{dict.recapTier}</p>
                        <p className="font-[family-name:var(--font-space-mono)] text-sm text-white">{dict.tiers[submitted.tier]}</p>
                      </div>
                    )}
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
                  <div className="mb-6 flex items-end justify-between gap-3">
                    <div>
                      <h3 className="mb-1 font-display-vn text-2xl uppercase leading-tight tracking-wider text-cream md:text-3xl">
                        {dict.formTitle}
                      </h3>
                      <p className="text-sm text-white/70 md:text-base">{dict.formSub}</p>
                    </div>
                    <span className="hidden shrink-0 font-[family-name:var(--font-space-mono)] text-[10px] uppercase tracking-widest text-loco-red sm:inline">
                      {dict.requiredHint}
                    </span>
                  </div>

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
                      <label htmlFor={`${formId}-name`} className={labelCls}>
                        {dict.fieldName}
                        {requiredMark}
                      </label>
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
                      <label htmlFor={`${formId}-phone`} className={labelCls}>
                        {dict.fieldPhone}
                        {requiredMark}
                      </label>
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

                    {/* Tier */}
                    <div>
                      <label htmlFor={`${formId}-tier`} className={labelCls}>{dict.fieldTier}</label>
                      <select
                        id={`${formId}-tier`}
                        value={values.tier}
                        onChange={set("tier")}
                        className={inputCls}
                      >
                        <option value="">{dict.fieldTierPlaceholder}</option>
                        {Object.entries(dict.tiers).map(([k, label]) => (
                          <option key={k} value={k}>{label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Date + Time */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label htmlFor={`${formId}-date`} className={labelCls}>
                          {dict.fieldDate}
                          {requiredMark}
                        </label>
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
                        <label htmlFor={`${formId}-time`} className={labelCls}>
                          {dict.fieldTime}
                          {requiredMark}
                        </label>
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
                      <label htmlFor={`${formId}-party`} className={labelCls}>
                        {dict.fieldGuests}
                        {requiredMark}
                      </label>
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
                      className="group mt-2 flex h-16 w-full items-center justify-center gap-2 rounded-full bg-loco-red text-base font-bold uppercase tracking-wider text-white shadow-[0_12px_45px_-10px_rgba(226,58,44,0.65)] transition-all hover:-translate-y-0.5 hover:bg-loco-red/90 hover:shadow-[0_18px_55px_-10px_rgba(226,58,44,0.75)] disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none md:text-lg"
                    >
                      {status === "submitting" ? (
                        <>
                          <SpinnerGap weight="bold" className="h-5 w-5 animate-spin" />
                          {dict.submittingBtn}
                        </>
                      ) : (
                        <>
                          <CalendarCheck weight="fill" className="h-5 w-5" />
                          {dict.submitBtn}
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Trust aside */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-5"
          >
            <div className="rounded-3xl border border-loco-yellow/30 bg-loco-yellow/[0.04] p-6 backdrop-blur-sm">
              <h3 className="mb-5 font-display-vn text-xl uppercase tracking-wider text-loco-yellow md:text-2xl">{dict.trustTitle}</h3>
              <ul className="flex flex-col gap-4">
                {[dict.trust1, dict.trust2, dict.trust3].map((t, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-medium text-white/85 md:text-base">
                    <ShieldCheck weight="fill" className="mt-0.5 h-5 w-5 shrink-0 text-loco-yellow" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Fallback card */}
            <div className="rounded-3xl border-2 border-loco-red/40 bg-loco-red/[0.06] p-6 text-center backdrop-blur-sm shadow-[0_10px_40px_-15px_rgba(226,58,44,0.5)]">
              <p className="mb-3 font-[family-name:var(--font-space-mono)] text-[11px] font-bold uppercase tracking-[0.2em] text-loco-red">
                {dict.fallbackTitle}
              </p>
              <a
                href={`tel:${BRAND.phoneTel}`}
                onClick={() => track("tel_click", { cta_location: "landing_trust_aside" })}
                className="mb-4 block font-[family-name:var(--font-space-mono)] text-3xl font-bold text-loco-red drop-shadow-[0_0_20px_rgba(226,58,44,0.5)] transition hover:text-loco-red/85 md:text-4xl"
              >
                {BRAND.phoneDisplay}
              </a>
              <a
                href={BRAND.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("zalo_click", { cta_location: "landing_trust_aside" })}
                className="inline-flex items-center gap-2 rounded-full bg-[#0068FF] px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-[0_8px_30px_-5px_rgba(0,104,255,0.5)] transition hover:-translate-y-0.5 hover:bg-[#0068FF]/85"
              >
                <ZaloIcon size={16} />
                Zalo
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
