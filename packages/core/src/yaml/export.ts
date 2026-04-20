import yaml from "js-yaml";
import type { WorkflowMeta } from "../types/workflow";
import type { WorkflowDefinition } from "../engine/types";

interface ExportOptions {
    definition: WorkflowDefinition;
    meta: WorkflowMeta;
}

export function exportWorkflowYaml({ definition, meta }: ExportOptions): string {
    const anyPlaceHasMetadata = definition.places.some(
        (p) => p.metadata && Object.keys(p.metadata).length > 0
    );

    let places: unknown;
    if (anyPlaceHasMetadata) {
        const placesObj: Record<string, unknown> = {};
        for (const place of definition.places) {
            const hasMetadata = place.metadata && Object.keys(place.metadata).length > 0;
            placesObj[place.name] = hasMetadata ? { metadata: place.metadata } : null;
        }
        places = placesObj;
    } else {
        places = definition.places.map((p) => p.name);
    }

    const transitions: Record<string, unknown> = {};
    for (const t of definition.transitions) {
        if (t.froms.length === 0 || t.tos.length === 0) continue;
        const transition: Record<string, unknown> = {
            from: t.froms.length === 1 ? t.froms[0] : t.froms,
            to: t.tos.length === 1 ? t.tos[0] : t.tos,
        };
        if (t.guard) transition.guard = t.guard;
        if (t.metadata && Object.keys(t.metadata).length > 0) {
            transition.metadata = t.metadata;
        }
        transitions[t.name] = transition;
    }

    const initialMarkingArr =
        meta.initial_marking.length > 0
            ? meta.initial_marking
            : definition.initialMarking;
    const initialMarking =
        initialMarkingArr.length === 1 ? initialMarkingArr[0] : initialMarkingArr;

    const workflowConfig: Record<string, unknown> = {
        type: meta.type,
        marking_store: {
            type: meta.marking_store,
            property: meta.property,
        },
        supports: [meta.supports],
        initial_marking: initialMarking,
        places,
        transitions,
    };

    const output = {
        framework: {
            workflows: {
                [meta.name]: workflowConfig,
            },
        },
    };

    const raw = yaml.dump(output, {
        indent: 4,
        lineWidth: 120,
        noRefs: true,
        quotingType: "'",
        forceQuotes: false,
        styles: { "!!null": "canonical" },
    });

    return raw.replace(
        /^( +)([\w][\w.]*):[ ]*\n((?:\1 {4}- .+\n)+)/gm,
        (_match, indent: string, key: string, items: string) => {
            const values = items
                .split("\n")
                .filter((l) => l.trim().startsWith("- "))
                .map((l) => l.trim().replace(/^- /, ""));
            return `${indent}${key}: [${values.join(", ")}]\n`;
        }
    );
}
