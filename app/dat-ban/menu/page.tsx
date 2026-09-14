import { MenuFlipbookMount } from "@/components/MenuFlipbookMount";

// Metadata nằm ở layout.tsx (render trong <head>). Trang immersive fullscreen — KHÔNG dùng Navbar/Footer.
export default function DatBanMenuPage() {
  return <MenuFlipbookMount locale="vi" />;
}
