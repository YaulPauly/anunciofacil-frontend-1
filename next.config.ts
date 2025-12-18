import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-de538402f54a4c759a3f6497622fb776.r2.dev",
      },
    ],
  },
};

export default nextConfig;
