import { create } from "zustand";
import type { Node, Edge } from "@xyflow/react";
import type { WorkflowMeta } from "@symflowbuilder/core";
import {
    WorkflowEngine,
    buildDefinition,
    validateDefinition,
    analyzeWorkflow,
    type Marking,
    type Transition,
    type ValidationResult,
    type WorkflowAnalysis,
} from "@symflowbuilder/core";

export interface SimulationStep {
    transitionName: string;
    fromMarking: Marking;
    toMarking: Marking;
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
}

export const useSimulatorStore = create<SimulatorStore>((set, get) => ({
    active: false,
    engine: null,
    marking: {},
    enabledTransitions: [],
    history: [],
    validation: null,
    analysis: null,
    autoPlaying: false,
    autoPlaySpeed: 1000,

    initialize: (nodes, edges, meta) => {
        const definition = buildDefinition(nodes, edges, meta);
        const validation = validateDefinition(definition);
        const analysis = analyzeWorkflow(definition);
        const engine = new WorkflowEngine(definition);

        set({
            engine,
            marking: engine.getMarking(),
            enabledTransitions: engine.getEnabledTransitions(),
            history: [],
            validation,
            analysis,
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
            autoPlaying: false,
        }),

    applyTransition: (transitionName) => {
        const { engine } = get();
        if (!engine) return;

        const fromMarking = engine.getMarking();
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
                        timestamp: Date.now(),
                    },
                ],
            }));
        } catch {
            // Transition failed — refresh enabled transitions
            set({ enabledTransitions: engine.getEnabledTransitions() });
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

    toggleAutoPlay: () => {
        set((state) => ({ autoPlaying: !state.autoPlaying }));
    },

    setAutoPlaySpeed: (ms) => set({ autoPlaySpeed: ms }),
}));
