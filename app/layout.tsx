import type { Metadata } from "next";
import { Be_Vietnam_Pro, Bebas_Neue, Caveat, Space_Mono } from "next/font/google";
import "./globals.css";
import { site, SITE_URL } from "@/lib/site";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
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
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "256x256" }],
    shortcut: "/favicon.ico",
  },
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
      <body className={`${beVietnamPro.className} min-h-[100dvh] flex flex-col`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
