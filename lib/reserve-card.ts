// Card đơn web trong group "Đơn booking" + vé sửa số — CHỈ chạy ở máy chủ (node:crypto).
//
// Tách khỏi route đặt bàn (28/10/2026) để API sửa số dựng lại card Y HỆT bản gốc:
// nút "Gửi …" của bot đọc chữ card + nút "Sao chép SĐT" ĐÚNG LÚC BẤM (Chat Bot/src/sua-card.ts),
// nên card phải mang số mới thì tin chào khách + tin đầu mối mới đi đúng số.

import { createHmac, timingSafeEqual } from "node:crypto";

export type CardData = {
  name?: string;
  phone?: string;
  date?: string;
  time?: string;
  party?: string;
  tier?: string;
  note?: string;
};

const tg = (s: string) => String(s || "").replace(/[_*\[\]()~`>#+=\-|{}.!]/g, "\\$&");

/**
 * trangThai (28/10/2026): kết quả bước soát số trên màn cảm ơn ("✅ khách đã bấm xác nhận…"). Ghi CHUNG dòng
 * "Liên hệ lại khách trong 10 phút" vì bot xoá nguyên dòng đó khi chuyển tin cho đầu mối (stripCompact) —
 * trạng thái chỉ cho sếp xem, không lọt sang đầu mối. Không viết "SĐT:" / "Ngày:" / "Tên:" vào đây: bot đọc card theo nhãn.
 */
export function cardText(venue: string, d: CardData, bookingId: string, timestamp: string, isNight: boolean, vnHHMM: string, trangThai?: string): string {
  const lines = [
    `🔔 *Đặt bàn mới ${tg(venue)}*`,
    `_${tg(timestamp)}_`,
    ``,
    `👤 *Tên:* ${tg(d.name || "")}`,
    `📞 *SĐT:* \`${tg(d.phone || "")}\``,
    `📅 *Ngày:* ${tg(d.date || "")} ${tg(d.time || "")}`,
    `👥 *Số khách:* ${tg(d.party || "")}`,
    `🎯 *Hạng bàn:* ${tg(d.tier || "—")}`,
    `💬 *Ghi chú:* ${tg(d.note || "—")}`,
    `🆔 *Booking ID:* \`${tg(bookingId)}\``,
    ``,
    trangThai ? `_Liên hệ lại khách trong 10 phút_ · ${tg(trangThai)}` : `_Liên hệ lại khách trong 10 phút_`,
  ];
  if (isNight) {
    lines.push(``, `🌙 _Đã tự gửi sang Group quản lý lúc ${tg(vnHHMM)}_`);
  }
  return lines.join("\n");
}

/** coNutGui=false: đơn đã gửi đầu mối từ trước (vd sếp bấm trên Omni) → card chỉ còn nút chép số, tránh gửi trùng. */
export function cardKeyboard(phone: string | undefined, bookingId: string, isNight: boolean, coNutGui = true) {
  const phoneDigits = String(phone || "").replace(/\D/g, "");
  return isNight || !coNutGui
    ? [[{ text: "📋 Sao chép SĐT", copy_text: { text: phoneDigits } }]]
    : [[
        { text: "📤 Gửi Group", callback_data: `fwd:${bookingId}` },
        { text: "📤 Gửi Ngọc", callback_data: `fwd2:${bookingId}` },
        { text: "📋 Sao chép SĐT", copy_text: { text: phoneDigits } },
      ]];
}

// ─── Vé sửa số ───────────────────────────────────────────────────────────────
// Trả về cho trình duyệt của đúng khách vừa đặt, kèm chữ ký HMAC → chỉ người giữ vé sửa được
// SĐT của đơn đó, trong 30 phút. Vé mang sẵn dữ liệu đơn để dựng lại card mà không cần lưu ở đâu.

export const VE_HAN_MS = 30 * 60 * 1000;

export type VeSuaSo = CardData & {
  v: 1;
  bk: string;
  loc: string;
  ts: string; // dòng giờ in trên card — dựng lại phải trùng
  m: number | null; // message_id card trên Telegram
  r: number | null; // dòng Sheet Booking
  iat: number;
  dry?: 1; // đơn chạy khô trên máy local — API sửa số cũng chạy khô
  cho?: 1; // card CHƯA gửi: chờ khách xong bước soát số (route hoan-tat mới gửi)
  p0?: string; // số khách gõ lúc đầu, có khi khách đã sửa số
};

/** Card giữ lại chờ khách soát số — nút X / nút xác nhận / rời trang / quá 3 phút đều gửi; mở popup lâu hơn cũng không mất card. */
export const VE_HOAN_TAT_HAN_MS = 24 * 3600 * 1000;

function khoaKy(): string | null {
  const s = process.env.CRM_API_KEY || process.env.TELEGRAM_BOT_TOKEN || process.env.GMAIL_APP_PASSWORD;
  return s ? `sua-so-v1:${s}` : null;
}

