"use client";

import { useEffect } from "react";
import { EditorCanvas } from "@/components/editor/EditorCanvas";
import { useAutosave } from "@/hooks/use-autosave";
import { useEditorStore } from "@/stores/editor";
import { useSession } from "next-auth/react";
import type { GraphJson } from "@symflow/core/react-flow";

export default function EditorPage() {
    const { data: session } = useSession();
    const { reset, loadFromJson } = useEditorStore();
    const nodes = useEditorStore((s) => s.nodes);

    // On mount: reset, then load from localStorage if a draft exists
    useEffect(() => {
        reset();
        try {
            const stored = localStorage.getItem("sfb_draft_new");
            if (stored) {
                const parsed = JSON.parse(stored) as GraphJson;
                loadFromJson({
                    nodes: parsed.nodes,
                    edges: parsed.edges,
                    meta: parsed.meta,
                });
            }
        } catch {
            // Ignore
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-save to localStorage for guests only
    const handleLocalSave =
        session === undefined || session
            ? undefined
            : () => {
                  try {
                      const { nodes, edges, workflowMeta } = useEditorStore.getState();
                      localStorage.setItem(
                          "sfb_draft_new",
                          JSON.stringify({
                              nodes,
                              edges,
                              meta: workflowMeta,
                          })
                      );
                  } catch {
                      // Ignore
                  }
              };

    useAutosave({
        onLocalSave: handleLocalSave,
        enabled: nodes.length > 0,
    });

    return (
        <div className="h-screen w-screen overflow-hidden">
            <EditorCanvas />
        </div>
    );
}
