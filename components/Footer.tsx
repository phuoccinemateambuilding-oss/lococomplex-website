import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { routeMap, type Locale } from "@/lib/i18n";

interface FooterTranslations {
  nav: {
    home: string;
    gallery: string;
    menu: string;
    contact: string;
    faq?: string;
  };
  footer: {
    disclaimer: string;
    copyright: string;
  };
}

interface FooterProps {
  locale: Locale;
  t: FooterTranslations;
}

export default function Footer({ locale, t }: FooterProps) {
  const year = new Date().getFullYear();

  const navLinks = [
    { label: t.nav.home, href: routeMap.home[locale] },
    { label: t.nav.gallery, href: routeMap.gallery[locale] },
    { label: t.nav.menu, href: routeMap.menu[locale] },
    { label: t.nav.contact, href: routeMap.contact[locale] },
    { label: t.nav.faq ?? (locale === "vi" ? "FAQ" : "FAQ"), href: routeMap.faq[locale] },
  ];

  return (
    <footer className="bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-[1400px] px-6 pt-16 pb-10 md:px-10">
        {/* Top — logo + tagline */}
        <div className="flex items-center gap-5 mb-12">
          <Image
            src="/assets/loco/logo.png"
            alt="LOCO Complex"
            width={80}
            height={80}
            className="h-20 w-auto"
          />
          <span className="font-[family-name:var(--font-caveat)] text-3xl text-white/80">
            {site.tagline}
          </span>
        </div>

        {/* Middle — 4-column grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.2fr_1fr_1.3fr]">
          {/* Col 1: nav links */}
          <nav aria-label="Footer navigation">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-white/65">Menu</p>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 2: address + hours */}
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-white/65">
                {locale === "vi" ? "Địa chỉ" : "Address"}
              </p>
              <p className="text-sm text-white/70">{site.address[locale]}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-white/65">
                {locale === "vi" ? "Giờ mở cửa" : "Hours"}
              </p>
              <p className="text-sm text-white/70">{site.hours[locale]}</p>
            </div>
            <a href={site.phoneTel} className="inline-block text-sm font-bold text-[#E23A2C] transition-colors hover:text-[#F5C330]">
              {site.phone}
            </a>
          </div>

          {/* Col 3: social */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-white/65">Social</p>
            <div className="flex flex-col gap-2">
              <a href={site.social.facebook} aria-label="Facebook" className="text-sm text-white/50 transition-colors hover:text-white">Facebook</a>
              <a href={site.social.instagram} aria-label="Instagram" className="text-sm text-white/50 transition-colors hover:text-white">Instagram</a>
              <a href={site.social.tiktok} aria-label="TikTok" className="text-sm text-white/50 transition-colors hover:text-white">TikTok</a>
            </div>
          </div>

          {/* Col 4: Google Maps mini */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-white/65">
              {locale === "vi" ? "Chỉ đường" : "Directions"}
            </p>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <iframe
                src={site.mapsEmbed}
                width="100%"
                height="160"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="LOCO Complex"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 px-6 py-6 text-[10px] text-white/60 uppercase tracking-widest md:flex-row md:items-center md:px-10">
          <p>{t.footer.disclaimer}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href={routeMap.privacy[locale]} className="hover:text-white transition-colors">
              {locale === "vi" ? "Chính sách bảo mật" : "Privacy Policy"}
            </Link>
            <Link href={routeMap.terms[locale]} className="hover:text-white transition-colors">
              {locale === "vi" ? "Điều khoản sử dụng" : "Terms of Use"}
            </Link>
            <p>&copy; {year} {site.name}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
