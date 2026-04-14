import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();

    try {
        const workflow = await prisma.workflow.findUnique({ where: { id } });
        if (!workflow) {
            return Response.json({ error: "Not found" }, { status: 404 });
        }

        // Allow if owner or if public
        if (workflow.userId !== session?.user?.id && !workflow.isPublic) {
            return Response.json({ error: "Not found" }, { status: 404 });
        }

        return Response.json(workflow);
    } catch {
        return Response.json({ error: "Failed to fetch workflow" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const existing = await prisma.workflow.findUnique({ where: { id } });
        if (!existing || existing.userId !== session.user.id) {
            return Response.json({ error: "Not found" }, { status: 404 });
        }

        const body = await request.json();
        const workflow = await prisma.workflow.update({
            where: { id },
            data: {
                name: body.name,
                description: body.description,
                symfonyVersion: body.symfonyVersion,
                type: body.type,
                graphJson: body.graphJson,
                yamlCache: body.yamlCache,
            },
        });

        return Response.json(workflow);
    } catch {
        return Response.json({ error: "Failed to update workflow" }, { status: 500 });
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const existing = await prisma.workflow.findUnique({ where: { id } });
        if (!existing || existing.userId !== session.user.id) {
            return Response.json({ error: "Not found" }, { status: 404 });
        }

        await prisma.workflow.delete({ where: { id } });
        return Response.json({ success: true });
    } catch {
        return Response.json({ error: "Failed to delete workflow" }, { status: 500 });
    }
}
