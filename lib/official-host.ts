// Chống sao chép website — cài bằng skill chong-sao-chep-web ngày 17/09/2026.
//
// Kẻ chép web tải nguyên HTML + file JS rồi TÌM-THAY chuỗi trong mọi file (đổi số điện thoại, tên
// miền, sửa cả code đã nén). Vì vậy tên miền chính thức KHÔNG viết thẳng mà lưu dạng XOR: phép
// tìm-thay không chạm tới được, lớp chống sao chép vẫn chạy trên bản bị chép.
//
// ⚠️ Đổi tên miền hoặc nhân bản code này sang venue khác thì phải sinh lại mã, nếu không web sẽ
// chuyển MỌI khách về tên miền cũ:
//   node ~/.claude/skills/chong-sao-chep-web/scripts/cai-dat.mjs --web <thư mục web> --domain <tên miền> --ghi-de

export const HOST_KEY = 0x2f;

/**
 * Phần tử đầu = tên miền chính (nơi chuyển khách về); các phần tử sau = tên miền phụ cũng chính chủ.
 * Mảng RỖNG = đang TẮT (site chưa có tên miền riêng): không chuyển hướng, không báo động.
 */
export const OFFICIAL_HOST_CODES: number[][] = [
  [67,64,76,64,76,64,66,95,67,74,87,1,76,64,66,1,89,65]
];

/** IP nội bộ: duyệt local trên máy / điện thoại cùng Wi-Fi / Tailscale (100.64.0.0/10) — không ai dựng web công khai được ở đây */
export const PRIVATE_IPV4 =
  /^(127\.\d{1,3}\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.\d{1,3}\.\d{1,3})$/;

/** IPv6 nội bộ trong location.hostname (có ngoặc vuông): loopback, ULA fc00::/7, link-local fe80::/10 */
export const PRIVATE_IPV6 = /^\[(::1|f[cd][0-9a-f]{0,2}:[0-9a-f:.%]*|fe[89ab][0-9a-f]?:[0-9a-f:.%]*)\]$/;

/** Chống vòng lặp: tên miền chính lại chuyển ngược về đây (đổi tên miền nhưng quên sinh lại mã). */
export const LOOP_KEY = "__cscw";
export const LOOP_MS = 10000;

const decode = (codes: number[]) => String.fromCharCode(...codes.map((c) => c ^ HOST_KEY));

export function officialHosts(): string[] {
  return OFFICIAL_HOST_CODES.map(decode);
}

export function officialHost(): string {
  return OFFICIAL_HOST_CODES.length ? decode(OFFICIAL_HOST_CODES[0]) : "";
}

export function officialOrigin(): string {
  return `https://${officialHost()}`;
}

/** Google Dịch mở trang qua <tên-miền>.translate.goog: dấu "-" nhân đôi rồi dấu "." thành "-" */
export function translateProxyHost(host: string): string {
  return `${host.replace(/-/g, "--").replace(/\./g, "-")}.translate.goog`;
}

/** true = được phép chạy site ở hostname này (tên miền chính chủ, local, Google Dịch, Wayback Machine). */
export function isOfficialHost(hostname: string): boolean {
  if (!OFFICIAL_HOST_CODES.length) return true; // đang tắt
  const h = hostname.toLowerCase().replace(/\.$/, "");
  if (
    h === "localhost" ||
    h === "::1" ||
    h === "web.archive.org" ||
    h.endsWith(".local") || // tên máy trong mạng nội bộ (mDNS)
    PRIVATE_IPV4.test(h) ||
    PRIVATE_IPV6.test(h)
  ) {
    return true;
  }
  return officialHosts().some((o) => {
    // tên miền chính dạng www.x.com thì x.com cũng là của mình (và ngược lại)
    const apex = o.startsWith("www.") ? o.slice(4) : o;
    return [apex, `www.${apex}`].some((v) => h === v || h === translateProxyHost(v));
  });
}

/** Báo về tên miền chính khi site đang chạy trên tên miền lạ. Không được làm hỏng việc chuyển hướng. */
export function reportCloneVisit(): void {
  try {
    const body = JSON.stringify({
      h: location.hostname,
      u: location.href.slice(0, 500),
      r: document.referrer.slice(0, 300),
    });
    navigator.sendBeacon?.(`${officialOrigin()}/api/beacon`, body);
  } catch {
    // bỏ qua — chuyển hướng quan trọng hơn báo động
  }
}

/**
 * Lớp 2 (components/DomainGuard.tsx gọi sau khi React chạy). Cùng logic với script đầu <head>
 * trong lib/domain-guard-script.ts — sửa chỗ này thì sửa cả chỗ kia.
 */
export function guardDomain(): void {
  const l = window.location;
  if (isOfficialHost(l.hostname)) return;
  let store: Storage | null = null;
  let mark: string | null = null;
  try {
    store = window.sessionStorage;
    mark = store.getItem(LOOP_KEY);
  } catch {
    // sessionStorage bị chặn → bỏ qua phần chống vòng lặp
  }
  if (mark === "loop") return;
  reportCloneVisit();
  if (mark && Date.now() - Number(mark) < LOOP_MS) {
    // Vừa chuyển khách đi mà lại bị đẩy về đúng tên miền này: dừng để web không quay vòng vô hạn.
    try {
      store?.setItem(LOOP_KEY, "loop");
    } catch {
      // bỏ qua
    }
    return;
  }
  try {
    store?.setItem(LOOP_KEY, String(Date.now()));
  } catch {
    // bỏ qua
  }
  l.replace(officialOrigin() + (l.hostname ? l.pathname + l.search + l.hash : "/"));
}
