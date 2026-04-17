"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useEditorStore } from "@/stores/editor";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseAutosaveOptions {
    workflowId?: string;
    enabled?: boolean;
    onLocalSave?: () => void;
}

export function useAutosave({
    workflowId,
    enabled = true,
    onLocalSave,
}: UseAutosaveOptions = {}) {
    const [status, setStatus] = useState<SaveStatus>("idle");
    const { nodes, edges, workflowMeta } = useEditorStore();
    const prevRef = useRef<string>("");

    const saveToCloud = useCallback(async () => {
        if (!workflowId) return;

        setStatus("saving");
        try {
            const res = await fetch(`/api/workflows/${workflowId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: workflowMeta.name,
                    symfonyVersion: workflowMeta.symfonyVersion,
                    type: workflowMeta.type,
                    graphJson: { nodes, edges, meta: workflowMeta },
                }),
            });

            if (!res.ok) throw new Error("Save failed");
            setStatus("saved");
            setTimeout(() => setStatus("idle"), 2000);
        } catch {
            setStatus("error");
        }
    }, [workflowId, nodes, edges, workflowMeta]);

    const debouncedSave = useDebouncedCallback(() => {
        if (workflowId) {
            saveToCloud();
        } else {
            onLocalSave?.();
            setStatus("saved");
            setTimeout(() => setStatus("idle"), 2000);
        }
    }, 2000);

    useEffect(() => {
        if (!enabled) return;

        const snapshot = JSON.stringify({ nodes, edges, workflowMeta });
        if (snapshot === prevRef.current) return;
        prevRef.current = snapshot;

        // Don't save empty state
        if (nodes.length === 0 && edges.length === 0) return;

        // Status update is intentional — shows saving indicator while debounced save runs
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStatus("saving");
        debouncedSave();
    }, [nodes, edges, workflowMeta, enabled, debouncedSave]);

    return { status, saveToCloud };
}
