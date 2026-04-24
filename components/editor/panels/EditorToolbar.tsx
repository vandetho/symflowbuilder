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
    FileJson,
    FileCode,
    Link2,
    GitBranch,
    CircleDot,
    Gem,
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
import type { SymfonyVersion } from "symflow";

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

    if (!session?.user || !workflowId) return null;

    const handleShare = async () => {
        try {
            const res = await fetch(`/api/workflows/${workflowId}/share`, {
                method: "POST",
            });
            if (!res.ok) throw new Error("Failed");
            const data = await res.json();
            const url = `${window.location.origin}/w/${data.shareId}`;
            await navigator.clipboard.writeText(url);
            toast.success(
                "Share link copied — anyone with this link can view your workflow"
            );
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to generate share link");
        }
    };

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
            <TooltipContent side="bottom">
                Generate a public read-only link
            </TooltipContent>
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

type ExportFormat = "yaml" | "json" | "typescript" | "mermaid" | "dot" | "php";

const FORMAT_CONFIG: Record<ExportFormat, { label: string; ext: string; mime: string }> =
    {
        yaml: { label: "YAML", ext: "yaml", mime: "text/yaml" },
        json: { label: "JSON", ext: "json", mime: "application/json" },
        typescript: { label: "TypeScript", ext: "ts", mime: "text/typescript" },
        mermaid: { label: "Mermaid", ext: "mmd", mime: "text/plain" },
        dot: { label: "DOT", ext: "dot", mime: "text/plain" },
        php: { label: "PHP (Laravel)", ext: "php", mime: "text/x-php" },
    };

