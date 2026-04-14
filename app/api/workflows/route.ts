import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const workflows = await prisma.workflow.findMany({
            where: { userId: session.user.id },
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
    const session = await auth();
    if (!session?.user?.id) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const workflow = await prisma.workflow.create({
            data: {
                userId: session.user.id,
                name: body.name ?? "Untitled Workflow",
                description: body.description,
                symfonyVersion: body.symfonyVersion ?? "6.4",
                type: body.type ?? "workflow",
                graphJson: body.graphJson ?? { nodes: [], edges: [] },
                yamlCache: body.yamlCache,
            },
        });
        return Response.json(workflow, { status: 201 });
    } catch {
        return Response.json({ error: "Failed to create workflow" }, { status: 500 });
    }
}
