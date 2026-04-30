import { auth } from "@/auth";
import { prisma, Prisma } from "@symflowbuilder/db";
import {
    getWorkflowAccess,
    canView,
    canEdit,
    isOwner,
    requireUserId,
} from "@/lib/workflow-auth";
import { updateWorkflowSchema } from "@/lib/schemas/workflow";
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
    const auth = await requireUserId();
    if (auth instanceof Response) return auth;

    try {
        const { access } = await getWorkflowAccess(id, auth.userId);

        if (!canEdit(access)) {
            return Response.json({ error: "Not found" }, { status: 404 });
        }

        const body = await request.json();
        const parsed = updateWorkflowSchema.safeParse(body);
        if (!parsed.success) {
            return Response.json(
                { error: "Invalid request", details: parsed.error.flatten() },
                { status: 400 }
            );
        }
        const data = parsed.data;
        const workflow = await prisma.workflow.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                symfonyVersion: data.symfonyVersion,
                type: data.type,
                graphJson: data.graphJson as object | undefined,
                yamlCache: data.yamlCache,
                simulationConfig:
                    data.simulationConfig === undefined
                        ? undefined
                        : data.simulationConfig === null
                          ? Prisma.JsonNull
                          : (data.simulationConfig as Prisma.InputJsonValue),
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
    const auth = await requireUserId();
    if (auth instanceof Response) return auth;

    try {
        const { access } = await getWorkflowAccess(id, auth.userId);

        if (!isOwner(access)) {
            return Response.json({ error: "Not found" }, { status: 404 });
        }

        await prisma.workflow.delete({ where: { id } });
        return Response.json({ success: true });
    } catch {
        return Response.json({ error: "Failed to delete workflow" }, { status: 500 });
    }
}
