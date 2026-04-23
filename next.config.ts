import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [390, 640, 828, 1080, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
