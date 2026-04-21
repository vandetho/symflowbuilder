"use client";

import { useCallback, useState, useMemo, useEffect } from "react";
import { X, Plus, Trash2, Palette, Workflow, Link2, Unlink } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColorInput } from "@/components/ui/color-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectItem } from "@/components/ui/select";
import { useEditorStore } from "@/stores/editor";
import type { TransitionListener } from "@symflow/core";
import type { StateNodeData, TransitionNodeData } from "@symflow/core/react-flow";
import type { SubWorkflowNodeData } from "@/types/subworkflow";

const PLACE_STYLING_KEYS = ["bg_color", "description"];
const TRANSITION_STYLING_KEYS = ["label", "color", "arrow_color"];

export function PropertiesPanel() {
    const { nodes, edges, selectedNodeId, updateNodeData, setSelectedNode } =
        useEditorStore();

    const selectedNode = selectedNodeId
        ? nodes.find((n) => n.id === selectedNodeId)
        : null;

    if (!selectedNode) return null;

    if (selectedNode.type === "state") {
        const data = selectedNode.data as unknown as StateNodeData;
        return (
            <div className="absolute top-16 right-4 bottom-4 z-20 w-[280px] bg-[#12121f] border border-[var(--glass-border)] rounded-[18px] flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--glass-border)]">
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                        State (Place)
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setSelectedNode(null)}
                    >
                        <X className="w-3.5 h-3.5" />
                    </Button>
                </div>

                <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label>Name</Label>
                        <Input
                            value={data.label}
                            onChange={(e) =>
                                updateNodeData(selectedNode.id, {
                                    label: e.target.value,
                                })
                            }
                            placeholder="state_name"
                        />
                        <span className="text-[9px] text-[var(--text-muted)]">
                            Use snake_case (e.g. waiting_for_review)
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                                checked={data.isInitial}
                                onCheckedChange={(checked) =>
                                    updateNodeData(selectedNode.id, {
                                        isInitial: checked === true,
                                    })
                                }
                            />
                            <span className="text-xs text-[var(--text-secondary)]">
                                Initial place
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                                checked={data.isFinal}
                                onCheckedChange={(checked) =>
                                    updateNodeData(selectedNode.id, {
                                        isFinal: checked === true,
                                    })
                                }
                            />
                            <span className="text-xs text-[var(--text-secondary)]">
                                Final place
                            </span>
                        </label>
                    </div>

                    <Separator />

                    {/* Symfony styling metadata */}
                    <div className="flex flex-col gap-2">
                        <Label className="flex items-center gap-1.5">
                            <Palette className="w-3 h-3" />
                            Styling
                        </Label>
                        <span className="text-[9px] text-[var(--text-muted)]">
                            Symfony workflow dump styling
                        </span>
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-[10px]">Background Color</Label>
                            <ColorInput
                                value={data.metadata?.bg_color ?? ""}
                                onChange={(val) =>
                                    updateNodeData(selectedNode.id, {
                                        metadata: { ...data.metadata, bg_color: val },
                                    })
                                }
                                onClear={() => {
                                    const { bg_color: _, ...rest } = data.metadata;
                                    updateNodeData(selectedNode.id, { metadata: rest });
                                }}
                                placeholder="#AABBCC or DeepSkyBlue"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-[10px]">Description</Label>
                            <Input
                                value={data.metadata?.description ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val) {
                                        updateNodeData(selectedNode.id, {
                                            metadata: {
                                                ...data.metadata,
                                                description: val,
                                            },
                                        });
                                    } else {
                                        const { description: _, ...rest } = data.metadata;
                                        updateNodeData(selectedNode.id, {
                                            metadata: rest,
                                        });
                                    }
                                }}
                                placeholder="Human review"
                                className="h-7 text-xs"
                            />
                        </div>
                    </div>

                    <Separator />

                    <MetadataEditor
                        metadata={data.metadata}
                        onChange={(metadata) =>
                            updateNodeData(selectedNode.id, { metadata })
                        }
                        excludeKeys={PLACE_STYLING_KEYS}
                    />
                </div>
            </div>
        );
    }

    if (selectedNode?.type === "subworkflow") {
        const data = selectedNode.data as unknown as SubWorkflowNodeData;
        return (
            <SubWorkflowPanel
                nodeId={selectedNode.id}
                data={data}
                onClose={() => setSelectedNode(null)}
            />
        );
    }

    if (selectedNode?.type === "transition") {
        const data = selectedNode.data as unknown as TransitionNodeData;

        // Derive from/to from connected edges (deduplicated)
        const fromLabels = [
            ...new Set(
                edges
                    .filter((e) => e.target === selectedNode.id)
                    .map((e) => nodes.find((n) => n.id === e.source))
                    .filter(Boolean)
                    .map((n) => (n!.data as unknown as StateNodeData).label)
            ),
        ];
        const toLabels = [
            ...new Set(
                edges
                    .filter((e) => e.source === selectedNode.id)
                    .map((e) => nodes.find((n) => n.id === e.target))
                    .filter(Boolean)
                    .map((n) => (n!.data as unknown as StateNodeData).label)
            ),
        ];

        return (
            <div className="absolute top-16 right-4 bottom-4 z-20 w-[300px] bg-[#12121f] border border-[var(--glass-border)] rounded-[18px] flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--glass-border)]">
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                        Transition
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setSelectedNode(null)}
                    >
                        <X className="w-3.5 h-3.5" />
                    </Button>
                </div>

                <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label>Name</Label>
                        <Input
                            value={data.label}
                            onChange={(e) =>
                                updateNodeData(selectedNode.id, {
                                    label: e.target.value,
                                })
                            }
                            placeholder="transition_name"
                        />
                        <span className="text-[9px] text-[var(--text-muted)]">
                            Use snake_case (e.g. submit_for_review)
                        </span>
                    </div>

                    {/* From / To info */}
                    <div className="flex flex-col gap-1 text-[10px] font-mono text-[var(--text-muted)]">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[var(--text-disabled)] w-8">from</span>
                            <div className="flex flex-wrap gap-1">
                                {fromLabels.map((l) => (
                                    <span
                                        key={l}
                                        className="px-1.5 py-0.5 rounded bg-[var(--glass-base)] border border-[var(--glass-border)]"
                                    >
                                        {l}
                                    </span>
                                ))}
                                {fromLabels.length > 1 && (
                                    <Badge variant="outline" className="text-[8px] px-1">
                                        AND
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[var(--text-disabled)] w-8">to</span>
                            <div className="flex flex-wrap gap-1">
                                {toLabels.map((l) => (
                                    <span
                                        key={l}
                                        className="px-1.5 py-0.5 rounded bg-[var(--glass-base)] border border-[var(--glass-border)]"
                                    >
                                        {l}
                                    </span>
                                ))}
                                {toLabels.length > 1 && (
                                    <Badge variant="outline" className="text-[8px] px-1">
                                        FORK
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex flex-col gap-1.5">
                        <Label>Guard Expression</Label>
                        <Input
                            value={data.guard ?? ""}
                            onChange={(e) =>
                                updateNodeData(selectedNode.id, {
                                    guard: e.target.value || undefined,
                                })
                            }
                            placeholder='is_granted("ROLE_ADMIN")'
                        />
                        <span className="text-[9px] text-[var(--text-muted)]">
                            Symfony ExpressionLanguage syntax
                        </span>
                    </div>

                    <Separator />

                    <ListenerEditor
                        listeners={data.listeners ?? []}
                        onChange={(listeners) =>
                            updateNodeData(selectedNode.id, { listeners })
                        }
                    />

                    <Separator />

                    <div className="flex flex-col gap-2">
                        <Label className="flex items-center gap-1.5">
                            <Palette className="w-3 h-3" />
                            Styling
                        </Label>
                        <span className="text-[9px] text-[var(--text-muted)]">
                            Symfony workflow dump styling
                        </span>
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-[10px]">Display Label</Label>
                            <Input
                                value={data.metadata?.label ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val) {
                                        updateNodeData(selectedNode.id, {
                                            metadata: { ...data.metadata, label: val },
                                        });
                                    } else {
                                        const { label: _, ...rest } = data.metadata;
                                        updateNodeData(selectedNode.id, {
                                            metadata: rest,
                                        });
                                    }
                                }}
                                placeholder="Accept PR"
                                className="h-7 text-xs"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-[10px]">Color</Label>
                            <ColorInput
                                value={data.metadata?.color ?? ""}
                                onChange={(val) =>
                                    updateNodeData(selectedNode.id, {
                                        metadata: { ...data.metadata, color: val },
                                    })
                                }
                                onClear={() => {
                                    const { color: _, ...rest } = data.metadata;
                                    updateNodeData(selectedNode.id, { metadata: rest });
                                }}
                                placeholder="#AABBCC or Orange"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-[10px]">Arrow Color</Label>
                            <ColorInput
                                value={data.metadata?.arrow_color ?? ""}
                                onChange={(val) =>
                                    updateNodeData(selectedNode.id, {
                                        metadata: { ...data.metadata, arrow_color: val },
                                    })
                                }
                                onClear={() => {
                                    const { arrow_color: _, ...rest } = data.metadata;
                                    updateNodeData(selectedNode.id, { metadata: rest });
                                }}
                                placeholder="#AABBCC or Turquoise"
                            />
                        </div>
                    </div>

                    <Separator />

                    <MetadataEditor
                        metadata={data.metadata}
                        onChange={(metadata) =>
                            updateNodeData(selectedNode.id, { metadata })
                        }
                        excludeKeys={TRANSITION_STYLING_KEYS}
                    />
                </div>
            </div>
        );
    }

    return null;
}