export function EditorToolbar() {
    const {
        workflowMeta,
        updateMeta,
        exportYaml,
        exportJson,
        exportTs,
        exportMermaid,
        exportDot,
        exportPhp,
        importYaml,
        importJson,
        importFromUrl,
        setSelectedNode,
        setSelectedEdge,
    } = useEditorStore();
    const [showExport, setShowExport] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const [exportOutput, setExportOutput] = useState("");
    const [exportFormat, setExportFormat] = useState<ExportFormat>("yaml");
    const [openDropdown, setOpenDropdown] = useState<"import" | "export" | null>(null);

    // Close dropdown on click outside
    useEffect(() => {
        if (!openDropdown) return;
        const handleClick = () => setOpenDropdown(null);
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [openDropdown]);

    const doExport = useCallback(
        (format: ExportFormat) => {
            const exporters: Record<ExportFormat, () => string> = {
                yaml: exportYaml,
                json: exportJson,
                typescript: exportTs,
                mermaid: exportMermaid,
                dot: exportDot,
                php: exportPhp,
            };
            setExportOutput(exporters[format]());
            setExportFormat(format);
            setShowExport(true);
            setSelectedNode(null);
            setSelectedEdge(null);
        },
        [
            exportYaml,
            exportJson,
            exportTs,
            exportMermaid,
            exportDot,
            exportPhp,
            setSelectedNode,
            setSelectedEdge,
        ]
    );

    const handleExport = useCallback(() => doExport("yaml"), [doExport]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(exportOutput);
        toast.success(`${FORMAT_CONFIG[exportFormat].label} copied to clipboard`);
    }, [exportOutput, exportFormat]);

    const handleDownload = useCallback(() => {
        const cfg = FORMAT_CONFIG[exportFormat];
        const blob = new Blob([exportOutput], { type: cfg.mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${workflowMeta.name}.${cfg.ext}`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`${cfg.label} file downloaded`);
    }, [exportOutput, exportFormat, workflowMeta.name]);

    const [showImportUrl, setShowImportUrl] = useState(false);
    const [importUrlValue, setImportUrlValue] = useState("");
    const [importingUrl, setImportingUrl] = useState(false);

    const handleImportFile = useCallback(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".yaml,.yml,.json";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const text = event.target?.result as string;
                    if (file.name.endsWith(".json")) {
                        importJson(text);
                    } else {
                        importYaml(text);
                    }
                    toast.success("Workflow imported successfully");
                } catch (err) {
                    toast.error(
                        `Import failed: ${err instanceof Error ? err.message : "Invalid file"}`
                    );
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }, [importYaml, importJson]);

    const handleImportFromUrl = useCallback(async () => {
        if (!importUrlValue.trim()) return;
        setImportingUrl(true);
        try {
            await importFromUrl(importUrlValue.trim());
            toast.success("Workflow imported from URL");
            setShowImportUrl(false);
            setImportUrlValue("");
        } catch (err) {
            toast.error(
                `Import failed: ${err instanceof Error ? err.message : "Failed to fetch"}`
            );
        } finally {
            setImportingUrl(false);
        }
    }, [importUrlValue, importFromUrl]);

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

                    <div className="relative flex items-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleImportFile}
                            className="rounded-r-none border-r-0"
                        >
                            <Upload className="w-3.5 h-3.5" />
                            Import
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-l-none px-1.5 h-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(
                                    openDropdown === "import" ? null : "import"
                                );
                            }}
                        >
                            <svg
                                width="8"
                                height="5"
                                viewBox="0 0 8 5"
                                fill="currentColor"
                            >
                                <path d="M0 0l4 5 4-5z" />
                            </svg>
                        </Button>
                        {openDropdown === "import" && (
                            <div className="absolute top-full left-0 mt-1 glass-strong border border-[var(--glass-border)] rounded-[10px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] min-w-[180px] z-50">
                                <button
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--glass-hover)] hover:text-[var(--text-primary)] transition-colors"
                                    onClick={() => {
                                        setOpenDropdown(null);
                                        handleImportFile();
                                    }}
                                >
                                    <Upload className="w-3.5 h-3.5" />
                                    From file (.yaml, .json)
                                </button>
                                <button
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--glass-hover)] hover:text-[var(--text-primary)] transition-colors"
                                    onClick={() => {
                                        setOpenDropdown(null);
                                        setShowImportUrl(true);
                                    }}
                                >
                                    <Link2 className="w-3.5 h-3.5" />
                                    From URL
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="relative flex items-center">
                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleExport}
                            className="rounded-r-none border-r-0"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Export
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            className="rounded-l-none border-l border-white/20 px-1.5 h-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(
                                    openDropdown === "export" ? null : "export"
                                );
                            }}
                        >
                            <svg
                                width="8"
                                height="5"
                                viewBox="0 0 8 5"
                                fill="currentColor"
                            >
                                <path d="M0 0l4 5 4-5z" />
                            </svg>
                        </Button>
                        {openDropdown === "export" && (
                            <div className="absolute top-full left-0 mt-1 glass-strong border border-[var(--glass-border)] rounded-[10px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] min-w-[140px] z-50">
                                <button
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--glass-hover)] hover:text-[var(--text-primary)] transition-colors"
                                    onClick={() => {
                                        setOpenDropdown(null);
                                        doExport("yaml");
                                    }}
                                >
                                    <FileDown className="w-3.5 h-3.5" />
                                    YAML
                                </button>
                                <button
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--glass-hover)] hover:text-[var(--text-primary)] transition-colors"
                                    onClick={() => {
                                        setOpenDropdown(null);
                                        doExport("json");
                                    }}
                                >
                                    <FileJson className="w-3.5 h-3.5" />
                                    JSON
                                </button>
                                <button
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--glass-hover)] hover:text-[var(--text-primary)] transition-colors"
                                    onClick={() => {
                                        setOpenDropdown(null);
                                        doExport("typescript");
                                    }}
                                >
                                    <FileCode className="w-3.5 h-3.5" />
                                    TypeScript
                                </button>
                                <button
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--glass-hover)] hover:text-[var(--text-primary)] transition-colors"
                                    onClick={() => {
                                        setOpenDropdown(null);
                                        doExport("mermaid");
                                    }}
                                >
                                    <GitBranch className="w-3.5 h-3.5" />
                                    Mermaid
                                </button>
                                <button
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--glass-hover)] hover:text-[var(--text-primary)] transition-colors"
                                    onClick={() => {
                                        setOpenDropdown(null);
                                        doExport("dot");
                                    }}
                                >
                                    <CircleDot className="w-3.5 h-3.5" />
                                    DOT (Graphviz)
                                </button>
                                <button
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--glass-hover)] hover:text-[var(--text-primary)] transition-colors"
                                    onClick={() => {
                                        setOpenDropdown(null);
                                        doExport("php");
                                    }}
                                >
                                    <Gem className="w-3.5 h-3.5" />
                                    PHP (Laravel)
                                </button>
                            </div>
                        )}
                    </div>

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

            {/* Import from URL Dialog */}
            <Dialog open={showImportUrl} onOpenChange={setShowImportUrl}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Import from URL</DialogTitle>
                        <DialogDescription>
                            Paste a URL to a YAML or JSON workflow config (e.g. GitHub raw
                            URL)
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-3 flex flex-col gap-3">
                        <Input
                            value={importUrlValue}
                            onChange={(e) => setImportUrlValue(e.target.value)}
                            placeholder="https://raw.githubusercontent.com/..."
                            className="text-xs"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleImportFromUrl();
                            }}
                        />
                        <Button
                            onClick={handleImportFromUrl}
                            disabled={importingUrl || !importUrlValue.trim()}
                            className="gap-2"
                        >
                            <Link2 className="w-3.5 h-3.5" />
                            {importingUrl ? "Importing..." : "Import"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Export Preview Drawer */}
            {showExport && (
                <div className="absolute top-0 right-0 bottom-0 z-30 w-[480px] bg-[#12121f] border-l border-[var(--glass-border)] rounded-l-[18px] flex flex-col shadow-[0_0_64px_rgba(0,0,0,0.5)]">
                    <div className="flex flex-col border-b border-[var(--glass-border)]">
                        <div className="flex items-center justify-between px-4 py-3">
                            <span className="text-sm font-medium text-[var(--text-primary)]">
                                {FORMAT_CONFIG[exportFormat].label} Output
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
                                    <TooltipContent side="bottom">
                                        Download .{FORMAT_CONFIG[exportFormat].ext}
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setShowExport(false)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">Close</TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 px-4 pb-2.5 flex-wrap">
                            {(
                                [
                                    "yaml",
                                    "json",
                                    "typescript",
                                    "mermaid",
                                    "dot",
                                    "php",
                                ] as ExportFormat[]
                            ).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => doExport(f)}
                                    className={`px-2.5 py-1 rounded-md text-[10px] transition-colors ${
                                        exportFormat === f
                                            ? "bg-[var(--accent-dim)] text-[var(--accent-bright)]"
                                            : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--glass-base)]"
                                    }`}
                                >
                                    {FORMAT_CONFIG[f].label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto p-4">
                        <pre className="text-[12px] font-mono text-[var(--text-secondary)] whitespace-pre leading-relaxed">
                            {exportOutput}
                        </pre>
                    </div>
                </div>
            )}
        </>
    );
}
