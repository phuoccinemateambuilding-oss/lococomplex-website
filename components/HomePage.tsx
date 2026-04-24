import Link from "next/link";
import Reveal from "@/components/Reveal";
import StickerTag from "@/components/StickerTag";
import GeometricShape from "@/components/GeometricShape";
import MusicTag from "@/components/MusicTag";
import Marquee from "@/components/Marquee";
import { FadeSlideUp, FloatingImage, PulseText } from "@/components/HeroAnimated";
import { site } from "@/lib/site";
import { routeMap, type Locale } from "@/lib/i18n";
import { galleryImages, spaceImages, menuImages } from "@/lib/images";
import ClickableGallery from "@/components/ClickableGallery";

interface HomePageProps {
  locale: Locale;
  t: any;
}

/* ------------------------------------------------------------------ */
/*  HERO — full-impact with floating images + animated text            */
/* ------------------------------------------------------------------ */

function HeroSection({ locale, t }: HomePageProps) {
  const contactHref = routeMap.contact[locale];

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-ink">
      {/* Background image grid — faded */}
      <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-5 gap-1 opacity-15">
        {spaceImages.slice(0, 10).map((img) => (
          <div key={img.src} className="overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt="" className="w-full h-full object-cover" aria-hidden="true" />
          </div>
        ))}
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 flex flex-col justify-center min-h-[100dvh] py-32">
        <div className="grid md:grid-cols-[1.1fr_1fr] gap-10 items-center">
          {/* LEFT — text content */}
          <div className="flex flex-col gap-5">
            <FadeSlideUp delay={0.1}>
              <span className="font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.25em] text-baby-blue">
                {t.hero.eyebrow}
              </span>
            </FadeSlideUp>

            <FadeSlideUp delay={0.2}>
              <PulseText className="inline-block">
                <h1 className="font-[family-name:var(--font-bebas-neue)] text-[8rem] leading-[0.8] text-white md:text-[14rem] drop-shadow-[0_0_60px_rgba(226,58,44,0.3)]">
                  <span className="sr-only">
                    {locale === "vi"
                      ? "LOCO Complex — Khu phức hợp giải trí NEWTRO tại 11 Nam Quốc Cang, Quận 1, Sài Gòn"
                      : "LOCO Complex — NEWTRO entertainment complex at 11 Nam Quoc Cang, District 1, Saigon"}
                  </span>
                  <span aria-hidden="true">{t.hero.heading}</span>
                </h1>
              </PulseText>
              <span className="block font-[family-name:var(--font-caveat)] text-5xl text-hot-pink md:text-6xl mt-1">
                {t.hero.subheading}
              </span>
            </FadeSlideUp>

            <FadeSlideUp delay={0.4}>
              <p className="text-lg text-white/60 max-w-[45ch] leading-relaxed">
                {t.hero.desc}
              </p>
            </FadeSlideUp>

            <FadeSlideUp delay={0.5} className="flex flex-wrap items-center gap-4 mt-2">
              <Link
                href={contactHref}
                className="inline-block rounded-full bg-loco-red px-8 py-4 text-lg font-bold text-white shadow-[0_8px_40px_-5px_rgba(226,58,44,0.5)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_50px_-5px_rgba(226,58,44,0.6)]"
              >
                {t.hero.cta}
              </Link>
              <StickerTag text={t.hero.hours} color="teal" />
            </FadeSlideUp>
          </div>

          {/* RIGHT — floating venue photos */}
          <div className="relative hidden md:block min-h-[560px]">
            <FloatingImage
              src={spaceImages[0].src}
              alt={spaceImages[0].alt}
              className="absolute right-0 top-[3%] w-[360px] h-[420px] overflow-hidden rounded-[2rem] shadow-2xl ring-4 ring-white/10 rotate-[3deg]"
              delay={0.3}
            />
            <FloatingImage
              src={spaceImages[2].src}
              alt={spaceImages[2].alt}
              className="absolute left-0 bottom-[5%] w-[280px] h-[320px] overflow-hidden rounded-2xl shadow-xl ring-4 ring-white/10 -rotate-[4deg]"
              delay={0.5}
            />
            <FloatingImage
              src={galleryImages[5].src}
              alt={galleryImages[5].alt}
              className="absolute right-[30px] bottom-[0%] w-[180px] h-[200px] overflow-hidden rounded-xl shadow-lg ring-2 ring-white/10 rotate-[6deg]"
              delay={0.7}
            />

            <GeometricShape variant="circle" size={100} className="absolute right-[-20px] top-[-10px] rotate-[12deg] drop-shadow-2xl" />
            <GeometricShape variant="asterisk" size={60} className="absolute bottom-16 right-[-8px] rotate-[25deg] drop-shadow-xl" />

            <StickerTag text="NEWTRO" color="pink" className="absolute left-[28%] top-[2%] rotate-[-5deg] shadow-lg" />
            <StickerTag text="2 FLOORS" color="yellow" className="absolute bottom-[12%] left-[30%] rotate-[4deg] shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  MARQUEE                                                            */
/* ------------------------------------------------------------------ */

function MarqueeSection() {
  return <Marquee items={["Top 40", "EDM", "House", "Hip-hop", "R&B", "NEWTRO", "LOCO Complex", "Heatroom", "BITES"]} />;
}

/* ------------------------------------------------------------------ */
/*  ABOUT                                                              */
/* ------------------------------------------------------------------ */

function AboutSection({ t }: { t: any }) {
  const stats = [
    { value: "300+", label: t.about.capacity, accent: "bg-loco-red" },
    { value: "D/C", label: t.about.dressCode, accent: "bg-teal" },
    { value: "2F", label: t.about.floors, accent: "bg-loco-yellow" },
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <span className="mb-8 block font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.2em] text-ink/50">
            {t.about.eyebrow}
          </span>
        </Reveal>

        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr] md:gap-16">
          <div>
            <Reveal>
              <h2 className="mb-6 font-bold text-4xl leading-tight text-ink md:text-6xl">{t.about.heading}</h2>
              <p className="max-w-prose text-lg leading-relaxed text-ink/70 mb-8">{t.about.description}</p>
            </Reveal>

            {/* Services chips */}
            <Reveal delay={0.1}>
              <div className="flex flex-wrap gap-2 mb-10">
                {(t.about.services as string[]).map((s: string) => (
                  <span key={s} className="rounded-full bg-baby-blue/15 px-4 py-1.5 text-sm text-electric-blue font-medium">{s}</span>
                ))}
              </div>
            </Reveal>

            <div className="flex flex-col gap-6">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.1 + 0.2}>
                  <div className="flex items-start gap-4">
                    <div className={`mt-1.5 h-12 w-1.5 rounded-full ${s.accent}`} />
                    <div>
                      <span className="block font-bold text-3xl text-ink">{s.value}</span>
                      <span className="font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-wider text-ink/50">{s.label}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.2}>
            <div className="overflow-hidden rounded-3xl shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={spaceImages[3].src} alt={spaceImages[3].alt} loading="lazy" className="w-full h-full object-cover" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  MUSIC — detailed floor info with tables + pricing                  */
