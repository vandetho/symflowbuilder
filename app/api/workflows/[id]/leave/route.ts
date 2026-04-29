import { prisma } from "@symflowbuilder/db";
import type { NextRequest } from "next/server";
import { requireUserId } from "@/lib/workflow-auth";

export async function POST(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const auth = await requireUserId();
    if (auth instanceof Response) return auth;

    try {
        const collaborator = await prisma.workflowCollaborator.findUnique({
            where: {
                workflowId_userId: {
                    workflowId: id,
                    userId: auth.userId,
                },
            },
        });

        if (!collaborator) {
            return Response.json({ error: "Not found" }, { status: 404 });
        }

        await prisma.workflowCollaborator.delete({
            where: { id: collaborator.id },
        });

        return Response.json({ success: true });
    } catch {
        return Response.json({ error: "Failed to leave workflow" }, { status: 500 });
    }
}
