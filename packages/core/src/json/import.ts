import type { WorkflowMeta } from "../types/workflow";
import type { WorkflowDefinition } from "../engine/types";
import type { WorkflowJson } from "./export";

export type { WorkflowJson };

export function importWorkflowJson(jsonString: string): WorkflowJson {
    let parsed: unknown;
    try {
        parsed = JSON.parse(jsonString);
    } catch (err) {
        throw new Error(
            `Invalid workflow JSON: ${err instanceof Error ? err.message : String(err)}`
        );
    }

    if (!parsed || typeof parsed !== "object") {
        throw new Error("Invalid workflow JSON: expected an object");
    }

    const obj = parsed as Record<string, unknown>;
    const definition = obj.definition as WorkflowDefinition | undefined;
    const meta = obj.meta as WorkflowMeta | undefined;

    if (!definition || typeof definition !== "object") {
        throw new Error("Invalid workflow JSON: missing 'definition'");
    }
    if (!meta || typeof meta !== "object") {
        throw new Error("Invalid workflow JSON: missing 'meta'");
    }
    if (!Array.isArray(definition.places) || !Array.isArray(definition.transitions)) {
        throw new Error(
            "Invalid workflow JSON: definition must have places and transitions arrays"
        );
    }

    return { definition, meta };
}
