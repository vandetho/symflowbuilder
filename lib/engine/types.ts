/** Mapping of place names to token counts */
export type Marking = Record<string, number>;

export interface Place {
    name: string;
    metadata?: Record<string, string>;
}

export interface Transition {
    name: string;
    froms: string[];
    tos: string[];
    guard?: string;
    metadata?: Record<string, string>;
}

export interface WorkflowDefinition {
    name: string;
    type: "workflow" | "state_machine";
    places: Place[];
    transitions: Transition[];
    initialMarking: string[];
}

/** Detected workflow pattern on a transition */
export type TransitionPattern =
    | "simple" // 1 from → 1 to
    | "and-split" // 1 from → N to (fork: all targets get tokens)
    | "and-join" // N from → 1 to (synchronization: all sources must be marked)
    | "and-split-join" // N from → M to
    | "or-split" // Place has multiple outgoing transitions (choice)
    | "or-join"; // Place has multiple incoming transitions (merge)

/** Detected workflow pattern on a place */
export type PlacePattern =
    | "simple"
    | "or-split" // Multiple outgoing transitions (choice point)
    | "or-join" // Multiple incoming transitions (merge point)
    | "and-split" // Single transition leads to multiple places including this one
    | "and-join"; // This place is one of multiple inputs to a transition

export interface PlaceAnalysis {
    name: string;
    patterns: PlacePattern[];
    incomingTransitions: string[];
    outgoingTransitions: string[];
}

export interface TransitionAnalysis {
    name: string;
    pattern: TransitionPattern;
    froms: string[];
    tos: string[];
}

export interface WorkflowAnalysis {
    places: Record<string, PlaceAnalysis>;
    transitions: Record<string, TransitionAnalysis>;
}

export interface TransitionBlocker {
    code: string;
    message: string;
}

export interface TransitionResult {
    allowed: boolean;
    blockers: TransitionBlocker[];
}

export type WorkflowEventType =
    | "guard"
    | "leave"
    | "transition"
    | "enter"
    | "entered"
    | "completed";

export interface WorkflowEvent {
    type: WorkflowEventType;
    transition: Transition;
    marking: Marking;
    workflowName: string;
}

export type WorkflowEventListener = (event: WorkflowEvent) => void;

export type GuardEvaluator = (
    expression: string,
    context: { marking: Marking; transition: Transition }
) => boolean;

export type ValidationErrorType =
    | "no_initial_marking"
    | "invalid_initial_marking"
    | "invalid_transition_source"
    | "invalid_transition_target"
    | "unreachable_place"
    | "dead_transition"
    | "orphan_place";

export interface ValidationError {
    type: ValidationErrorType;
    message: string;
    details?: Record<string, unknown>;
}

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}
