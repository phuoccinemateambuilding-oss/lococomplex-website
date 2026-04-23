"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { site } from "@/lib/site";
import { type Locale } from "@/lib/i18n";
import { Plus } from "@phosphor-icons/react/dist/ssr";

type Qa = { q: string; a: string };

const faqVi: Qa[] = [
  {
    q: "LOCO Complex mở cửa giờ nào?",
    a: "LOCO Complex mở cửa 18:00 – 00:00, từ Thứ Ba đến Chủ Nhật.",
  },
  {
    q: "LOCO Complex ở đâu?",
    a: "LOCO Complex tọa lạc tại 11 Đường Nam Quốc Cang, P. Phạm Ngũ Lão, Quận 1, TP.HCM — trung tâm khu vực giải trí Phạm Ngũ Lão.",
  },
  {
    q: "Làm thế nào để đặt bàn tại LOCO Complex?",
    a: "Bạn có thể đặt bàn qua hotline 0866 433 754, Zalo chính thức tại zalo.me/0866433754, hoặc form đặt bàn trên website. Đặt bàn miễn phí, xác nhận trong 10 phút.",
  },
  {
    q: "Giá bàn VIP tại LOCO Complex là bao nhiêu?",
    a: "Bàn VIP tại LOCO Complex có giá từ 3.5 – 30 triệu VND, tuỳ vị trí, loại bàn và số lượng khách. Chưa bao gồm 10% VAT và 10% phí dịch vụ.",
  },
  {
    q: "LOCO Complex có dress code không?",
    a: "Có. Dress code tại LOCO Complex là Trẻ trung / Thanh lịch (Youthful / Smart Casual) — không mặc dép lê, quần thể thao hoặc trang phục lộ liễu. Nhằm giữ không gian đẳng cấp.",
  },
  {
    q: "LOCO Complex có những tầng nào?",
    a: "LOCO Complex gồm 2 tầng club: Tầng 1 — Hip-hop Club với bàn B, Standing, L-Zone Sofa, VIP và SVIP. Tầng 2 — Heatroom, mini nightclub phát nhạc Top 40, EDM, House. Và khu F&B BITES.",
  },
  {
    q: "LOCO Complex phát nhạc gì?",
    a: "Tầng 1 (Hip-hop Club) phát nhạc Hip-hop, R&B. Tầng 2 (Heatroom) phát Top 40, EDM, House. Mỗi tầng có DJ chuyên nghiệp và hệ thống âm thanh chuẩn club.",
  },
  {
    q: "LOCO Complex có thể đặt tổ chức sự kiện riêng không?",
    a: "Có. LOCO Complex nhận private party, sinh nhật, corporate event, tiệc kỷ niệm. Liên hệ hotline 0866 433 754 để được tư vấn không gian, trang trí và thực đơn theo yêu cầu.",
  },
  {
    q: "LOCO Heatroom là gì?",
    a: "LOCO Heatroom là mini nightclub ở Tầng 2 của LOCO Complex — không gian âm nhạc điện tử với hệ thống âm thanh & ánh sáng đỉnh cao. Phát Top 40, EDM, House mỗi đêm từ 18:00.",
  },
  {
    q: "Khách hàng cần bao nhiêu tuổi để vào LOCO Complex?",
    a: "LOCO Complex phục vụ khách từ 18 tuổi trở lên. Đây là quy định bắt buộc tại toàn bộ không gian entertainment complex.",
  },
];

const faqEn: Qa[] = [
  {
    q: "What are LOCO Complex's opening hours?",
    a: "LOCO Complex is open 6:00 PM – 12:00 AM (Midnight), Tuesday through Sunday.",
  },
  {
    q: "Where is LOCO Complex located?",
    a: "LOCO Complex is located at 11 Nam Quoc Cang Street, Pham Ngu Lao Ward, District 1, Ho Chi Minh City — in the heart of the Pham Ngu Lao entertainment district.",
  },
  {
    q: "How do I reserve a table at LOCO Complex?",
    a: "You can reserve via hotline +84 866 433 754, official Zalo at zalo.me/0866433754, or the reservation form on our website. Reservation is complimentary, confirmed within 10 minutes.",
  },
  {
    q: "How much do VIP tables cost at LOCO Complex?",
    a: "VIP tables at LOCO Complex range from 3.5 – 30 million VND, depending on location, table type, and party size. Prices exclude 10% VAT and 10% service charge.",
  },
  {
    q: "Is there a dress code at LOCO Complex?",
    a: "Yes. Dress code is Youthful / Smart Casual — no flip-flops, sportswear, or overly revealing outfits. This is to maintain the upscale ambience.",
  },
  {
    q: "What floors does LOCO Complex have?",
    a: "LOCO Complex has 2 club floors: Floor 1 — Hip-hop Club with B Tables, Standing, L-Zone Sofa, VIP and SVIP. Floor 2 — Heatroom, a mini nightclub spinning Top 40, EDM, House. Plus BITES for dining.",
  },
  {
    q: "What music genres does LOCO Complex play?",
    a: "Floor 1 (Hip-hop Club) plays Hip-hop and R&B. Floor 2 (Heatroom) spins Top 40, EDM, and House. Each floor has professional DJs and a club-grade sound system.",
  },
  {
    q: "Can I book LOCO Complex for a private event?",
    a: "Yes. LOCO Complex accepts private parties, birthday celebrations, corporate events, and anniversaries. Contact hotline +84 866 433 754 for space, decoration, and custom menu consultation.",
  },
  {
    q: "What is LOCO Heatroom?",
    a: "LOCO Heatroom is the mini nightclub on Floor 2 of LOCO Complex — an electronic music space with top-tier sound & lighting. Top 40, EDM, House spun every night from 6 PM.",
  },
  {
    q: "What is the minimum age to enter LOCO Complex?",
    a: "LOCO Complex is for guests aged 18 and over. This applies to the entire entertainment complex.",
  },
];

