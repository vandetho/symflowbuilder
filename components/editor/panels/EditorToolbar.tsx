"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
    Download,
    Upload,
    FileDown,
    Copy,
    X,
    Settings2,
    LogIn,
    Save,
    Share2,
    Check,
    Play,
    Square,
    Globe,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Logo } from "@/components/ui/logo";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useEditorStore } from "@/stores/editor";
import { useSimulatorStore } from "@/stores/simulator";
import { GitHubIcon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { version } from "@/package.json";
import type { SymfonyVersion } from "@/types/workflow";

const SYMFONY_VERSIONS: SymfonyVersion[] = ["5.4", "6.4", "7.4", "8.0"];

function SimulateButton() {
    const simActive = useSimulatorStore((s) => s.active);
    const initialize = useSimulatorStore((s) => s.initialize);
    const activate = useSimulatorStore((s) => s.activate);
    const deactivate = useSimulatorStore((s) => s.deactivate);
    const { nodes, edges, workflowMeta } = useEditorStore();

    const handleToggle = () => {
        if (simActive) {
            deactivate();
        } else {
            initialize(nodes, edges, workflowMeta);
            activate();
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            className={`gap-1.5 ${simActive ? "text-[var(--success)] bg-[var(--success-dim)]" : ""}`}
            onClick={handleToggle}
        >
            {simActive ? (
                <Square className="w-3.5 h-3.5" />
            ) : (
                <Play className="w-3.5 h-3.5" />
            )}
            {simActive ? "Stop" : "Simulate"}
        </Button>
    );
}

function SaveButton() {
    const { data: session } = useSession();
    const router = useRouter();
    const params = useParams();
    const workflowId = params?.id as string | undefined;
    const { nodes, edges, workflowMeta, exportYaml } = useEditorStore();
    const [saving, setSaving] = useState(false);
    const savingRef = useRef(false);

    const handleSave = useCallback(async () => {
        if (savingRef.current) return;
        savingRef.current = true;
        setSaving(true);

        if (!session?.user) {
            // Guest: save to localStorage
            try {
                const data = { nodes, edges, meta: workflowMeta };
                localStorage.setItem("sfb_draft_new", JSON.stringify(data));
                toast.success("Saved to browser");
            } catch {
                toast.error("Failed to save");
            }
            setSaving(false);
            savingRef.current = false;
            return;
        }

        const body = JSON.stringify({
            name: workflowMeta.name,
            symfonyVersion: workflowMeta.symfonyVersion,
            type: workflowMeta.type,
            graphJson: { nodes, edges, meta: workflowMeta },
            yamlCache: exportYaml(),
        });

        try {
            if (workflowId) {
                // Update existing workflow
                const res = await fetch(`/api/workflows/${workflowId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body,
                });
                if (!res.ok) throw new Error("Failed to save");
                toast.success("Workflow saved");
            } else {
                // Create new workflow
                const res = await fetch("/api/workflows", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body,
                });
                if (!res.ok) throw new Error("Failed to save");
                const workflow = await res.json();
                toast.success("Workflow saved");
                router.push(`/editor/${workflow.id}`);
            }
        } catch {
            toast.error("Failed to save workflow");
        } finally {
            setSaving(false);
            savingRef.current = false;
        }
    }, [session, nodes, edges, workflowMeta, exportYaml, router, workflowId]);

    // Listen for Cmd+S event from EditorControls
    useEffect(() => {
        const handler = () => handleSave();
        document.addEventListener("sfb:save", handler);
        return () => document.removeEventListener("sfb:save", handler);
    }, [handleSave]);

    return (
        <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={handleSave}
            disabled={saving}
        >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving..." : "Save"}
        </Button>
    );
}

function ShareButton() {
    const { data: session } = useSession();
    const params = useParams();
    const workflowId = params?.id as string | undefined;
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        let url: string;
        if (session?.user && workflowId) {
            try {
                const res = await fetch(`/api/workflows/${workflowId}/share`, {
                    method: "POST",
                });
                if (!res.ok) throw new Error("Failed");
                const data = await res.json();
                url = `${window.location.origin}/w/${data.shareId}`;
                await navigator.clipboard.writeText(url);
                toast.success(
                    "Share link copied — anyone with this link can view your workflow"
                );
            } catch {
                toast.error("Failed to generate share link");
                return;
            }
        } else {
            url = window.location.href;
            await navigator.clipboard.writeText(url);
            toast.success("Editor URL copied to clipboard");
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const tooltipText =
        session?.user && workflowId
            ? "Generate a public read-only link"
            : "Copy the editor URL to clipboard";

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5"
                    onClick={handleShare}
                    disabled={copied}
                >
                    {copied ? (
                        <Check className="w-3.5 h-3.5 text-[var(--success)]" />
                    ) : (
                        <Share2 className="w-3.5 h-3.5" />
                    )}
                    {copied ? "Copied!" : "Share"}
                </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{tooltipText}</TooltipContent>
        </Tooltip>
    );
}

function SignInButton() {
    const { data: session } = useSession();
    if (session?.user) {
        return (
            <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-1.5">
                    {session.user.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={session.user.image}
                            alt=""
                            className="w-4 h-4 rounded-full"
                        />
                    )}
                    <span className="text-xs">{session.user.name ?? "Dashboard"}</span>
                </Button>
            </Link>
        );
    }
    return (
        <Link href="/auth/signin">
            <Button variant="ghost" size="sm" className="gap-1.5">
                <LogIn className="w-3.5 h-3.5" />
                Sign in
            </Button>
        </Link>
    );
}

export function EditorToolbar() {
    const {
        workflowMeta,
        updateMeta,
        exportYaml,
        importYaml,
        setSelectedNode,
        setSelectedEdge,
    } = useEditorStore();
    const [showYaml, setShowYaml] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const [yamlOutput, setYamlOutput] = useState("");

    const handleExport = useCallback(() => {
        const output = exportYaml();
        setYamlOutput(output);
        setShowYaml(true);
        // Close properties panel to avoid overlap
        setSelectedNode(null);
        setSelectedEdge(null);
    }, [exportYaml, setSelectedNode, setSelectedEdge]);

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
                <div className="bg-[#12121f] border border-[var(--glass-border)] rounded-[14px] flex items-center gap-3 px-4 py-2 flex-1">
                    <Link href="/">
                        <Logo size={24} />
                    </Link>
                    <div className="h-4 w-px bg-[var(--glass-border)]" />
                    <Input
                        value={workflowMeta.name}
                        onChange={(e) => updateMeta({ name: e.target.value })}
                        className="max-w-[200px] h-7 text-sm bg-transparent border-none focus-visible:border-none"
                        placeholder="workflow_name"
                    />

                    <div className="h-4 w-px bg-[var(--glass-border)]" />

                    <Select
                        value={workflowMeta.type}
                        onChange={(e) =>
                            updateMeta({
                                type: e.target.value as "workflow" | "state_machine",
                            })
                        }
                        className="h-7 w-auto text-xs"
                    >
                        <SelectItem value="workflow">workflow</SelectItem>
                        <SelectItem value="state_machine">state_machine</SelectItem>
                    </Select>

                    <Select
                        value={workflowMeta.symfonyVersion}
                        onChange={(e) =>
                            updateMeta({
                                symfonyVersion: e.target.value as SymfonyVersion,
                            })
                        }
                        className="h-7 w-auto text-xs"
                    >
                        {SYMFONY_VERSIONS.map((v) => (
                            <SelectItem key={v} value={v}>
                                Symfony {v}
                            </SelectItem>
                        ))}
                    </Select>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfig(true)}
                        className="text-[10px] font-mono"
                    >
                        <Settings2 className="w-3 h-3" />
                        Config
                    </Button>

                    <div className="flex-1" />

                    <Link href="/explore">
                        <Button variant="ghost" size="sm" className="gap-1.5">
                            <Globe className="w-3.5 h-3.5" />
                            Explore
                        </Button>
                    </Link>

                    <Button variant="ghost" size="sm" onClick={handleImport}>
                        <Upload className="w-3.5 h-3.5" />
                        Import
                    </Button>

                    <Button variant="default" size="sm" onClick={handleExport}>
                        <Download className="w-3.5 h-3.5" />
                        Export YAML
                    </Button>

                    <SimulateButton />
                    <SaveButton />
                    <ShareButton />
                    <SignInButton />

                    <div className="h-4 w-px bg-[var(--glass-border)]" />

                    <a
                        href="https://github.com/vandetho/symflowbuilder"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Badge
                            variant="outline"
                            className="gap-1 text-[10px] cursor-pointer hover:border-[var(--glass-border-hover)]"
                        >
                            <GitHubIcon className="w-3 h-3" />v{version}
                        </Badge>
                    </a>
                </div>
            </div>

            {/* Workflow Config Dialog */}
            <Dialog open={showConfig} onOpenChange={setShowConfig}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Workflow Config</DialogTitle>
                        <DialogDescription>
                            Configure the Symfony workflow settings
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-3 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label>Type</Label>
                            <Select
                                value={workflowMeta.type}
                                onChange={(e) =>
                                    updateMeta({
                                        type: e.target.value as
                                            | "workflow"
                                            | "state_machine",
                                    })
                                }
                            >
                                <SelectItem value="workflow">workflow</SelectItem>
                                <SelectItem value="state_machine">
                                    state_machine
                                </SelectItem>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label>Symfony Version</Label>
                            <Select
                                value={workflowMeta.symfonyVersion}
                                onChange={(e) =>
                                    updateMeta({
                                        symfonyVersion: e.target.value as SymfonyVersion,
                                    })
                                }
                            >
                                {SYMFONY_VERSIONS.map((v) => (
                                    <SelectItem key={v} value={v}>
                                        Symfony {v}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
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
                            <Select
                                value={workflowMeta.marking_store}
                                onChange={(e) =>
                                    updateMeta({
                                        marking_store: e.target.value as
                                            | "method"
                                            | "property",
                                    })
                                }
                            >
                                <SelectItem value="method">method</SelectItem>
                                <SelectItem value="property">property</SelectItem>
                            </Select>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* YAML Preview Drawer */}
            {showYaml && (
                <div className="absolute top-0 right-0 bottom-0 z-30 w-[480px] bg-[#12121f] border-l border-[var(--glass-border)] rounded-l-[18px] flex flex-col shadow-[0_0_64px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--glass-border)]">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                            YAML Output
                        </span>
                        <div className="flex items-center gap-2">
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleCopy}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">Copy</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleDownload}
                                    >
                                        <FileDown className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">Download</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowYaml(false)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">Close</TooltipContent>
                            </Tooltip>
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
