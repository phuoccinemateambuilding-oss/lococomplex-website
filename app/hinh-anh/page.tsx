import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";
import Reveal from "@/components/Reveal";
import ImageSlider from "@/components/ImageSlider";
import { galleryImages, spaceImages } from "@/lib/images";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "Hình ảnh — Không gian & Khoảnh khắc LOCO Complex",
  description:
    "Album không gian 2 tầng club (Heatroom Floor 2 · Hip-hop Floor 1) và khoảnh khắc đêm tại LOCO Complex — 11 Nam Quốc Cang, Quận 1, Sài Gòn.",
  keywords: [
    "hình ảnh LOCO Complex",
    "không gian LOCO",
    "LOCO Heatroom interior",
    "club Quận 1 hình ảnh",
    "LOCO Complex gallery",
  ],
  alternates: {
    canonical: "/hinh-anh",
    languages: { vi: "/hinh-anh", en: "/en/gallery", "x-default": "/hinh-anh" },
  },
  openGraph: {
    title: "Hình ảnh LOCO Complex — Không gian & Khoảnh khắc",
    description:
      "Album 2 tầng club Heatroom · Hip-hop + không gian BITES F&B tại LOCO Complex Quận 1.",
    url: "/hinh-anh",
    locale: "vi_VN",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "LOCO Complex gallery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hình ảnh LOCO Complex",
    description: "Không gian 2 tầng club + BITES F&B.",
    images: ["/og.jpg"],
  },
};

export default function GalleryPage() {
  const locale = "vi";
  const t = getDict(locale);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Trang chủ", path: "/" },
          { name: "Hình ảnh", path: "/hinh-anh" },
        ]}
      />
      <Navbar locale={locale} t={t.nav} currentPath="/hinh-anh" />
      <main className="flex-1 pt-24">
        <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-32">
          <Reveal>
            <p className="font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.2em] text-ink/70 mb-4">
              {t.gallery.eyebrow}
            </p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-ink mb-16">
              {t.gallery.heading}
            </h1>
          </Reveal>

          {/* Album: Không gian */}
          <div className="mb-20">
            <Reveal>
              <ImageSlider images={spaceImages} title={locale === "vi" ? "Không gian" : "Space"} />
            </Reveal>
          </div>

          {/* Album: Khoảnh khắc */}
          <div>
            <Reveal>
              <ImageSlider images={galleryImages} title={locale === "vi" ? "Khoảnh khắc" : "Moments"} />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer locale={locale} t={{ footer: t.footer, nav: t.nav }} />
      <FloatingContacts />
    </>
  );
}
