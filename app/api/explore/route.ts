import { prisma } from "@symflowbuilder/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") ?? "";
    const type = searchParams.get("type") ?? "";
    const version = searchParams.get("version") ?? "";
    const sort = searchParams.get("sort") ?? "recent";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = 12;

    try {
        const where = {
            isPublic: true,
            shareId: { not: null },
            ...(search && {
                OR: [
                    { name: { contains: search, mode: "insensitive" as const } },
                    {
                        description: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                ],
            }),
            ...(type && { type }),
            ...(version && { symfonyVersion: version }),
        };

        const [workflows, total] = await Promise.all([
            prisma.workflow.findMany({
                where,
                orderBy:
                    sort === "name"
                        ? { name: "asc" }
                        : sort === "oldest"
                          ? { createdAt: "asc" }
                          : { updatedAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    symfonyVersion: true,
                    type: true,
                    shareId: true,
                    graphJson: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                },
            }),
            prisma.workflow.count({ where }),
        ]);

        return Response.json({
            workflows,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch {
        return Response.json({ error: "Failed to fetch workflows" }, { status: 500 });
    }
}
