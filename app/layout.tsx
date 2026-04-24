import type { Metadata } from "next";
import { Be_Vietnam_Pro, Bebas_Neue, Caveat, Space_Mono } from "next/font/google";
import "./globals.css";
import { site, SITE_URL } from "@/lib/site";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics as GoogleAnalytics } from "@/components/Analytics";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  adjustFontFallback: false,
  preload: true,
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  adjustFontFallback: false,
  preload: true,
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  adjustFontFallback: false,
  preload: true,
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  adjustFontFallback: false,
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LOCO Complex — Khu Giải Trí & Âm Nhạc · Quận 1, Sài Gòn",
    template: "%s | LOCO Complex",
  },
  description:
    "LOCO Complex — khu phức hợp giải trí phong cách NEWTRO tại 11 Nam Quốc Cang, Quận 1, Sài Gòn. 2 tầng club: Heatroom (EDM, Top 40, House) + Hip-hop. F&B by BITES. Mở cửa 18:00 – 00:00. Đặt bàn: 0866 433 754.",
  keywords: [
    "LOCO Complex",
    "LOCO Heatroom",
    "LOCO Quận 1",
    "LOCO Sài Gòn",
    "LOCO Complex Quận 1",
    "khu giải trí Quận 1 Sài Gòn",
    "club Nam Quốc Cang",
    "club EDM Quận 1",
    "club Hip-hop Sài Gòn",
    "nightclub Phạm Ngũ Lão",
  ],
  alternates: {
    canonical: "/",
    languages: {
      vi: "/",
      en: "/en",
      "x-default": "/",
    },
  },
  verification: {
    google: "q9xdUxx4Cxbr17qTB7TG55IuK8HEimhfI9e62P-nYQI",
  },
  openGraph: {
    type: "website",
    title: "LOCO Complex — Khu Giải Trí & Âm Nhạc · Quận 1, Sài Gòn",
    description:
      "Khu phức hợp giải trí phong cách NEWTRO tại 11 Nam Quốc Cang, Quận 1. 2 tầng club: Heatroom (EDM, Top 40, House) + Hip-hop. F&B by BITES. Đặt bàn: 0866 433 754.",
    siteName: "LOCO Complex",
    locale: "vi_VN",
    alternateLocale: "en_US",
    url: "/",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "LOCO Complex — Entertainment complex District 1 Saigon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LOCO Complex — Khu Giải Trí & Âm Nhạc · Quận 1, Sài Gòn",
    description:
      "Khu phức hợp giải trí NEWTRO · 2 tầng club · F&B by BITES · Đặt bàn 0866 433 754",
    images: ["/og.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  authors: [{ name: "LOCO Complex" }],
  creator: "LOCO Complex",
  publisher: "LOCO Complex",
  category: "Entertainment",
  applicationName: "LOCO Complex",
  formatDetection: { telephone: true, email: false, address: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${bebasNeue.variable} ${caveat.variable} ${spaceMono.variable} antialiased`}
    >
      <head>
        <link
          rel="preload"
          as="image"
          href="/_next/image?url=%2Fassets%2Floco%2Flogo.png&w=640&q=85"
          fetchPriority="high"
          imageSizes="(min-width: 1024px) 320px, 70vw"
          imageSrcSet="/_next/image?url=%2Fassets%2Floco%2Flogo.png&w=384&q=85 384w, /_next/image?url=%2Fassets%2Floco%2Flogo.png&w=640&q=85 640w, /_next/image?url=%2Fassets%2Floco%2Flogo.png&w=750&q=85 750w"
        />
      </head>
      <body className={`${beVietnamPro.className} min-h-[100dvh] flex flex-col`}>
        {children}
        <GoogleAnalytics />
        <VercelAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
