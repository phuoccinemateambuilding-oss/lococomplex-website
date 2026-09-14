"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import Link from "next/link";
import { CaretLeft, CaretRight, ArrowLeft } from "@phosphor-icons/react/dist/ssr";

/* ─────────────────────────────────────────────────────────────
   CONFIG — chỉ sửa 7 dòng này cho mỗi venue
   ───────────────────────────────────────────────────────────── */
const VENUE = "LOCO Complex";                     // topbar hiện "Menu {VENUE}"
const ASSET_DIR = "/assets/loco/menu-book";        // thư mục chứa ảnh trang trong public/
const FILE_PREFIX = "loco-menu";                  // slug tên file — PHẢI khớp output render-menu.sh
const TOTAL = 5;                                  // số trang menu
const RATIO = 1200 / 1820;                        // (w/h) 1 trang — lấy từ output render-menu.sh
const BACK_HREF = { vi: "/dat-ban", en: "/en/book" };            // nút "Quay lại" trỏ đâu
const BOOK_HREF = { vi: "/dat-ban#form", en: "/en/book#form" };  // nút "Đặt bàn" trỏ đâu

type Locale = "vi" | "en";

const L = {
  vi: { back: "Quay lại", book: "Đặt bàn", page: "Trang", prev: "Trang trước", next: "Trang sau", alt: "Thực đơn" },
  en: { back: "Back", book: "Book a table", page: "Page", prev: "Previous page", next: "Next page", alt: "Menu" },
} as const;
/* ───────────────────────────────────────────────────────────── */

const PAGES = Array.from(
  { length: TOTAL },
  (_, i) => `${ASSET_DIR}/${FILE_PREFIX}-${String(i + 1).padStart(2, "0")}.webp`
);

// Một trang — react-pageflip clone kèm ref vào div ngoài cùng → PHẢI forwardRef
const Page = forwardRef<HTMLDivElement, { src: string; index: number; locale: Locale }>(
  function Page({ src, index, locale }, ref) {
    const l = L[locale];
    return (
      <div className="mf-page" ref={ref}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`${l.alt} ${VENUE} — ${l.page.toLowerCase()} ${index + 1} / ${TOTAL}`}
          loading={index < 2 ? "eager" : "lazy"}
          draggable={false}
        />
      </div>
    );
  }
);

type PageFlipApi = { flipNext: () => void; flipPrev: () => void };
type FlipBookRef = { pageFlip: () => PageFlipApi };

