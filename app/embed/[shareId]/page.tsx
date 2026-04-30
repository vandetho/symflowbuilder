import type { Metadata } from "next";
import { prisma } from "@symflowbuilder/db";
import { notFound } from "next/navigation";
import { EmbeddedWorkflowView } from "./EmbeddedWorkflowView";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ shareId: string }>;
}): Promise<Metadata> {
    const { shareId } = await params;
    const workflow = await prisma.workflow.findUnique({
        where: { shareId },
        select: { name: true, isPublic: true },
    });

    if (!workflow || !workflow.isPublic) {
        return { title: "Workflow Not Found" };
    }

    return {
        title: `${workflow.name} — Embedded`,
        robots: { index: false, follow: false },
    };
}

export default async function EmbedWorkflowPage({
    params,
    searchParams,
}: {
    params: Promise<{ shareId: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const { shareId } = await params;
    const query = await searchParams;

    const workflow = await prisma.workflow.findUnique({
        where: { shareId },
        select: {
            name: true,
            type: true,
            symfonyVersion: true,
            graphJson: true,
            simulationConfig: true,
            isPublic: true,
        },
    });

    if (!workflow || !workflow.isPublic) {
        notFound();
    }

    const showMiniMap = query.minimap !== "0";
    const showBranding = query.branding !== "0";
    const autoPlay = query.play === "1";

    return (
        <EmbeddedWorkflowView
            shareId={shareId}
            name={workflow.name}
            type={workflow.type}
            symfonyVersion={workflow.symfonyVersion}
            graphJson={workflow.graphJson as Record<string, unknown>}
            simulationConfig={
                (workflow.simulationConfig as Record<string, unknown> | null) ?? null
            }
            showMiniMap={showMiniMap}
            showBranding={showBranding}
            autoPlay={autoPlay}
        />
    );
}
