import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { cookies } from "next/headers";
import { isOfficialHost } from "@/lib/official-host";
import { cardKeyboard, cardText, chayKho, coKhoaKy, kyVe } from "@/lib/reserve-card";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  name?: string;
  phone?: string;
  date?: string;
  time?: string;
  party?: string;
  tier?: string;
  note?: string;
  locale?: string;
  bot_field?: string;
  site?: string; // tên miền nơi khách điền form — chỉ có khi form chạy trên bản sao chép
  flow?: number; // 2 = form có bước soát số trên màn cảm ơn (28/10/2026) → card Telegram gửi SAU bước đó
};

const VENUE_NAME = process.env.VENUE_NAME || "LOCO Complex";

function isAfterHoursVN(): boolean {
  // Tự động gửi thẳng vào group Quản lý booking ban đêm ĐÃ TẮT (sếp yêu cầu 2026-07-24).
  return false;
}

function vnHHMM(now = new Date()): string {
  const vnMs = now.getTime() + 7 * 60 * 60 * 1000;
  const d = new Date(vnMs);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function formatPhoneVNGrouped(raw: string | undefined): string {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  return digits;
}

const esc = (s: string | undefined) =>
  String(s || "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string));

async function sendMail(d: Payload) {
  const GMAIL = process.env.GMAIL_USER;
  const PASS = process.env.GMAIL_APP_PASSWORD;
  const TO = process.env.NOTIFY_EMAIL || GMAIL;
  if (!GMAIL || !PASS) throw new Error("Missing GMAIL env");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: GMAIL, pass: PASS.replace(/\s/g, "") },
  });

  const timestamp = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

  await transporter.sendMail({
    from: `"${VENUE_NAME} — Website" <${GMAIL}>`,
    to: TO,
    subject: `🔔 Đặt bàn ${VENUE_NAME} — ${d.name} · ${d.phone}`,
    html: `<div style="font-family:Helvetica,Arial,sans-serif;max-width:600px;padding:24px;background:#fff;color:#111">
      <div style="border-left:4px solid #E23A2C;padding-left:16px;margin-bottom:20px">
        <h2 style="color:#E23A2C;margin:0 0 4px;font-size:22px">Đặt bàn mới</h2>
        <p style="color:#888;margin:0;font-size:13px">${VENUE_NAME} · ${timestamp}</p>
      </div>
      <table style="font-size:15px;line-height:1.7;border-collapse:collapse;width:100%">
        <tr><td style="padding:8px 16px 8px 0;color:#555;width:120px"><b>Tên khách</b></td><td>${esc(d.name)}</td></tr>
        <tr style="background:#fef7f7"><td style="padding:8px 16px 8px 0;color:#555"><b>Số điện thoại</b></td><td><a href="tel:${esc(d.phone)}" style="color:#E23A2C;text-decoration:none;font-weight:600">${esc(d.phone)}</a></td></tr>
        <tr><td style="padding:8px 16px 8px 0;color:#555"><b>Ngày đặt bàn</b></td><td>${esc(d.date)} — ${esc(d.time)}</td></tr>
        <tr style="background:#fef7f7"><td style="padding:8px 16px 8px 0;color:#555"><b>Số khách</b></td><td>${esc(d.party)}</td></tr>
        <tr><td style="padding:8px 16px 8px 0;color:#555"><b>Hạng bàn</b></td><td>${esc(d.tier) || "—"}</td></tr>
        <tr style="background:#fef7f7"><td style="padding:8px 16px 8px 0;color:#555;vertical-align:top"><b>Ghi chú</b></td><td>${esc(d.note) || "—"}</td></tr>
      </table>
      <p style="color:#aaa;font-size:11px;margin-top:20px">Tự động gửi từ website · Ngôn ngữ form: ${esc(d.locale || "vi")}</p>
    </div>`,
    text: [
      `Đặt bàn mới — ${VENUE_NAME} (${timestamp})`,
      ``,
      `Tên: ${d.name}`,
      `SĐT: ${d.phone}`,
      `Ngày: ${d.date} ${d.time}`,
      `Số khách: ${d.party}`,
      `Hạng bàn: ${d.tier || "—"}`,
      `Ghi chú: ${d.note || "—"}`,
    ].join("\n"),
  });
}

