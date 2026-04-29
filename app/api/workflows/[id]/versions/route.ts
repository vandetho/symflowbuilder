import { prisma } from "@symflowbuilder/db";
import { getWorkflowAccess, canView, canEdit, requireUserId } from "@/lib/workflow-auth";
import { createVersionSchema } from "@/lib/schemas/workflow";
import type { NextRequest } from "next/server";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const auth = await requireUserId();
    if (auth instanceof Response) return auth;

    try {
        const { access } = await getWorkflowAccess(id, auth.userId);

        if (!canView(access)) {
            return Response.json({ error: "Not found" }, { status: 404 });
        }

        const versions = await prisma.workflowVersion.findMany({
            where: { workflowId: id },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                label: true,
                createdAt: true,
            },
        });

        return Response.json(versions);
    } catch {
        return Response.json({ error: "Failed to fetch versions" }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const auth = await requireUserId();
    if (auth instanceof Response) return auth;

    try {
        const { access, workflow } = await getWorkflowAccess(id, auth.userId);

        if (!canEdit(access) || !workflow) {
            return Response.json({ error: "Not found" }, { status: 404 });
        }

        const body = await request.json();
        const parsed = createVersionSchema.safeParse(body);
        if (!parsed.success) {
            return Response.json(
                { error: "Invalid request", details: parsed.error.flatten() },
                { status: 400 }
            );
        }
        const data = parsed.data;
        const version = await prisma.workflowVersion.create({
            data: {
                workflowId: id,
                graphJson: (data.graphJson ?? workflow.graphJson) as object,
                yamlSnapshot: data.yamlSnapshot ?? workflow.yamlCache ?? "",
                label: data.label,
            },
        });

        return Response.json(version, { status: 201 });
    } catch {
        return Response.json({ error: "Failed to create version" }, { status: 500 });
    }
}
