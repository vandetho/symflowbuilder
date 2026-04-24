"use client";

import { useState } from "react";
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
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    Pencil,
    Settings2,
    Download,
    Copy,
    Check,
    Play,
    Square,
} from "lucide-react";

import { Logo } from "@/components/ui/logo";
import { StateNode } from "@/components/editor/nodes/StateNode";
import { TransitionNode } from "@/components/editor/nodes/TransitionNode";
import { SubWorkflowNode } from "@/components/editor/nodes/SubWorkflowNode";
import { ConnectorEdge } from "@/components/editor/edges/ConnectorEdge";
import { SimulatorPanel } from "@/components/editor/panels/SimulatorPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSimulatorStore } from "@/stores/simulator";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import type { WorkflowMeta } from "symflow";
import {
    migrateGraphData,
    exportGraphToYaml,
    exportGraphToMermaid,
} from "symflow/react-flow";

const nodeTypes = {
    state: StateNode,
    transition: TransitionNode,
    subworkflow: SubWorkflowNode,
};

const edgeTypes = {
    connector: ConnectorEdge,
};

interface Props {
    name: string;
    type: string;
    symfonyVersion: string;
    graphJson: Record<string, unknown>;
    workflowId?: string;
}

export function SharedWorkflowView({
    name,
    type,
    symfonyVersion,
    graphJson,
    workflowId,
}: Props) {
    const router = useRouter();
    const [showConfig, setShowConfig] = useState(false);
    const [showExport, setShowExport] = useState(false);
    const [copied, setCopied] = useState(false);
    const [exportFormat, setExportFormat] = useState<"yaml" | "mermaid">("yaml");
    const simActive = useSimulatorStore((s) => s.active);
    const simInitialize = useSimulatorStore((s) => s.initialize);
    const simActivate = useSimulatorStore((s) => s.activate);
    const simDeactivate = useSimulatorStore((s) => s.deactivate);
    const rawNodes = (graphJson.nodes as Node[]) ?? [];
    const rawEdges = (graphJson.edges as Edge[]) ?? [];

    const { nodes, edges } = migrateGraphData({ nodes: rawNodes, edges: rawEdges });

    const stateCount = nodes.filter((n) => n.type === "state").length;
    const transitionCount = nodes.filter((n) => n.type === "transition").length;

    const meta = (graphJson.meta as WorkflowMeta) ?? {
        name,
        symfonyVersion,
        type,
        marking_store: "method",
        initial_marking: [],
        supports: "App\\Entity\\MyEntity",
        property: "currentState",
    };

    const exportOutput =
        exportFormat === "yaml"
            ? exportGraphToYaml({ nodes, edges, meta })
            : exportGraphToMermaid({ nodes, edges, meta });

    const exportExt = exportFormat === "yaml" ? "yaml" : "mmd";
    const exportMime = exportFormat === "yaml" ? "text/yaml" : "text/plain";
    const exportLabel = exportFormat === "yaml" ? "YAML" : "Mermaid";

    const handleCopyExport = async () => {
        await navigator.clipboard.writeText(exportOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadExport = () => {
        const blob = new Blob([exportOutput], { type: exportMime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${meta.name}.${exportExt}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleOpenInEditor = () => {
        localStorage.setItem("sfb_draft_new", JSON.stringify({ nodes, edges, meta }));
        router.push("/editor");
    };

    return (
        <div className="h-screen w-screen flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a14]/95 backdrop-blur-xl border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2">
                        <Logo size={24} />
                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                            SymFlowBuilder
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
                        {stateCount} states · {transitionCount} transitions
                    </span>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1.5"
                        onClick={() => setShowExport(!showExport)}
                    >
                        <Download className="w-3.5 h-3.5" />
                        Export
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className={`gap-1.5 ${simActive ? "text-[var(--success)] bg-[var(--success-dim)]" : ""}`}
                        onClick={() => {
                            if (simActive) {
                                simDeactivate();
                            } else {
                                simInitialize(nodes, edges, meta);
                                simActivate();
                            }
                        }}
                    >
                        {simActive ? (
                            <>
                                <Square className="w-3.5 h-3.5" /> Stop
                            </>
                        ) : (
                            <>
                                <Play className="w-3.5 h-3.5" /> Simulate
                            </>
                        )}
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1.5"
                        onClick={() => setShowConfig(true)}
                    >
                        <Settings2 className="w-3.5 h-3.5" />
                        Config
                    </Button>
                    {workflowId ? (
                        <Link href={`/editor/${workflowId}`}>
                            <Button size="sm" variant="default" className="gap-1.5">
                                <Pencil className="w-3 h-3" />
                                Edit
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            size="sm"
                            variant="ghost"
                            className="gap-1.5"
                            onClick={handleOpenInEditor}
                        >
                            Open in Editor
                            <ArrowRight className="w-3 h-3" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex-1 relative">
                {/* Export Drawer */}
                {showExport && (
                    <div className="absolute top-0 right-0 bottom-0 z-30 w-[420px] bg-[#0a0a14]/98 border-l border-[var(--glass-border)] flex flex-col">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--glass-border)]">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-[var(--text-primary)]">
                                    {exportLabel} Export
                                </span>
                                <div className="flex items-center gap-1">
                                    {(["yaml", "mermaid"] as const).map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setExportFormat(f)}
                                            className={`px-2 py-0.5 rounded-md text-[10px] transition-colors ${
                                                exportFormat === f
                                                    ? "bg-[var(--accent-dim)] text-[var(--accent-bright)]"
                                                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                                            }`}
                                        >
                                            {f === "yaml" ? "YAML" : "Mermaid"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={handleCopyExport}
                                >
                                    {copied ? (
                                        <Check className="w-3.5 h-3.5 text-[var(--success)]" />
                                    ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={handleDownloadExport}
                                >
                                    <Download className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                        <pre className="flex-1 overflow-auto p-4 text-[11px] font-mono text-[var(--text-secondary)] leading-relaxed whitespace-pre">
                            {exportOutput}
                        </pre>
                    </div>
                )}

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
                    <SimulatorPanel />
                </ReactFlowProvider>
            </div>

            {/* Config Dialog */}
            <Dialog open={showConfig} onOpenChange={setShowConfig}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Workflow Configuration</DialogTitle>
                        <DialogDescription>
                            Read-only configuration for this shared workflow.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 pt-2">
                        <div className="flex flex-col gap-1">
                            <Label className="text-[10px] text-[var(--text-muted)]">
                                Name
                            </Label>
                            <span className="text-sm font-mono text-[var(--text-primary)]">
                                {meta.name}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className="text-[10px] text-[var(--text-muted)]">
                                Type
                            </Label>
                            <span className="text-sm font-mono text-[var(--text-primary)]">
                                {meta.type}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className="text-[10px] text-[var(--text-muted)]">
                                Symfony Version
                            </Label>
                            <span className="text-sm font-mono text-[var(--text-primary)]">
                                {meta.symfonyVersion}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className="text-[10px] text-[var(--text-muted)]">
                                Marking Store
                            </Label>
                            <span className="text-sm font-mono text-[var(--text-primary)]">
                                {meta.marking_store} ({meta.property})
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className="text-[10px] text-[var(--text-muted)]">
                                Supports
                            </Label>
                            <span className="text-sm font-mono text-[var(--text-primary)]">
                                {meta.supports}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className="text-[10px] text-[var(--text-muted)]">
                                Initial Marking
                            </Label>
                            <div className="flex flex-wrap gap-1">
                                {meta.initial_marking.length > 0 ? (
                                    meta.initial_marking.map((p) => (
                                        <Badge
                                            key={p}
                                            variant="outline"
                                            className="text-[10px] font-mono"
                                        >
                                            {p}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-xs text-[var(--text-muted)]">
                                        Derived from initial nodes
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 text-xs text-[var(--text-muted)]">
                            <span>
                                {stateCount} states · {transitionCount} transitions
                            </span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
