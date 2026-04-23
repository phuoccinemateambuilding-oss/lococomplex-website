import vi from "@/i18n/vi.json";
import en from "@/i18n/en.json";

export type Locale = "vi" | "en";

const dictionaries = { vi, en } as const;

export function getDict(locale: Locale) {
  return dictionaries[locale] || dictionaries.vi;
}

export function getLocaleFromPathname(pathname: string): Locale {
  return pathname.startsWith("/en") ? "en" : "vi";
}

export const routeMap: Record<string, Record<Locale, string>> = {
  home: { vi: "/", en: "/en" },
  gallery: { vi: "/hinh-anh", en: "/en/gallery" },
  menu: { vi: "/menu", en: "/en/menu" },
  contact: { vi: "/lien-he", en: "/en/contact" },
  faq: { vi: "/faq", en: "/en/faq" },
};

export function getAlternateRoute(currentPath: string, targetLocale: Locale): string {
  for (const routes of Object.values(routeMap)) {
    const currentLocale: Locale = currentPath.startsWith("/en") ? "en" : "vi";
    if (routes[currentLocale] === currentPath) {
      return routes[targetLocale];
    }
  }
  return targetLocale === "en" ? "/en" : "/";
}
