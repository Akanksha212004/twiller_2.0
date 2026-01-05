import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    domains: ["randomuser.me", "images.pexels.com"],
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL
  },
  eslint: {
    ignoreDuringBuilds: true
  },
};

export default nextConfig;
