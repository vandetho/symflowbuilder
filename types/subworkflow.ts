export interface SubWorkflowNodeData {
    label: string;
    /** CUID of the referenced workflow (null if not yet linked) */
    workflowId: string | null;
    /** Display name of the referenced workflow (cached for rendering) */
    workflowName: string | null;
    metadata: Record<string, string>;
}
