"use client";

import { useEffect, useState } from "react";
import { List, X, Phone } from "@phosphor-icons/react/dist/ssr";
import { Wordmark } from "@/components/Wordmark";
import { BRAND } from "@/lib/brand";

type Dnav = {
  home: string;
  about: string;
  gallery: string;
  form: string;
  faq: string;
  menuLabel: string;
  close: string;
};

type NavItem = { key: keyof Omit<Dnav, "menuLabel" | "close">; hash: string };

const NAV_ITEMS: NavItem[] = [
  { key: "home", hash: "top" },
  { key: "about", hash: "about" },
  { key: "gallery", hash: "gallery" },
  { key: "form", hash: "form" },
  { key: "faq", hash: "faq" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function LandingHeader({ dict }: { dict: Dnav }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNav = (hash: string) => {
    setMenuOpen(false);
    requestAnimationFrame(() => scrollTo(hash));
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-loco-red/20 bg-midnight-deep/90 backdrop-blur-md"
            : "bg-gradient-to-b from-midnight-deep/70 to-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-4 px-5 md:h-20 md:px-10">
          <button
            type="button"
            onClick={() => handleNav("top")}
            aria-label="LOCO Complex"
            className="flex items-center"
          >
            <Wordmark width={90} height={38} className="h-auto w-[72px] md:w-[96px]" />
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((it) => (
              <button
                key={it.key}
                type="button"
                onClick={() => handleNav(it.hash)}
                className="rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.1em] text-white/80 transition hover:bg-loco-red/10 hover:text-loco-red"
              >
                {dict[it.key]}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${BRAND.phoneTel}`}
              className="hidden h-11 items-center gap-2 rounded-full border border-loco-red/40 bg-midnight/40 px-4 font-[family-name:var(--font-space-mono)] text-xs font-bold text-loco-red backdrop-blur transition hover:border-loco-red hover:bg-loco-red/10 md:inline-flex"
            >
              <Phone weight="fill" className="h-4 w-4" />
              {BRAND.phoneDisplay}
            </a>
            <button
              type="button"
              onClick={() => handleNav("form")}
              className="hidden h-11 items-center gap-1.5 rounded-full bg-loco-red px-5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-loco-red/85 sm:inline-flex"
            >
              {dict.form}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={dict.menuLabel}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-midnight/50 text-white backdrop-blur transition hover:border-loco-red hover:text-loco-red lg:hidden"
            >
              <List weight="bold" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-[55] bg-midnight-deep/80 backdrop-blur-sm transition-opacity lg:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        aria-hidden={!menuOpen}
        aria-label={dict.menuLabel}
        className={`fixed right-0 top-0 z-[60] flex h-full w-[88%] max-w-[360px] flex-col border-l border-loco-red/20 bg-midnight-deep shadow-2xl transition-transform duration-300 lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <Wordmark width={80} height={34} className="h-auto w-[70px]" />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label={dict.close}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-loco-red hover:text-loco-red"
          >
            <X weight="bold" className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {NAV_ITEMS.map((it) => (
            <button
              key={it.key}
              type="button"
              onClick={() => handleNav(it.hash)}
              className="flex min-h-[56px] items-center rounded-2xl px-4 text-left text-base font-bold uppercase tracking-wider text-white transition hover:bg-loco-red/10 hover:text-loco-red"
            >
              {dict[it.key]}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4 pt-3">
          <a
            href={`tel:${BRAND.phoneTel}`}
            className="mb-3 flex h-14 w-full items-center justify-center gap-2 rounded-full border border-loco-red/50 bg-midnight/40 font-[family-name:var(--font-space-mono)] text-sm font-bold text-loco-red transition hover:bg-loco-red/10"
          >
            <Phone weight="fill" className="h-5 w-5" />
            {BRAND.phoneDisplay}
          </a>
          <button
            type="button"
            onClick={() => handleNav("form")}
            className="flex h-14 w-full items-center justify-center rounded-full bg-loco-red text-sm font-bold uppercase tracking-wider text-white transition hover:bg-loco-red/85"
          >
            {dict.form}
          </button>
        </div>
      </aside>
    </>
  );
}
