"use client";

import { COUNTRIES } from "@/lib/countryCodes";

// Select mã quốc gia đứng trước input số điện thoại.
// value = ISO code ("VN") để tránh trùng value giữa các nước chung dial (+1 US/CA).
export function CountryCodeSelect({
  value,
  onChange,
  className,
  ariaLabel,
  name,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  ariaLabel: string;
  name?: string;
}) {
  return (
    <select value={value} onChange={onChange} className={className} aria-label={ariaLabel} name={name}>
      {COUNTRIES.map((c) => (
        <option key={c.iso} value={c.iso} title={c.nameVi}>
          {c.flag} {c.dial}
        </option>
      ))}
    </select>
  );
}
