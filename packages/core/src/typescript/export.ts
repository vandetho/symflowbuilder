import type { WorkflowMeta } from "../types/workflow";
import type { WorkflowDefinition } from "../engine/types";

interface ExportOptions {
    definition: WorkflowDefinition;
    meta: WorkflowMeta;
    /** Variable prefix used for the emitted exports. Defaults to `"workflow"`. */
    exportName?: string;
    /** Module specifier the emitted file imports types from. Defaults to `"@symflow/core"`. */
    importFrom?: string;
}

/**
 * Emit a TypeScript module string that re-declares the workflow as typed
 * `WorkflowDefinition` and `WorkflowMeta` literals. Save the result as a
 * `.ts` file and import the named exports normally — no runtime parsing
 * needed.
 */
export function exportWorkflowTs({
    definition,
    meta,
    exportName = "workflow",
    importFrom = "@symflow/core",
}: ExportOptions): string {
    const definitionLiteral = JSON.stringify(definition, null, 4);
    const metaLiteral = JSON.stringify(meta, null, 4);

    return `import type { WorkflowDefinition, WorkflowMeta } from "${importFrom}";

export const ${exportName}Definition: WorkflowDefinition = ${definitionLiteral};

export const ${exportName}Meta: WorkflowMeta = ${metaLiteral};
`;
}
