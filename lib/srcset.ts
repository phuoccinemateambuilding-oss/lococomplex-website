// Helper sinh srcset từ pre-gen variants -400.webp / -800.webp / original.
// Dùng cho mọi <img> trên site khi Vercel Image Optimization hết quota.
// Variants do scripts/gen-srcset.mjs tạo.

export function buildSrcSet(src: string, width = 1280): string {
  const dot = src.lastIndexOf(".");
  if (dot < 0) return src;
  const base = src.slice(0, dot);
  const parts: string[] = [];
  if (width > 400) parts.push(`${base}-400.webp 400w`);
  if (width > 800) parts.push(`${base}-800.webp 800w`);
  parts.push(`${src} ${width}w`);
  return parts.join(", ");
}

export function thumbSrc(src: string, width = 1280): string {
  const dot = src.lastIndexOf(".");
  if (dot < 0) return src;
  const base = src.slice(0, dot);
  if (width > 800) return `${base}-800.webp`;
  if (width > 400) return `${base}-400.webp`;
  return src;
}
