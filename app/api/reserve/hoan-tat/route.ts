import { NextResponse } from "next/server";
import { cardKeyboard, cardText, chayKho, conNguyen, crm, docVe, kyVe, telegram, vnHHMM, VE_HOAN_TAT_HAN_MS, type DonCrm, type VeSuaSo } from "@/lib/reserve-card";
import { hienThiSo } from "@/lib/phone-check";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Khách xong bước soát số trên màn cảm ơn → GỬI card đơn vào group "Đơn booking" (28/10/2026).
//
// Sếp chốt: card phải là thông tin CUỐI CÙNG sau bước khách soát / sửa số. Route reserve giữ card lại (vé
// mang cờ cho=1); màn cảm ơn gọi route này khi khách bấm "Xác nhận đúng số", bấm X, rời trang (chuyển sang
// Zalo, khoá máy, đóng tab) hoặc để popup quá 3 phút. Gọi lại khi card đã gửi (vé có m) = chỉ cập nhật dòng
// trạng thái trên card, không gửi card thứ hai. Trình duyệt tự xếp hàng các lần gọi nên không có hai lần gửi song song.

const VENUE_NAME = process.env.VENUE_NAME || "LOCO Complex";

type Cach = "nut" | "x" | "roi-trang" | "het-gio";

function trangThai(cach: Cach, ve: VeSuaSo): string {
  const chinh: Record<Cach, string> = {
    nut: "✅ khách đã bấm xác nhận đúng số Zalo/WhatsApp",
    x: "☑️ khách đã xem lại số rồi đóng bảng (chưa bấm xác nhận)",
    "roi-trang": "↪️ khách rời trang trước khi bấm xác nhận số",
    "het-gio": "⌛ khách chưa bấm xác nhận số sau 3 phút",
  };
  return ve.p0 ? `${chinh[cach]} · ✏️ đã sửa lại số (lúc đầu gõ ${hienThiSo(ve.p0)})` : chinh[cach];
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { token?: string; cach?: string };
    const ve = docVe(String(body.token || ""), VE_HOAN_TAT_HAN_MS);
    if (!ve) return NextResponse.json({ ok: false, reason: "het_han" }, { status: 400 });
    const cach: Cach = (["nut", "x", "roi-trang", "het-gio"] as const).find((c) => c === body.cach) ?? "x";

    if (ve.dry || chayKho()) {
      return NextResponse.json({ ok: true, suaToken: kyVe({ ...ve, cho: undefined, m: ve.m ?? 1 }), daGuiCard: !ve.m });
    }

    // Đơn đã gửi đầu mối từ trước (vd sếp bấm trên tab BK của Omni) → card chỉ để xem, bỏ nút "Gửi …" kẻo gửi trùng.
    const get = await crm("GET", ve.bk);
    const don = get?.ok ? ((await get.json().catch(() => ({}))) as { booking?: DonCrm }).booking ?? null : null;
    const daGui = !!don?.partner_id;
    const tt = trangThai(cach, ve) + (daGui ? " · đơn đã được gửi đầu mối trước đó" : "");

    if (!ve.m) {
      // Card chưa gửi → gửi bản cuối cùng (số trong vé là số khách đã soát / sửa)
      const gui = await telegram("sendMessage", {
        text: cardText(VENUE_NAME, ve, ve.bk, ve.ts, false, vnHHMM(), tt),
        parse_mode: "MarkdownV2",
        reply_markup: { inline_keyboard: cardKeyboard(ve.phone, ve.bk, false, !daGui) },
      });
      if (!gui?.message_id) return NextResponse.json({ ok: false, reason: "telegram" }, { status: 502 });
      return NextResponse.json({ ok: true, suaToken: kyVe({ ...ve, cho: undefined, m: gui.message_id }), daGuiCard: true });
    }

    // Card đã có (gửi lúc khách rời trang, giờ khách quay lại bấm nút / X) → chỉ đổi dòng trạng thái, và chỉ khi
    // đơn còn nguyên: card đã sửa tay / đã gửi đầu mối thì để yên.
    if (cach !== "roi-trang" && cach !== "het-gio" && don && !daGui && conNguyen(don, ve)) {
      await telegram("editMessageText", {
        message_id: ve.m,
        text: cardText(VENUE_NAME, ve, ve.bk, ve.ts, false, vnHHMM(), tt),
        parse_mode: "MarkdownV2",
        reply_markup: { inline_keyboard: cardKeyboard(ve.phone, ve.bk, false) },
      });
    }
    return NextResponse.json({ ok: true, suaToken: body.token, daGuiCard: false });
  } catch (err) {
    console.error("[/api/reserve/hoan-tat]", err);
    return NextResponse.json({ ok: false, reason: "loi" }, { status: 500 });
  }
}
