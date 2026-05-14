import type { NextConfig } from "next";

const csp = [
  "default-src 'self' https: data: blob:",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://www.google.com https://googleads.g.doubleclick.net https://*.g.doubleclick.net https://va.vercel-scripts.com https://vercel.live",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://www.google-analytics.com https://*.analytics.google.com https://*.google-analytics.com https://*.googletagmanager.com https://www.google.com https://googleads.g.doubleclick.net https://*.g.doubleclick.net https://stats.g.doubleclick.net https://vitals.vercel-insights.com https://va.vercel-scripts.com https://vercel.live",
  "frame-src 'self' https://www.googletagmanager.com https://td.doubleclick.net https://www.google.com https://bid.g.doubleclick.net https://www.google.com/maps/",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["@phosphor-icons/react", "framer-motion"],
  },
  async headers() {
    return [
      // Security headers for all routes
      { source: "/:path*", headers: securityHeaders },
      // Long-term cache for static image assets (immutable fingerprinted or versioned)
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Long-term cache for Next.js static chunks (hashed filenames)
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
