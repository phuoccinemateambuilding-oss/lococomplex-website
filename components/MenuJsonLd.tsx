import { SITE_URL, site } from "@/lib/site";

type Props = {
  locale: "vi" | "en";
  pages: readonly { title: string; desc: string }[];
};

/* Khai báo schema.org Menu cho trang /menu — mỗi trang menu = 1 MenuSection.
   Không đưa con số tiền vào đây: giá do chủ venue tự sửa trên ảnh menu, lặp lại
   ở JSON-LD sẽ lệch nhau khi menu đổi. */
export function MenuJsonLd({ locale, pages }: Props) {
  const path = locale === "vi" ? "/menu" : "/en/menu";
  const json = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: locale === "vi" ? "Thực đơn LOCO Complex" : "LOCO Complex Menu",
    url: `${SITE_URL}${path}`,
    inLanguage: locale === "vi" ? "vi-VN" : "en-US",
    hasMenuSection: pages.map((p, i) => ({
      "@type": "MenuSection",
      position: i + 1,
      name: p.title,
      description: p.desc,
      image: `${SITE_URL}/assets/loco/menu-book/loco-menu-${String(i + 1).padStart(2, "0")}.webp`,
    })),
    provider: {
      "@type": "NightClub",
      name: site.name,
      url: SITE_URL,
      telephone: site.phoneE164,
      priceRange: "$$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: "11 Đường Nam Quốc Cang",
        addressLocality: "Quận 1",
        addressRegion: "TP. Hồ Chí Minh",
        addressCountry: "VN",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
