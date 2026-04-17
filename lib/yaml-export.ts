import yaml from "js-yaml";
import type { Node, Edge } from "@xyflow/react";
import type { StateNodeData, TransitionNodeData, WorkflowMeta } from "@/types/workflow";

interface ExportOptions {
    nodes: Node[];
    edges: Edge[];
    meta: WorkflowMeta;
}

export function exportWorkflowYaml({ nodes, edges, meta }: ExportOptions): string {
    const stateNodes = nodes.filter((n) => n.type === "state");

    // Build places — string[] when none have metadata, object otherwise
    const anyPlaceHasMetadata = stateNodes.some(
        (n) => Object.keys((n.data as unknown as StateNodeData).metadata).length > 0
    );
    let places: unknown;
    if (anyPlaceHasMetadata) {
        const placesObj: Record<string, unknown> = {};
        for (const node of stateNodes) {
            const data = node.data as unknown as StateNodeData;
            const hasMetadata = Object.keys(data.metadata).length > 0;
            placesObj[data.label] = hasMetadata ? { metadata: data.metadata } : null;
        }
        places = placesObj;
    } else {
        places = stateNodes.map((n) => (n.data as unknown as StateNodeData).label);
    }

    // Build transitions from transition nodes
    const transitionNodes = nodes.filter((n) => n.type === "transition");
    const transitions: Record<string, unknown> = {};

    for (const tNode of transitionNodes) {
        const data = tNode.data as unknown as TransitionNodeData;

        // Find connected state nodes via edges
        const fromLabels = edges
            .filter((e) => e.target === tNode.id)
            .map((e) => stateNodes.find((n) => n.id === e.source))
            .filter(Boolean)
            .map((n) => (n!.data as unknown as StateNodeData).label);

        const toLabels = edges
            .filter((e) => e.source === tNode.id)
            .map((e) => stateNodes.find((n) => n.id === e.target))
            .filter(Boolean)
            .map((n) => (n!.data as unknown as StateNodeData).label);

        if (fromLabels.length === 0 || toLabels.length === 0) continue;

        const transition: Record<string, unknown> = {
            from: fromLabels.length === 1 ? fromLabels[0] : fromLabels,
            to: toLabels.length === 1 ? toLabels[0] : toLabels,
        };

        if (data.guard) {
            transition.guard = data.guard;
        }

        if (Object.keys(data.metadata).length > 0) {
            transition.metadata = data.metadata;
        }

        transitions[data.label] = transition;
    }

    // Build initial_marking — string when single, array when multiple
    const initialMarkingArr =
        meta.initial_marking.length > 0
            ? meta.initial_marking
            : stateNodes
                  .filter((n) => (n.data as unknown as StateNodeData).isInitial)
                  .map((n) => (n.data as unknown as StateNodeData).label);
    const initialMarking =
        initialMarkingArr.length === 1 ? initialMarkingArr[0] : initialMarkingArr;

    const workflowConfig: Record<string, unknown> = {
        type: meta.type,
        marking_store: {
            type: meta.marking_store,
            property: meta.property,
        },
        supports: [meta.supports],
        initial_marking: initialMarking,
        places,
        transitions,
    };

    const output = {
        framework: {
            workflows: {
                [meta.name]: workflowConfig,
            },
        },
    };

    const raw = yaml.dump(output, {
        indent: 4,
        lineWidth: 120,
        noRefs: true,
        quotingType: "'",
        forceQuotes: false,
        styles: { "!!null": "canonical" },
    });

    // Convert block-style arrays to Symfony-style flow arrays: [a, b, c]
    return raw.replace(
        /^( +)([\w][\w.]*):[ ]*\n((?:\1 {4}- .+\n)+)/gm,
        (_match, indent: string, key: string, items: string) => {
            const values = items
                .split("\n")
                .filter((l) => l.trim().startsWith("- "))
                .map((l) => l.trim().replace(/^- /, ""));
            return `${indent}${key}: [${values.join(", ")}]\n`;
        }
    );
}
