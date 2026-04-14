import yaml from "js-yaml";
import type { Node, Edge } from "@xyflow/react";
import type {
    StateNodeData,
    TransitionEdgeData,
    WorkflowMeta,
    WorkflowType,
    MarkingStoreType,
} from "@/types/workflow";
import { DEFAULT_WORKFLOW_META } from "@/types/workflow";
import { autoLayoutNodes } from "./layout-engine";

interface ImportResult {
    nodes: Node[];
    edges: Edge[];
    meta: WorkflowMeta;
}

export function importWorkflowYaml(yamlString: string): ImportResult {
    const parsed = yaml.load(yamlString) as Record<string, unknown>;

    // Support both full framework.workflows.{name} and bare workflow object
    let workflowName: string;
    let config: Record<string, unknown>;

    if (parsed.framework) {
        const fw = parsed.framework as Record<string, unknown>;
        const workflows = fw.workflows as Record<string, Record<string, unknown>>;
        const names = Object.keys(workflows);
        if (names.length === 0) throw new Error("No workflow found in YAML");
        workflowName = names[0];
        config = workflows[workflowName];
    } else if (parsed.places || parsed.transitions) {
        workflowName = "imported_workflow";
        config = parsed;
    } else {
        // Try treating keys as workflow names
        const keys = Object.keys(parsed);
        if (keys.length > 0 && typeof parsed[keys[0]] === "object") {
            const inner = parsed[keys[0]] as Record<string, unknown>;
            if (inner.places || inner.transitions) {
                workflowName = keys[0];
                config = inner;
            } else {
                throw new Error("Could not detect workflow structure in YAML");
            }
        } else {
            throw new Error("Could not detect workflow structure in YAML");
        }
    }

    // Extract metadata
    const markingStore = config.marking_store as Record<string, string> | undefined;
    const meta: WorkflowMeta = {
        name: workflowName,
        symfonyVersion: DEFAULT_WORKFLOW_META.symfonyVersion,
        type: (config.type as WorkflowType) ?? "workflow",
        marking_store: (markingStore?.type as MarkingStoreType) ?? "method",
        property: markingStore?.property ?? "currentState",
        initial_marking: Array.isArray(config.initial_marking)
            ? config.initial_marking
            : config.initial_marking
              ? [config.initial_marking as string]
              : [],
        supports: Array.isArray(config.supports)
            ? (config.supports[0] as string)
            : ((config.supports as string) ?? DEFAULT_WORKFLOW_META.supports),
    };

    // Parse places
    const places = config.places as Record<string, unknown> | string[] | undefined;
    const placeNames: string[] = [];
    const placeMetadata: Record<string, Record<string, string>> = {};

    if (Array.isArray(places)) {
        placeNames.push(...places);
    } else if (places && typeof places === "object") {
        for (const [name, value] of Object.entries(places)) {
            placeNames.push(name);
            if (
                value &&
                typeof value === "object" &&
                "metadata" in (value as Record<string, unknown>)
            ) {
                placeMetadata[name] = (value as Record<string, unknown>)
                    .metadata as Record<string, string>;
            }
        }
    }

    // Create state nodes
    const nodes: Node[] = placeNames.map((name) => ({
        id: `state-${name}`,
        type: "state",
        position: { x: 0, y: 0 }, // will be auto-laid out
        data: {
            label: name,
            isInitial: meta.initial_marking.includes(name),
            isFinal: false, // will detect below
            metadata: placeMetadata[name] ?? {},
        } satisfies StateNodeData,
    }));

    // Parse transitions
    const transitions = config.transitions as Record<string, unknown> | undefined;
    const edges: Edge[] = [];

    if (transitions) {
        for (const [transName, transConfig] of Object.entries(transitions)) {
            const tc = transConfig as Record<string, unknown>;
            const froms = Array.isArray(tc.from) ? tc.from : [tc.from as string];
            const tos = Array.isArray(tc.to) ? tc.to : [tc.to as string];

            for (const from of froms) {
                for (const to of tos) {
                    edges.push({
                        id: `edge-${transName}-${from}-${to}`,
                        source: `state-${from}`,
                        target: `state-${to}`,
                        type: "transition",
                        data: {
                            label: transName,
                            guard: tc.guard as string | undefined,
                            listeners: [],
                            metadata: (tc.metadata as Record<string, string>) ?? {},
                        } satisfies TransitionEdgeData,
                    });
                }
            }
        }
    }

    // Detect final nodes (no outgoing edges)
    const sourcesSet = new Set(edges.map((e) => e.source));
    for (const node of nodes) {
        if (!sourcesSet.has(node.id)) {
            (node.data as unknown as StateNodeData).isFinal = true;
        }
    }

    // Auto-layout
    const layoutedNodes = autoLayoutNodes(nodes, edges);

    return { nodes: layoutedNodes, edges, meta };
}
