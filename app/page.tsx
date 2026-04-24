import { getDict } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import HomePage from "@/components/HomePage";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";
import { JsonLd } from "@/components/JsonLd";

export default function Page() {
  const locale = "vi";
  const t = getDict(locale);

  return (
    <>
      <JsonLd locale={locale} />
      <Navbar locale={locale} t={t.nav} currentPath="/" />
      <main className="flex-1">
        <HomePage locale={locale} t={t} />
      </main>
      <Footer locale={locale} t={{ footer: t.footer, nav: t.nav }} />
      <FloatingContacts />
    </>
  );
}
