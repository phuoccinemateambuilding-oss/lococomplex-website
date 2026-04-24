import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Locale } from "@/lib/i18n";

type Section = { title: string; body: string[] };

type Props = {
  locale: Locale;
  dict: any;
  page: { kicker: string; title: string; updated: string; intro: string; sections: Section[] };
  currentPath: string;
};

export function PolicyPage({ locale, dict, page, currentPath }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar locale={locale} t={dict.nav} currentPath={currentPath} />
      <main className="relative flex-1 pt-28 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-[860px] px-5 md:px-10">
          <header className="border-b border-black/10 pb-8">
            <p className="font-[family-name:var(--font-space-mono)] text-[11px] tracking-[0.35em] uppercase text-loco-red">
              {page.kicker}
            </p>
            <h1 className="mt-3 font-display text-3xl md:text-5xl uppercase text-black">
              {page.title}
            </h1>
            <p className="mt-4 font-[family-name:var(--font-space-mono)] text-xs text-black/55 tracking-wider">
              {page.updated}
            </p>
            <p className="mt-6 text-black/80 text-base leading-relaxed">
              {page.intro}
            </p>
          </header>

          <div className="mt-10 space-y-8">
            {page.sections.map((s) => (
              <section key={s.title}>
                <h2 className="font-display text-xl md:text-2xl uppercase text-black">
                  {s.title}
                </h2>
                <div className="mt-4 space-y-3 text-black/80 text-[15px] leading-relaxed">
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer locale={locale} t={{ footer: dict.footer, nav: dict.nav }} />
    </div>
  );
}
