import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/embed/:path*",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: "frame-ancestors *",
                    },
                ],
            },
        ];
    },
    async redirects() {
        return [
            {
                source: "/:path*",
                has: [{ type: "host", value: "www.symflowbuilder.com" }],
                destination: "https://symflowbuilder.com/:path*",
                permanent: true,
            },
            {
                source: "/news/import-from-url",
                destination: "/blog/import-workflows-from-url",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
