// Mở form đặt bàn nhanh (QuickBookDialog) từ các nút "Đặt bàn" của landing /dat-ban, /en/book.
// Đề xuất #2 ads-ops 28/10/2026, anh Phước duyệt: khách quảng cáo bấm là điền 5 ô ngay tại chỗ,
// không phải cuộn 4.7 màn hình tới form dài 6 ô.
//
// Trả về false khi chưa có form nhanh nào lắng nghe (chưa hydrate / chunk chưa tải) → nút tự cuộn tới #form như cũ.

export const OPEN_QUICK_BOOK_EVENT = "loco:open-quick-book";
export const QUICK_BOOK_ACK_EVENT = "loco:quick-book-ack";

export function openQuickBook(source: string): boolean {
  if (typeof window === "undefined") return false;
  let handled = false;
  const ack = () => {
    handled = true;
  };
  window.addEventListener(QUICK_BOOK_ACK_EVENT, ack, { once: true });
  window.dispatchEvent(new CustomEvent(OPEN_QUICK_BOOK_EVENT, { detail: { source } }));
  window.removeEventListener(QUICK_BOOK_ACK_EVENT, ack);
  return handled;
}