interface WorkflowOption {
    id: string;
    name: string;
    type: string;
}

function SubWorkflowPanel({
    nodeId,
    data,
    onClose,
}: {
    nodeId: string;
    data: SubWorkflowNodeData;
    onClose: () => void;
}) {
    const { updateNodeData } = useEditorStore();
    const { data: session } = useSession();
    const [workflows, setWorkflows] = useState<WorkflowOption[] | null>(null);

    useEffect(() => {
        if (!session?.user) return;
        let cancelled = false;
        const controller = new AbortController();

        const load = async () => {
            try {
                const res = await fetch("/api/workflows", { signal: controller.signal });
                if (cancelled) return;
                const data: WorkflowOption[] = res.ok ? await res.json() : [];
                if (!cancelled) setWorkflows(data);
            } catch {
                if (!cancelled) setWorkflows([]);
            }
        };
        load();

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [session]);

    const loading = workflows === null;

    const handleLink = useCallback(
        (workflowId: string) => {
            const wf = workflows?.find((w) => w.id === workflowId);
            updateNodeData(nodeId, {
                workflowId: workflowId || null,
                workflowName: wf?.name ?? null,
            });
        },
        [nodeId, workflows, updateNodeData]
    );

    const handleUnlink = useCallback(() => {
        updateNodeData(nodeId, { workflowId: null, workflowName: null });
    }, [nodeId, updateNodeData]);

    return (
        <div className="absolute top-16 right-4 bottom-4 z-20 w-[280px] bg-[#12121f] border border-[var(--glass-border)] rounded-[18px] flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--glass-border)]">
                <span className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-1.5">
                    <Workflow className="w-3.5 h-3.5 text-[var(--warning)]" />
                    Sub-Workflow
                </span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                    <X className="w-3.5 h-3.5" />
                </Button>
            </div>

            <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label>Name</Label>
                    <Input
                        value={data.label}
                        onChange={(e) =>
                            updateNodeData(nodeId, { label: e.target.value })
                        }
                        placeholder="sub_workflow_name"
                    />
                    <span className="text-[9px] text-[var(--text-muted)]">
                        Label for this node in the parent workflow
                    </span>
                </div>

                <Separator />

                <div className="flex flex-col gap-1.5">
                    <Label className="flex items-center gap-1.5">
                        <Link2 className="w-3 h-3" />
                        Linked Workflow
                    </Label>
                    {session?.user ? (
                        <>
                            <Select
                                value={data.workflowId ?? ""}
                                onChange={(e) => handleLink(e.target.value)}
                                className="text-xs"
                            >
                                <SelectItem value="">
                                    {loading ? "Loading..." : "Select a workflow..."}
                                </SelectItem>
                                {(workflows ?? []).map((wf) => (
                                    <SelectItem key={wf.id} value={wf.id}>
                                        {wf.name} ({wf.type})
                                    </SelectItem>
                                ))}
                            </Select>
                            {data.workflowId && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1.5 text-xs self-start"
                                    onClick={handleUnlink}
                                >
                                    <Unlink className="w-3 h-3" />
                                    Unlink
                                </Button>
                            )}
                        </>
                    ) : (
                        <span className="text-[10px] text-[var(--text-muted)]">
                            Sign in to link saved workflows
                        </span>
                    )}
                </div>

                {data.workflowId && data.workflowName && (
                    <>
                        <Separator />
                        <div className="flex flex-col gap-1">
                            <Label className="text-[10px] text-[var(--text-muted)]">
                                Referenced Workflow
                            </Label>
                            <Badge
                                variant="outline"
                                className="text-[10px] font-mono self-start"
                            >
                                {data.workflowName}
                            </Badge>
                        </div>
                    </>
                )}

                <Separator />

                <MetadataEditor
                    metadata={data.metadata}
                    onChange={(metadata) => updateNodeData(nodeId, { metadata })}
                    excludeKeys={[]}
                />
            </div>
        </div>
    );
}

