"use client";

import { useState, useCallback } from "react";
import { useEditorStore } from "@/stores/editor";
import { toast } from "sonner";

export function useWorkflow() {
    const { nodes, edges, workflowMeta, exportYaml } = useEditorStore();
    const [saving, setSaving] = useState(false);

    const createWorkflow = useCallback(async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/workflows", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: workflowMeta.name,
                    symfonyVersion: workflowMeta.symfonyVersion,
                    type: workflowMeta.type,
                    graphJson: { nodes, edges, meta: workflowMeta },
                    yamlCache: exportYaml(),
                }),
            });

            if (!res.ok) throw new Error("Failed to create workflow");
            const workflow = await res.json();
            toast.success("Workflow saved");
            return workflow.id as string;
        } catch (err) {
            toast.error("Failed to save workflow");
            return null;
        } finally {
            setSaving(false);
        }
    }, [nodes, edges, workflowMeta, exportYaml]);

    const shareWorkflow = useCallback(async (workflowId: string) => {
        try {
            const res = await fetch(`/api/workflows/${workflowId}/share`, {
                method: "POST",
            });
            if (!res.ok) throw new Error("Failed to share");
            const data = await res.json();
            const url = `${window.location.origin}/w/${data.shareId}`;
            await navigator.clipboard.writeText(url);
            toast.success("Share link copied to clipboard");
            return data.shareId as string;
        } catch {
            toast.error("Failed to share workflow");
            return null;
        }
    }, []);

    const deleteWorkflow = useCallback(async (workflowId: string) => {
        try {
            const res = await fetch(`/api/workflows/${workflowId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete");
            toast.success("Workflow deleted");
            return true;
        } catch {
            toast.error("Failed to delete workflow");
            return false;
        }
    }, []);

    const createVersion = useCallback(
        async (workflowId: string, label?: string) => {
            try {
                const res = await fetch(`/api/workflows/${workflowId}/versions`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        graphJson: { nodes, edges, meta: workflowMeta },
                        yamlSnapshot: exportYaml(),
                        label,
                    }),
                });
                if (!res.ok) throw new Error("Failed to create version");
                toast.success("Version snapshot created");
            } catch {
                toast.error("Failed to create version");
            }
        },
        [nodes, edges, workflowMeta, exportYaml]
    );

    return { createWorkflow, shareWorkflow, deleteWorkflow, createVersion, saving };
}
