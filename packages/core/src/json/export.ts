import type { WorkflowMeta } from "../types/workflow";
import type { WorkflowDefinition } from "../engine/types";

export interface WorkflowJson {
    definition: WorkflowDefinition;
    meta: WorkflowMeta;
}

interface ExportOptions {
    definition: WorkflowDefinition;
    meta: WorkflowMeta;
    indent?: number;
}

export function exportWorkflowJson({
    definition,
    meta,
    indent = 2,
}: ExportOptions): string {
    const payload: WorkflowJson = { definition, meta };
    return JSON.stringify(payload, null, indent);
}
