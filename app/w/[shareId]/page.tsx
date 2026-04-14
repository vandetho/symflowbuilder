import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SharedWorkflowView } from "./SharedWorkflowView";

export default async function SharedWorkflowPage({
    params,
}: {
    params: Promise<{ shareId: string }>;
}) {
    const { shareId } = await params;

    const workflow = await prisma.workflow.findUnique({
        where: { shareId },
    });

    if (!workflow || !workflow.isPublic) {
        notFound();
    }

    return (
        <SharedWorkflowView
            name={workflow.name}
            type={workflow.type}
            symfonyVersion={workflow.symfonyVersion}
            graphJson={workflow.graphJson as Record<string, unknown>}
        />
    );
}
