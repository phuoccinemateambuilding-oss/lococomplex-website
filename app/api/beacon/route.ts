import { NextResponse } from "next/server";
import { isOfficialHost, officialHost } from "../../../lib/official-host";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Nhận báo động từ lớp chống sao chép (script đầu trang + DomainGuard) khi website chạy trên tên miền
// lạ → nhắn Telegram RIÊNG cho chủ (CLONE_ALERT_CHAT_ID), không gửi group đặt bàn.
// Endpoint công khai nên chặn spam: mỗi tên miền tối đa 1 tin / 6 giờ, mỗi instance tối đa 20 tin / giờ.
// Kiểm tra cấu hình mà KHÔNG gửi tin: POST {"kiemtra":"<CLONE_ALERT_CHAT_ID>"} → {"token":true,"chat":true}
const VENUE = "LOCO Complex";
// Link *.vercel.app của CHÍNH project (bản deploy / nhánh / alias): trang vẫn tự chuyển về tên miền chính, nhưng KHÔNG
// nhắn Telegram — mỗi bản deploy có link riêng, dịch vụ chụp ảnh deployment của Vercel mở nó sau mỗi lần deploy.
const OWN_VERCEL_PROJECT = "lococomplex-website";
const OWN_VERCEL_TEAM = "phuoccinemateambuilding-oss-projects";
const OWN_VERCEL_ALIASES: string[] = ["lococomplex-website.vercel.app","lococomplex-website-phuoccinemateambuilding-oss-projects.vercel.app"];
const PER_HOST_MS = 6 * 60 * 60 * 1000;
const HOURLY_CAP = 20;
const lastAlertByHost = new Map<string, number>();
let hourStart = 0;
let hourCount = 0;

const noContent = () => new NextResponse(null, { status: 204 });

function isOwnVercelHost(host: string): boolean {
  if (!host.endsWith(".vercel.app")) return false;
  if (OWN_VERCEL_ALIASES.includes(host) || host === process.env.VERCEL_URL || host === process.env.VERCEL_BRANCH_URL) return true;
  return !!OWN_VERCEL_PROJECT && !!OWN_VERCEL_TEAM && host.startsWith(`${OWN_VERCEL_PROJECT}-`) && host.endsWith(`-${OWN_VERCEL_TEAM}.vercel.app`);
}

const esc = (s: string) =>
  s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c] as string);

export async function POST(req: Request) {
  let data: { h?: unknown; u?: unknown; r?: unknown; kiemtra?: unknown } | null;
  try {
    // sendBeacon gửi text/plain → đọc text rồi tự parse
    data = JSON.parse(await req.text());
  } catch {
    return noContent();
  }
  if (!data || typeof data !== "object") return noContent();

  const TOKEN = process.env.CLONE_ALERT_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.CLONE_ALERT_CHAT_ID;

  if (typeof data.kiemtra === "string" && CHAT_ID && data.kiemtra === CHAT_ID) {
    let chat = false;
    try {
      const r = await fetch(
        `https://api.telegram.org/bot${TOKEN}/getChat?chat_id=${encodeURIComponent(CHAT_ID)}`,
        { signal: AbortSignal.timeout(8000) },
      );
      chat = r.ok && (await r.json())?.ok === true;
    } catch {
      // chat = false
    }
    return NextResponse.json({ token: !!TOKEN, chat });
  }

  const host = String(data.h ?? "").toLowerCase().slice(0, 253);
  if (!host || !/^[a-z0-9.-]+$/.test(host) || isOfficialHost(host) || isOwnVercelHost(host)) return noContent();

  const now = Date.now();
  if (now - (lastAlertByHost.get(host) ?? 0) < PER_HOST_MS) return noContent();
  if (now - hourStart > 60 * 60 * 1000) {
    hourStart = now;
    hourCount = 0;
  }
  if (hourCount >= HOURLY_CAP) return noContent();
  lastAlertByHost.set(host, now);
  hourCount++;

  if (!TOKEN || !CHAT_ID) {
    console.warn("[beacon] website đang chạy trên tên miền lạ (chưa set CLONE_ALERT_CHAT_ID):", host);
    return noContent();
  }

  const page = String(data.u ?? "").slice(0, 300);
  const referrer = String(data.r ?? "").slice(0, 200);
  let city = req.headers.get("x-vercel-ip-city") ?? "";
  try {
    city = decodeURIComponent(city);
  } catch {
    // giữ nguyên nếu header không phải dạng mã hoá URL
  }
  const country = req.headers.get("x-vercel-ip-country") ?? "";
  const place = [city, country].filter(Boolean).join(", ");
  const time = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

  const lines = [
    `🚨 <b>Có người vào website sao chép ${esc(VENUE)}</b>`,
    "",
    `🌐 Tên miền: <b>${esc(host)}</b>`,
  ];
  if (page) lines.push(`📄 Trang: ${esc(page)}`);
  if (referrer) lines.push(`↩️ Đến từ: ${esc(referrer)}`);
  if (place) lines.push(`📍 Vị trí khách: ${esc(place)}`);
  lines.push(`🕒 ${esc(time)}`, "", `Khách được tự chuyển về ${esc(officialHost())}. Mỗi tên miền chỉ báo 1 lần trong 6 giờ.`);
  if (host.endsWith(".vercel.app")) {
    lines.push("ℹ️ Tên miền *.vercel.app: có thể là link Vercel của chính website (chưa bật chuyển về tên miền chính).");
  } else {
    lines.push("ℹ️ Nếu đây là tên miền mới của chính website: chạy lại skill chong-sao-chep-web để thêm tên miền.");
  }
  const text = lines.join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML", disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("[beacon] Telegram", res.status, await res.text());
  } catch (err) {
    console.error("[beacon] Telegram lỗi:", err);
  }
  return noContent();
}