export default function MenuFlipbook({ locale = "vi" }: { locale?: Locale }) {
  const l = L[locale];
  const bookRef = useRef<FlipBookRef | null>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [port, setPort] = useState(true);

  // Tính kích thước 1 trang khớp viewport (bố cục cố định, không tràn)
  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isPortrait = vw < 900; // mobile/tablet dọc = 1 trang; desktop = spread 2 trang
      const availH = Math.max(300, vh - 180); // chừa thanh trên + dưới + padding
      const availW = isPortrait ? vw - 28 : (vw - 96) / 2;
      let h = Math.min(availH, 920);
      let w = h * RATIO;
      if (w > availW) { w = availW; h = w / RATIO; }
      setDims({ w: Math.round(w), h: Math.round(h) });
      setPort(isPortrait);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const onFlip = useCallback((e: { data: number }) => setPage(e.data), []);

  const flipPrev = () => bookRef.current?.pageFlip()?.flipPrev();
  const flipNext = () => bookRef.current?.pageFlip()?.flipNext();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") flipPrev();
      if (e.key === "ArrowRight") flipNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Cử chỉ chạm: (1) vuốt 1 ngón kiểu lướt ảnh để lật; (2) chụm 2 ngón phóng to, thả tay tự bật về
  useEffect(() => {
    const el = zoomRef.current;
    if (!el) return;

    let startDist = 0;
    let scale = 1;
    let zooming = false;
    let sx = 0, sy = 0, st = 0, tracking = false; // theo dõi vuốt 1 ngón

    const dist = (t: TouchList) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

    const onStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        zooming = true;
        tracking = false;
        startDist = dist(e.touches);
        const r = el.getBoundingClientRect();
        const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - r.left;
        const my = (e.touches[0].clientY + e.touches[1].clientY) / 2 - r.top;
        el.style.transition = "none";
        el.style.transformOrigin = `${(mx / r.width) * 100}% ${(my / r.height) * 100}%`;
      } else if (e.touches.length === 1 && !zooming) {
        tracking = true;
        sx = e.touches[0].clientX;
        sy = e.touches[0].clientY;
        st = e.timeStamp;
      }
    };

    const onMove = (e: TouchEvent) => {
      if (zooming && e.touches.length === 2) {
        e.preventDefault();
        scale = Math.min(3, Math.max(1, dist(e.touches) / startDist));
        el.style.transform = `scale(${scale})`;
      }
    };

    const onEnd = (e: TouchEvent) => {
      // kết thúc pinch → bật về 1x
      if (zooming) {
        if (e.touches.length === 0) {
          zooming = false;
          scale = 1;
          el.style.transition = "transform .28s cubic-bezier(.22,1,.36,1)";
          el.style.transform = "scale(1)";
        }
        return;
      }
      // kết thúc vuốt 1 ngón → flick lật trang (như lướt ảnh)
      if (tracking && e.changedTouches.length) {
        tracking = false;
        const dx = e.changedTouches[0].clientX - sx;
        const dy = e.changedTouches[0].clientY - sy;
        const dt = e.timeStamp - st;
        const horizontal = Math.abs(dx) > Math.abs(dy) * 1.3;
        const far = Math.abs(dx) > 45;
        const flick = Math.abs(dx) > 22 && dt < 320; // lướt nhanh, quãng ngắn cũng ăn
        if (horizontal && (far || flick)) {
          if (dx < 0) bookRef.current?.pageFlip()?.flipNext();
          else bookRef.current?.pageFlip()?.flipPrev();
        }
      }
    };

    el.addEventListener("touchstart", onStart, { passive: false });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [dims, port]);

  // Menu LOCO không có trang bìa riêng (page-01 đã là nội dung) → luôn hiện số trang.
  const label = `${l.page} ${Math.min(page + 1, TOTAL)} / ${TOTAL}`;

  return (
    <div className="mf-root">
      {/* Thanh trên */}
      <div className="mf-topbar">
        <Link href={BACK_HREF[locale]} className="mf-back" aria-label={l.back}>
          <ArrowLeft size={16} weight="bold" /> <span>{l.back}</span>
        </Link>
        <div className="mf-title">Menu {VENUE}</div>
        <Link href={BOOK_HREF[locale]} className="mf-dl" aria-label={`${l.book} ${VENUE}`}>{l.book}</Link>
      </div>

      {/* Khu vực sách */}
      <div className="mf-stage">
        <div className="mf-zoom" ref={zoomRef}>
          {dims && (
            <HTMLFlipBook
              key={`${dims.w}x${dims.h}x${port}`}
              ref={bookRef}
              width={dims.w}
              height={dims.h}
              size="fixed"
              minWidth={200}
              maxWidth={900}
              minHeight={280}
              maxHeight={1200}
              drawShadow
              maxShadowOpacity={0.3}
              showCover={false}
              mobileScrollSupport={false}
              useMouseEvents={false}
              clickEventForward={false}
              swipeDistance={10}
              flippingTime={550}
              usePortrait={port}
              startPage={0}
              startZIndex={0}
              autoSize={false}
              showPageCorners
              disableFlipByClick={false}
              onFlip={onFlip}
              className="mf-book"
              style={{}}
            >
              {PAGES.map((src, i) => (
                <Page key={src} src={src} index={i} locale={locale} />
              ))}
            </HTMLFlipBook>
          )}
        </div>

        {/* Nút lật 2 bên (desktop) */}
        <button className="mf-nav mf-nav-l" onClick={flipPrev} aria-label={l.prev} disabled={page <= 0}>
          <CaretLeft size={22} weight="bold" />
        </button>
        <button className="mf-nav mf-nav-r" onClick={flipNext} aria-label={l.next} disabled={page >= TOTAL - 1}>
          <CaretRight size={22} weight="bold" />
        </button>
      </div>

      {/* Thanh điều khiển dưới — 2 mũi tên nổi bật để khách bấm lật */}
      <div className="mf-controls">
        <button className="mf-arrow" onClick={flipPrev} disabled={page <= 0} aria-label={l.prev}><CaretLeft size={20} weight="bold" /></button>
        <span className="mf-page-ind">{label}</span>
        <button className="mf-arrow" onClick={flipNext} disabled={page >= TOTAL - 1} aria-label={l.next}><CaretRight size={20} weight="bold" /></button>
      </div>
    </div>
  );
}
