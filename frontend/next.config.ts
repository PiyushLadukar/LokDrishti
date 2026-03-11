import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google profile photos
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        {
          // Proxy to Flask — but NOT /api/auth/* (that stays with NextAuth)
          source: "/api/((?!auth).*)",
          destination: "http://127.0.0.1:5000/api/$1",
        },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;