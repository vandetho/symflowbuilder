import { prisma } from "@symflowbuilder/db";
import { getWorkflowAccess, isOwner, requireUserId } from "@/lib/workflow-auth";
import { updateCollaboratorRoleSchema } from "@/lib/schemas/collaborator";
import type { NextRequest } from "next/server";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; collaboratorId: string }> }
) {
    const { id, collaboratorId } = await params;
    const auth = await requireUserId();
    if (auth instanceof Response) return auth;

    try {
        const { access } = await getWorkflowAccess(id, auth.userId);

        if (!isOwner(access)) {
            return Response.json({ error: "Not found" }, { status: 404 });
        }

        const body = await request.json();
        const parsed = updateCollaboratorRoleSchema.safeParse(body);
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
    const auth = await requireUserId();
    if (auth instanceof Response) return auth;

    try {
        const { access } = await getWorkflowAccess(id, auth.userId);

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