export function FaqPage({ locale }: { locale: Locale }) {
  const items = locale === "vi" ? faqVi : faqEn;
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const t = {
    eyebrow: locale === "vi" ? "Câu hỏi thường gặp" : "Frequently Asked Questions",
    title:
      locale === "vi"
        ? "Thông tin cần biết về LOCO Complex"
        : "What you should know about LOCO Complex",
    body:
      locale === "vi"
        ? "10 câu hỏi phổ biến về LOCO Complex — từ giờ mở cửa, giá bàn VIP, dress code đến đặt sự kiện riêng. Liên hệ 0866 433 754 nếu cần thêm."
        : "Top 10 common questions about LOCO Complex — from opening hours, VIP pricing, dress code to private event booking. Call +84 866 433 754 for more.",
    stillQ: locale === "vi" ? "Vẫn còn thắc mắc?" : "Still have questions?",
    stillBody:
      locale === "vi"
        ? "Gọi hotline hoặc nhắn Zalo — đội ngũ LOCO luôn sẵn sàng hỗ trợ bạn."
        : "Call our hotline or message on Zalo — the LOCO team is here to help.",
    cta: locale === "vi" ? "Đặt bàn ngay" : "Book a Table",
    ctaPath: locale === "vi" ? "/lien-he" : "/en/contact",
  };

  return (
    <>
      <FaqJsonLd items={items} />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-[#0A0A0A] pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <Reveal>
              <p className="font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.25em] text-[#E91E8C] mb-4">
                {t.eyebrow}
              </p>
              <h1 className="font-bold text-5xl md:text-7xl tracking-tight text-white max-w-3xl">
                {t.title}
              </h1>
              <p className="mt-5 text-white/50 text-base md:text-lg max-w-2xl">{t.body}</p>
            </Reveal>
          </div>
        </section>

        {/* FAQ accordion */}
        <section className="bg-[#0A0A0A] py-12 md:py-16">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <div className="grid gap-3 max-w-3xl">
              {items.map((item, i) => (
                <Reveal key={i} delay={0.04 * i}>
                  <div
                    className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden transition-colors hover:border-[#E23A2C]/40"
                    onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  >
                    <button
                      className="w-full flex items-center justify-between gap-6 px-6 py-5 text-left"
                      aria-expanded={openIdx === i}
                    >
                      <h2 className="font-semibold text-white text-base md:text-lg">{item.q}</h2>
                      <span
                        className={`flex-none text-[#E23A2C] transition-transform duration-300 ${openIdx === i ? "rotate-45" : ""}`}
                      >
                        <Plus size={20} weight="bold" />
                      </span>
                    </button>
                    {openIdx === i && (
                      <div className="px-6 pb-6">
                        <p className="text-white/60 text-sm md:text-base leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>

            {/* CTA block */}
            <Reveal delay={0.3} className="mt-16 max-w-3xl">
              <div className="rounded-3xl border border-[#F5C330]/30 bg-[#F5C330]/5 p-8 md:p-10">
                <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl md:text-4xl text-[#F5C330] tracking-wide">
                  {t.stillQ}
                </h2>
                <p className="mt-3 text-white/70 text-base">{t.stillBody}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={site.phoneTel}
                    className="inline-flex items-center gap-2 rounded-full bg-[#E23A2C] px-6 py-3 font-bold text-sm text-white transition hover:bg-[#E23A2C]/80"
                  >
                    {site.phone}
                  </a>
                  <a
                    href={site.zaloUrl}
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-bold text-sm text-white transition hover:border-[#F5C330] hover:text-[#F5C330]"
                  >
                    Zalo
                  </a>
                  <a
                    href={t.ctaPath}
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-bold text-sm text-white transition hover:border-[#E91E8C] hover:text-[#E91E8C]"
                  >
                    {t.cta}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
