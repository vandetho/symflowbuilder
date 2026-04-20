import { auth } from "@/auth";
import { prisma } from "@symflowbuilder/db";
import { getWorkflowAccess, isOwner } from "@/lib/workflow-auth";
import type { NextRequest } from "next/server";
import { randomBytes } from "crypto";

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
        const { access } = await getWorkflowAccess(id, session.user.id);

        if (!isOwner(access)) {
            return Response.json({ error: "Not found" }, { status: 404 });
        }

        const shareId = randomBytes(8).toString("hex");
        const workflow = await prisma.workflow.update({
            where: { id },
            data: { shareId, isPublic: true },
        });

        return Response.json({ shareId: workflow.shareId });
    } catch {
        return Response.json({ error: "Failed to share workflow" }, { status: 500 });
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

        await prisma.workflow.update({
            where: { id },
            data: { shareId: null, isPublic: false },
        });

        return Response.json({ success: true });
    } catch {
        return Response.json({ error: "Failed to unshare workflow" }, { status: 500 });
    }
}
