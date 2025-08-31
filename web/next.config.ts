import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: [
      "*.replit.dev",
      "*.replit.co",
      "localhost:3000"
    ]
  }
};

export default nextConfig;
