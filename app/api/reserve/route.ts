import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { google } from "googleapis";

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
};

const VENUE_NAME = process.env.VENUE_NAME || "LOCO Complex";

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

async function appendToSheet(d: Payload) {
  const SHEET_ID = process.env.GOOGLE_SHEET_ID;
  const SA_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const SA_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!SHEET_ID || !SA_EMAIL || !SA_KEY) return;

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

  await sheets.spreadsheets.values.append({
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
}

async function sendTelegram(d: Payload) {
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  if (!TOKEN || !CHAT_ID) return;

  const timestamp = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const tg = (s: string) =>
    String(s || "").replace(/[_*[\]()~`>#+=\-|{}.!]/g, "\\$&");

  const phoneDigits = String(d.phone || "").replace(/\D/g, "");

  const text = [
    `🔔 *Đặt bàn mới ${tg(VENUE_NAME)}*`,
    `_${tg(timestamp)}_`,
    ``,
    `👤 *Tên:* ${tg(d.name || "")}`,
    `📞 *SĐT:* \`${tg(d.phone || "")}\``,
    `📅 *Ngày:* ${tg(d.date || "")} ${tg(d.time || "")}`,
    `👥 *Số khách:* ${tg(d.party || "")}`,
    `🎯 *Hạng bàn:* ${tg(d.tier || "—")}`,
    `💬 *Ghi chú:* ${tg(d.note || "—")}`,
    ``,
    `_Liên hệ lại khách trong 10 phút_`,
  ].join("\n");

  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: "MarkdownV2",
      reply_markup: {
        inline_keyboard: [[
          { text: "💬 Zalo khách", url: `https://zalo.me/${phoneDigits}` },
        ]],
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram ${res.status}: ${body}`);
  }
}

export async function POST(req: Request) {
  try {
    const d = (await req.json()) as Payload;

    if (d.bot_field) return NextResponse.json({ ok: false, reason: "bot" });

    if (!d.name || !d.phone) {
      return NextResponse.json({ ok: false, reason: "missing" }, { status: 400 });
    }

    const [mailResult, sheetResult, tgResult] = await Promise.allSettled([
      sendMail(d),
      appendToSheet(d),
      sendTelegram(d),
    ]);

    if (mailResult.status === "rejected") {
      console.error("[/api/reserve] mail failed", mailResult.reason);
      return NextResponse.json({ ok: false, reason: "mail" }, { status: 500 });
    }
    if (sheetResult.status === "rejected") {
      console.error("[/api/reserve] sheet append failed (mail OK)", sheetResult.reason);
    }
    if (tgResult.status === "rejected") {
      console.error("[/api/reserve] telegram failed (non-blocking)", tgResult.reason);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/reserve]", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
