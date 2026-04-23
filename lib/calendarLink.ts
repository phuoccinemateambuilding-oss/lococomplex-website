import { BRAND } from "@/lib/brand";

type BookingForCalendar = {
  name: string;
  date: string;
  time: string;
  tier: string;
  party: string;
  note: string;
  locale: "vi" | "en";
};

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatIcsLocal(year: number, month: number, day: number, hour: number, minute: number): string {
  return `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(minute)}00`;
}

export function buildCalendarUrl(b: BookingForCalendar): string {
  const [yStr, mStr, dStr] = b.date.split("-");
  const [hStr, minStr] = b.time.split(":");
  const year = Number(yStr), month = Number(mStr), day = Number(dStr);
  const hour = Number(hStr), minute = Number(minStr);

  const start = new Date(year, month - 1, day, hour, minute);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const startStr = formatIcsLocal(start.getFullYear(), start.getMonth() + 1, start.getDate(), start.getHours(), start.getMinutes());
  const endStr = formatIcsLocal(end.getFullYear(), end.getMonth() + 1, end.getDate(), end.getHours(), end.getMinutes());

  const title = b.locale === "vi"
    ? `Đặt bàn LOCO Complex${b.tier ? ` — ${b.tier}` : ""}`
    : `LOCO Complex reservation${b.tier ? ` — ${b.tier}` : ""}`;

  const details = b.locale === "vi"
    ? `Khách: ${b.name}\nSố khách: ${b.party}\nGhi chú: ${b.note || "Không có"}\nHotline: ${BRAND.phoneDisplay}`
    : `Guest: ${b.name}\nParty size: ${b.party}\nNote: ${b.note || "None"}\nHotline: ${BRAND.phoneDisplay}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${startStr}/${endStr}`,
    details,
    location: BRAND.address[b.locale],
    ctz: "Asia/Ho_Chi_Minh",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
