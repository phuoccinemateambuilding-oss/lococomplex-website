// Danh sách mã quốc gia cho field số điện thoại — Việt Nam mặc định.
// Chọn lọc các quốc gia khách quốc tế hay ghé venue Sài Gòn.
export type Country = {
  iso: string;
  dial: string;
  flag: string;
  nameVi: string;
  nameEn: string;
};

export const COUNTRIES: Country[] = [
  { iso: "VN", dial: "+84", flag: "🇻🇳", nameVi: "Việt Nam", nameEn: "Vietnam" },
  { iso: "US", dial: "+1", flag: "🇺🇸", nameVi: "Hoa Kỳ", nameEn: "United States" },
  { iso: "GB", dial: "+44", flag: "🇬🇧", nameVi: "Anh", nameEn: "United Kingdom" },
  { iso: "AU", dial: "+61", flag: "🇦🇺", nameVi: "Úc", nameEn: "Australia" },
  { iso: "CA", dial: "+1", flag: "🇨🇦", nameVi: "Canada", nameEn: "Canada" },
  { iso: "SG", dial: "+65", flag: "🇸🇬", nameVi: "Singapore", nameEn: "Singapore" },
  { iso: "KR", dial: "+82", flag: "🇰🇷", nameVi: "Hàn Quốc", nameEn: "South Korea" },
  { iso: "JP", dial: "+81", flag: "🇯🇵", nameVi: "Nhật Bản", nameEn: "Japan" },
  { iso: "CN", dial: "+86", flag: "🇨🇳", nameVi: "Trung Quốc", nameEn: "China" },
  { iso: "TW", dial: "+886", flag: "🇹🇼", nameVi: "Đài Loan", nameEn: "Taiwan" },
  { iso: "HK", dial: "+852", flag: "🇭🇰", nameVi: "Hồng Kông", nameEn: "Hong Kong" },
  { iso: "TH", dial: "+66", flag: "🇹🇭", nameVi: "Thái Lan", nameEn: "Thailand" },
  { iso: "MY", dial: "+60", flag: "🇲🇾", nameVi: "Malaysia", nameEn: "Malaysia" },
  { iso: "ID", dial: "+62", flag: "🇮🇩", nameVi: "Indonesia", nameEn: "Indonesia" },
  { iso: "PH", dial: "+63", flag: "🇵🇭", nameVi: "Philippines", nameEn: "Philippines" },
  { iso: "IN", dial: "+91", flag: "🇮🇳", nameVi: "Ấn Độ", nameEn: "India" },
  { iso: "FR", dial: "+33", flag: "🇫🇷", nameVi: "Pháp", nameEn: "France" },
  { iso: "DE", dial: "+49", flag: "🇩🇪", nameVi: "Đức", nameEn: "Germany" },
  { iso: "NL", dial: "+31", flag: "🇳🇱", nameVi: "Hà Lan", nameEn: "Netherlands" },
  { iso: "ES", dial: "+34", flag: "🇪🇸", nameVi: "Tây Ban Nha", nameEn: "Spain" },
  { iso: "IT", dial: "+39", flag: "🇮🇹", nameVi: "Ý", nameEn: "Italy" },
  { iso: "CH", dial: "+41", flag: "🇨🇭", nameVi: "Thụy Sĩ", nameEn: "Switzerland" },
  { iso: "SE", dial: "+46", flag: "🇸🇪", nameVi: "Thụy Điển", nameEn: "Sweden" },
  { iso: "RU", dial: "+7", flag: "🇷🇺", nameVi: "Nga", nameEn: "Russia" },
  { iso: "AE", dial: "+971", flag: "🇦🇪", nameVi: "UAE", nameEn: "UAE" },
  { iso: "NZ", dial: "+64", flag: "🇳🇿", nameVi: "New Zealand", nameEn: "New Zealand" },
];

export const DEFAULT_COUNTRY = "VN";

export function dialOf(iso: string): string {
  return COUNTRIES.find((c) => c.iso === iso)?.dial ?? "+84";
}

// Ghép mã quốc gia vào số local: "+84" + "0912 345 678" → "+84 912 345 678".
// Nếu khách đã tự gõ dạng quốc tế (+...) thì giữ nguyên.
export function formatIntlPhone(iso: string, raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.startsWith("+")) return trimmed;
  return `${dialOf(iso)} ${trimmed.replace(/^0+/, "")}`;
}
