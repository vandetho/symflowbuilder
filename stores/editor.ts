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
import type {
    StateNodeData,
    TransitionNodeData,
    TransitionEdgeData,
    WorkflowMeta,
    Snapshot,
} from "@/types/workflow";
import type { AccessLevel } from "@/types/collaboration";
import { DEFAULT_WORKFLOW_META } from "@/types/workflow";
import { exportWorkflowYaml } from "@/lib/yaml-export";
import { importWorkflowYaml } from "@/lib/yaml-import";
import { uid, uniqueName } from "@/lib/utils";

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
        data: Partial<StateNodeData> | Partial<TransitionNodeData>
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
    importYaml: (yamlString: string) => void;
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
        set((state) => ({
            nodes: state.nodes.map((n) =>
                n.id === id ? { ...n, data: { ...n.data, ...data } } : n
            ),
        }));
    },

    updateEdgeData: (id, data) => {
        set((state) => ({
            edges: state.edges.map((e) =>
                e.id === id ? { ...e, data: { ...e.data, ...data } } : e
            ),
        }));
    },

    setSelectedNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
    setSelectedEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

    updateMeta: (meta) => {
        set((state) => ({
            workflowMeta: { ...state.workflowMeta, ...meta },
        }));
    },

    snapshot: () => {
        set((state) => ({
            history: {
                past: [
                    ...state.history.past.slice(-49),
                    { nodes: state.nodes, edges: state.edges },
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
        return exportWorkflowYaml({ nodes, edges, meta: workflowMeta });
    },

    importYaml: (yamlString) => {
        const result = importWorkflowYaml(yamlString);
        set({
            nodes: result.nodes,
            edges: result.edges,
            workflowMeta: result.meta,
            history: { past: [], future: [] },
            selectedNodeId: null,
            selectedEdgeId: null,
        });
    },

    loadFromJson: ({ nodes, edges, meta }) => {
        set({
            nodes,
            edges,
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
        set((state) => ({
            nodes: typeof updater === "function" ? updater(state.nodes) : updater,
        }));
    },

    setEdges: (updater) => {
        set((state) => ({
            edges: typeof updater === "function" ? updater(state.edges) : updater,
        }));
    },
}));
