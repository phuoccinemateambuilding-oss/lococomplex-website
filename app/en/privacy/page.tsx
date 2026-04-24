import { getDict } from "@/lib/i18n";
import { PolicyPage } from "@/components/PolicyPage";

export default function Page() {
  const locale = "en";
  const t = getDict(locale);
  return (
    <PolicyPage
      locale={locale}
      dict={t}
      page={t.privacy}
      currentPath="/en/privacy"
    />
  );
}
