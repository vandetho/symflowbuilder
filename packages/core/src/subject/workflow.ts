import { WorkflowEngine } from "../engine/workflow-engine";
import type {
    Marking,
    Transition,
    TransitionResult,
    WorkflowDefinition,
    WorkflowEventType,
} from "../engine/types";
import type { MarkingStore, SubjectEventListener, SubjectGuardEvaluator } from "./types";

export interface CreateWorkflowOptions<T> {
    markingStore: MarkingStore<T>;
    guardEvaluator?: SubjectGuardEvaluator<T>;
}

/**
 * Subject-driven workflow facade. Mirrors Symfony's `Workflow` service:
 * pass the entity to `can()` / `apply()` — the marking is loaded from and
 * written back to the subject via the provided `MarkingStore`.
 */
export class Workflow<T> {
    readonly definition: WorkflowDefinition;
    private readonly markingStore: MarkingStore<T>;
    private readonly guardEvaluator?: SubjectGuardEvaluator<T>;
    private readonly listeners = new Map<
        WorkflowEventType,
        Set<SubjectEventListener<T>>
    >();

    constructor(definition: WorkflowDefinition, options: CreateWorkflowOptions<T>) {
        this.definition = definition;
        this.markingStore = options.markingStore;
        this.guardEvaluator = options.guardEvaluator;
    }

    getMarking(subject: T): Marking {
        return this.markingStore.read(subject);
    }

    setMarking(subject: T, marking: Marking): void {
        this.markingStore.write(subject, marking);
    }

    getEnabledTransitions(subject: T): Transition[] {
        return this.buildEngine(subject).getEnabledTransitions();
    }

    can(subject: T, transitionName: string): TransitionResult {
        return this.buildEngine(subject).can(transitionName);
    }

    apply(subject: T, transitionName: string): Marking {
        const engine = this.buildEngine(subject);

        const unsubscribers: Array<() => void> = [];
        for (const [type, listeners] of this.listeners) {
            unsubscribers.push(
                engine.on(type, (event) => {
                    for (const listener of listeners) {
                        listener({ ...event, subject });
                    }
                })
            );
        }

        try {
            const newMarking = engine.apply(transitionName);
            this.markingStore.write(subject, newMarking);
            return newMarking;
        } finally {
            for (const unsub of unsubscribers) unsub();
        }
    }

    on(type: WorkflowEventType, listener: SubjectEventListener<T>): () => void {
        if (!this.listeners.has(type)) this.listeners.set(type, new Set());
        this.listeners.get(type)!.add(listener);
        return () => {
            this.listeners.get(type)?.delete(listener);
        };
    }

    private buildEngine(subject: T): WorkflowEngine {
        const guardEvaluator = this.guardEvaluator;
        const engine = new WorkflowEngine(this.definition, {
            guardEvaluator: guardEvaluator
                ? (expression, { marking, transition }) =>
                      guardEvaluator(expression, { subject, marking, transition })
                : undefined,
        });
        engine.setMarking(this.markingStore.read(subject));
        return engine;
    }
}

export function createWorkflow<T>(
    definition: WorkflowDefinition,
    options: CreateWorkflowOptions<T>
): Workflow<T> {
    return new Workflow(definition, options);
}