function ListenerEditor({
    listeners,
    onChange,
}: {
    listeners: TransitionListener[];
    onChange: (listeners: TransitionListener[]) => void;
}) {
    const [newEvent, setNewEvent] = useState("");
    const [newService, setNewService] = useState("");

    const addListener = useCallback(() => {
        if (!newEvent.trim() || !newService.trim()) return;
        onChange([...listeners, { event: newEvent.trim(), service: newService.trim() }]);
        setNewEvent("");
        setNewService("");
    }, [listeners, newEvent, newService, onChange]);

    const removeListener = useCallback(
        (index: number) => {
            onChange(listeners.filter((_, i) => i !== index));
        },
        [listeners, onChange]
    );

    return (
        <div className="flex flex-col gap-2">
            <Label>
                Listeners{" "}
                {listeners.length > 0 && (
                    <Badge variant="default" className="ml-1">
                        {listeners.length}
                    </Badge>
                )}
            </Label>

            {listeners.map((listener, i) => (
                <div
                    key={i}
                    className="flex items-start gap-1.5 p-2 rounded-[8px] bg-[var(--glass-base)] border border-[var(--glass-border)]"
                >
                    <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                        <span className="text-[10px] text-[var(--accent-bright)] font-mono truncate">
                            {listener.event}
                        </span>
                        <span className="text-[9px] text-[var(--text-muted)] font-mono truncate">
                            {listener.service}
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 shrink-0"
                        onClick={() => removeListener(i)}
                    >
                        <Trash2 className="w-3 h-3" />
                    </Button>
                </div>
            ))}

            <div className="flex flex-col gap-1.5">
                <Input
                    value={newEvent}
                    onChange={(e) => setNewEvent(e.target.value)}
                    placeholder="workflow.transition.completed"
                    className="h-7 text-[10px]"
                />
                <div className="flex items-center gap-1.5">
                    <Input
                        value={newService}
                        onChange={(e) => setNewService(e.target.value)}
                        placeholder="App\EventListener\..."
                        className="flex-1 h-7 text-[10px]"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={addListener}
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

function MetadataEditor({
    metadata,
    onChange,
    excludeKeys = [],
}: {
    metadata: Record<string, string>;
    onChange: (metadata: Record<string, string>) => void;
    excludeKeys?: string[];
}) {
    const [newKey, setNewKey] = useState("");
    const [newValue, setNewValue] = useState("");

    const filteredEntries = useMemo(
        () => Object.entries(metadata).filter(([key]) => !excludeKeys.includes(key)),
        [metadata, excludeKeys]
    );

    const addEntry = useCallback(() => {
        if (!newKey.trim()) return;
        onChange({ ...metadata, [newKey.trim()]: newValue });
        setNewKey("");
        setNewValue("");
    }, [metadata, newKey, newValue, onChange]);

    const removeEntry = useCallback(
        (key: string) => {
            const next = { ...metadata };
            delete next[key];
            onChange(next);
        },
        [metadata, onChange]
    );

    return (
        <div className="flex flex-col gap-2">
            <Label>Metadata</Label>
            {filteredEntries.map(([key, value]) => (
                <div key={key} className="flex items-center gap-1.5">
                    <Badge variant="outline" className="flex-1 truncate">
                        {key}: {value}
                    </Badge>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 shrink-0"
                        onClick={() => removeEntry(key)}
                    >
                        <Trash2 className="w-3 h-3" />
                    </Button>
                </div>
            ))}
            <div className="flex items-center gap-1.5">
                <Input
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="key"
                    className="flex-1 h-7 text-xs"
                />
                <Input
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="value"
                    className="flex-1 h-7 text-xs"
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={addEntry}
                >
                    <Plus className="w-3.5 h-3.5" />
                </Button>
            </div>
        </div>
    );
}
