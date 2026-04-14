export type SymfonyVersion = "5.4" | "6.4" | "7.4" | "8.0";
export type WorkflowType = "workflow" | "state_machine";
export type MarkingStoreType = "method" | "property";

export interface StateNodeData {
    label: string;
    isInitial: boolean;
    isFinal: boolean;
    metadata: Record<string, string>;
}

export interface TransitionListener {
    event: string;
    service: string;
}

export interface TransitionEdgeData {
    label: string;
    guard?: string;
    listeners: TransitionListener[];
    metadata: Record<string, string>;
}

export interface WorkflowMeta {
    name: string;
    symfonyVersion: SymfonyVersion;
    type: WorkflowType;
    marking_store: MarkingStoreType;
    initial_marking: string[];
    supports: string;
    property: string;
}

export interface GraphJson {
    nodes: import("@xyflow/react").Node[];
    edges: import("@xyflow/react").Edge[];
    meta: WorkflowMeta;
}

export interface Snapshot {
    nodes: import("@xyflow/react").Node[];
    edges: import("@xyflow/react").Edge[];
}

export const STATE_NAME_REGEX = /^[a-z][a-z0-9_]*$/;

export const DEFAULT_WORKFLOW_META: WorkflowMeta = {
    name: "my_workflow",
    symfonyVersion: "6.4",
    type: "workflow",
    marking_store: "method",
    initial_marking: [],
    supports: "App\\Entity\\MyEntity",
    property: "currentState",
};
