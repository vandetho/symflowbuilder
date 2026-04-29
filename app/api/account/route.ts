import { prisma } from "@symflowbuilder/db";
import { requireUserId } from "@/lib/workflow-auth";

export async function DELETE() {
    const auth = await requireUserId();
    if (auth instanceof Response) return auth;

    try {
        // Delete user and all related data (cascades via Prisma schema)
        await prisma.user.delete({ where: { id: auth.userId } });
        return Response.json({ success: true });
    } catch {
        return Response.json({ error: "Failed to delete account" }, { status: 500 });
    }
}
