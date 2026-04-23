import { NextResponse, type NextRequest } from "next/server";

export function proxy(req: NextRequest) {
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
