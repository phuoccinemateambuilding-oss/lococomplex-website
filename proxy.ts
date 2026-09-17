import { NextResponse, type NextRequest } from "next/server";

// ─── Chống sao chép (skill chong-sao-chep-web, 17/09/2026) ──────────────────────────────────────────
// Chặn công cụ tải nguyên website và máy chủ đang chạy bản chép. Chỉ áp cho trang HTML: /api, /_next và file
// tĩnh đi thẳng, nên form, webhook và ảnh không bị ảnh hưởng.
// KHÔNG chặn User-Agent rỗng: chưa xác minh được bot xem trước link của Zalo có gửi User-Agent hay không
// (chặn nhầm = link chia sẻ qua Zalo mất ảnh xem trước). Muốn chặn thì thêm `!ua ||` vào điều kiện, SAU khi
// thử dán link website vào Zalo vẫn thấy ảnh xem trước.
const SITE_COPIER_UA =
  /HTTrack|WebCopier|SiteSucker|Offline ?Explorer|WebZIP|Teleport ?Pro|Cyotek|WebReaper|Website ?Downloader|SiteSnagger|WebStripper|WebWhacker|BlackWidow|Wget/i;

// IP máy chủ từng chạy bản chép web venue — thêm dòng mới khi phát hiện vụ khác (ghi kèm tên miền + ngày)
const BLOCKED_IPS = new Set<string>([
  "150.95.108.119", // palmorasaigon.vn chép Palmora — 17/09/2026
]);

function blockSiteCopier(req: NextRequest): NextResponse | null {
  const p = req.nextUrl.pathname;
  if (p.startsWith("/api/") || p.startsWith("/_next/") || /\.[a-z0-9]+$/i.test(p)) return null;
  const ua = req.headers.get("user-agent") || "";
  const ip = req.headers.get("x-real-ip") || (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  if (!SITE_COPIER_UA.test(ua) && !BLOCKED_IPS.has(ip)) return null;
  return new NextResponse("Nội dung thuộc bản quyền LOCO Complex.", {
    status: 403,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      // no-store: CDN tuyệt đối không được lưu trang chặn rồi trả nhầm cho khách thật / Googlebot
      "cache-control": "private, no-store, max-age=0",
      "x-robots-tag": "noindex",
    },
  });
}
// ─────────────────────────────────────────────────────────────────────────────────────────────────

export function proxy(req: NextRequest) {
  const blocked = blockSiteCopier(req);
  if (blocked) return blocked;

  const host = req.headers.get("host") || "";

  // 1. www → non-www canonical redirect
  if (host === "www.lococomplex.com.vn") {
    const url = new URL(
      req.nextUrl.pathname + req.nextUrl.search,
      "https://lococomplex.com.vn"
    );
    return NextResponse.redirect(url, 301);
  }

  // 2. Vercel production alias → custom domain (consolidate SEO rank)
  if (host === "lococomplex-website.vercel.app") {
    const url = new URL(
      req.nextUrl.pathname + req.nextUrl.search,
      "https://lococomplex.com.vn"
    );
    return NextResponse.redirect(url, 301);
  }

  // 3. Preview deployments → noindex (prevent duplicate content in Google index)
  if (host.endsWith(".vercel.app")) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|webp|avif|svg|ico|webmanifest)$).*)",
  ],
};
