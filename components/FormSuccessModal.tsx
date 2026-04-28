"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, Phone } from "@phosphor-icons/react/dist/ssr";

type Intent = "booking" | "contact" | "newsletter" | "inquiry" | "default";
type Locale = "vi" | "en";

const COPY: Record<Intent, Record<Locale, { title: string; desc: string }>> = {
  booking: {
    vi: {
      title: "Đã nhận đặt bàn!",
      desc: "Cảm ơn bạn đã chọn LOCO Complex. Lễ tân sẽ liên hệ xác nhận trong 15 phút tới qua số điện thoại bạn cung cấp.",
    },
    en: {
      title: "Booking received!",
      desc: "Thank you for choosing LOCO Complex. Our team will reach out within 15 minutes to confirm via the phone number you provided.",
    },
  },
  contact: {
    vi: {
      title: "Đã nhận tin nhắn!",
      desc: "Cảm ơn bạn đã liên hệ LOCO Complex. Chúng tôi sẽ phản hồi trong vòng 24 giờ qua số điện thoại bạn cung cấp.",
    },
    en: {
      title: "Message received!",
      desc: "Thank you for contacting LOCO Complex. We will respond within 24 hours via the phone number you provided.",
    },
  },
  newsletter: {
    vi: {
      title: "Đăng ký thành công!",
      desc: "Bạn sẽ nhận được tin tức và ưu đãi mới nhất từ LOCO Complex qua email.",
    },
    en: {
      title: "Subscribed!",
      desc: "You will receive the latest news and offers from LOCO Complex via email.",
    },
  },
  inquiry: {
    vi: {
      title: "Đã nhận yêu cầu!",
      desc: "Cảm ơn bạn. LOCO Complex sẽ phản hồi với phương án phù hợp trong vòng 1 ngày làm việc.",
    },
    en: {
      title: "Request received!",
      desc: "Thank you. LOCO Complex will respond with a suitable proposal within 1 business day.",
    },
  },
  default: {
    vi: {
      title: "Đã gửi thông tin!",
      desc: "Cảm ơn bạn. LOCO Complex đã nhận được thông tin và sẽ phản hồi sớm nhất.",
    },
    en: {
      title: "Information sent!",
      desc: "Thank you. LOCO Complex has received your information and will respond soon.",
    },
  },
};

const BUTTONS: Record<Locale, { call: string; close: string; hotlineLabel: string }> = {
  vi: { call: "Gọi hotline", close: "Đóng", hotlineLabel: "Cần xác nhận gấp?" },
  en: { call: "Call now", close: "Close", hotlineLabel: "Need urgent help?" },
};

export function FormSuccessModal({
  open,
  onClose,
  locale = "vi",
  intent = "default",
}: {
  open: boolean;
  onClose: () => void;
  locale?: Locale;
  intent?: Intent;
}) {
  const t = COPY[intent][locale];
  const b = BUTTONS[locale];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = orig;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const modal = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="absolute inset-0 bg-ink/90 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-[440px] bg-midnight border-2 border-loco-red rounded-[1.75rem] sm:rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10 shadow-[0_0_50px_rgba(214,52,39,0.45)]"
            initial={{ scale: 0.85, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            <BulbCorners />

            <button
              type="button"
              aria-label={b.close}
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 flex items-center justify-center rounded-full bg-ink/70 border border-cream/20 text-cream hover:bg-loco-red hover:text-ink hover:border-loco-red transition-colors z-10"
            >
              <X size={18} weight="bold" />
            </button>

            <div className="flex flex-col items-center text-center pt-2">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.12 }}
                className="mb-5"
              >
                <CheckCircle
                  size={84}
                  weight="fill"
                  className="text-loco-red"
                  style={{ filter: "drop-shadow(0 0 18px rgba(214,52,39,0.75))" }}
                />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.4 }}
                className="font-display-vn text-2xl sm:text-3xl md:text-[2rem] leading-tight uppercase tracking-wider text-loco-red mb-3"
              >
                {t.title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.36, duration: 0.4 }}
                className="text-cream/85 text-[14px] sm:text-[15px] leading-relaxed mb-6 max-w-[36ch]"
              >
                {t.desc}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.46 }}
                className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold mb-2"
              >
                {b.hotlineLabel}
              </motion.div>

              <motion.a
                href="tel:+84866433754"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-display-vn text-2xl sm:text-3xl text-electric-blue tracking-wider mb-7 hover:scale-105 transition-transform"
              >
                0866 433 754
              </motion.a>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="flex flex-col sm:flex-row gap-3 w-full"
              >
                <a
                  href="tel:+84866433754"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-loco-red text-ink font-display-vn text-[13px] tracking-[0.25em] uppercase hover:opacity-90 transition-opacity min-h-[48px]"
                >
                  <Phone size={18} weight="fill" />
                  <span>{b.call}</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 inline-flex items-center justify-center px-5 py-3.5 rounded-full border-2 border-cream/30 text-cream font-display-vn text-[13px] tracking-[0.25em] uppercase hover:border-cream hover:bg-cream/5 transition-colors min-h-[48px]"
                >
                  {b.close}
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}

function BulbCorners() {
  const corners = [
    { top: 10, left: 10 },
    { top: 10, right: 10 },
    { bottom: 10, left: 10 },
    { bottom: 10, right: 10 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none">
      {corners.map((pos, i) => (
        <motion.span
          key={i}
          className="absolute w-2 h-2 rounded-full bg-loco-red"
          style={{ ...pos, boxShadow: "0 0 8px rgba(214,52,39,0.95), 0 0 14px rgba(214,52,39,0.6)" }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </div>
  );
}
