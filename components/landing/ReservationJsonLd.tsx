import { SITE_URL } from "@/lib/site";
import { BRAND } from "@/lib/brand";

export function ReservationJsonLd({ locale }: { locale: "vi" | "en" }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EntertainmentBusiness",
    "@id": `${SITE_URL}/#business`,
    name: "LOCO Complex",
    alternateName: ["LOCO Heatroom", "LOCO Sài Gòn", "LOCO Quận 1"],
    description:
      locale === "vi"
        ? "LOCO Complex — khu phức hợp giải trí phong cách NEWTRO tại 11 Nam Quốc Cang, Quận 1, Sài Gòn. 2 tầng club: Heatroom (EDM, Top 40, House) + Hip-hop. Mở cửa 18:00 – 00:00."
        : "LOCO Complex — NEWTRO-style entertainment complex at 11 Nam Quoc Cang, District 1, Saigon. 2-floor club: Heatroom (EDM, Top 40, House) + Hip-hop. Open 6 PM – 12 AM.",
    url: locale === "vi" ? `${SITE_URL}/dat-ban` : `${SITE_URL}/en/book`,
    telephone: "+84866433754",
    address: {
      "@type": "PostalAddress",
      streetAddress: "11 Nam Quoc Cang Street",
      addressLocality: "Pham Ngu Lao Ward, District 1",
      addressRegion: "Ho Chi Minh City",
      addressCountry: "VN",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "18:00",
        closes: "00:00",
      },
    ],
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BRAND.mapQuery)}`,
    priceRange: "$$$",
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: locale === "vi" ? `${SITE_URL}/dat-ban` : `${SITE_URL}/en/book`,
        inLanguage: locale,
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      result: {
        "@type": "Reservation",
        name: "Table Reservation",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
