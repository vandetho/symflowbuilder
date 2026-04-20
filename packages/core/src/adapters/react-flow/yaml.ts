import type { Node, Edge } from "@xyflow/react";
import type { WorkflowMeta } from "../../types/workflow";
import {
    importWorkflowYaml as importPure,
    exportWorkflowYaml as exportPure,
} from "../../yaml";
import { buildDefinition } from "./definition-builder";
import { autoLayoutNodes } from "./layout";
import type { StateNodeData, TransitionNodeData } from "./types";

export interface ImportGraphResult {
    nodes: Node[];
    edges: Edge[];
    meta: WorkflowMeta;
}

/**
 * Parse a Symfony workflow YAML and produce an auto-laid-out React Flow graph.
 * Wraps the pure YAML importer and materialises the definition as nodes/edges.
 */
export function importWorkflowYamlToGraph(yamlString: string): ImportGraphResult {
    const { definition, meta } = importPure(yamlString);

    const stateNodes: Node[] = definition.places.map((place) => ({
        id: `state-${place.name}`,
        type: "state",
        position: { x: 0, y: 0 },
        data: {
            label: place.name,
            isInitial: definition.initialMarking.includes(place.name),
            isFinal: false,
            metadata: place.metadata ?? {},
        } satisfies StateNodeData,
    }));

    const transitionNodes: Node[] = [];
    const edges: Edge[] = [];

    for (const transition of definition.transitions) {
        const transitionId = `transition-${transition.name}`;
        transitionNodes.push({
            id: transitionId,
            type: "transition",
            position: { x: 0, y: 0 },
            data: {
                label: transition.name,
                guard: transition.guard,
                listeners: [],
                metadata: transition.metadata ?? {},
            } satisfies TransitionNodeData,
        });

        for (const from of transition.froms) {
            edges.push({
                id: `edge-${transition.name}-from-${from}`,
                source: `state-${from}`,
                target: transitionId,
                type: "connector",
            });
        }

        for (const to of transition.tos) {
            edges.push({
                id: `edge-${transition.name}-to-${to}`,
                source: transitionId,
                target: `state-${to}`,
                type: "connector",
            });
        }
    }

    const allNodes = [...stateNodes, ...transitionNodes];

    const statesThatAreSource = new Set(
        edges.filter((e) => e.target.startsWith("transition-")).map((e) => e.source)
    );
    for (const node of stateNodes) {
        if (!statesThatAreSource.has(node.id)) {
            (node.data as unknown as StateNodeData).isFinal = true;
        }
    }

    const layoutedNodes = autoLayoutNodes(allNodes, edges);
    return { nodes: layoutedNodes, edges, meta };
}

/**
 * Build a WorkflowDefinition from a React Flow graph and dump it as YAML.
 */
export function exportGraphToYaml(options: {
    nodes: Node[];
    edges: Edge[];
    meta: WorkflowMeta;
}): string {
    const definition = buildDefinition(options.nodes, options.edges, options.meta);
    return exportPure({ definition, meta: options.meta });
}
