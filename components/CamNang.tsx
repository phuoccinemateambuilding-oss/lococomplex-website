import Link from "next/link";
import StickerTag from "@/components/StickerTag";
import { site } from "@/lib/site";
import { routeMap, type Locale } from "@/lib/i18n";
import { CAM_NANG_EN, CAM_NANG_PHOTOS, CAM_NANG_VI, type CamNangLinkKey } from "@/lib/cam-nang";

// Khối "Cẩm nang" trang chủ — server component, toàn bộ chữ có sẵn trong HTML (không Reveal, không
// accordion). Giữ ngôn ngữ NEWTRO của LOCO: nền paper, nhãn mono, StickerTag xoay nghiêng, khối màu
// loco-red / hot-pink / teal / electric-blue / loco-yellow, thẻ viền đậm bóng lệch kiểu sticker.
const DOTS = ["bg-loco-red", "bg-hot-pink", "bg-teal", "bg-electric-blue", "bg-loco-yellow"] as const;

export default function CamNang({ locale }: { locale: Locale }) {
  const t = locale === "en" ? CAM_NANG_EN : CAM_NANG_VI;
  const hrefOf = (k: CamNangLinkKey) => routeMap[k][locale];

  return (
    <section
      id="cam-nang"
      data-cam-nang="2310"
      aria-labelledby="cam-nang-title"
      className="relative bg-paper py-16 md:py-24 overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <header className="lg:col-span-4 flex flex-col gap-5">
            <span className="font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.2em] text-ink/60">
              {t.kicker} · LOCO Complex
            </span>
            <h2 id="cam-nang-title" className="font-bold text-4xl leading-tight text-ink md:text-6xl">
              {t.title}
            </h2>
            <div>
              <StickerTag text="make impossible" color="pink" />
            </div>
            <p className="text-base leading-relaxed text-ink/75 md:text-lg">{t.lead}</p>
            <nav aria-label={t.tocTitle}>
              <p className="mb-3 font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.2em] text-ink/55">
                {t.tocTitle}
              </p>
              <ol className="grid gap-x-6 border-t border-ink/10 sm:grid-cols-2 lg:grid-cols-1">
                {t.sections.map((s, i) => (
                  <li key={s.id} className="border-b border-ink/10">
                    <a
                      href={`#cn-${s.id}`}
                      className="flex items-baseline gap-3 py-2.5 text-[15px] text-ink/80 transition-colors hover:text-loco-red"
                    >
                      <span className="font-[family-name:var(--font-space-mono)] text-xs text-loco-red">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{s.h}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </header>

          <div className="lg:col-span-8 flex flex-col gap-14 md:gap-16">
            {t.sections.map((s, i) => (
              <article key={s.id} id={`cn-${s.id}`} className="scroll-mt-28 max-w-[70ch]">
                <div className="mb-5 flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${DOTS[i % DOTS.length]} font-[family-name:var(--font-space-mono)] text-sm font-bold ${
                      DOTS[i % DOTS.length] === "bg-loco-yellow" ? "text-ink" : "text-white"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-bold text-2xl leading-snug text-ink md:text-3xl">{s.h}</h3>
                </div>

                {s.p.length > 0 && (
                  <div className="flex flex-col gap-4 text-base leading-[1.75] text-ink/75 md:text-[17px]">
                    {s.p.map((para, k) => (
                      <p key={k}>{para}</p>
                    ))}
                  </div>
                )}

                {s.items && (
                  <ul className={`${s.p.length > 0 ? "mt-5" : ""} flex flex-col gap-3`}>
                    {s.items.map((it) => (
                      <li
                        key={it.name}
                        className="rounded-2xl border-2 border-ink bg-white px-5 py-4 shadow-[4px_4px_0_#0A0A0A]"
                      >
                        <p className="font-bold text-base text-ink md:text-[17px]">{it.name}</p>
                        <p className="mt-1 text-base leading-relaxed text-ink/70">{it.body}</p>
                      </li>
                    ))}
                  </ul>
                )}

                {s.after && (
                  <div className="mt-5 flex flex-col gap-4 text-base leading-[1.75] text-ink/75 md:text-[17px]">
                    {s.after.map((para, k) => (
                      <p key={k}>{para}</p>
                    ))}
                  </div>
                )}

                {s.ngoai && (
                  <p className="mt-4 text-base leading-[1.75] text-ink/75 md:text-[17px]">
                    {s.ngoai.truoc}
                    <a
                      href={s.ngoai.href}
                      className="font-bold text-electric-blue underline decoration-electric-blue/40 underline-offset-4 hover:decoration-electric-blue"
                    >
                      {s.ngoai.nhan}
                    </a>
                    {s.ngoai.sau}
                  </p>
                )}

                {s.photos && s.photos.length > 0 && (
                  <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {s.photos.map((n) => {
                      const [name, w, h] = CAM_NANG_PHOTOS[n];
                      const big = `/assets/loco/cam-nang/${name}.webp`;
                      const small = `/assets/loco/cam-nang/${name}-800.webp`;
                      const sw = Math.round(w * Math.min(1, 800 / Math.max(w, h)));
                      return (
                        <figure key={name} className="aspect-square overflow-hidden rounded-2xl bg-ink">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={small}
                            srcSet={sw < w ? `${small} ${sw}w, ${big} ${w}w` : undefined}
                            sizes="(max-width: 640px) 50vw, 240px"
                            width={w}
                            height={h}
                            alt={t.alts[n]}
                            loading="lazy"
                            decoding="async"
                            className="block h-full w-full object-cover"
                          />
                        </figure>
                      );
                    })}
                  </div>
                )}

                {s.cta && (
                  <div className="mt-7 flex flex-wrap gap-3">
                    <a
                      href={site.phoneTel}
                      className="inline-flex min-h-[48px] items-center rounded-full bg-loco-red px-6 font-bold text-white transition-all hover:-translate-y-0.5"
                    >
                      {t.call} {site.phone}
                    </a>
                    <a
                      href={site.zaloUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[48px] items-center rounded-full border-2 border-ink px-6 font-bold text-ink transition-all hover:-translate-y-0.5"
                    >
                      {t.zalo}
                    </a>
                    <Link
                      href={hrefOf("book")}
                      className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-ink px-6 font-bold text-white transition-all hover:-translate-y-0.5"
                    >
                      {t.bookPage} <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                )}

                {s.link && (
                  <p className="mt-5">
                    <Link
                      href={hrefOf(s.link.key)}
                      className="inline-flex items-center gap-2 font-bold text-electric-blue underline decoration-electric-blue/40 underline-offset-4 hover:decoration-electric-blue"
                    >
                      {s.link.label} <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </p>
                )}
              </article>
            ))}

            <nav aria-label={t.linksTitle} className="max-w-[70ch]">
              <p className="mb-4 font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.2em] text-ink/60">
                {t.linksTitle}
              </p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {t.links.map((l, i) => (
                  <li key={l.key}>
                    <Link
                      href={hrefOf(l.key)}
                      className="group flex items-start gap-3 rounded-2xl border-2 border-ink bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#0A0A0A]"
                    >
                      <span aria-hidden="true" className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${DOTS[i % DOTS.length]}`} />
                      <span>
                        <span className="block font-bold text-ink">{l.label}</span>
                        <span className="mt-1 block text-sm text-ink/60">{l.sub}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
