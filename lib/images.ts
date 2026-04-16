export const galleryImages = Array.from({ length: 33 }, (_, i) => ({
  src: `/assets/loco/gallery/gallery-${String(i + 1).padStart(2, "0")}.jpg`,
  alt: `LOCO Complex ${i + 1}`,
}));

export const spaceImages = Array.from({ length: 14 }, (_, i) => ({
  src: `/assets/loco/space/space-${String(i + 1).padStart(2, "0")}.jpg`,
  alt: `LOCO Complex space ${i + 1}`,
}));

export const menuImages = Array.from({ length: 11 }, (_, i) => ({
  src: `/assets/loco/menu/menu-${String(i + 1).padStart(2, "0")}.webp`,
  alt: `LOCO Complex menu ${i + 1}`,
}));
