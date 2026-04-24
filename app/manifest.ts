import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LOCO Complex — Entertainment · District 1 Saigon",
    short_name: "LOCO",
    description:
      "LOCO Complex — khu phức hợp giải trí NEWTRO tại 11 Nam Quốc Cang, Quận 1, Sài Gòn. 2 tầng club (Heatroom · Hip-hop) + BITES. Mở 18:00 – 00:00.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#E23A2C",
    lang: "vi-VN",
    orientation: "portrait",
    categories: ["entertainment", "nightlife", "food"],
    icons: [
      { src: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
