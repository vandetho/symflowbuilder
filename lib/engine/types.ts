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
