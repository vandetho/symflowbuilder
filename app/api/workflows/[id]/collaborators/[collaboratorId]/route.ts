import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getWorkflowAccess, isOwner } from "@/lib/workflow-auth";
import type { NextRequest } from "next/server";
import { z } from "zod";

const updateRoleSchema = z.object({
    role: z.enum(["viewer", "editor"]),
});

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; collaboratorId: string }> }
) {
    const { id, collaboratorId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { access } = await getWorkflowAccess(id, session.user.id);

        if (!isOwner(access)) {
            return Response.json({ error: "Not found" }, { status: 404 });
        }

        const body = await request.json();
        const parsed = updateRoleSchema.safeParse(body);
        if (!parsed.success) {
            return Response.json(
                { error: "Invalid request", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const collaborator = await prisma.workflowCollaborator.update({
            where: { id: collaboratorId, workflowId: id },
            data: { role: parsed.data.role },
            include: {
                user: {
                    select: { name: true, email: true, image: true },
                },
            },
        });

        return Response.json(collaborator);
    } catch {
        return Response.json({ error: "Failed to update collaborator" }, { status: 500 });
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string; collaboratorId: string }> }
) {
    const { id, collaboratorId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { access } = await getWorkflowAccess(id, session.user.id);

        if (!isOwner(access)) {
            return Response.json({ error: "Not found" }, { status: 404 });
        }

        await prisma.workflowCollaborator.delete({
            where: { id: collaboratorId, workflowId: id },
        });

        return Response.json({ success: true });
    } catch {
        return Response.json({ error: "Failed to remove collaborator" }, { status: 500 });
    }
}