async function appendToSheet(d: Payload): Promise<number | null> {
  const SHEET_ID = process.env.GOOGLE_SHEET_ID;
  const SA_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const SA_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!SHEET_ID || !SA_EMAIL || !SA_KEY) return null;

  const now = new Date();
  const vnFormatter = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  });
  const parts = vnFormatter.formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const monthStr = get("month");
  const timestampStr = `${get("hour")}:${get("minute")} ${get("day")}/${get("month")}/${get("year")}`;

  const formatPhone = (p: string | undefined): string => {
    const digits = String(p || "").replace(/\D/g, "");
    if (digits.length >= 10) return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
    return digits;
  };

  const formatDate = (d: string | undefined): string => {
    const m = String(d || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? `${m[3]}-${m[2]}-${m[1]}` : String(d || "");
  };

  const auth = new google.auth.JWT({
    email: SA_EMAIL,
    key: SA_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const ghi = await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: "Booking!B:K",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[
        monthStr,
        timestampStr,
        VENUE_NAME,
        d.name || "",
        formatPhone(d.phone),
        formatDate(d.date),
        d.time || "",
        d.party || "",
        d.tier || "",
        d.note || "",
      ]],
    },
  });
  // Số dòng vừa ghi (append trả "Booking!B123:K123") → vé sửa số ghi lại SĐT mới đúng dòng này
  const dong = ghi.data.updates?.updatedRange?.match(/![A-Z]+(\d+)/);
  return dong ? Number(dong[1]) : null;
}

