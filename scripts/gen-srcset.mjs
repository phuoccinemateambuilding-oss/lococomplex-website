// Pre-generate 3 srcset variants (400w, 800w, 1280w) cho gallery + space + menu.
// Output cùng folder, naming: <name>-<width>.webp.
// Thay thế Vercel Image Optimization (đã hết quota Hobby plan).
//
// Pattern đúc kết từ Empire Club. Run: node scripts/gen-srcset.mjs

import sharp from "sharp";
import { readdir } from "fs/promises";
import { join, basename, extname } from "path";
import { fileURLToPath } from "url";
import { statSync, existsSync } from "fs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..", "public", "assets", "loco");

const TARGETS = [
  { dir: join(ROOT, "gallery"), pattern: /^gallery-\d+\.(jpg|webp|jpeg|png)$/i },
  { dir: join(ROOT, "space"),   pattern: /^(space-\d+|hero-main)\.(jpg|webp|jpeg|png)$/i },
  { dir: join(ROOT, "menu"),    pattern: /^menu-\d+\.(jpg|webp|jpeg|png)$/i },
];

const SIZES = [400, 800, 1280];
let totalAdded = 0;
let totalCount = 0;

for (const { dir, pattern } of TARGETS) {
  if (!existsSync(dir)) {
    console.log(`(skip) ${dir} không tồn tại`);
    continue;
  }
  const files = (await readdir(dir)).filter((f) => pattern.test(f));
  console.log(`\n=== ${dir.split("/").slice(-2).join("/")} (${files.length} files) ===`);

  for (const f of files) {
    const src = join(dir, f);
    const base = basename(f, extname(f));
    if (/-\d{3,4}$/.test(base)) continue; // already a variant

    const meta = await sharp(src).metadata();
    const origW = meta.width ?? 0;

    for (const w of SIZES) {
      if (w >= origW) continue;
      const dst = join(dir, `${base}-${w}.webp`);
      if (existsSync(dst)) continue;
      await sharp(src)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: w === 1280 ? 75 : 72, effort: 6 })
        .toFile(dst);
      const size = statSync(dst).size;
      totalAdded += size;
      totalCount++;
      console.log(`✓ ${base}-${w}.webp  (${(size / 1024).toFixed(0)}KB)`);
    }
  }
}

console.log(`\nDone. ${totalCount} variants added, total ${(totalAdded / 1024 / 1024).toFixed(2)}MB.`);
