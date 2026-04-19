import { create } from "zustand";
import type { Node, Edge } from "@xyflow/react";
import type { WorkflowMeta } from "@/types/workflow";
import {
    WorkflowEngine,
    buildDefinition,
    validateDefinition,
    analyzeWorkflow,
    type Marking,
    type Transition,
    type ValidationResult,
    type WorkflowAnalysis,
    type WorkflowEvent,
} from "@/lib/engine";

export interface SimulationStep {
    transitionName: string;
    fromMarking: Marking;
    toMarking: Marking;
    events: WorkflowEvent[];
    timestamp: number;
}

interface SimulatorStore {
    // Mode
    active: boolean;

    // Engine
    engine: WorkflowEngine | null;

    // State
    marking: Marking;
    enabledTransitions: Transition[];
    history: SimulationStep[];
    validation: ValidationResult | null;
    analysis: WorkflowAnalysis | null;

    // Guard overrides: transition name → blocked (true = guard blocks)
    blockedGuards: Record<string, boolean>;

    // Auto-play
    autoPlaying: boolean;
    autoPlaySpeed: number;

    // Actions
    initialize: (nodes: Node[], edges: Edge[], meta: WorkflowMeta) => void;
    activate: () => void;
    deactivate: () => void;
    applyTransition: (transitionName: string) => void;
    reset: () => void;
    stepBack: () => void;
    toggleAutoPlay: () => void;
    setAutoPlaySpeed: (ms: number) => void;
    toggleGuard: (transitionName: string) => void;
}

export const useSimulatorStore = create<SimulatorStore>((set, get) => ({
    active: false,
    engine: null,
    marking: {},
    enabledTransitions: [],
    history: [],
    validation: null,
    analysis: null,
    blockedGuards: {},
    autoPlaying: false,
    autoPlaySpeed: 1000,

    initialize: (nodes, edges, meta) => {
        const definition = buildDefinition(nodes, edges, meta);
        const validation = validateDefinition(definition);
        const analysis = analyzeWorkflow(definition);

        // Build initial guard block state (all guards pass by default)
        const blockedGuards: Record<string, boolean> = {};
        for (const t of definition.transitions) {
            if (t.guard) {
                blockedGuards[t.name] = false;
            }
        }

        const engine = new WorkflowEngine(definition, {
            guardEvaluator: (_expr, ctx) => {
                const current = get().blockedGuards;
                return !current[ctx.transition.name];
            },
        });

        set({
            engine,
            marking: engine.getMarking(),
            enabledTransitions: engine.getEnabledTransitions(),
            history: [],
            validation,
            analysis,
            blockedGuards,
        });
    },

    activate: () => set({ active: true }),

    deactivate: () =>
        set({
            active: false,
            engine: null,
            marking: {},
            enabledTransitions: [],
            history: [],
            validation: null,
            analysis: null,
            blockedGuards: {},
            autoPlaying: false,
        }),

    applyTransition: (transitionName) => {
        const { engine } = get();
        if (!engine) return;

        const fromMarking = engine.getMarking();

        // Collect events fired during this transition
        const firedEvents: WorkflowEvent[] = [];
        const unsubs = (
            [
                "guard",
                "leave",
                "transition",
                "enter",
                "entered",
                "completed",
                "announce",
            ] as const
        ).map((type) => engine.on(type, (event) => firedEvents.push(event)));

        try {
            const toMarking = engine.apply(transitionName);
            set((state) => ({
                marking: toMarking,
                enabledTransitions: engine.getEnabledTransitions(),
                history: [
                    ...state.history,
                    {
                        transitionName,
                        fromMarking,
                        toMarking,
                        events: firedEvents,
                        timestamp: Date.now(),
                    },
                ],
            }));
        } catch {
            set({ enabledTransitions: engine.getEnabledTransitions() });
        } finally {
            unsubs.forEach((unsub) => unsub());
        }
    },

    reset: () => {
        const { engine } = get();
        if (!engine) return;
        engine.reset();
        set({
            marking: engine.getMarking(),
            enabledTransitions: engine.getEnabledTransitions(),
            history: [],
            autoPlaying: false,
        });
    },

    stepBack: () => {
        const { engine, history } = get();
        if (!engine || history.length === 0) return;

        const prev = history[history.length - 1];
        engine.setMarking(prev.fromMarking);
        set({
            marking: prev.fromMarking,
            enabledTransitions: engine.getEnabledTransitions(),
            history: history.slice(0, -1),
        });
    },

    toggleGuard: (transitionName) => {
        const { engine, blockedGuards } = get();
        const updated = {
            ...blockedGuards,
            [transitionName]: !blockedGuards[transitionName],
        };
        set({ blockedGuards: updated });

        // Re-evaluate enabled transitions with new guard state
        if (engine) {
            set({ enabledTransitions: engine.getEnabledTransitions() });
        }
    },

    toggleAutoPlay: () => {
        set((state) => ({ autoPlaying: !state.autoPlaying }));
    },

    setAutoPlaySpeed: (ms) => set({ autoPlaySpeed: ms }),
}));
