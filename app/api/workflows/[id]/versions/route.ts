import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const workflow = await prisma.workflow.findUnique({ where: { id } });
        if (!workflow || workflow.userId !== session.user.id) {
            return Response.json({ error: "Not found" }, { status: 404 });
        }

        const versions = await prisma.workflowVersion.findMany({
            where: { workflowId: id },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                label: true,
                createdAt: true,
            },
        });

        return Response.json(versions);
    } catch {
        return Response.json({ error: "Failed to fetch versions" }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const workflow = await prisma.workflow.findUnique({ where: { id } });
        if (!workflow || workflow.userId !== session.user.id) {
            return Response.json({ error: "Not found" }, { status: 404 });
        }

        const body = await request.json();
        const version = await prisma.workflowVersion.create({
            data: {
                workflowId: id,
                graphJson: body.graphJson ?? workflow.graphJson,
                yamlSnapshot: body.yamlSnapshot ?? workflow.yamlCache ?? "",
                label: body.label,
            },
        });

        return Response.json(version, { status: 201 });
    } catch {
        return Response.json({ error: "Failed to create version" }, { status: 500 });
    }
}
