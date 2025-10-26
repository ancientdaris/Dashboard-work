import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    '192.168.1.2',
    '192.168.1.2:3000',
  ],
};

export default nextConfig;
