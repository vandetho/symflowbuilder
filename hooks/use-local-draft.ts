"use client";

import { useEffect, useCallback } from "react";
import { useEditorStore } from "@/stores/editor";
import type { GraphJson } from "@symflowbuilder/core";

const STORAGE_PREFIX = "sfb_draft_";

export function useLocalDraft(draftId?: string) {
    const { nodes, edges, workflowMeta, loadFromJson } = useEditorStore();
    const key = draftId ? `${STORAGE_PREFIX}${draftId}` : null;

    // Load draft on mount (only if draftId is provided)
    useEffect(() => {
        if (!key) return;
        try {
            const stored = localStorage.getItem(key);
            if (stored) {
                const parsed = JSON.parse(stored) as GraphJson;
                loadFromJson({
                    nodes: parsed.nodes,
                    edges: parsed.edges,
                    meta: parsed.meta,
                });
            }
        } catch {
            // Ignore invalid stored data
        }
    }, [key, loadFromJson]);

    // Save draft (debounced externally)
    const saveDraft = useCallback(() => {
        if (!key) return;
        try {
            const data: GraphJson = { nodes, edges, meta: workflowMeta };
            localStorage.setItem(key, JSON.stringify(data));
        } catch {
            // localStorage full or unavailable
        }
    }, [key, nodes, edges, workflowMeta]);

    const clearDraft = useCallback(() => {
        if (!key) return;
        try {
            localStorage.removeItem(key);
        } catch {
            // Ignore
        }
    }, [key]);

    return { saveDraft, clearDraft };
}

export function getAllDraftKeys(): string[] {
    const keys: string[] = [];
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(STORAGE_PREFIX)) {
                keys.push(key);
            }
        }
    } catch {
        // Ignore
    }
    return keys;
}

export function getDraft(key: string): GraphJson | null {
    try {
        const stored = localStorage.getItem(key);
        if (stored) return JSON.parse(stored) as GraphJson;
    } catch {
        // Ignore
    }
    return null;
}

export function clearAllDrafts() {
    getAllDraftKeys().forEach((key) => {
        try {
            localStorage.removeItem(key);
        } catch {
            // Ignore
        }
    });
}
