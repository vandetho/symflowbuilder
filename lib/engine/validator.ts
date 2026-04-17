import type { WorkflowDefinition, ValidationResult, ValidationError } from "./types";

export function validateDefinition(definition: WorkflowDefinition): ValidationResult {
    const errors: ValidationError[] = [];
    const placeNames = new Set(definition.places.map((p) => p.name));

    // No initial marking
    if (definition.initialMarking.length === 0) {
        errors.push({
            type: "no_initial_marking",
            message: "Workflow has no initial marking",
        });
    }

    // Invalid initial marking
    for (const place of definition.initialMarking) {
        if (!placeNames.has(place)) {
            errors.push({
                type: "invalid_initial_marking",
                message: `Initial marking references unknown place "${place}"`,
                details: { place },
            });
        }
    }

    // Invalid transition sources/targets
    for (const transition of definition.transitions) {
        for (const from of transition.froms) {
            if (!placeNames.has(from)) {
                errors.push({
                    type: "invalid_transition_source",
                    message: `Transition "${transition.name}" references unknown source place "${from}"`,
                    details: { transition: transition.name, place: from },
                });
            }
        }
        for (const to of transition.tos) {
            if (!placeNames.has(to)) {
                errors.push({
                    type: "invalid_transition_target",
                    message: `Transition "${transition.name}" references unknown target place "${to}"`,
                    details: { transition: transition.name, place: to },
                });
            }
        }
    }

    // Reachability analysis via BFS from initial marking
    const reachable = new Set<string>(definition.initialMarking);
    const queue = [...definition.initialMarking];

    while (queue.length > 0) {
        const current = queue.shift()!;
        for (const transition of definition.transitions) {
            if (transition.froms.includes(current)) {
                for (const to of transition.tos) {
                    if (!reachable.has(to)) {
                        reachable.add(to);
                        queue.push(to);
                    }
                }
            }
        }
    }

    // Unreachable places
    for (const place of definition.places) {
        if (!reachable.has(place.name)) {
            errors.push({
                type: "unreachable_place",
                message: `Place "${place.name}" is unreachable from the initial marking`,
                details: { place: place.name },
            });
        }
    }

    // Dead transitions — all froms must be reachable
    for (const transition of definition.transitions) {
        const allFromsReachable = transition.froms.every((f) => reachable.has(f));
        if (!allFromsReachable) {
            errors.push({
                type: "dead_transition",
                message: `Transition "${transition.name}" can never fire — not all source places are reachable`,
                details: { transition: transition.name },
            });
        }
    }

    // Orphan places — no incoming or outgoing transitions (except initial places)
    const hasIncoming = new Set<string>();
    const hasOutgoing = new Set<string>();
    for (const transition of definition.transitions) {
        for (const from of transition.froms) hasOutgoing.add(from);
        for (const to of transition.tos) hasIncoming.add(to);
    }
    for (const place of definition.places) {
        const isInitial = definition.initialMarking.includes(place.name);
        if (!hasIncoming.has(place.name) && !hasOutgoing.has(place.name)) {
            errors.push({
                type: "orphan_place",
                message: `Place "${place.name}" has no transitions${isInitial ? " (initial place)" : ""}`,
                details: { place: place.name, isInitial },
            });
        }
    }

    return { valid: errors.length === 0, errors };
}
