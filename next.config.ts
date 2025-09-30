import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    // PWA Configuration - simplified to avoid mobile access issues
    experimental: {
        esmExternals: false,
    },
    // Minimal headers for PWA - only essential ones
    async headers() {
        return [
            {
                source: "/sw.js",
                headers: [
                    {
                        key: "Service-Worker-Allowed",
                        value: "/",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
