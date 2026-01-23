import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Cho phép external packages trong server components
  serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;
