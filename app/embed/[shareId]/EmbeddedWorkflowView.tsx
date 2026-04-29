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

import { Logo } from "@/components/ui/logo";
import { StateNode } from "@/components/editor/nodes/StateNode";
import { TransitionNode } from "@/components/editor/nodes/TransitionNode";
import { SubWorkflowNode } from "@/components/editor/nodes/SubWorkflowNode";
import { ConnectorEdge } from "@/components/editor/edges/ConnectorEdge";
import { migrateGraphData } from "symflow/react-flow";

const nodeTypes = {
    state: StateNode,
    transition: TransitionNode,
    subworkflow: SubWorkflowNode,
};

const edgeTypes = {
    connector: ConnectorEdge,
};

interface Props {
    shareId: string;
    name: string;
    graphJson: Record<string, unknown>;
    showMiniMap: boolean;
    showBranding: boolean;
}

export function EmbeddedWorkflowView({
    shareId,
    name,
    graphJson,
    showMiniMap,
    showBranding,
}: Props) {
    const rawNodes = (graphJson.nodes as Node[]) ?? [];
    const rawEdges = (graphJson.edges as Edge[]) ?? [];
    const { nodes, edges } = migrateGraphData({ nodes: rawNodes, edges: rawEdges });

    return (
        <div className="h-screen w-screen relative bg-[#0a0a14]">
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
                    {showMiniMap && (
                        <MiniMap
                            className="!bg-[var(--glass-base)] !border !border-[var(--glass-border)] !rounded-[14px]"
                            nodeColor="var(--glass-overlay)"
                            maskColor="rgba(0,0,0,0.5)"
                        />
                    )}
                </ReactFlow>
            </ReactFlowProvider>

            {showBranding && (
                <a
                    href={`/w/${shareId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open ${name} on SymFlowBuilder`}
                    className="absolute bottom-3 left-3 z-30 flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] bg-[var(--glass-base)] border border-[var(--glass-border)] backdrop-blur-xl text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                    <Logo size={12} />
                    <span className="font-medium">SymFlowBuilder</span>
                </a>
            )}
        </div>
    );
}
