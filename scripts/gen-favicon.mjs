// Generate favicon 256×256 từ logo LOCO Complex
// Usage: node scripts/gen-favicon.mjs

import sharp from "sharp";
import { copyFileSync } from "fs";

const LOGO_SRC = "./public/assets/loco/logo.png";
const OUT_PUBLIC = "./public/favicon.ico";
const OUT_APP = "./app/favicon.ico";

// Logo LOCO nền trắng — dùng nền trắng để giữ màu logo đúng
await sharp(LOGO_SRC)
  .resize(256, 256, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .flatten({ background: { r: 255, g: 255, b: 255 } })
  .png()
  .toFile(OUT_PUBLIC);
console.log("✓ public/favicon.ico (256×256, white bg)");

// Cũng copy vào app/favicon.ico để Next.js App Router serve đúng
copyFileSync(OUT_PUBLIC, OUT_APP);
console.log("✓ app/favicon.ico ← override (critical for Next.js App Router)");
