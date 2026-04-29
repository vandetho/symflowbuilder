import { prisma, type Workflow } from "@symflowbuilder/db";
import { auth } from "@/auth";
import type { AccessLevel } from "@/types/collaboration";

export type { AccessLevel };

/**
 * Returns `{ userId }` for an authenticated request, or a 401 Response that
 * the route handler should return as-is.
 *
 * Usage:
 *   const result = await requireUserId();
 *   if (result instanceof Response) return result;
 *   const { userId } = result;
 */
export async function requireUserId(): Promise<{ userId: string } | Response> {
    const session = await auth();
    if (!session?.user?.id) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return { userId: session.user.id };
}

interface WorkflowAccess {
    access: AccessLevel;
    workflow: Workflow | null;
}

export async function getWorkflowAccess(
    workflowId: string,
    userId: string | undefined
): Promise<WorkflowAccess> {
    const workflow = await prisma.workflow.findUnique({
        where: { id: workflowId },
        include: userId
            ? {
                  collaborators: {
                      where: { userId },
                      take: 1,
                  },
              }
            : undefined,
    });

    if (!workflow) return { access: "none", workflow: null };
    if (userId && workflow.userId === userId) return { access: "owner", workflow };

    const collaborators = "collaborators" in workflow ? workflow.collaborators : [];
    if (userId && Array.isArray(collaborators) && collaborators.length > 0) {
        const role = collaborators[0].role;
        if (role === "editor" || role === "viewer") {
            return { access: role, workflow };
        }
    }

    if (workflow.isPublic) return { access: "viewer", workflow };

    return { access: "none", workflow: null };
}

export function canView(access: AccessLevel): boolean {
    return access !== "none";
}

export function canEdit(access: AccessLevel): boolean {
    return access === "owner" || access === "editor";
}

export function isOwner(access: AccessLevel): boolean {
    return access === "owner";
}
