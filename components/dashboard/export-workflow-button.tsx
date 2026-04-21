"use client";

import { useState } from "react";
import { Download, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { WorkflowMeta } from "@symflow/core";
import { exportGraphToYaml } from "@symflow/core/react-flow";
import { exportGraphToMermaid } from "@symflow/core/react-flow";
import type { Node, Edge } from "@xyflow/react";

type DashboardExportFormat = "yaml" | "mermaid";

const FORMAT_CONFIG: Record<
    DashboardExportFormat,
    { label: string; ext: string; mime: string }
> = {
    yaml: { label: "YAML", ext: "yaml", mime: "text/yaml" },
    mermaid: { label: "Mermaid", ext: "mmd", mime: "text/plain" },
};

interface ExportWorkflowButtonProps {
    name: string;
    graphJson: Record<string, unknown>;
}

export function ExportWorkflowButton({ name, graphJson }: ExportWorkflowButtonProps) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [format, setFormat] = useState<DashboardExportFormat>("yaml");

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

    const output = open
        ? format === "yaml"
            ? exportGraphToYaml({ nodes, edges, meta })
            : exportGraphToMermaid({ nodes, edges, meta })
        : "";

    const cfg = FORMAT_CONFIG[format];

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        toast.success(`${cfg.label} copied`);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([output], { type: cfg.mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name}.${cfg.ext}`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`${cfg.label} downloaded`);
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
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-sm">
                                    {name}.{cfg.ext}
                                </span>
                                <div className="flex items-center gap-1">
                                    {(["yaml", "mermaid"] as DashboardExportFormat[]).map(
                                        (f) => (
                                            <button
                                                key={f}
                                                onClick={() => setFormat(f)}
                                                className={`px-2 py-0.5 rounded-md text-[10px] transition-colors ${
                                                    format === f
                                                        ? "bg-[var(--accent-dim)] text-[var(--accent-bright)]"
                                                        : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                                                }`}
                                            >
                                                {FORMAT_CONFIG[f].label}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
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
                            {output}
                        </pre>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
