import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function POST(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const collaborator = await prisma.workflowCollaborator.findUnique({
            where: {
                workflowId_userId: {
                    workflowId: id,
                    userId: session.user.id,
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
