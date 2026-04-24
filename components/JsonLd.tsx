import { SITE_URL, site } from "@/lib/site";

type Locale = "vi" | "en";

const desc = {
  vi: "LOCO Complex — khu phức hợp giải trí phong cách NEWTRO tại 11 Nam Quốc Cang, Quận 1, Sài Gòn. 2 tầng club: Heatroom (EDM, Top 40, House) + Hip-hop. F&B by BITES. Mở cửa 18:00 – 00:00.",
  en: "LOCO Complex — NEWTRO-style entertainment complex at 11 Nam Quoc Cang, District 1, Saigon. 2-floor club: Heatroom (EDM, Top 40, House) + Hip-hop. Dining by BITES. Open 6 PM – 12 AM.",
};

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: "11 Nam Quoc Cang Street",
  addressLocality: "Pham Ngu Lao Ward, District 1",
  addressRegion: "Ho Chi Minh City",
  postalCode: "700000",
  addressCountry: "VN",
};

export function JsonLd({ locale }: { locale: Locale }) {
  const urlSelf = locale === "vi" ? SITE_URL : `${SITE_URL}/en`;
  const same = Object.values(site.social).filter((u) => u && u !== "#");

  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "LOCO Complex",
      alternateName: ["LOCO", "LOCO Heatroom", "LOCO Sài Gòn", "LOCO Quận 1"],
      description: desc[locale],
      inLanguage: locale === "vi" ? "vi-VN" : "en-US",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "LOCO Complex",
      alternateName: ["LOCO Heatroom", "BITES"],
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/assets/loco/logo.png`,
        width: 2000,
        height: 2000,
      },
      image: `${SITE_URL}/og.jpg`,
      telephone: site.phoneE164,
      address: postalAddress,
      ...(same.length > 0 ? { sameAs: same } : {}),
    },
    {
      "@type": ["NightClub", "BarOrPub", "EntertainmentBusiness"],
      "@id": `${SITE_URL}/#business`,
      name: "LOCO Complex",
      alternateName: ["LOCO Heatroom", "LOCO Sài Gòn", "LOCO Quận 1"],
      description: desc[locale],
      url: urlSelf,
      mainEntityOfPage: urlSelf,
      telephone: site.phoneE164,
      priceRange: "$$$",
      image: [
        `${SITE_URL}/og.jpg`,
        `${SITE_URL}/assets/loco/space/hero-main.jpg`,
      ],
      logo: `${SITE_URL}/assets/loco/logo.png`,
      address: postalAddress,
      hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("LOCO Complex 11 Nam Quoc Cang District 1 Ho Chi Minh City")}`,
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "18:00",
          closes: "00:00",
        },
      ],
      acceptsReservations: true,
      servesCuisine: ["Asian Fusion", "Snacks", "Finger Food", "International"],
      paymentAccepted: ["Cash", "Credit Card", "Bank Transfer", "QR Payment"],
      currenciesAccepted: "VND",
      maximumAttendeeCapacity: 300,
      amenityFeature: [
        { "@type": "LocationFeatureSpecification", name: "VIP Tables", value: true },
        { "@type": "LocationFeatureSpecification", name: "Sound System", value: true },
        { "@type": "LocationFeatureSpecification", name: "F&B", value: true },
        { "@type": "LocationFeatureSpecification", name: "Live DJ", value: true },
      ],
      knowsAbout: ["EDM", "Top 40", "House", "Hip-hop", "Nightlife", "DJ events"],
      slogan: "make impossible",
      potentialAction: {
        "@type": "ReserveAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: locale === "vi" ? `${SITE_URL}/lien-he` : `${SITE_URL}/en/contact`,
          inLanguage: locale === "vi" ? "vi-VN" : "en-US",
          actionPlatform: [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
          ],
        },
        result: { "@type": "Reservation", name: "Table Reservation" },
      },
      parentOrganization: { "@id": `${SITE_URL}/#organization` },
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
