import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
    const session = await auth();
    if (!session?.user?.id) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Delete user and all related data (cascades via Prisma schema)
        await prisma.user.delete({
            where: { id: session.user.id },
        });

        return Response.json({ success: true });
    } catch {
        return Response.json({ error: "Failed to delete account" }, { status: 500 });
    }
}
