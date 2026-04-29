import { create } from "zustand";
import {
    type Node,
    type Edge,
    type Connection,
    type OnNodesChange,
    type OnEdgesChange,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
} from "@xyflow/react";
import type { WorkflowMeta } from "symflow";
import { DEFAULT_WORKFLOW_META } from "symflow";
import type {
    StateNodeData,
    TransitionNodeData,
    TransitionEdgeData,
    Snapshot,
} from "symflow/react-flow";
import {
    exportGraphToYaml,
    exportGraphToJson,
    exportGraphToTs,
    exportGraphToMermaid,
    exportGraphToDot,
    exportGraphToPhp,
    importWorkflowYamlToGraph,
    importWorkflowJsonToGraph,
    migrateGraphData,
} from "symflow/react-flow";
import type { AccessLevel } from "@/types/collaboration";
import type { SubWorkflowNodeData } from "@/types/subworkflow";
import { uid, uniqueName } from "@/lib/utils";

function shallowEqualPatch<T extends object>(
    base: T | undefined,
    patch: Partial<T>
): boolean {
    if (!base) return false;
    for (const key of Object.keys(patch) as (keyof T)[]) {
        if (base[key] !== patch[key]) return false;
    }
    return true;
}

function cloneSnapshot(nodes: Node[], edges: Edge[]): Snapshot {
    return {
        nodes: nodes.map((n) => ({ ...n, data: { ...n.data } })),
        edges: edges.map((e) => ({ ...e, data: e.data ? { ...e.data } : e.data })),
    };
}

interface EditorStore {
    nodes: Node[];
    edges: Edge[];
    history: { past: Snapshot[]; future: Snapshot[] };
    workflowMeta: WorkflowMeta;
    selectedNodeId: string | null;
    selectedEdgeId: string | null;
    accessLevel: AccessLevel | null;
    setAccessLevel: (level: AccessLevel | null) => void;

    // React Flow handlers
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: (connection: Connection) => void;

    // Node/Edge CRUD
    addNode: (node: Node) => void;
    deleteSelected: () => void;
    updateNodeData: (
        id: string,
        data:
            | Partial<StateNodeData>
            | Partial<TransitionNodeData>
            | Partial<SubWorkflowNodeData>
    ) => void;
    updateEdgeData: (id: string, data: Partial<TransitionEdgeData>) => void;
    setSelectedNode: (id: string | null) => void;
    setSelectedEdge: (id: string | null) => void;

    // Meta
    updateMeta: (meta: Partial<WorkflowMeta>) => void;

    // History
    undo: () => void;
    redo: () => void;
    snapshot: () => void;

    // Import/Export
    exportYaml: () => string;
    exportJson: () => string;
    exportTs: () => string;
    exportMermaid: () => string;
    exportDot: () => string;
    exportPhp: () => string;
    importYaml: (yamlString: string) => void;
    importJson: (jsonString: string) => void;
    importFromUrl: (url: string) => Promise<void>;
    loadFromJson: (data: { nodes: Node[]; edges: Edge[]; meta: WorkflowMeta }) => void;
    reset: () => void;

    // Setters for ReactFlow
    setNodes: (updater: Node[] | ((nodes: Node[]) => Node[])) => void;
    setEdges: (updater: Edge[] | ((edges: Edge[]) => Edge[])) => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
    nodes: [],
    edges: [],
    history: { past: [], future: [] },
    workflowMeta: { ...DEFAULT_WORKFLOW_META },
    selectedNodeId: null,
    selectedEdgeId: null,
    accessLevel: null,
    setAccessLevel: (level) => set({ accessLevel: level }),

    onNodesChange: (changes) => {
        set({ nodes: applyNodeChanges(changes, get().nodes) });
    },

    onEdgesChange: (changes) => {
        set({ edges: applyEdgeChanges(changes, get().edges) });
    },

    onConnect: (connection) => {
        const { edges, snapshot } = get();
        const existingLabels = edges
            .map((e) => (e.data as unknown as TransitionEdgeData)?.label)
            .filter(Boolean) as string[];
        const newEdge: Edge = {
            ...connection,
            id: uid("edge"),
            type: "transition",
            data: {
                label: uniqueName("transition", existingLabels),
                guard: undefined,
                listeners: [],
                metadata: {},
            } satisfies TransitionEdgeData,
        };
        set({ edges: addEdge(newEdge, edges) });
        snapshot();
    },

    addNode: (node) => {
        set((state) => ({ nodes: [...state.nodes, node] }));
        get().snapshot();
    },

    deleteSelected: () => {
        const { nodes, edges, selectedNodeId, selectedEdgeId, snapshot } = get();
        if (selectedNodeId) {
            set({
                nodes: nodes.filter((n) => n.id !== selectedNodeId),
                edges: edges.filter(
                    (e) => e.source !== selectedNodeId && e.target !== selectedNodeId
                ),
                selectedNodeId: null,
            });
            snapshot();
        } else if (selectedEdgeId) {
            set({
                edges: edges.filter((e) => e.id !== selectedEdgeId),
                selectedEdgeId: null,
            });
            snapshot();
        }
    },

    updateNodeData: (id, data) => {
        set((state) => {
            let mutated = false;
            const nextNodes = state.nodes.map((n) => {
                if (n.id !== id) return n;
                if (shallowEqualPatch(n.data, data)) return n;
                mutated = true;
                return { ...n, data: { ...n.data, ...data } };
            });
            return mutated ? { nodes: nextNodes } : state;
        });
    },

