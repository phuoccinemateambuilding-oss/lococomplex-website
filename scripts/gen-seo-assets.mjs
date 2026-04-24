import sharp from "sharp";
import fs from "fs";
import path from "path";

const PUBLIC_DIR = process.argv[2] || "public";
const BG = process.argv[3] || "#0A0A0A";
const LOGO = path.join(PUBLIC_DIR, "assets/loco/logo.png");

if (!fs.existsSync(LOGO)) {
  console.error("Logo not found:", LOGO);
  process.exit(1);
}

const sizes = [
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "favicon-32.png", size: 32 },
];

async function main() {
  for (const { name, size } of sizes) {
    const out = path.join(PUBLIC_DIR, name);
    await sharp({
      create: { width: size, height: size, channels: 4, background: BG },
    })
      .composite([
        {
          input: await sharp(LOGO)
            .resize({ width: Math.round(size * 0.82), fit: "inside" })
            .toBuffer(),
          gravity: "center",
        },
      ])
      .png()
      .toFile(out);
    console.log("✓", name, `(${size}×${size})`);
  }

  // OG image 1200×630
  const ogOut = path.join(PUBLIC_DIR, "og.jpg");
  const logoBuf = await sharp(LOGO).resize({ width: 420, fit: "inside" }).toBuffer();
  const title = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="210">
      <style>
        .brand { font: 900 72px "Arial Black", system-ui; fill: #ffffff; letter-spacing: 2px; }
        .sub { font: 700 32px "Arial", system-ui; fill: #F5C330; letter-spacing: 3px; }
      </style>
      <text x="600" y="85" text-anchor="middle" class="brand">LOCO COMPLEX</text>
      <text x="600" y="140" text-anchor="middle" class="sub">DISTRICT 1 · SAIGON</text>
      <text x="600" y="180" text-anchor="middle" class="sub" style="font-size:22px;fill:#E23A2C">make impossible</text>
    </svg>`,
  );

  await sharp({
    create: { width: 1200, height: 630, channels: 4, background: BG },
  })
    .composite([
      { input: logoBuf, gravity: "north", top: 60, left: Math.round((1200 - 420) / 2) },
      { input: title, top: 400, left: 0 },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(ogOut);
  console.log("✓ og.jpg (1200×630)");

  // favicon.ico (keep existing OR regenerate from 32px)
  console.log("Note: favicon.ico giữ nguyên file hiện tại (15KB multi-res)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
