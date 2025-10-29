import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    '192.168.1.2',
    '192.168.1.2:3000',
  ],
  webpack: (config) => {
    // Exclude React Native folder from build
    config.module.rules.push({
      test: /\.tsx?$/,
      exclude: /osasnative-main/,
    });
    return config;
  },
};

export default nextConfig;
