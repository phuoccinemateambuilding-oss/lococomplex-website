"use client";

import { useEffect, useState } from "react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export function DeferredVercelInsights() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), 3000);
    return () => window.clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <>
      <VercelAnalytics />
      <SpeedInsights />
    </>
  );
}
