import type {
    WorkflowDefinition,
    WorkflowAnalysis,
    PlaceAnalysis,
    TransitionAnalysis,
    PlacePattern,
    TransitionPattern,
} from "./types";

/**
 * Analyzes a workflow definition to detect structural patterns:
 * - AND-split: one transition forks to multiple places
 * - AND-join: multiple places synchronize into one transition
 * - OR-split: a place has multiple outgoing transitions (choice)
 * - OR-join: a place has multiple incoming transitions (merge)
 */
export function analyzeWorkflow(definition: WorkflowDefinition): WorkflowAnalysis {
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

        // OR-split: multiple outgoing transitions = choice point
        if (outgoing.size > 1) {
            patterns.push("or-split");
        }

        // OR-join: multiple incoming transitions = merge point
        if (incoming.size > 1) {
            patterns.push("or-join");
        }

        // AND-split: this place is a target of a transition that has multiple tos
        for (const tName of incoming) {
            const t = definition.transitions.find((tr) => tr.name === tName);
            if (t && t.tos.length > 1) {
                patterns.push("and-split");
                break;
            }
        }

        // AND-join: this place is a source of a transition that has multiple froms
        for (const tName of outgoing) {
            const t = definition.transitions.find((tr) => tr.name === tName);
            if (t && t.froms.length > 1) {
                patterns.push("and-join");
                break;
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
