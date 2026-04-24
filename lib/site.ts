const DEFAULT_PROD_URL = "https://lococomplex.com.vn";
const DEFAULT_DEV_URL = "http://localhost:3000";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production" ? DEFAULT_PROD_URL : DEFAULT_DEV_URL);

export const site = {
  name: "LOCO Complex",
  shortName: "LOCO",
  tagline: "make impossible",
  phone: "0866 433 754",
  phoneE164: "+84866433754",
  phoneTel: "tel:0866433754",
  zaloUrl: "https://zalo.me/0866433754",
  address: {
    vi: "11 Đường Nam Quốc Cang, P. Phạm Ngũ Lão, Quận 1, TP.HCM",
    en: "11 Nam Quoc Cang Street, Pham Ngu Lao Ward, District 1, HCMC",
  },
  hours: {
    vi: "Thứ Ba – Chủ Nhật · 18:00 – Late",
    en: "Tue – Sun · 6:00 PM – Late",
  },
  mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5!2d106.6928!3d10.7689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1640b9deaf%3A0x3c2d3c8b4d3c4e4e!2s11%20Nam%20Qu%E1%BB%91c%20Cang%2C%20Qu%E1%BA%ADn%201%2C%20HCMC!5e0!3m2!1svi!2svn!4v1713300000000",
  social: {
    facebook: "#",
    instagram: "#",
    tiktok: "#",
  },
} as const;
