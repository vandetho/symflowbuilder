"use client";

import { useCallback, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useEditorStore } from "@/stores/editor";
import type {
    StateNodeData,
    TransitionEdgeData,
    TransitionListener,
} from "@/types/workflow";

export function PropertiesPanel() {
    const {
        nodes,
        edges,
        selectedNodeId,
        selectedEdgeId,
        updateNodeData,
        updateEdgeData,
        setSelectedNode,
        setSelectedEdge,
    } = useEditorStore();

    const selectedNode = selectedNodeId
        ? nodes.find((n) => n.id === selectedNodeId)
        : null;
    const selectedEdge = selectedEdgeId
        ? edges.find((e) => e.id === selectedEdgeId)
        : null;

    if (!selectedNode && !selectedEdge) return null;

    if (selectedNode) {
        const data = selectedNode.data as unknown as StateNodeData;
        return (
            <div className="absolute top-16 right-4 bottom-4 z-20 w-[280px] glass-strong rounded-[18px] flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
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
                            <input
                                type="checkbox"
                                checked={data.isInitial}
                                onChange={(e) =>
                                    updateNodeData(selectedNode.id, {
                                        isInitial: e.target.checked,
                                    })
                                }
                                className="accent-[var(--accent)]"
                            />
                            <span className="text-xs text-[var(--text-secondary)]">
                                Initial place
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.isFinal}
                                onChange={(e) =>
                                    updateNodeData(selectedNode.id, {
                                        isFinal: e.target.checked,
                                    })
                                }
                                className="accent-[var(--accent)]"
                            />
                            <span className="text-xs text-[var(--text-secondary)]">
                                Final place
                            </span>
                        </label>
                    </div>

                    <Separator />

                    <MetadataEditor
                        metadata={data.metadata}
                        onChange={(metadata) =>
                            updateNodeData(selectedNode.id, { metadata })
                        }
                    />
                </div>
            </div>
        );
    }

    if (selectedEdge) {
        const data = selectedEdge.data as unknown as TransitionEdgeData;
        return (
            <div className="absolute top-16 right-4 bottom-4 z-20 w-[300px] glass-strong rounded-[18px] flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--glass-border)]">
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                        Transition
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setSelectedEdge(null)}
                    >
                        <X className="w-3.5 h-3.5" />
                    </Button>
                </div>

                <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
                    {/* Transition name */}
                    <div className="flex flex-col gap-1.5">
                        <Label>Name</Label>
                        <Input
                            value={data.label}
                            onChange={(e) =>
                                updateEdgeData(selectedEdge.id, {
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
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--text-muted)]">
                        <span className="px-1.5 py-0.5 rounded bg-[var(--glass-base)] border border-[var(--glass-border)]">
                            {nodes.find((n) => n.id === selectedEdge.source)
                                ? (
                                      nodes.find(
                                          (n) =>
                                              n.id === selectedEdge.source
                                      )?.data as unknown as StateNodeData
                                  ).label
                                : selectedEdge.source}
                        </span>
                        <span>-&gt;</span>
                        <span className="px-1.5 py-0.5 rounded bg-[var(--glass-base)] border border-[var(--glass-border)]">
                            {nodes.find((n) => n.id === selectedEdge.target)
                                ? (
                                      nodes.find(
                                          (n) =>
                                              n.id === selectedEdge.target
                                      )?.data as unknown as StateNodeData
                                  ).label
                                : selectedEdge.target}
                        </span>
                    </div>

                    <Separator />

                    {/* Guard expression */}
                    <div className="flex flex-col gap-1.5">
                        <Label>Guard Expression</Label>
                        <Input
                            value={data.guard ?? ""}
                            onChange={(e) =>
                                updateEdgeData(selectedEdge.id, {
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

                    {/* Listeners */}
                    <ListenerEditor
                        listeners={data.listeners ?? []}
                        onChange={(listeners) =>
                            updateEdgeData(selectedEdge.id, { listeners })
                        }
                    />

                    <Separator />

                    {/* Metadata */}
                    <MetadataEditor
                        metadata={data.metadata}
                        onChange={(metadata) =>
                            updateEdgeData(selectedEdge.id, { metadata })
                        }
                    />
                </div>
            </div>
        );
    }

    return null;
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
        onChange([
            ...listeners,
            { event: newEvent.trim(), service: newService.trim() },
        ]);
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
}: {
    metadata: Record<string, string>;
    onChange: (metadata: Record<string, string>) => void;
}) {
    const [newKey, setNewKey] = useState("");
    const [newValue, setNewValue] = useState("");

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
            {Object.entries(metadata).map(([key, value]) => (
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
