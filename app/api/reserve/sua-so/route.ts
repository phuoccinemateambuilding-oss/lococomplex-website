import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { cardKeyboard, cardText, chayKho, conNguyen, crm, docVe, kyVe, telegram, vnHHMM, type DonCrm, type VeSuaSo } from "@/lib/reserve-card";
import { chiSo, chuanHoaSoSua, hienThiSo, kiemTraSo } from "@/lib/phone-check";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Khách SỬA SỐ ngay trên màn cảm ơn (28/10/2026) — số gõ nhầm là lý do số 1 lễ tân không liên lạc
// được khách đặt qua web.
//
// Card Telegram + CRM phải luôn mang CÙNG một số: nút "Gửi …" của bot PATCH CRM kèm expect_phone = số
// in trên card, lệch là CRM trả 409 và đơn kẹt. Nên chỉ ghi đè card + CRM khi đơn còn nguyên như lúc
// khách gửi (chưa gửi đầu mối, sếp chưa sửa tay qua sua-card). Ca còn lại: KHÔNG đụng card lẫn CRM,
// chỉ trả lời vào card để người thật sửa bằng "sđt <số mới>" (sua-card lo đồng bộ cả hai).

const VENUE_NAME = process.env.VENUE_NAME || "LOCO Complex";
async function suaSheet(ve: VeSuaSo, moi: string) {
  const SHEET_ID = process.env.GOOGLE_SHEET_ID;
  const SA_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const SA_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!SHEET_ID || !SA_EMAIL || !SA_KEY || !ve.r) return;
  const auth = new google.auth.JWT({ email: SA_EMAIL, key: SA_KEY, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
  const sheets = google.sheets({ version: "v4", auth });
  // Sheet master dùng chung nhiều web — chỉ ghi khi dòng đó vẫn là đơn này (cột D quán, E tên)
  const row = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: `Booking!D${ve.r}:E${ve.r}` });
  const [quan, ten] = row.data.values?.[0] ?? [];
  if (quan !== VENUE_NAME || String(ten ?? "") !== (ve.name || "")) return;
  const d = chiSo(moi);
  const dep = d.length === 10 || d.length === 11 ? `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}` : d;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `Booking!F${ve.r}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[dep]] },
  });
}

async function guiMail(ve: VeSuaSo, cu: string, moi: string, ghiChu: string) {
  const GMAIL = process.env.GMAIL_USER;
  const PASS = process.env.GMAIL_APP_PASSWORD;
  if (!GMAIL || !PASS) return;
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: GMAIL, pass: PASS.replace(/\s/g, "") },
  });
  await transporter.sendMail({
    from: `"${VENUE_NAME} — Website" <${GMAIL}>`,
    to: process.env.NOTIFY_EMAIL || GMAIL,
    subject: `✏️ Khách sửa SĐT ${ve.bk} — ${ve.name} · ${moi}`,
    text: [
      `Khách vừa sửa số điện thoại ngay trên màn cảm ơn của website ${VENUE_NAME}.`,
      ``,
      `Mã đơn: ${ve.bk}`,
      `Tên: ${ve.name}`,
      `Số cũ: ${cu}`,
      `Số MỚI: ${moi}`,
      `Ngày: ${ve.date} ${ve.time} · ${ve.party} khách`,
      ``,
      ghiChu,
    ].join("\n"),
  });
}

export async function POST(req: Request) {
  try {
    const { token, phone } = (await req.json()) as { token?: string; phone?: string };
    const ve = docVe(String(token || ""));
    if (!ve) return NextResponse.json({ ok: false, reason: "het_han" }, { status: 400 });

    const moi = chuanHoaSoSua(String(phone || ""));
    const loi = kiemTraSo(moi);
    if (loi) return NextResponse.json({ ok: false, reason: "sai_so", loi }, { status: 400 });

    const cu = ve.phone || "";
    if (chiSo(moi) === chiSo(cu)) return NextResponse.json({ ok: true, phone: cu, suaToken: token });

    // Hạn vé tính từ lúc đặt (iat giữ nguyên) — sửa nhiều lần cũng chỉ trong 30 phút đầu.
    const suaToken = kyVe({ ...ve, phone: moi, p0: ve.p0 ?? cu });
    if (ve.dry || chayKho()) return NextResponse.json({ ok: true, phone: moi, suaToken, capNhatCard: true });

    // 1) Đơn còn nguyên? (chưa gửi đầu mối, chưa ai sửa tay)
    let lyDo = "";
    let coCrm = false;
    let daGui = false;
    const get = await crm("GET", ve.bk);
    if (get?.ok) {
      const b = ((await get.json().catch(() => ({}))) as { booking?: DonCrm }).booking;
      if (!b) lyDo = "chưa đọc được đơn trên CRM";
      else if (b.partner_id) {
        lyDo = "đơn ĐÃ GỬI đầu mối với số cũ";
        daGui = true;
      } else if (ve.cho && !ve.m) coCrm = true; // card chưa gửi → chỉ CRM cần khớp số, card sẽ dựng từ vé mới
      else if (!conNguyen(b, ve)) lyDo = "card đã được sửa tay";
      else coCrm = true;
    } else if (get && get.status !== 404) {
      lyDo = "chưa đọc được đơn trên CRM";
    } // 404 / không có khoá CRM: đơn không nằm trên CRM → chỉ còn card để sửa

    // 1b) Card còn GIỮ LẠI chờ khách soát số: chưa có card để sửa — chỉ đưa số mới vào CRM; card gửi lúc
    // hoàn tất (/api/reserve/hoan-tat) dựng từ vé mới nên mang luôn số cuối cùng. Không nhắn group.
    if (ve.cho && !ve.m && !daGui) {
      if (coCrm) {
        const patch = await crm("PATCH", ve.bk, { phone: moi, expect_phone: cu });
        if (!patch?.ok) console.error("[sua-so] CRM không nhận số mới (card chưa gửi):", patch?.status);
      }
      const [sheet, mail] = await Promise.allSettled([
        suaSheet(ve, moi),
        guiMail(ve, cu, moi, "Card Telegram chưa gửi — card gửi sau bước xác nhận sẽ mang số mới."),
      ]);
      if (sheet.status === "rejected") console.error("[sua-so] sheet lỗi:", sheet.reason);
      if (mail.status === "rejected") console.error("[sua-so] mail lỗi:", mail.reason);
      return NextResponse.json({ ok: true, phone: moi, suaToken, capNhatCard: true });
    }
    if (!lyDo && !ve.m) lyDo = "không tìm được card";

    // 2) Ghi đè CRM rồi card; card hỏng thì trả CRM về số cũ để hai bên không lệch nhau.
    let capNhatCard = false;
    if (!lyDo) {
      let crmOk = true;
      if (coCrm) {
        const patch = await crm("PATCH", ve.bk, { phone: moi, expect_phone: cu });
        crmOk = !!patch?.ok;
        if (!crmOk) lyDo = "CRM không nhận số mới";
      }
      if (crmOk) {
        capNhatCard = !!(await telegram("editMessageText", {
          message_id: ve.m,
          text: cardText(VENUE_NAME, { ...ve, phone: moi }, ve.bk, ve.ts, false, vnHHMM(), `✏️ khách đã sửa lại số (lúc đầu gõ ${hienThiSo(ve.p0 ?? cu)})`),
          parse_mode: "MarkdownV2",
          reply_markup: { inline_keyboard: cardKeyboard(moi, ve.bk, false) },
        }));
        if (!capNhatCard) {
          lyDo = "không sửa được card";
          if (coCrm) await crm("PATCH", ve.bk, { phone: cu, expect_phone: moi });
        }
      }
    }

    // 3) Báo ngay dưới card. Tránh chữ "Đặt bàn mới" + nút fwd: userbot nhận diện card bằng hai dấu đó.
    const dong = capNhatCard
      ? [`✏️ ${ve.bk} — khách tự sửa SĐT trên web`, `${hienThiSo(cu)} → ${hienThiSo(moi)}`, `Card + CRM đã mang số mới.`]
      : [
          `⚠️ ${ve.bk} — khách vừa sửa SĐT trên web (${lyDo})`,
          `Số cũ: ${hienThiSo(cu)}`,
          `Số MỚI: ${hienThiSo(moi)}`,
          lyDo.startsWith("đơn ĐÃ GỬI")
            ? `Tin chào / phiếu đã đi số cũ — nhờ liên hệ lại số mới.`
            : `Trả lời card: sđt ${chiSo(moi)} để cập nhật card + CRM.`,
        ];
    await telegram("sendMessage", {
      text: dong.join("\n"),
      ...(ve.m ? { reply_parameters: { message_id: ve.m, allow_sending_without_reply: true } } : {}),
      reply_markup: { inline_keyboard: [[{ text: "📋 Sao chép SĐT mới", copy_text: { text: chiSo(moi) } }]] },
    });

    // 4) Sheet + mail: phụ, lỗi không làm hỏng việc sửa số
    const ghiChu = capNhatCard ? "Card Telegram + CRM đã cập nhật số mới." : `Chưa ghi đè card/CRM: ${lyDo}.`;
    const [sheet, mail] = await Promise.allSettled([suaSheet(ve, moi), guiMail(ve, cu, moi, ghiChu)]);
    if (sheet.status === "rejected") console.error("[sua-so] sheet lỗi:", sheet.reason);
    if (mail.status === "rejected") console.error("[sua-so] mail lỗi:", mail.reason);

    return NextResponse.json({ ok: true, phone: moi, suaToken, capNhatCard });
  } catch (err) {
    console.error("[/api/reserve/sua-so]", err);
    return NextResponse.json({ ok: false, reason: "loi" }, { status: 500 });
  }
}
