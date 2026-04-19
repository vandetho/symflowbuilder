import type { Node, Edge } from "@xyflow/react";
import type { WorkflowMeta } from "../../types/workflow";
import { exportWorkflowTs } from "../../typescript";
import { buildDefinition } from "./definition-builder";

/**
 * Build a WorkflowDefinition from a React Flow graph and emit it as a
 * standalone `.ts` module string ready to be written to disk.
 */
export function exportGraphToTs(options: {
    nodes: Node[];
    edges: Edge[];
    meta: WorkflowMeta;
    exportName?: string;
    importFrom?: string;
}): string {
    const definition = buildDefinition(options.nodes, options.edges, options.meta);
    return exportWorkflowTs({
        definition,
        meta: options.meta,
        exportName: options.exportName,
        importFrom: options.importFrom,
    });
}
