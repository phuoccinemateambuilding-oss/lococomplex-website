/**
 * Chuyển LƯỢT BẤM nút liên hệ (Zalo · WhatsApp · Gọi · Messenger) lên Omni Inbox — nguồn khách.
 *
 * Trình duyệt gửi về chính web này (khỏi CSP, khỏi trình chặn quảng cáo), máy chủ web chuyển tiếp tới
 * tên miền CỐ ĐỊNH của Omni. Đổi máy chủ Omni chỉ cần sửa bản ghi DNS "omni" của cinemateambuilding.info,
 * không phải deploy lại web. Bắn-rồi-quên: Omni hỏng cũng không ảnh hưởng gì tới khách.
 */
export const dynamic = "force-dynamic";

const OMNI = "https://omni.cinemateambuilding.info/api/zalo-click";

export async function POST(req: Request): Promise<Response> {
  try {
    const host = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "")
      .split(",")[0].trim().replace(/:\d+$/, "");
    const body = (await req.text()).slice(0, 2000);
    await fetch(OMNI, {
      method: "POST",
      headers: { "content-type": "text/plain;charset=UTF-8", "x-nguon-host": host },
      body,
      signal: AbortSignal.timeout(4000),
    });
  } catch { /* nguồn khách là gia vị — không bao giờ làm phiền khách */ }
  return new Response(null, { status: 204 });
}