/* ------------------------------------------------------------------ */

function MusicSection({ t }: { t: any }) {
  const floors = [
    {
      title: t.music.floor1,
      desc: t.music.floor1Desc,
      tables: t.music.floor1Tables,
      price: t.music.floor1Price,
      accent: "bg-hot-pink",
      accentText: "text-hot-pink",
      bg: "bg-hot-pink/5 border-hot-pink/20",
      genres: ["Hip-hop", "R&B"],
      img: spaceImages[5],
    },
    {
      title: t.music.floor2,
      desc: t.music.floor2Desc,
      tables: t.music.floor2Tables,
      price: t.music.floor2Price,
      accent: "bg-electric-blue",
      accentText: "text-electric-blue",
      bg: "bg-electric-blue/5 border-electric-blue/20",
      genres: ["Top 40", "EDM", "House"],
      img: spaceImages[6],
    },
  ];

  return (
    <section className="bg-ink py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <span className="mb-8 block font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.2em] text-baby-blue">
            {t.music.eyebrow}
          </span>
          <h2 className="mb-12 font-bold text-4xl text-white md:text-6xl">{t.music.heading}</h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {floors.map((floor, i) => (
            <Reveal key={floor.title} delay={i * 0.15}>
              <div className={`rounded-2xl border overflow-hidden ${floor.bg}`}>
                <div className="h-56 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={floor.img.src} alt={floor.img.alt} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="p-8">
                  <div className={`mb-4 h-1.5 w-20 rounded-full ${floor.accent}`} />
                  <h3 className="mb-3 font-bold text-2xl text-white">{floor.title}</h3>
                  <p className="mb-4 text-base leading-relaxed text-white/60 max-w-[50ch]">{floor.desc}</p>
                  <p className="mb-2 text-sm text-white/65 font-[family-name:var(--font-space-mono)]">{floor.tables}</p>
                  <p className={`mb-6 text-sm font-bold ${floor.accentText}`}>{floor.price}</p>
                  <div className="flex flex-wrap gap-2">
                    {floor.genres.map((g) => (
                      <MusicTag key={g} genre={g} className="border-white/20 text-white/70" />
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  MENU TEASER                                                        */
/* ------------------------------------------------------------------ */

function MenuTeaser({ locale, t }: HomePageProps) {
  const menuHref = routeMap.menu[locale];
  const preview = menuImages.slice(0, 4);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={spaceImages[8].src} alt="" className="w-full h-full object-cover opacity-8" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-paper via-paper/95 to-paper" />
      </div>
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 items-center">
          <div>
            <Reveal>
              <StickerTag text="BITES" color="yellow" className="mb-4 inline-block" />
              <h2 className="font-bold text-4xl text-ink md:text-6xl mb-4">{t.menuPage.bites}</h2>
              <p className="text-ink/70 text-lg max-w-[45ch] mb-4">{t.menuPage.bitesDesc}</p>
              <p className="text-ink/50 text-sm mb-8">{t.menuPage.vipDesc}</p>
              <Link
                href={menuHref}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                {locale === "vi" ? "Xem menu" : "View menu"} <span aria-hidden="true">&rarr;</span>
              </Link>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <ClickableGallery images={preview} columns="grid-cols-2" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  GALLERY TEASER — uniform square crops                              */
/* ------------------------------------------------------------------ */

function GallerySection({ locale, t }: HomePageProps) {
  const galleryHref = routeMap.gallery[locale];
  const previewImages = galleryImages.slice(0, 12);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <span className="mb-8 block font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.2em] text-ink/50">
            {t.gallery.eyebrow}
          </span>
          <h2 className="mb-12 font-bold text-4xl text-ink md:text-6xl">{t.gallery.heading}</h2>
        </Reveal>

        <Reveal>
          <ClickableGallery images={previewImages} />
        </Reveal>

        <Reveal delay={0.2}>
          <Link
            href={galleryHref}
            className="mt-10 inline-flex items-center gap-2 font-[family-name:var(--font-space-mono)] text-sm uppercase tracking-widest text-ink/60 transition-colors hover:text-loco-red"
          >
            {t.gallery.viewAll} <span aria-hidden="true">&rarr;</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CONTACT CTA — artistic, distinct from footer                       */
/* ------------------------------------------------------------------ */

function ContactCTASection({ locale, t }: HomePageProps) {
  const contactHref = routeMap.contact[locale];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background: blurred venue photo */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={spaceImages[1].src} alt="" className="w-full h-full object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-ink/85 backdrop-blur-sm" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid items-center gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
          <Reveal>
            <span className="mb-6 block font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.2em] text-loco-yellow">
              {t.contact.eyebrow}
            </span>
            <h2 className="mb-4 font-bold text-5xl text-white md:text-7xl">{t.contact.heading}</h2>
            <p className="mb-8 text-white/50 max-w-[40ch]">{t.hero.desc}</p>
            <Link
              href={contactHref}
              className="inline-block rounded-full bg-loco-red px-8 py-4 text-lg font-bold text-white transition-all hover:-translate-y-1 hover:shadow-[0_16px_50px_-5px_rgba(226,58,44,0.5)]"
            >
              {t.hero.cta}
            </Link>
          </Reveal>

          <Reveal delay={0.2}>
            <a
              href={site.phoneTel}
              className="block rounded-3xl border border-white/10 bg-white/5 px-8 py-12 text-center backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white/10"
            >
              <span className="block font-[family-name:var(--font-space-mono)] text-sm uppercase tracking-widest text-white/50">
                {t.contact.callNow}
              </span>
              <span className="mt-3 block font-[family-name:var(--font-bebas-neue)] text-5xl text-loco-red md:text-7xl">
                {site.phone}
              </span>
              <span className="mt-2 block text-sm text-white/30">{site.address[locale]}</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE EXPORT                                                        */
/* ------------------------------------------------------------------ */

export default function HomePage({ locale, t }: HomePageProps) {
  return (
    <>
      <HeroSection locale={locale} t={t} />
      <MarqueeSection />
      <AboutSection t={t} />
      <MusicSection t={t} />
      <MenuTeaser locale={locale} t={t} />
      <GallerySection locale={locale} t={t} />
      <ContactCTASection locale={locale} t={t} />
    </>
  );
}
