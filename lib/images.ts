export const galleryImages = Array.from({ length: 33 }, (_, i) => ({
  src: `/assets/loco/gallery/gallery-${String(i + 1).padStart(2, "0")}.jpg`,
  alt: `LOCO Complex — khoảnh khắc đêm #${i + 1} tại 11 Nam Quốc Cang, Quận 1, Sài Gòn`,
}));

export const spaceImages = Array.from({ length: 14 }, (_, i) => ({
  src: `/assets/loco/space/space-${String(i + 1).padStart(2, "0")}.jpg`,
  alt: `LOCO Complex — không gian Heatroom / Hip-hop Floor #${i + 1}`,
}));

export const menuImages = Array.from({ length: 11 }, (_, i) => ({
  src: `/assets/loco/menu/menu-${String(i + 1).padStart(2, "0")}.webp`,
  alt: `LOCO Complex BITES — trang menu #${i + 1}`,
}));
