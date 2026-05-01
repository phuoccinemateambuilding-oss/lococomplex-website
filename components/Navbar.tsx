"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/lib/site";
import { routeMap, getAlternateRoute, type Locale } from "@/lib/i18n";

interface NavTranslations {
  home: string;
  gallery: string;
  menu: string;
  contact: string;
  bookTable: string;
}

interface NavbarProps {
  locale: Locale;
  t: NavTranslations;
  currentPath: string;
}

export default function Navbar({ locale, t, currentPath }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t.home, href: routeMap.home[locale] },
    { label: t.gallery, href: routeMap.gallery[locale] },
    { label: t.menu, href: routeMap.menu[locale] },
    { label: t.contact, href: routeMap.contact[locale] },
  ];

  const alternateLang: Locale = locale === "vi" ? "en" : "vi";
  const alternateHref = getAlternateRoute(currentPath, alternateLang);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-[#0A0A0A]/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 md:px-10">
          {/* Left: logo */}
          <Link href={routeMap.home[locale]} className="shrink-0">
            <Image
              src="/assets/loco/logo.png"
              alt={site.name}
              width={240}
              height={80}
              className="h-20 w-auto"
              priority
            />
          </Link>

          {/* Center: nav links — desktop only */}
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-normal transition-colors hover:text-[#E23A2C] ${
                  currentPath === link.href
                    ? "text-[#E23A2C]"
                    : "text-[#0A0A0A]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: lang switch + CTA + hamburger */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <Link
              href={alternateHref}
              className="rounded-md border border-[#0A0A0A]/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] transition-colors hover:border-[#E23A2C] hover:text-[#E23A2C]"
            >
              {alternateLang === "en" ? "EN" : "VI"}
            </Link>

            {/* CTA — desktop only */}
            <a
              href={site.phoneTel}
              className="hidden rounded-full bg-[#E23A2C] px-5 py-2 text-sm font-bold text-white transition-transform hover:scale-105 md:inline-block"
            >
              {t.bookTable}
            </a>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-md md:hidden"
              aria-label="Open menu"
            >
              <List size={24} weight="bold" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-in panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white shadow-2xl"
            >
              <div className="flex h-16 items-center justify-end px-6">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-center rounded-md"
                >
                  <X size={24} weight="bold" />
                </button>
              </div>

              <nav className="flex flex-col gap-1 px-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-4 py-3 text-base font-normal transition-colors ${
                      currentPath === link.href
                        ? "bg-[#E23A2C]/10 text-[#E23A2C]"
                        : "text-[#0A0A0A] hover:bg-[#0A0A0A]/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <hr className="my-4 border-[#0A0A0A]/10" />

                <a
                  href={site.phoneTel}
                  className="rounded-full bg-[#E23A2C] px-5 py-3 text-center text-sm font-bold text-white"
                >
                  {t.bookTable}
                </a>

                <Link
                  href={alternateHref}
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 text-center text-sm font-bold uppercase tracking-wider text-[#0A0A0A]/60"
                >
                  {alternateLang === "en" ? "English" : "Tiếng Việt"}
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
