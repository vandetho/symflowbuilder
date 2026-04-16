import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://symflowbuilder.com";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/dashboard/", "/auth/"],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
