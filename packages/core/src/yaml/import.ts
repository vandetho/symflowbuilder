import yaml from "js-yaml";
import type { WorkflowMeta, WorkflowType, MarkingStoreType } from "../types/workflow";
import { DEFAULT_WORKFLOW_META } from "../types/workflow";
import type { WorkflowDefinition, Place, Transition } from "../engine/types";

export interface ImportResult {
    definition: WorkflowDefinition;
    meta: WorkflowMeta;
}

export function importWorkflowYaml(yamlString: string): ImportResult {
    const parsed = yaml.load(yamlString) as Record<string, unknown>;

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

    const markingStore = config.marking_store as Record<string, string> | undefined;
    const initialMarking: string[] = Array.isArray(config.initial_marking)
        ? (config.initial_marking as string[])
        : config.initial_marking
          ? [config.initial_marking as string]
          : [];

    const meta: WorkflowMeta = {
        name: workflowName,
        symfonyVersion: DEFAULT_WORKFLOW_META.symfonyVersion,
        type: (config.type as WorkflowType) ?? "workflow",
        marking_store: (markingStore?.type as MarkingStoreType) ?? "method",
        property: markingStore?.property ?? "currentState",
        initial_marking: initialMarking,
        supports: Array.isArray(config.supports)
            ? (config.supports[0] as string)
            : ((config.supports as string) ?? DEFAULT_WORKFLOW_META.supports),
    };

    const placesRaw = config.places as Record<string, unknown> | string[] | undefined;
    const places: Place[] = [];
    if (Array.isArray(placesRaw)) {
        for (const name of placesRaw) places.push({ name });
    } else if (placesRaw && typeof placesRaw === "object") {
        for (const [name, value] of Object.entries(placesRaw)) {
            const place: Place = { name };
            if (
                value &&
                typeof value === "object" &&
                "metadata" in (value as Record<string, unknown>)
            ) {
                place.metadata = (value as Record<string, unknown>).metadata as Record<
                    string,
                    string
                >;
            }
            places.push(place);
        }
    }

    const transitionsRaw = config.transitions as Record<string, unknown> | undefined;
    const transitions: Transition[] = [];
    if (transitionsRaw) {
        for (const [name, tc] of Object.entries(transitionsRaw)) {
            const tcObj = tc as Record<string, unknown>;
            const froms = Array.isArray(tcObj.from)
                ? (tcObj.from as string[])
                : [tcObj.from as string];
            const tos = Array.isArray(tcObj.to)
                ? (tcObj.to as string[])
                : [tcObj.to as string];
            const transition: Transition = { name, froms, tos };
            if (tcObj.guard) transition.guard = tcObj.guard as string;
            if (tcObj.metadata) {
                transition.metadata = tcObj.metadata as Record<string, string>;
            }
            transitions.push(transition);
        }
    }

    const definition: WorkflowDefinition = {
        name: workflowName,
        type: meta.type,
        places,
        transitions,
        initialMarking,
    };

    return { definition, meta };
}
