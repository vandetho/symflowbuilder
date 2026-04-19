import type { Node, Edge } from "@xyflow/react";
import type { StateNodeData, TransitionNodeData, WorkflowMeta } from "../types/workflow";
import type { WorkflowDefinition, Place, Transition } from "./types";

/**
 * Converts React Flow graph state into a pure WorkflowDefinition
 * for the engine to consume. Reads transition data from transition nodes.
 */
export function buildDefinition(
    nodes: Node[],
    edges: Edge[],
    meta: WorkflowMeta
): WorkflowDefinition {
    const stateNodes = nodes.filter((n) => n.type === "state");
    const transitionNodes = nodes.filter((n) => n.type === "transition");

    // Build places
    const places: Place[] = stateNodes.map((n) => {
        const data = n.data as unknown as StateNodeData;
        return {
            name: data.label,
            metadata: Object.keys(data.metadata).length > 0 ? data.metadata : undefined,
        };
    });

    // Build transitions from transition nodes
    const transitions: Transition[] = transitionNodes.map((tNode) => {
        const data = tNode.data as unknown as TransitionNodeData;

        const froms = edges
            .filter((e) => e.target === tNode.id)
            .map((e) => stateNodes.find((n) => n.id === e.source))
            .filter(Boolean)
            .map((n) => (n!.data as unknown as StateNodeData).label);

        const tos = edges
            .filter((e) => e.source === tNode.id)
            .map((e) => stateNodes.find((n) => n.id === e.target))
            .filter(Boolean)
            .map((n) => (n!.data as unknown as StateNodeData).label);

        return {
            name: data.label,
            froms,
            tos,
            guard: data.guard || undefined,
            metadata: Object.keys(data.metadata).length > 0 ? data.metadata : undefined,
        };
    });

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