async function sendTelegram(d: Payload, bookingId: string, isNight: boolean, timestamp: string): Promise<number | null> {
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  if (!TOKEN || !CHAT_ID) return null;

  // Chữ card + bộ nút nằm ở lib/reserve-card (28/10/2026) để route hoan-tat / sua-so dựng lại card Y HỆT.
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: cardText(VENUE_NAME, d, bookingId, timestamp, isNight, vnHHMM()),
      parse_mode: "MarkdownV2",
      reply_markup: { inline_keyboard: cardKeyboard(d.phone, bookingId, isNight) },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram ${res.status}: ${body}`);
  }
  // message_id của card → vé sửa số dùng để sửa đúng card này nếu khách đổi số
  const out = (await res.json().catch(() => ({}))) as { result?: { message_id?: number } };
  return out?.result?.message_id ?? null;
}

async function sendTelegramToGroup(d: Payload, bookingId: string) {
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const GROUP_ID = process.env.TELEGRAM_GROUP_ID;
  if (!TOKEN || !GROUP_ID) return;

  const timestamp = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const tg = (s: string) =>
    String(s || "").replace(/[_*[\]()~`>#+=\-|{}.!]/g, "\\$&");
  const phoneDigits = String(d.phone || "").replace(/\D/g, "");
  const phoneGrouped = formatPhoneVNGrouped(d.phone);

  const text = [
    `🌙 *\\[TỰ ĐỘNG BAN ĐÊM\\] Đặt bàn mới ${tg(VENUE_NAME)}*`,
    ``,
    `👤 *Tên:* ${tg(d.name || "")}`,
    `📞 *SĐT:* ${tg(phoneGrouped)}`,
    `📅 *Ngày:* ${tg(d.date || "")} ${tg(d.time || "")}`,
    `👥 *Số khách:* ${tg(d.party || "")}`,
    `🎯 *Hạng bàn:* ${tg(d.tier || "—")}`,
    `💬 *Ghi chú:* ${tg(d.note || "—")}`,
    `🆔 *Booking ID:* \`${tg(bookingId)}\``,
    ``,
    `⏱ _Tin gửi lúc ${tg(timestamp)}_`,
  ].join("\n");

  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: GROUP_ID,
      text,
      parse_mode: "MarkdownV2",
      reply_markup: {
        inline_keyboard: [[
          { text: "📋 Sao chép SĐT", copy_text: { text: phoneDigits } },
        ]],
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram group ${res.status}: ${body}`);
  }
}


// Đổ đơn vào Nightclub CRM ngay khi tạo (chưa gán đầu mối — bấm "Gửi ..." trên card
// Telegram mới gán). Fire-and-forget: CRM lỗi KHÔNG được chặn flow đặt bàn của khách.

// Nguồn khách (2026-08-24) — component TrafficSource ghi cookie khi khách vào site;
// đọc ở đây gửi kèm sang CRM để cuối tháng thống kê tỷ lệ nguồn khách.
async function readTrafficCookie(): Promise<{
  traffic_source?: string | null;
  traffic_detail?: string | null;
}> {
  try {
    const c = await cookies();
    const dec = (v: string) => {
      try {
        return decodeURIComponent(v);
      } catch {
        return v;
      }
    };
    const src = c.get("nc_src")?.value || "";
    const detail = c.get("nc_srcd")?.value || "";
    return {
      traffic_source: src ? dec(src) : null,
      traffic_detail: detail ? dec(detail).slice(0, 400) : null,
    };
  } catch {
    return {};
  }
}

async function sendCrm(d: Payload, bookingId: string): Promise<string | null> {
  const KEY = process.env.CRM_API_KEY;
  if (!KEY) return null;
  try {
    const dateRaw = String(d.date || "").trim();
    let iso = /^\d{4}-\d{2}-\d{2}$/.test(dateRaw) ? dateRaw : "";
    const dmy = dateRaw.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
    if (!iso && dmy) iso = `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
    if (!iso) iso = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
    const timeRaw = String(d.time || "").trim();
    const hm = timeRaw.match(/^(\d{1,2}):(\d{2})/);
    const time = hm ? `${hm[1].padStart(2, "0")}:${hm[2]}` : "21:00";
    const guests = parseInt(String(d.party ?? "").replace(/\D/g, ""), 10) || 1;
    const res = await fetch("https://nightclub-crm.vercel.app/api/bookings", {
      method: "POST",
      headers: { "x-api-key": KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        bk_code: bookingId,
        venue: "loco",
        customer_name: d.name || null,
        phone: d.phone || null,
        channel: "phone",
        locale: d.locale === "en" ? "en" : "vi",
        guest_count: guests,
        arrival_at: `${iso}T${time}`,
        status: "confirmed",
        source: "web",
        ...(await readTrafficCookie()),
        notes: [d.tier, d.note].filter(Boolean).join(" · ") || null,
      }),
      signal: AbortSignal.timeout(8000),
    });
    // CRM có thể cấp MÃ KHÁC khi mã ngẫu nhiên trùng mã một đơn cũ (11/09/2026).
    // Phải trả mã THẬT về cho card Telegram + Sheet, nếu không nút "Gửi đầu mối" bấm
    // trên card sẽ ghi trúng đơn khác — ca BK1169 đè lên đơn BK4590 ngày 15/08.
    const out = (await res.json().catch(() => ({}))) as {
      booking?: { bk_code?: string };
    };
    return out?.booking?.bk_code || bookingId;
  } catch (err) {
    console.error("[crm] push booking fail:", err);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const d = (await req.json()) as Payload;

    if (d.bot_field) return NextResponse.json({ ok: false, reason: "bot" });

    if (!d.name || !d.phone) {
      return NextResponse.json({ ok: false, reason: "missing" }, { status: 400 });
    }

    // Đơn tự chuyển về từ website sao chép → ghi vào ghi chú để mail/Telegram/Sheet/CRM đều thấy
    const site = String(d.site || "").toLowerCase().slice(0, 100);
    if (site && !isOfficialHost(site)) {
      d.note = `⚠️ Đơn gửi từ trang sao chép ${site}${d.note ? ` — ${d.note}` : ""}`;
    }

    const bookingId = `BK${Math.floor(1000 + Math.random() * 9000)}`;

    const isNight = isAfterHoursVN();
    const timestamp = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });

    // Bản duyệt local (RESERVE_DRY_RUN=1): không gửi đi đâu, chỉ trả mã + vé để duyệt màn cảm ơn.
    if (chayKho()) {
      const ve = kyVe({ v: 1, bk: bookingId, loc: d.locale || "vi", ts: timestamp, m: null, r: null, iat: Date.now(), dry: 1, cho: 1,
        name: d.name, phone: d.phone, date: d.date, time: d.time, party: d.party, tier: d.tier, note: d.note });
      return NextResponse.json({ ok: true, bookingId, suaToken: ve });
    }

    // Card Telegram GIỮ LẠI tới khi khách xong bước soát số trên màn cảm ơn (sếp chốt 28/10/2026: card phải là
    // thông tin cuối cùng — bot tự gửi đầu mối ban đêm xử lý card ngay lúc card xuất hiện). Chỉ giữ khi trình duyệt
    // là bản form mới (flow 2) và ký được vé; tab mở từ trước khi deploy không bao giờ gọi hoan-tat → gửi ngay như cũ.
    // Mail + Sheet + CRM vẫn ghi ngay, nên đơn không mất kể cả khi bước hoàn tất không tới.
    const giuCard = d.flow === 2 && !isNight && coKhoaKy();

    // CRM TRƯỚC rồi mới dựng card (11/09/2026): mã ngẫu nhiên có thể trùng mã một
    // đơn cũ, khi đó CRM cấp mã mới. Card + Sheet phải mang mã THẬT, nếu không nút
    // "Gửi đầu mối" trên card sẽ ghi trúng đơn khác (sự cố BK1169 / BK4590).
    const bk = (await sendCrm(d, bookingId)) || bookingId;

    const [mailResult, sheetResult, tgResult, tgGroupResult] = await Promise.allSettled([
      sendMail(d),
      appendToSheet(d),
      giuCard ? Promise.resolve(null) : sendTelegram(d, bk, isNight, timestamp),
      isNight ? sendTelegramToGroup(d, bk) : Promise.resolve(),
    ]);

    if (mailResult.status === "rejected") {
      console.error("[/api/reserve] mail failed", mailResult.reason);
    }
    if (sheetResult.status === "rejected") {
      console.error("[/api/reserve] sheet append failed", sheetResult.reason);
    }
    if (tgResult.status === "rejected") {
      console.error("[/api/reserve] telegram failed", tgResult.reason);
    }
    if (tgGroupResult.status === "rejected") {
      console.error("[/api/reserve] telegram group (after-hours) failed (non-blocking)", tgGroupResult.reason);
    }

    // anySucceeded pattern: chỉ báo fail khi CẢ 3 kênh chính (mail + sheet + telegram) đều rejected.
    // tgGroupResult (after-hours forward) luôn non-blocking, không tính vào điều kiện fail.
    const allCoreFailed =
      mailResult.status === "rejected" &&
      sheetResult.status === "rejected" &&
      tgResult.status === "rejected";

    if (allCoreFailed) {
      // Card đang GIỮ chờ popup: khách sắp thấy báo lỗi, không popup nào gọi hoan-tat → gửi card ngay kẻo mất (28/10/2026)
      // (khi giữ card thì tgResult = fulfilled nên nhánh này thực tế không tới — giữ cho chắc nếu điều kiện đổi sau này)
      if (giuCard) await sendTelegram(d, bk, isNight, timestamp).catch((e) => console.error("[/api/reserve] gửi card bù lỗi", e));
      return NextResponse.json({ ok: false, reason: "all_channels_failed" }, { status: 500 });
    }

    // Vé sửa số (28/10/2026): màn cảm ơn hiện lại số khách vừa gõ, gõ nhầm thì sửa ngay —
    // vé mang message_id card + dòng Sheet để API sửa số cập nhật đúng chỗ. Đơn ban đêm đã tự
    // gửi group quản lý thì không cấp vé (card đó không còn nút để sửa đồng bộ).
    const suaToken = isNight
      ? null
      : kyVe({
          v: 1, bk, loc: d.locale || "vi", ts: timestamp, iat: Date.now(),
          ...(giuCard ? { cho: 1 as const } : {}),
          m: tgResult.status === "fulfilled" ? tgResult.value : null,
          r: sheetResult.status === "fulfilled" ? sheetResult.value : null,
          name: d.name, phone: d.phone, date: d.date, time: d.time, party: d.party, tier: d.tier, note: d.note,
        });

    return NextResponse.json({ ok: true, bookingId: bk, suaToken });
  } catch (err) {
    console.error("[/api/reserve]", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
