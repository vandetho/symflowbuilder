import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://symflowbuilder.com";

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${siteUrl}/editor`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${siteUrl}/explore`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8,
        },
        {
            url: `${siteUrl}/features`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${siteUrl}/how-it-works`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${siteUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: `${siteUrl}/faq`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];

    let workflowPages: MetadataRoute.Sitemap = [];
    try {
        const publicWorkflows = await prisma.workflow.findMany({
            where: { isPublic: true, shareId: { not: null } },
            select: { shareId: true, updatedAt: true },
        });

        workflowPages = publicWorkflows.map((w) => ({
            url: `${siteUrl}/w/${w.shareId}`,
            lastModified: w.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.6,
        }));
    } catch {
        // DB unavailable at build time (CI) — skip dynamic entries
    }

    return [...staticPages, ...workflowPages];
}
