import { auth } from "@/auth";
import { prisma } from "@symflowbuilder/db";
import { getWorkflowAccess, isOwner } from "@/lib/workflow-auth";
import type { NextRequest } from "next/server";
import { z } from "zod";

const addCollaboratorSchema = z.object({
    email: z.string().email(),
    role: z.enum(["viewer", "editor"]),
});

export async function GET(
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

        const collaborators = await prisma.workflowCollaborator.findMany({
            where: { workflowId: id },
            include: {
                user: {
                    select: { name: true, email: true, image: true },
                },
            },
            orderBy: { createdAt: "asc" },
        });

        return Response.json(collaborators);
    } catch {
        return Response.json({ error: "Failed to fetch collaborators" }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
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

        const body = await request.json();
        const parsed = addCollaboratorSchema.safeParse(body);
        if (!parsed.success) {
            return Response.json(
                { error: "Invalid request", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { email, role } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return Response.json(
                { error: "User not found. They must have an account first." },
                { status: 404 }
            );
        }

        if (user.id === session.user.id) {
            return Response.json(
                { error: "You cannot add yourself as a collaborator" },
                { status: 400 }
            );
        }

        const collaborator = await prisma.workflowCollaborator.upsert({
            where: {
                workflowId_userId: { workflowId: id, userId: user.id },
            },
            update: { role },
            create: { workflowId: id, userId: user.id, role },
            include: {
                user: {
                    select: { name: true, email: true, image: true },
                },
            },
        });

        return Response.json(collaborator, { status: 201 });
    } catch {
        return Response.json({ error: "Failed to add collaborator" }, { status: 500 });
    }
}
