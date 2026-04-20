import type {
    Marking,
    Transition,
    WorkflowEvent,
    WorkflowEventType,
} from "../engine/types";

/**
 * Reads and writes a workflow's `Marking` onto a domain object (the "subject").
 * Mirrors Symfony's `MarkingStoreInterface`.
 */
export interface MarkingStore<T> {
    read(subject: T): Marking;
    write(subject: T, marking: Marking): void;
}

/** A workflow event delivered to listeners attached via `Workflow.on()`. */
export interface SubjectEvent<T> extends WorkflowEvent {
    subject: T;
}

export type SubjectEventListener<T> = (event: SubjectEvent<T>) => void;

/** Context passed to a subject-aware guard evaluator. */
export interface SubjectGuardContext<T> {
    subject: T;
    marking: Marking;
    transition: Transition;
}

export type SubjectGuardEvaluator<T> = (
    expression: string,
    context: SubjectGuardContext<T>
) => boolean;

export type { Marking, Transition, WorkflowEvent, WorkflowEventType };
