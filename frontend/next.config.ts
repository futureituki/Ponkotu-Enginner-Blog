import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/uploads/**',
      },
    ],
  },
  /* config options here */
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
     config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 200,
       };
     }
    return config;
  },
};

export default nextConfig;
