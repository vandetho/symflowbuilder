import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SharedWorkflowView } from "./SharedWorkflowView";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ shareId: string }>;
}): Promise<Metadata> {
    const { shareId } = await params;
    const workflow = await prisma.workflow.findUnique({
        where: { shareId },
        select: { name: true, type: true, symfonyVersion: true, isPublic: true },
    });

    if (!workflow || !workflow.isPublic) {
        return { title: "Workflow Not Found" };
    }

    const title = `${workflow.name} — SymFlowBuilder`;
    const description = `A ${workflow.type} workflow for Symfony ${workflow.symfonyVersion}. View and export as YAML.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

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
