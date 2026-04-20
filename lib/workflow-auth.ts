import { prisma, type Workflow } from "@symflowbuilder/db";

export type AccessLevel = "none" | "viewer" | "editor" | "owner";

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
