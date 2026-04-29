import { prisma } from "@symflowbuilder/db";
import type { NextRequest } from "next/server";
import { requireUserId } from "@/lib/workflow-auth";
import { createWorkflowSchema } from "@/lib/schemas/workflow";

export async function GET() {
    const auth = await requireUserId();
    if (auth instanceof Response) return auth;

    try {
        const workflows = await prisma.workflow.findMany({
            where: { userId: auth.userId },
            orderBy: { updatedAt: "desc" },
            select: {
                id: true,
                name: true,
                description: true,
                symfonyVersion: true,
                type: true,
                isPublic: true,
                shareId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return Response.json(workflows);
    } catch {
        return Response.json({ error: "Failed to fetch workflows" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const auth = await requireUserId();
    if (auth instanceof Response) return auth;

    try {
        const body = await request.json();
        const parsed = createWorkflowSchema.safeParse(body);
        if (!parsed.success) {
            return Response.json(
                { error: "Invalid request", details: parsed.error.flatten() },
                { status: 400 }
            );
        }
        const data = parsed.data;
        const workflow = await prisma.workflow.create({
            data: {
                userId: auth.userId,
                name: data.name ?? "Untitled Workflow",
                description: data.description ?? null,
                symfonyVersion: data.symfonyVersion ?? "8.0",
                type: data.type ?? "workflow",
                graphJson: (data.graphJson ?? { nodes: [], edges: [] }) as object,
                yamlCache: data.yamlCache,
            },
        });
        return Response.json(workflow, { status: 201 });
    } catch {
        return Response.json({ error: "Failed to create workflow" }, { status: 500 });
    }
}
