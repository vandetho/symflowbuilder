import yaml from "js-yaml";
import type { Node, Edge } from "@xyflow/react";
import type { StateNodeData, TransitionEdgeData, WorkflowMeta } from "@/types/workflow";

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

    // Build transitions
    const transitions: Record<string, unknown> = {};
    for (const edge of edges) {
        const data = edge.data as unknown as TransitionEdgeData | undefined;
        if (!data?.label) continue;

        const sourceNode = stateNodes.find((n) => n.id === edge.source);
        const targetNode = stateNodes.find((n) => n.id === edge.target);
        if (!sourceNode || !targetNode) continue;

        const sourceLabel = (sourceNode.data as unknown as StateNodeData).label;
        const targetLabel = (targetNode.data as unknown as StateNodeData).label;

        const existing = transitions[data.label] as Record<string, unknown> | undefined;

        if (existing) {
            // Merge multiple froms for same transition name
            const currentFrom = existing.from;
            if (Array.isArray(currentFrom)) {
                if (!currentFrom.includes(sourceLabel)) {
                    currentFrom.push(sourceLabel);
                }
            } else if (currentFrom !== sourceLabel) {
                existing.from = [currentFrom, sourceLabel];
            }
            // Merge multiple tos
            const currentTo = existing.to;
            if (Array.isArray(currentTo)) {
                if (!currentTo.includes(targetLabel)) {
                    currentTo.push(targetLabel);
                }
            } else if (currentTo !== targetLabel) {
                existing.to = [currentTo, targetLabel];
            }
        } else {
            const transition: Record<string, unknown> = {
                from: sourceLabel,
                to: targetLabel,
            };

            if (data.guard) {
                transition.guard = data.guard;
            }

            if (Object.keys(data.metadata).length > 0) {
                transition.metadata = data.metadata;
            }

            transitions[data.label] = transition;
        }
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
