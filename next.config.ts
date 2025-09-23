// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ✅ Allow builds to pass even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  images: {
    domains: ["picsum.photos"], // allow external demo images
  },
};

export default nextConfig;