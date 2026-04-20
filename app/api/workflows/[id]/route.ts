import { auth } from "@/auth";
import { prisma } from "@symflowbuilder/db";
import { getWorkflowAccess, canView, canEdit, isOwner } from "@/lib/workflow-auth";
import type { NextRequest } from "next/server";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();

    try {
        const { access, workflow } = await getWorkflowAccess(id, session?.user?.id);

        if (!canView(access) || !workflow) {
            return Response.json({ error: "Not found" }, { status: 404 });
        }

        return Response.json({ ...workflow, accessLevel: access });
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
        const { access } = await getWorkflowAccess(id, session.user.id);

        if (!canEdit(access)) {
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

        return Response.json({ ...workflow, accessLevel: access });
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
        const { access } = await getWorkflowAccess(id, session.user.id);

        if (!isOwner(access)) {
            return Response.json({ error: "Not found" }, { status: 404 });
        }

        await prisma.workflow.delete({ where: { id } });
        return Response.json({ success: true });
    } catch {
        return Response.json({ error: "Failed to delete workflow" }, { status: 500 });
    }
}
