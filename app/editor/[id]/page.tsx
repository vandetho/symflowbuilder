"use client";

import { use, useEffect, useState } from "react";
import { EditorCanvas } from "@/components/editor/EditorCanvas";
import { useEditorStore } from "@/stores/editor";
import { useAutosave } from "@/hooks/use-autosave";
import type { WorkflowMeta } from "@/types/workflow";
import type { Node, Edge } from "@xyflow/react";

export default function EditWorkflowPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const { loadFromJson, setAccessLevel, accessLevel } = useEditorStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const canEdit = accessLevel === "owner" || accessLevel === "editor";
    useAutosave({ workflowId: id, enabled: !loading && !error && canEdit });

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/workflows/${id}`);
                if (!res.ok) {
                    setError("Workflow not found");
                    return;
                }
                const workflow = await res.json();
                const graphJson = workflow.graphJson as {
                    nodes: Node[];
                    edges: Edge[];
                    meta: WorkflowMeta;
                };
                setAccessLevel(workflow.accessLevel ?? "owner");
                loadFromJson({
                    nodes: graphJson.nodes ?? [],
                    edges: graphJson.edges ?? [],
                    meta: graphJson.meta ?? {
                        name: workflow.name,
                        symfonyVersion: workflow.symfonyVersion,
                        type: workflow.type,
                        marking_store: "method",
                        initial_marking: [],
                        supports: "App\\Entity\\MyEntity",
                        property: "currentState",
                    },
                });
            } catch {
                setError("Failed to load workflow");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id, loadFromJson, setAccessLevel]);

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <span className="text-sm text-[var(--text-muted)] font-mono animate-pulse">
                    Loading...
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <span className="text-sm text-[var(--danger)]">{error}</span>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen overflow-hidden">
            <EditorCanvas />
        </div>
    );
}
