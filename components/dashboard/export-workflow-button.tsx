"use client";

import { useState } from "react";
import { Download, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { WorkflowMeta } from "@symflow/core";
import { exportGraphToYaml } from "@symflow/core/react-flow";
import type { Node, Edge } from "@xyflow/react";

interface ExportWorkflowButtonProps {
    name: string;
    graphJson: Record<string, unknown>;
}

export function ExportWorkflowButton({ name, graphJson }: ExportWorkflowButtonProps) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const nodes = (graphJson.nodes as Node[]) ?? [];
    const edges = (graphJson.edges as Edge[]) ?? [];
    const meta = (graphJson.meta as WorkflowMeta) ?? {
        name,
        symfonyVersion: "8.0",
        type: "workflow",
        marking_store: "method",
        initial_marking: [],
        supports: "App\\Entity\\MyEntity",
        property: "currentState",
    };

    const yamlOutput = open ? exportGraphToYaml({ nodes, edges, meta }) : "";

    const handleCopy = () => {
        navigator.clipboard.writeText(yamlOutput);
        setCopied(true);
        toast.success("YAML copied");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([yamlOutput], { type: "text/yaml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name}.yaml`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("YAML downloaded");
    };

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setOpen(true)}
            >
                <Download className="w-3 h-3" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span className="font-mono text-sm">{name}.yaml</span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopy}
                                    className="gap-1.5 text-xs"
                                >
                                    {copied ? (
                                        <Check className="w-3 h-3 text-[var(--success)]" />
                                    ) : (
                                        <Copy className="w-3 h-3" />
                                    )}
                                    {copied ? "Copied" : "Copy"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDownload}
                                    className="gap-1.5 text-xs"
                                >
                                    <Download className="w-3 h-3" />
                                    Download
                                </Button>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="mt-2 max-h-[400px] overflow-auto rounded-[10px] bg-[var(--glass-base)] border border-[var(--glass-border)] p-4">
                        <pre className="text-[11px] font-mono text-[var(--text-secondary)] whitespace-pre leading-relaxed">
                            {yamlOutput}
                        </pre>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
