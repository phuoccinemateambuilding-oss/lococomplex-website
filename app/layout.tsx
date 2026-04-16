import type { Metadata } from "next";
import { Be_Vietnam_Pro, Bebas_Neue, Caveat, Space_Mono } from "next/font/google";
import "./globals.css";
import { site, SITE_URL } from "@/lib/site";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
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
  description: site.name,
  alternates: {
    canonical: "/",
    languages: {
      vi: "/",
      en: "/en",
      "x-default": "/",
    },
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
      </body>
    </html>
  );
}
