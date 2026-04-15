"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface WorkflowConfigProps {
    name: string;
    type: string;
    symfonyVersion: string;
    graphJson: Record<string, unknown>;
}

export function WorkflowConfigBadge({
    name,
    type,
    symfonyVersion,
    graphJson,
}: WorkflowConfigProps) {
    const [open, setOpen] = useState(false);

    const meta = (graphJson.meta as Record<string, unknown>) ?? {};
    const nodes = (graphJson.nodes as unknown[]) ?? [];
    const edges = (graphJson.edges as unknown[]) ?? [];

    const stateCount = nodes.filter(
        (n) =>
            n &&
            typeof n === "object" &&
            "type" in (n as Record<string, unknown>) &&
            (n as Record<string, unknown>).type === "state"
    ).length;

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setOpen(true)}
            >
                <Settings2 className="w-3 h-3" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="font-mono text-sm">{name}</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-3 mt-2">
                        <div className="grid grid-cols-2 gap-3">
                            <ConfigRow label="Type" value={type} />
                            <ConfigRow label="Symfony" value={symfonyVersion} />
                            <ConfigRow label="States" value={String(stateCount)} />
                            <ConfigRow label="Transitions" value={String(edges.length)} />
                            <ConfigRow
                                label="Marking Store"
                                value={(meta.marking_store as string) ?? "method"}
                            />
                            <ConfigRow
                                label="Property"
                                value={(meta.property as string) ?? "currentState"}
                            />
                            <ConfigRow
                                label="Supports"
                                value={
                                    (meta.supports as string) ?? "App\\Entity\\MyEntity"
                                }
                            />
                        </div>

                        <Separator />

                        <div>
                            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2">
                                States
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {nodes
                                    .filter(
                                        (n) =>
                                            n &&
                                            typeof n === "object" &&
                                            (n as Record<string, unknown>).type ===
                                                "state"
                                    )
                                    .map((n, i) => {
                                        const data = (n as Record<string, unknown>)
                                            .data as Record<string, unknown> | null;
                                        const label =
                                            (data?.label as string) ?? "unnamed";
                                        const isInitial = data?.isInitial === true;
                                        const isFinal = data?.isFinal === true;
                                        return (
                                            <Badge
                                                key={i}
                                                variant={
                                                    isInitial
                                                        ? "default"
                                                        : isFinal
                                                          ? "success"
                                                          : "outline"
                                                }
                                                className="text-[9px]"
                                            >
                                                {label}
                                                {isInitial && " (initial)"}
                                                {isFinal && " (final)"}
                                            </Badge>
                                        );
                                    })}
                                {stateCount === 0 && (
                                    <span className="text-[10px] text-[var(--text-muted)]">
                                        No states
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

function ConfigRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                {label}
            </p>
            <p className="text-xs text-[var(--text-primary)] font-mono truncate">
                {value}
            </p>
        </div>
    );
}
