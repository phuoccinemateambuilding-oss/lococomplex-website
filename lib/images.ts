export const galleryImages = Array.from({ length: 33 }, (_, i) => ({
  src: `/assets/loco/gallery/gallery-${String(i + 1).padStart(2, "0")}.jpg`,
  alt: `LOCO Complex — khoảnh khắc đêm #${i + 1} tại 11 Nam Quốc Cang, Quận 1, Sài Gòn`,
}));

export const spaceImages = Array.from({ length: 14 }, (_, i) => ({
  src: `/assets/loco/space/space-${String(i + 1).padStart(2, "0")}.jpg`,
  alt: `LOCO Complex — không gian Heatroom / Hip-hop Floor #${i + 1}`,
}));

/* Menu LOCO Heatroom bản cập nhật 2026-09-04 — 5 trang.
   Nguồn: /Volumes/TRANSCEND/Nightclub-Media/Sài Gòn/Loco/Menu
   (thứ tự trang theo SỐ IN Ở CHÂN mỗi trang menu, không theo tên file IMG_xxxx).
   Ảnh dùng chung cho trang lật /dat-ban/menu và trang SEO /menu.
   Tiêu đề + mô tả từng trang nằm trong i18n/{vi,en}.json → menuPage.pages */
export const MENU_TOTAL = 5;
export const MENU_PAGE_W = 1200;
export const MENU_PAGE_H = 1820;

export const menuPageSrc = (no: number) =>
  `/assets/loco/menu-book/loco-menu-${String(no).padStart(2, "0")}.webp`;

export const menuImages = Array.from({ length: MENU_TOTAL }, (_, i) => ({
  no: i + 1,
  src: menuPageSrc(i + 1),
}));