export const coKhoaKy = () => !!khoaKy();

export function kyVe(ve: VeSuaSo): string | null {
  const khoa = khoaKy();
  if (!khoa) return null;
  const body = Buffer.from(JSON.stringify(ve)).toString("base64url");
  const sig = createHmac("sha256", khoa).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function docVe(token: string, hanMs = VE_HAN_MS): VeSuaSo | null {
  const khoa = khoaKy();
  if (!khoa || typeof token !== "string") return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const dung = createHmac("sha256", khoa).update(body).digest();
  const gui = Buffer.from(sig, "base64url");
  if (gui.length !== dung.length || !timingSafeEqual(gui, dung)) return null;
  try {
    const ve = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as VeSuaSo;
    if (ve.v !== 1 || !ve.bk || Date.now() - ve.iat > hanMs) return null;
    return ve;
  } catch {
    return null;
  }
}

/**
 * Chạy khô (không gửi mail/Telegram/Sheet/CRM) khi bản duyệt local bật cờ RESERVE_DRY_RUN=1 —
 * kể cả khi mở bằng điện thoại qua IP nội bộ, vì .env.local chứa khoá thật. Trên Vercel (VERCEL=1)
 * cờ bị bỏ qua: lỡ đặt nhầm env cũng không nuốt đơn thật.
 */
export function chayKho(): boolean {
  return process.env.RESERVE_DRY_RUN === "1" && process.env.VERCEL !== "1";
}

// ─── Dùng chung cho route sua-so + hoan-tat ─────────────────

const CRM_BASE = "https://nightclub-crm.vercel.app/api/bookings";

export type DonCrm = {
  partner_id: number | null;
  customer_name: string | null;
  guest_count: number | null;
  arrival_at: string | null;
  status: string | null;
  notes: string | null;
};

export function vnHHMM(now = new Date()): string {
  const d = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

/** Đơn trên CRM còn y như web đã đổ vào (route reserve → sendCrm)? */
export function conNguyen(b: DonCrm, ve: VeSuaSo): boolean {
  const guests = parseInt(String(ve.party ?? "").replace(/\D/g, ""), 10) || 1;
  const notes = [ve.tier, ve.note].filter(Boolean).join(" · ") || null;
  if ((b.customer_name ?? "").trim() !== (ve.name ?? "").trim()) return false;
  if (b.guest_count !== guests) return false;
  if ((b.notes ?? null) !== notes) return false;
  if (b.status !== "confirmed") return false;
  if (!b.arrival_at) return false;
  // Dựng giờ đến Y NHƯ sendCrm của route: form không bắt buộc ngày/giờ → thiếu ngày = hôm đặt (giờ VN, lấy
  // theo iat của vé), thiếu giờ = 21:00; ngày dạng dd/mm/yyyy cũng được đổi.
  const dateRaw = String(ve.date || "").trim();
  let iso = /^\d{4}-\d{2}-\d{2}$/.test(dateRaw) ? dateRaw : "";
  const dmy = dateRaw.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (!iso && dmy) iso = `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
  if (!iso) iso = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(ve.iat));
  const hm = String(ve.time || "").trim().match(/^(\d{1,2}):(\d{2})/);
  const gio = hm ? `${hm[1].padStart(2, "0")}:${hm[2]}` : "21:00";
  const goc = Date.parse(`${iso}T${gio}:00+07:00`);
  const lech = Date.parse(b.arrival_at) - goc;
  // CRM tự cộng 12 tiếng cho giờ 06:00–11:59 (lưới "quán đêm") → lệch 0 hoặc đúng 12 tiếng đều là nguyên bản
  return Math.abs(lech) < 60_000 || Math.abs(lech - 12 * 3600_000) < 60_000;
}

export async function crm(method: "GET" | "PATCH", bk: string, body?: unknown): Promise<Response | null> {
  const KEY = process.env.CRM_API_KEY;
  if (!KEY) return null;
  try {
    return await fetch(`${CRM_BASE}/${encodeURIComponent(bk)}`, {
      method,
      headers: { "x-api-key": KEY, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(8000),
    });
  } catch (err) {
    console.error(`[reserve] CRM ${method} lỗi:`, err);
    return null;
  }
}

/** Gọi Bot API vào group đơn (TELEGRAM_CHAT_ID). Trả `result` của Telegram (tin vừa gửi/sửa), lỗi → null. */
export async function telegram(method: string, payload: Record<string, unknown>): Promise<{ message_id?: number } | null> {
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  if (!TOKEN || !CHAT_ID) return null;
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, ...payload }),
  }).catch(() => null);
  if (!res?.ok) {
    console.error(`[reserve] telegram ${method} lỗi:`, res ? await res.text() : "mạng");
    return null;
  }
  const out = (await res.json().catch(() => ({}))) as { result?: { message_id?: number } };
  return out.result ?? {};
}
