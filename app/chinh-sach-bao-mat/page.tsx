import { getDict } from "@/lib/i18n";
import { PolicyPage } from "@/components/PolicyPage";

export default function Page() {
  const locale = "vi";
  const t = getDict(locale);
  return (
    <PolicyPage
      locale={locale}
      dict={t}
      page={t.privacy}
      currentPath="/chinh-sach-bao-mat"
    />
  );
}
