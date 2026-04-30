import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Thực đơn — LOCO Complex",
  description:
    "Thực đơn LOCO Complex — bộ menu BITES F&B của khu giải trí NEWTRO tại 11 Nam Quốc Cang, Quận 1. Snack, refreshments, đồ uống signature. Đặt bàn giữ chỗ trước miễn phí.",
  alternates: {
    canonical: `${SITE_URL}/thuc-don`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ThucDonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
