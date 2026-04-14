"use client";

import { useState, useCallback } from "react";
import { Download, Upload, FileDown, Copy, X, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEditorStore } from "@/stores/editor";
import type { SymfonyVersion } from "@/types/workflow";

const SYMFONY_VERSIONS: SymfonyVersion[] = ["5.4", "6.4", "7.4", "8.0"];

export function EditorToolbar() {
    const { workflowMeta, updateMeta, exportYaml, importYaml } = useEditorStore();
    const [showYaml, setShowYaml] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const [yamlOutput, setYamlOutput] = useState("");

    const handleExport = useCallback(() => {
        const output = exportYaml();
        setYamlOutput(output);
        setShowYaml(true);
    }, [exportYaml]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(yamlOutput);
        toast.success("YAML copied to clipboard");
    }, [yamlOutput]);

    const handleDownload = useCallback(() => {
        const blob = new Blob([yamlOutput], { type: "text/yaml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${workflowMeta.name}.yaml`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("YAML file downloaded");
    }, [yamlOutput, workflowMeta.name]);

    const handleImport = useCallback(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".yaml,.yml";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    importYaml(event.target?.result as string);
                    toast.success("Workflow imported successfully");
                } catch (err) {
                    toast.error(
                        `Import failed: ${err instanceof Error ? err.message : "Invalid YAML"}`
                    );
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }, [importYaml]);

    return (
        <>
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center gap-3 px-4 py-3">
                <div className="glass rounded-[14px] flex items-center gap-3 px-4 py-2 flex-1">
                    <Input
                        value={workflowMeta.name}
                        onChange={(e) => updateMeta({ name: e.target.value })}
                        className="max-w-[200px] h-7 text-sm bg-transparent border-none focus-visible:border-none"
                        placeholder="workflow_name"
                    />

                    <div className="h-4 w-px bg-[var(--glass-border)]" />

                    <select
                        value={workflowMeta.type}
                        onChange={(e) =>
                            updateMeta({
                                type: e.target.value as "workflow" | "state_machine",
                            })
                        }
                        className="h-7 px-2 rounded-[8px] text-xs font-mono bg-[var(--glass-base)] border border-[var(--glass-border)] text-[var(--text-secondary)] cursor-pointer"
                    >
                        <option value="workflow">workflow</option>
                        <option value="state_machine">state_machine</option>
                    </select>

                    <select
                        value={workflowMeta.symfonyVersion}
                        onChange={(e) =>
                            updateMeta({
                                symfonyVersion: e.target.value as SymfonyVersion,
                            })
                        }
                        className="h-7 px-2 rounded-[8px] text-xs font-mono bg-[var(--glass-base)] border border-[var(--glass-border)] text-[var(--text-secondary)] cursor-pointer"
                    >
                        {SYMFONY_VERSIONS.map((v) => (
                            <option key={v} value={v}>
                                Symfony {v}
                            </option>
                        ))}
                    </select>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfig(!showConfig)}
                        className="text-[10px] font-mono"
                    >
                        <Save className="w-3 h-3" />
                        Config
                    </Button>

                    <div className="flex-1" />

                    <Button variant="ghost" size="sm" onClick={handleImport}>
                        <Upload className="w-3.5 h-3.5" />
                        Import
                    </Button>

                    <Button variant="default" size="sm" onClick={handleExport}>
                        <Download className="w-3.5 h-3.5" />
                        Export YAML
                    </Button>
                </div>
            </div>

            {/* Workflow Config Panel */}
            {showConfig && (
                <div className="absolute top-16 left-4 z-20 w-[300px] glass-strong rounded-[14px] p-4 flex flex-col gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[var(--text-primary)]">
                            Workflow Config
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => setShowConfig(false)}
                        >
                            <X className="w-3 h-3" />
                        </Button>
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-1.5">
                        <Label>Supports (entity class)</Label>
                        <Input
                            value={workflowMeta.supports}
                            onChange={(e) => updateMeta({ supports: e.target.value })}
                            placeholder="App\Entity\Order"
                            className="text-xs"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label>Marking Store Property</Label>
                        <Input
                            value={workflowMeta.property}
                            onChange={(e) => updateMeta({ property: e.target.value })}
                            placeholder="currentState"
                            className="text-xs"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label>Marking Store Type</Label>
                        <select
                            value={workflowMeta.marking_store}
                            onChange={(e) =>
                                updateMeta({
                                    marking_store: e.target.value as
                                        | "method"
                                        | "property",
                                })
                            }
                            className="h-7 px-2 rounded-[8px] text-xs font-mono bg-[var(--glass-base)] border border-[var(--glass-border)] text-[var(--text-secondary)] cursor-pointer w-full"
                        >
                            <option value="method">method</option>
                            <option value="property">property</option>
                        </select>
                    </div>
                </div>
            )}

            {/* YAML Preview Drawer */}
            {showYaml && (
                <div className="absolute top-0 right-0 bottom-0 z-30 w-[480px] glass-strong rounded-l-[18px] flex flex-col shadow-[0_0_64px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--glass-border)]">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                            YAML Output
                        </span>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={handleCopy}>
                                <Copy className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={handleDownload}>
                                <FileDown className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowYaml(false)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto p-4">
                        <pre className="text-[12px] font-mono text-[var(--text-secondary)] whitespace-pre leading-relaxed">
                            {yamlOutput}
                        </pre>
                    </div>
                </div>
            )}
        </>
    );
}
