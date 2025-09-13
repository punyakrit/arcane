import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  /* config options here */
  reactStrictMode: false,
  onDemandEntries: {
    // Keep pages alive longer in dev mode
    maxInactiveAge: 1000 * 60 * 60,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "bdmprjjhzokyioptfhkk.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      }
    ],
  }
};

export default nextConfig;
