"use client";

import { useEffect } from "react";
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
import { Play, Square } from "lucide-react";

import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { StateNode } from "@/components/editor/nodes/StateNode";
import { TransitionNode } from "@/components/editor/nodes/TransitionNode";
import { SubWorkflowNode } from "@/components/editor/nodes/SubWorkflowNode";
import { ConnectorEdge } from "@/components/editor/edges/ConnectorEdge";
import { SimulatorPanel } from "@/components/editor/panels/SimulatorPanel";
import { useSimulatorStore } from "@/stores/simulator";
import { useExternalMarkingStore } from "@/stores/externalMarking";
import type { WorkflowMeta } from "symflow";
import type { SimulationConfig } from "@/types/simulation";
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
    type: string;
    symfonyVersion: string;
    graphJson: Record<string, unknown>;
    simulationConfig?: Record<string, unknown> | null;
    showMiniMap: boolean;
    showBranding: boolean;
    autoPlay: boolean;
    externalMarking: string[];
}

export function EmbeddedWorkflowView({
    shareId,
    name,
    type,
    symfonyVersion,
    graphJson,
    simulationConfig,
    showMiniMap,
    showBranding,
    autoPlay,
    externalMarking,
}: Props) {
    const rawNodes = (graphJson.nodes as Node[]) ?? [];
    const rawEdges = (graphJson.edges as Edge[]) ?? [];
    const { nodes, edges } = migrateGraphData({ nodes: rawNodes, edges: rawEdges });

    const meta = (graphJson.meta as WorkflowMeta) ?? {
        name,
        symfonyVersion,
        type,
        marking_store: "method",
        initial_marking: [],
        supports: "App\\Entity\\MyEntity",
        property: "currentState",
    };

    const simActive = useSimulatorStore((s) => s.active);
    const simInitialize = useSimulatorStore((s) => s.initialize);
    const simActivate = useSimulatorStore((s) => s.activate);
    const simDeactivate = useSimulatorStore((s) => s.deactivate);
    const setExternalPlaces = useExternalMarkingStore((s) => s.setPlaces);
    const clearExternalPlaces = useExternalMarkingStore((s) => s.clear);

    useEffect(() => {
        if (autoPlay && !simActive) {
            simInitialize(
                nodes,
                edges,
                meta,
                (simulationConfig as SimulationConfig | null) ?? null
            );
            simActivate();
        }
        return () => {
            simDeactivate();
        };
        // Run once on mount; deactivate on unmount.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setExternalPlaces(externalMarking);
        return () => {
            clearExternalPlaces();
        };
    }, [externalMarking, setExternalPlaces, clearExternalPlaces]);

    const handleToggle = () => {
        if (simActive) {
            simDeactivate();
        } else {
            simInitialize(
                nodes,
                edges,
                meta,
                (simulationConfig as SimulationConfig | null) ?? null
            );
            simActivate();
        }
    };

    return (
        <div className="h-screen w-screen relative bg-[#1a1a2e]">
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
                    fitViewOptions={{ padding: 0.15, minZoom: 0.7, maxZoom: 1.2 }}
                    minZoom={0.4}
                    maxZoom={2}
                    proOptions={{ hideAttribution: true }}
                >
                    <Background
                        variant={BackgroundVariant.Dots}
                        gap={20}
                        size={1}
                        color="rgba(255,255,255,0.18)"
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

            <div className="absolute top-3 left-3 z-30">
                <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-1.5 backdrop-blur-xl border ${
                        simActive
                            ? "text-[var(--success)] bg-[var(--success-dim)] border-[var(--success)]"
                            : "bg-[var(--glass-base)] border-[var(--glass-border)]"
                    }`}
                    onClick={handleToggle}
                >
                    {simActive ? (
                        <Square className="w-3.5 h-3.5" />
                    ) : (
                        <Play className="w-3.5 h-3.5" />
                    )}
                    {simActive ? "Stop" : "Run scenario"}
                </Button>
            </div>

            <SimulatorPanel />

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
