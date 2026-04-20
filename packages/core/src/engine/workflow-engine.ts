import type {
    WorkflowDefinition,
    Marking,
    Transition,
    TransitionResult,
    TransitionBlocker,
    WorkflowEventType,
    WorkflowEventListener,
    WorkflowEvent,
    GuardEvaluator,
} from "./types";

const defaultGuardEvaluator: GuardEvaluator = () => true;

export class WorkflowEngine {
    private definition: WorkflowDefinition;
    private marking: Marking;
    private listeners = new Map<WorkflowEventType, Set<WorkflowEventListener>>();
    private guardEvaluator: GuardEvaluator;
    private placeNames: Set<string>;

    constructor(
        definition: WorkflowDefinition,
        options?: { guardEvaluator?: GuardEvaluator }
    ) {
        this.definition = definition;
        this.guardEvaluator = options?.guardEvaluator ?? defaultGuardEvaluator;
        this.placeNames = new Set(definition.places.map((p) => p.name));
        this.marking = this.buildInitialMarking();
    }

    private buildInitialMarking(): Marking {
        const marking: Marking = {};
        for (const place of this.definition.places) {
            marking[place.name] = 0;
        }
        for (const place of this.definition.initialMarking) {
            if (this.placeNames.has(place)) {
                marking[place] = 1;
            }
        }
        return marking;
    }

    getDefinition(): WorkflowDefinition {
        return this.definition;
    }

    getMarking(): Marking {
        return { ...this.marking };
    }

    setMarking(marking: Marking): void {
        this.marking = { ...marking };
    }

    getInitialMarking(): Marking {
        return this.buildInitialMarking();
    }

    /** Returns the names of all currently active places (token count > 0) */
    getActivePlaces(): string[] {
        return Object.entries(this.marking)
            .filter(([, count]) => count > 0)
            .map(([name]) => name);
    }

    /** Returns all transitions that can fire from the current marking */
    getEnabledTransitions(): Transition[] {
        return this.definition.transitions.filter((t) => this.can(t.name).allowed);
    }

    /** Check if a specific transition can fire */
    can(transitionName: string): TransitionResult {
        const transition = this.definition.transitions.find(
            (t) => t.name === transitionName
        );
        if (!transition) {
            return {
                allowed: false,
                blockers: [
                    {
                        code: "unknown_transition",
                        message: `Transition "${transitionName}" does not exist`,
                    },
                ],
            };
        }

        const blockers: TransitionBlocker[] = [];

        // For state_machine: exactly one place should be active
        if (this.definition.type === "state_machine") {
            const activePlaces = this.getActivePlaces();
            if (activePlaces.length !== 1) {
                blockers.push({
                    code: "invalid_marking",
                    message: `State machine must have exactly one active place, found ${activePlaces.length}`,
                });
                return { allowed: false, blockers };
            }
            if (!transition.froms.includes(activePlaces[0])) {
                blockers.push({
                    code: "not_in_place",
                    message: `Current state "${activePlaces[0]}" is not in transition's from places`,
                });
                return { allowed: false, blockers };
            }
        } else {
            // For workflow: all from-places must have at least one token
            for (const from of transition.froms) {
                if ((this.marking[from] ?? 0) < 1) {
                    blockers.push({
                        code: "not_in_place",
                        message: `Place "${from}" is not marked`,
                    });
                }
            }
        }

        if (blockers.length > 0) {
            return { allowed: false, blockers };
        }

        // Evaluate guard
        if (transition.guard) {
            const guardPassed = this.guardEvaluator(transition.guard, {
                marking: this.getMarking(),
                transition,
            });
            if (!guardPassed) {
                blockers.push({
                    code: "guard_blocked",
                    message: `Guard "${transition.guard}" blocked the transition`,
                });
                return { allowed: false, blockers };
            }
        }

        return { allowed: true, blockers: [] };
    }

    /** Apply a transition and return the new marking */
    apply(transitionName: string): Marking {
        const result = this.can(transitionName);
        if (!result.allowed) {
            throw new Error(
                `Cannot apply transition "${transitionName}": ${result.blockers.map((b) => b.message).join(", ")}`
            );
        }

        const transition = this.definition.transitions.find(
            (t) => t.name === transitionName
        )!;

        // Fire events in Symfony order:
        // https://symfony.com/doc/current/workflow.html#using-events

        // 1. Guard (already checked in can(), but fire the event)
        this.emit("guard", transition);

        // 2. Leave — fire per from-place, then remove tokens
        for (let i = 0; i < transition.froms.length; i++) {
            this.emit("leave", transition);
        }
        for (const from of transition.froms) {
            this.marking[from] = Math.max(0, (this.marking[from] ?? 0) - 1);
        }

        // 3. Transition
        this.emit("transition", transition);

        // 4. Enter — fire BEFORE marking update (subject not yet in new place)
        for (let i = 0; i < transition.tos.length; i++) {
            this.emit("enter", transition);
        }

        // 5. Update marking (add tokens to target places)
        for (const to of transition.tos) {
            this.marking[to] = (this.marking[to] ?? 0) + 1;
        }

        // 6. Entered — fire AFTER marking update (subject is now in new place)
        this.emit("entered", transition);

        // 7. Completed
        this.emit("completed", transition);

        // 8. Announce — fire for each newly enabled transition
        const enabled = this.getEnabledTransitions();
        for (let i = 0; i < enabled.length; i++) {
            this.emit("announce", transition);
        }

        return this.getMarking();
    }

    /** Reset marking to initial state */
    reset(): void {
        this.marking = this.buildInitialMarking();
    }

    /** Register an event listener. Returns an unsubscribe function. */
    on(type: WorkflowEventType, listener: WorkflowEventListener): () => void {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type)!.add(listener);
        return () => {
            this.listeners.get(type)?.delete(listener);
        };
    }

    private emit(type: WorkflowEventType, transition: Transition): void {
        const event: WorkflowEvent = {
            type,
            transition,
            marking: this.getMarking(),
            workflowName: this.definition.name,
        };
        this.listeners.get(type)?.forEach((listener) => listener(event));
    }
}
