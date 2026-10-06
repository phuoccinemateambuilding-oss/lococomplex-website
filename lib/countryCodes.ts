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

// Độ dài số quốc gia (sau mã nước, đã bỏ số 0 đầu) của số di động/cố định, kèm tiền tố trong
// nước khác 0 (Nga gõ "8 916…"). Sinh từ libphonenumber-js 1.13.14 cho các mã nước của form —
// thêm nước mới thì thêm mã vào đây (thiếu mã chỉ mất phần tự sửa, không hỏng gì).
const DO_DAI_SO: Record<string, [number[], string?]> = {
  "1":[[10],"1"], "7":[[10],"8"], "31":[[9,11]], "33":[[9]], "34":[[9]], "39":[[6,7,8,9,10,11,12]],
  "41":[[9]], "44":[[9,10]], "46":[[7,8,9]], "49":[[5,6,7,8,9,10,11,12,13,14,15]], "60":[[8,9,10]],
  "61":[[9]], "62":[[7,8,9,10,11,12]], "63":[[6,8,9,10]], "64":[[8,9,10]], "65":[[8]],
  "66":[[8,9]], "81":[[9,10]], "82":[[5,6,8,9,10]], "84":[[9,10]], "86":[[7,8,9,10,11]],
  "91":[[10]], "852":[[8]], "886":[[8,9]], "971":[[8,9]],
};

// Ghép mã quốc gia vào số khách gõ: "+84" + "0912 345 678" → "+84 912345678".
// Khách đã gõ sẵn mã nước thì KHÔNG ghép thêm (06/10/2026, ca BK2225: chọn +60 rồi gõ / trình
// duyệt tự điền "60 11 1213 7277" → số thành +60 60… → WhatsApp không giao được tin xác nhận):
//   "+60 11-1213 7277" / "0060…" → theo đúng mã khách gõ
//   "601112137277" (thiếu +)      → bỏ mã lặp khi số đầy đủ sai độ dài mà phần sau mã đúng độ dài
// Số đúng độ dài thì không đụng, kể cả số bắt đầu bằng chính mã nước (Ấn Độ +91 91…).
export function ghepMaNuoc(dial: string, raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  const cc = dial.replace(/\D/g, "");
  let d = trimmed.replace(/\D/g, "");
  const quocTe = trimmed.startsWith("+") || d.startsWith("00");
  if (d.startsWith("00")) d = d.slice(2);
  if (quocTe) {
    if (!d.startsWith(cc)) return `+${d}`; // khách gõ mã nước khác ô chọn → theo khách
    d = d.slice(cc.length);
  }
  d = d.replace(/^0+/, "");
  const bang = DO_DAI_SO[cc];
  if (bang && !bang[0].includes(d.length)) {
    const [doDai, tienTo] = bang;
    const boMa = d.slice(cc.length).replace(/^0+/, "");
    if (d.startsWith(cc) && doDai.includes(boMa.length)) d = boMa;
    else if (tienTo && d.startsWith(tienTo) && doDai.includes(d.length - tienTo.length)) d = d.slice(tienTo.length);
  }
  return `${dial} ${d}`;
}

export function formatIntlPhone(iso: string, raw: string): string {
  return ghepMaNuoc(dialOf(iso), raw);
}
