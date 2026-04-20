import type {
    WorkflowDefinition,
    WorkflowAnalysis,
    PlaceAnalysis,
    TransitionAnalysis,
    PlacePattern,
    TransitionPattern,
} from "./types";

/**
 * Analyzes a workflow definition to detect structural patterns.
 *
 * Pattern semantics depend on the workflow type:
 * - state_machine: one place active at a time → splits/joins are XOR (exclusive)
 * - workflow: multiple places can be active → splits/joins are OR (non-exclusive)
 *   and AND patterns (from/to arrays) create parallel states
 */
export function analyzeWorkflow(definition: WorkflowDefinition): WorkflowAnalysis {
    const isStateMachine = definition.type === "state_machine";

    // Build adjacency info
    const placeOutgoing = new Map<string, Set<string>>();
    const placeIncoming = new Map<string, Set<string>>();

    for (const place of definition.places) {
        placeOutgoing.set(place.name, new Set());
        placeIncoming.set(place.name, new Set());
    }

    for (const transition of definition.transitions) {
        for (const from of transition.froms) {
            placeOutgoing.get(from)?.add(transition.name);
        }
        for (const to of transition.tos) {
            placeIncoming.get(to)?.add(transition.name);
        }
    }

    // Analyze transitions
    const transitions: Record<string, TransitionAnalysis> = {};
    for (const t of definition.transitions) {
        let pattern: TransitionPattern;
        if (t.froms.length > 1 && t.tos.length > 1) {
            pattern = "and-split-join";
        } else if (t.froms.length > 1) {
            pattern = "and-join";
        } else if (t.tos.length > 1) {
            pattern = "and-split";
        } else {
            pattern = "simple";
        }

        transitions[t.name] = {
            name: t.name,
            pattern,
            froms: t.froms,
            tos: t.tos,
        };
    }

    // Analyze places
    const places: Record<string, PlaceAnalysis> = {};
    for (const place of definition.places) {
        const outgoing = placeOutgoing.get(place.name) ?? new Set();
        const incoming = placeIncoming.get(place.name) ?? new Set();
        const patterns: PlacePattern[] = [];

        // Multiple outgoing transitions = choice point
        // state_machine: XOR (only one place active, so only one path)
        // workflow: OR (multiple transitions can fire independently)
        if (outgoing.size > 1) {
            patterns.push(isStateMachine ? "xor-split" : "or-split");
        }

        // Multiple incoming transitions from different sources = join
        // state_machine: XOR (only one path could have been taken)
        // workflow: OR (tokens from multiple paths can merge)
        if (incoming.size > 1) {
            patterns.push(isStateMachine ? "xor-join" : "or-join");
        }

        // AND-split: this place is a target of a transition with multiple tos
        // (only meaningful in workflow type — parallel states)
        if (!isStateMachine) {
            for (const tName of incoming) {
                const t = definition.transitions.find((tr) => tr.name === tName);
                if (t && t.tos.length > 1) {
                    patterns.push("and-split");
                    break;
                }
            }
        }

        // AND-join: this place is a source of a transition with multiple froms
        // (only meaningful in workflow type — synchronization)
        if (!isStateMachine) {
            for (const tName of outgoing) {
                const t = definition.transitions.find((tr) => tr.name === tName);
                if (t && t.froms.length > 1) {
                    patterns.push("and-join");
                    break;
                }
            }
        }

        if (patterns.length === 0) {
            patterns.push("simple");
        }

        places[place.name] = {
            name: place.name,
            patterns,
            incomingTransitions: Array.from(incoming),
            outgoingTransitions: Array.from(outgoing),
        };
    }

    return { places, transitions };
}