    updateEdgeData: (id, data) => {
        set((state) => {
            let mutated = false;
            const nextEdges = state.edges.map((e) => {
                if (e.id !== id) return e;
                if (shallowEqualPatch(e.data, data)) return e;
                mutated = true;
                return { ...e, data: { ...e.data, ...data } };
            });
            return mutated ? { edges: nextEdges } : state;
        });
    },

    setSelectedNode: (id) =>
        set((state) =>
            state.selectedNodeId === id && state.selectedEdgeId === null
                ? state
                : { selectedNodeId: id, selectedEdgeId: null }
        ),
    setSelectedEdge: (id) =>
        set((state) =>
            state.selectedEdgeId === id && state.selectedNodeId === null
                ? state
                : { selectedEdgeId: id, selectedNodeId: null }
        ),

    updateMeta: (meta) => {
        set((state) => {
            if (shallowEqualPatch(state.workflowMeta, meta)) return state;
            return { workflowMeta: { ...state.workflowMeta, ...meta } };
        });
    },

    // Deep-copy nodes/edges so a later in-place mutation by React Flow (e.g. on
    // selection/dragging flags) cannot corrupt the past/future entry.
    snapshot: () => {
        set((state) => ({
            history: {
                past: [
                    ...state.history.past.slice(-49),
                    cloneSnapshot(state.nodes, state.edges),
                ],
                future: [],
            },
        }));
    },

    undo: () => {
        set((state) => {
            const prev = state.history.past.at(-1);
            if (!prev) return state;
            return {
                nodes: prev.nodes,
                edges: prev.edges,
                history: {
                    past: state.history.past.slice(0, -1),
                    future: [
                        { nodes: state.nodes, edges: state.edges },
                        ...state.history.future,
                    ],
                },
            };
        });
    },

    redo: () => {
        set((state) => {
            const next = state.history.future[0];
            if (!next) return state;
            return {
                nodes: next.nodes,
                edges: next.edges,
                history: {
                    past: [
                        ...state.history.past,
                        { nodes: state.nodes, edges: state.edges },
                    ],
                    future: state.history.future.slice(1),
                },
            };
        });
    },

    exportYaml: () => {
        const { nodes, edges, workflowMeta } = get();
        return exportGraphToYaml({ nodes, edges, meta: workflowMeta });
    },

    exportJson: () => {
        const { nodes, edges, workflowMeta } = get();
        return exportGraphToJson({ nodes, edges, meta: workflowMeta });
    },

    exportTs: () => {
        const { nodes, edges, workflowMeta } = get();
        return exportGraphToTs({
            nodes,
            edges,
            meta: workflowMeta,
            exportName: workflowMeta.name.replace(/[^a-zA-Z0-9]/g, "_"),
        });
    },

    exportMermaid: () => {
        const { nodes, edges, workflowMeta } = get();
        return exportGraphToMermaid({ nodes, edges, meta: workflowMeta });
    },

    exportDot: () => {
        const { nodes, edges, workflowMeta } = get();
        return exportGraphToDot({ nodes, edges, meta: workflowMeta });
    },

    exportPhp: () => {
        const { nodes, edges, workflowMeta } = get();
        return exportGraphToPhp({ nodes, edges, meta: workflowMeta });
    },

    importYaml: (yamlString) => {
        const result = importWorkflowYamlToGraph(yamlString);
        set({
            nodes: result.nodes,
            edges: result.edges,
            workflowMeta: result.meta,
            history: { past: [], future: [] },
            selectedNodeId: null,
            selectedEdgeId: null,
        });
    },

    importJson: (jsonString) => {
        const result = importWorkflowJsonToGraph(jsonString);
        set({
            nodes: result.nodes,
            edges: result.edges,
            workflowMeta: result.meta,
            history: { past: [], future: [] },
            selectedNodeId: null,
            selectedEdgeId: null,
        });
    },

    importFromUrl: async (url) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        const text = await res.text();
        const isJson = url.endsWith(".json") || text.trimStart().startsWith("{");
        if (isJson) {
            get().importJson(text);
        } else {
            get().importYaml(text);
        }
    },

    loadFromJson: ({ nodes, edges, meta }) => {
        // Migrate old edge-based workflows to node-based format
        const migrated = migrateGraphData({ nodes, edges });
        set({
            nodes: migrated.nodes,
            edges: migrated.edges,
            workflowMeta: meta,
            history: { past: [], future: [] },
            selectedNodeId: null,
            selectedEdgeId: null,
        });
    },

    reset: () => {
        set({
            nodes: [],
            edges: [],
            history: { past: [], future: [] },
            workflowMeta: { ...DEFAULT_WORKFLOW_META },
            selectedNodeId: null,
            selectedEdgeId: null,
        });
    },

    setNodes: (updater) => {
        set((state) => {
            const next = typeof updater === "function" ? updater(state.nodes) : updater;
            return next === state.nodes ? state : { nodes: next };
        });
    },

    setEdges: (updater) => {
        set((state) => {
            const next = typeof updater === "function" ? updater(state.edges) : updater;
            return next === state.edges ? state : { edges: next };
        });
    },
}));
