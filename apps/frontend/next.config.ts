import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";
const apiBase = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;

const nextConfig: NextConfig = {
    output: "standalone",
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    publicRuntimeConfig: {
        baseUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || "",
    },
    env: {
        NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    async rewrites() {
        return isProduction
            ? []
            : [
                  {
                      source: "/api/:path*",
                      destination: `${apiBase}/api/:path*`,
                  },
              ];
    },
};

export default nextConfig;
