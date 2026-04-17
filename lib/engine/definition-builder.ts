import type { Node, Edge } from "@xyflow/react";
import type { StateNodeData, TransitionEdgeData, WorkflowMeta } from "@/types/workflow";
import type { WorkflowDefinition, Place, Transition } from "./types";

/**
 * Converts React Flow graph state into a pure WorkflowDefinition
 * for the engine to consume.
 */
export function buildDefinition(
    nodes: Node[],
    edges: Edge[],
    meta: WorkflowMeta
): WorkflowDefinition {
    const stateNodes = nodes.filter((n) => n.type === "state");

    // Build places
    const places: Place[] = stateNodes.map((n) => {
        const data = n.data as unknown as StateNodeData;
        return {
            name: data.label,
            metadata: Object.keys(data.metadata).length > 0 ? data.metadata : undefined,
        };
    });

    // Build transitions — group edges by label (same label = same Symfony transition)
    const transitionMap = new Map<
        string,
        {
            froms: Set<string>;
            tos: Set<string>;
            guard?: string;
            metadata?: Record<string, string>;
        }
    >();

    for (const edge of edges) {
        const data = edge.data as unknown as TransitionEdgeData | undefined;
        if (!data?.label) continue;

        const sourceNode = stateNodes.find((n) => n.id === edge.source);
        const targetNode = stateNodes.find((n) => n.id === edge.target);
        if (!sourceNode || !targetNode) continue;

        const sourceLabel = (sourceNode.data as unknown as StateNodeData).label;
        const targetLabel = (targetNode.data as unknown as StateNodeData).label;

        const existing = transitionMap.get(data.label);
        if (existing) {
            existing.froms.add(sourceLabel);
            existing.tos.add(targetLabel);
        } else {
            transitionMap.set(data.label, {
                froms: new Set([sourceLabel]),
                tos: new Set([targetLabel]),
                guard: data.guard || undefined,
                metadata:
                    Object.keys(data.metadata).length > 0 ? data.metadata : undefined,
            });
        }
    }

    const transitions: Transition[] = Array.from(transitionMap.entries()).map(
        ([name, { froms, tos, guard, metadata }]) => ({
            name,
            froms: Array.from(froms),
            tos: Array.from(tos),
            guard,
            metadata,
        })
    );

    // Build initial marking
    const initialMarking =
        meta.initial_marking.length > 0
            ? meta.initial_marking
            : stateNodes
                  .filter((n) => (n.data as unknown as StateNodeData).isInitial)
                  .map((n) => (n.data as unknown as StateNodeData).label);

    return {
        name: meta.name,
        type: meta.type,
        places,
        transitions,
        initialMarking,
    };
}
