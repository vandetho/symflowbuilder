import type { Node, Edge } from "@xyflow/react";
import type { TransitionNodeData, TransitionListener } from "../types/workflow";

interface GraphData {
    nodes: Node[];
    edges: Edge[];
}

/**
 * Migrates old edge-based workflow data (where transitions are edges with
 * TransitionEdgeData) to the new node-based format (where transitions are
 * intermediate nodes between state nodes).
 *
 * Idempotent: returns data unchanged if already in the new format.
 */
export function migrateGraphData(data: GraphData): GraphData {
    // Detect old format: edges with type "transition" that have label data
    const oldEdges = data.edges.filter(
        (e) =>
            e.type === "transition" &&
            e.data &&
            "label" in (e.data as Record<string, unknown>)
    );

    // Already in new format (no old-style transition edges)
    if (oldEdges.length === 0) return data;

    const newNodes = [...data.nodes];
    const newEdges: Edge[] = [];

    // Keep any non-transition edges
    for (const edge of data.edges) {
        if (
            edge.type !== "transition" ||
            !edge.data ||
            !("label" in (edge.data as Record<string, unknown>))
        ) {
            newEdges.push(edge);
        }
    }

    // Group old transition edges by label
    const transitionGroups = new Map<
        string,
        { froms: Set<string>; tos: Set<string>; data: Record<string, unknown> }
    >();

    for (const edge of oldEdges) {
        const edgeData = edge.data as unknown as Record<string, unknown>;
        const label = edgeData.label as string;
        const existing = transitionGroups.get(label);
        if (existing) {
            existing.froms.add(edge.source);
            existing.tos.add(edge.target);
        } else {
            transitionGroups.set(label, {
                froms: new Set([edge.source]),
                tos: new Set([edge.target]),
                data: edgeData,
            });
        }
    }

    // Create transition nodes and connector edges
    for (const [label, group] of transitionGroups) {
        const transitionId = `transition-migrated-${label}`;
        const edgeData = group.data;

        // Position at midpoint of connected states
        const fromNodes = [...group.froms]
            .map((id) => data.nodes.find((n) => n.id === id))
            .filter(Boolean);
        const toNodes = [...group.tos]
            .map((id) => data.nodes.find((n) => n.id === id))
            .filter(Boolean);
        const allConnected = [...fromNodes, ...toNodes];
        const midX =
            allConnected.length > 0
                ? allConnected.reduce((sum, n) => sum + n!.position.x, 0) /
                  allConnected.length
                : 0;
        const midY =
            allConnected.length > 0
                ? allConnected.reduce((sum, n) => sum + n!.position.y, 0) /
                  allConnected.length
                : 0;

        newNodes.push({
            id: transitionId,
            type: "transition",
            position: { x: midX, y: midY },
            data: {
                label,
                guard: edgeData.guard as string | undefined,
                listeners: (edgeData.listeners as TransitionListener[]) ?? [],
                metadata: (edgeData.metadata as Record<string, string>) ?? {},
            } satisfies TransitionNodeData,
        });

        for (const fromId of group.froms) {
            newEdges.push({
                id: `edge-migrated-${label}-from-${fromId}`,
                source: fromId,
                target: transitionId,
                type: "connector",
            });
        }

        for (const toId of group.tos) {
            newEdges.push({
                id: `edge-migrated-${label}-to-${toId}`,
                source: transitionId,
                target: toId,
                type: "connector",
            });
        }
    }

    return { nodes: newNodes, edges: newEdges };
}
