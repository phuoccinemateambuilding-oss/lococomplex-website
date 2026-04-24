"use client";

import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
const AW_ID = process.env.NEXT_PUBLIC_AW_ID || "";

export function Analytics() {
  const ids = [GA_ID, AW_ID].filter(Boolean);
  if (ids.length === 0) return null;

  return (
    <>
      {ids.map((id) => (
        <Script
          key={id}
          src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
          strategy="afterInteractive"
        />
      ))}
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${ids.map((id) => `gtag('config', '${id}');`).join("\n")}
        `}
      </Script>
    </>
  );
}
