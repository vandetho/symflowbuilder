"use client";

import {
    ReactFlow,
    Background,
    BackgroundVariant,
    MiniMap,
    ReactFlowProvider,
    type Node,
    type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Logo } from "@/components/ui/logo";
import { StateNode } from "@/components/editor/nodes/StateNode";
import { TransitionEdge } from "@/components/editor/edges/TransitionEdge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const nodeTypes = {
    state: StateNode,
};

const edgeTypes = {
    transition: TransitionEdge,
};

interface Props {
    name: string;
    type: string;
    symfonyVersion: string;
    graphJson: Record<string, unknown>;
}

export function SharedWorkflowView({ name, type, symfonyVersion, graphJson }: Props) {
    const nodes = (graphJson.nodes as Node[]) ?? [];
    const edges = (graphJson.edges as Edge[]) ?? [];

    return (
        <div className="h-screen w-screen flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 glass border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2">
                        <Logo size={24} />
                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                            SFB
                        </span>
                    </Link>
                    <div className="w-px h-4 bg-[var(--glass-border)]" />
                    <span className="text-sm font-mono text-[var(--text-primary)]">
                        {name}
                    </span>
                    <Badge variant="outline">{type}</Badge>
                    <Badge variant="outline">Symfony {symfonyVersion}</Badge>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--text-muted)]">
                        {nodes.length} states
                    </span>
                    <Link href="/editor">
                        <Button size="sm" variant="ghost" className="gap-1.5">
                            Open in Editor
                            <ArrowRight className="w-3 h-3" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1">
                <ReactFlowProvider>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        nodesDraggable={false}
                        nodesConnectable={false}
                        elementsSelectable={false}
                        panOnDrag={true}
                        zoomOnScroll={true}
                        fitView
                        proOptions={{ hideAttribution: true }}
                    >
                        <Background
                            variant={BackgroundVariant.Dots}
                            gap={20}
                            size={1}
                            color="rgba(255,255,255,0.07)"
                        />
                        <MiniMap
                            className="!bg-[var(--glass-base)] !border !border-[var(--glass-border)] !rounded-[14px]"
                            nodeColor="var(--glass-overlay)"
                            maskColor="rgba(0,0,0,0.5)"
                        />
                    </ReactFlow>
                </ReactFlowProvider>
            </div>
        </div>
    );
}
