import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
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
