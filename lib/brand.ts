import { site } from "@/lib/site";

export const BRAND = {
  name: site.name,
  shortName: site.shortName,
  tagline: site.tagline,
  phoneDisplay: site.phone,
  phoneTel: site.phoneE164,
  zaloUrl: site.zaloUrl,
  address: site.address,
  addressShort: "11 Nam Quốc Cang, Q.1",
  hours: site.hours,
  mapQuery: "LOCO Complex 11 Nam Quoc Cang District 1 Ho Chi Minh City",
} as const;
