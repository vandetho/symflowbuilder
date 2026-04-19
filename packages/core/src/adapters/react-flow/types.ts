import type { Node, Edge } from "@xyflow/react";
import type { TransitionListener, WorkflowMeta } from "../../types/workflow";

export interface StateNodeData {
    label: string;
    isInitial: boolean;
    isFinal: boolean;
    metadata: Record<string, string>;
}

export interface TransitionNodeData {
    label: string;
    guard?: string;
    listeners: TransitionListener[];
    metadata: Record<string, string>;
}

/** @deprecated Use TransitionNodeData — transitions are now nodes, not edges */
export interface TransitionEdgeData {
    label: string;
    guard?: string;
    listeners: TransitionListener[];
    metadata: Record<string, string>;
}

export interface GraphJson {
    nodes: Node[];
    edges: Edge[];
    meta: WorkflowMeta;
}

export interface Snapshot {
    nodes: Node[];
    edges: Edge[];
}
