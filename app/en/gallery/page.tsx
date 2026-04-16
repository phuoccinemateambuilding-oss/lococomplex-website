import { getDict } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";
import Reveal from "@/components/Reveal";
import ImageSlider from "@/components/ImageSlider";
import { galleryImages, spaceImages } from "@/lib/images";

export default function GalleryPage() {
  const locale = "en";
  const t = getDict(locale);

  return (
    <>
      <Navbar locale={locale} t={t.nav} currentPath="/en/gallery" />
      <main className="flex-1 pt-24">
        <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-32">
          <Reveal>
            <p className="font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.2em] text-teal mb-4">
              {t.gallery.eyebrow}
            </p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-ink mb-16">
              {t.gallery.heading}
            </h1>
          </Reveal>

          <div className="mb-20">
            <Reveal>
              <ImageSlider images={spaceImages} title="Space" />
            </Reveal>
          </div>

          <div>
            <Reveal>
              <ImageSlider images={galleryImages} title="Moments" />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer locale={locale} t={{ footer: t.footer, nav: t.nav }} />
      <FloatingContacts />
    </>
  );
}
