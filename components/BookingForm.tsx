"use client";

import { useState } from "react";

interface BookingFormProps {
  t: {
    formName: string;
    formPhone: string;
    formDate: string;
    formGuests: string;
    formMessage: string;
    formSubmit: string;
  };
}

export default function BookingForm({ t }: BookingFormProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-teal/10 border-2 border-teal rounded-2xl p-8 text-center">
        <p className="font-bold text-2xl text-teal mb-2">
          {/* Success state */}
          OK!
        </p>
        <p className="text-ink/70">
          {/* Will be replaced with proper message */}
          We will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">{t.formName}</label>
        <input
          type="text"
          required
          className="w-full px-4 py-3 rounded-xl border-2 border-ink/10 bg-white focus:border-loco-red focus:outline-none transition-colors text-base min-h-[48px]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">{t.formPhone}</label>
        <input
          type="tel"
          required
          className="w-full px-4 py-3 rounded-xl border-2 border-ink/10 bg-white focus:border-loco-red focus:outline-none transition-colors text-base min-h-[48px]"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">{t.formDate}</label>
          <input
            type="date"
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-ink/10 bg-white focus:border-loco-red focus:outline-none transition-colors text-base min-h-[48px]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">{t.formGuests}</label>
          <input
            type="number"
            min={1}
            max={50}
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-ink/10 bg-white focus:border-loco-red focus:outline-none transition-colors text-base min-h-[48px]"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">{t.formMessage}</label>
        <textarea
          rows={3}
          className="w-full px-4 py-3 rounded-xl border-2 border-ink/10 bg-white focus:border-loco-red focus:outline-none transition-colors resize-none text-base"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-loco-red text-white font-semibold py-4 rounded-full text-lg hover:bg-loco-red/90 active:scale-[0.98] transition-all min-h-[48px]"
      >
        {t.formSubmit}
      </button>
    </form>
  );
}
