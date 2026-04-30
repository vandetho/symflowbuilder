import { create } from "zustand";
import type { Node, Edge } from "@xyflow/react";
import type { WorkflowMeta } from "symflow";
import {
    WorkflowEngine,
    validateDefinition,
    analyzeWorkflow,
    type Marking,
    type Transition,
    type ValidationResult,
    type WorkflowAnalysis,
    type WorkflowEvent,
} from "symflow/engine";
import { buildDefinition } from "symflow/react-flow";
import type {
    FieldPatch,
    JsonValue,
    MockRequest,
    SimulationConfig,
    TransitionEffect,
} from "@/types/simulation";
import {
    applyEffect,
    deepClone,
    ensureConfig,
    resolveMockRequest,
} from "@/lib/simulation/apply-effect";

export interface SimulationStep {
    transitionName: string;
    fromMarking: Marking;
    toMarking: Marking;
    events: WorkflowEvent[];
    timestamp: number;
    subjectBefore: Record<string, JsonValue>;
    subjectAfter: Record<string, JsonValue>;
    effect?: TransitionEffect;
    resolvedRequest?: MockRequest;
}

export type SimulatorTab = "steps" | "scenario" | "inspector";

interface SimulatorStore {
    // Mode
    active: boolean;
    tab: SimulatorTab;

    // Engine
    engine: WorkflowEngine | null;
    meta: WorkflowMeta | null;

    // State
    marking: Marking;
    enabledTransitions: Transition[];
    history: SimulationStep[];
    validation: ValidationResult | null;
    analysis: WorkflowAnalysis | null;

    // Guard overrides: transition name → blocked (true = guard blocks)
    blockedGuards: Record<string, boolean>;

    // Scenario
    config: SimulationConfig;
    initialSubject: Record<string, JsonValue>;
    subject: Record<string, JsonValue>;
    selectedStepIndex: number | null;
    configDirty: boolean;

    // Auto-play
    autoPlaying: boolean;
    autoPlaySpeed: number;

    // Actions
    initialize: (
        nodes: Node[],
        edges: Edge[],
        meta: WorkflowMeta,
        config?: SimulationConfig | null
    ) => void;
    activate: () => void;
    deactivate: () => void;
    applyTransition: (transitionName: string) => void;
    reset: () => void;
    stepBack: () => void;
    toggleAutoPlay: () => void;
    setAutoPlaySpeed: (ms: number) => void;
    toggleGuard: (transitionName: string) => void;
    setTab: (tab: SimulatorTab) => void;
    setSelectedStep: (index: number | null) => void;
    setSubject: (subject: Record<string, JsonValue>) => void;
    setEffect: (transitionName: string, effect: TransitionEffect | null) => void;
    addEffectPatch: (transitionName: string, patch: FieldPatch) => void;
    updateEffectPatch: (
        transitionName: string,
        index: number,
        patch: Partial<FieldPatch>
    ) => void;
    removeEffectPatch: (transitionName: string, index: number) => void;
    loadTemplate: (config: SimulationConfig) => void;
    markConfigSaved: () => void;
}

function markingValue(marking: Marking, type: WorkflowMeta["type"]): JsonValue {
    const places = Object.entries(marking)
        .filter(([, count]) => count > 0)
        .map(([name]) => name);
    if (type === "state_machine") return places[0] ?? null;
    return places;
}

function injectMarking(
    subject: Record<string, JsonValue>,
    marking: Marking,
    meta: WorkflowMeta | null
): Record<string, JsonValue> {
    if (!meta?.property) return subject;
    return {
        ...subject,
        [meta.property]: markingValue(marking, meta.type),
    };
}

export const useSimulatorStore = create<SimulatorStore>((set, get) => ({
    active: false,
    tab: "steps",
    engine: null,
    meta: null,
    marking: {},
    enabledTransitions: [],
    history: [],
    validation: null,
    analysis: null,
    blockedGuards: {},
    config: { subject: {}, effects: {} },
    initialSubject: {},
    subject: {},
    selectedStepIndex: null,
    configDirty: false,
    autoPlaying: false,
    autoPlaySpeed: 1000,

    initialize: (nodes, edges, meta, config) => {
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

        const fullConfig = ensureConfig(config);
        const startMarking = engine.getMarking();
        const initialSubject = injectMarking(
            deepClone(fullConfig.subject),
            startMarking,
            meta
        );

        set({
            engine,
            meta,
            marking: startMarking,
            enabledTransitions: engine.getEnabledTransitions(),
            history: [],
            validation,
            analysis,
            blockedGuards,
            config: fullConfig,
            initialSubject,
            subject: deepClone(initialSubject),
            selectedStepIndex: null,
            configDirty: false,
        });
    },

    activate: () => set({ active: true }),

    deactivate: () =>
        set({
            active: false,
            engine: null,
            meta: null,
            marking: {},
            enabledTransitions: [],
            history: [],
            validation: null,
            analysis: null,
            blockedGuards: {},
            autoPlaying: false,
            selectedStepIndex: null,
            tab: "steps",
        }),

    applyTransition: (transitionName) => {
        const { engine, subject, config, meta } = get();
        if (!engine) return;

        const fromMarking = engine.getMarking();
        const subjectBefore = deepClone(subject);

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
            const effect = config.effects?.[transitionName];
            const patched = applyEffect(subjectBefore, effect);
            // Mirror Symfony's marking_store behavior: write the new marking
            // into subject[meta.property] so the Inspector diff shows the
            // state change as data, not just on the canvas.
            const subjectAfter = injectMarking(patched, toMarking, meta);
            const resolvedRequest = resolveMockRequest(
                effect?.mockRequest,
                subjectBefore
            );

            set((state) => ({
                marking: toMarking,
                enabledTransitions: engine.getEnabledTransitions(),
                subject: subjectAfter,
                history: [
                    ...state.history,
                    {
                        transitionName,
                        fromMarking,
                        toMarking,
                        events: firedEvents,
                        timestamp: Date.now(),
                        subjectBefore,
                        subjectAfter,
                        effect,
                        resolvedRequest,
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
        const { engine, initialSubject, meta } = get();
        if (!engine) return;
        engine.reset();
        const startMarking = engine.getMarking();
        set({
            marking: startMarking,
            enabledTransitions: engine.getEnabledTransitions(),
            history: [],
            autoPlaying: false,
            subject: injectMarking(deepClone(initialSubject), startMarking, meta),
            selectedStepIndex: null,
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
            subject: deepClone(prev.subjectBefore),
            selectedStepIndex: null,
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
        set((state) => ({
            autoPlaying: !state.autoPlaying,
            // Surface the action: when starting auto-play from another tab,
            // jump to Steps so the user sees the marking and history change.
            tab: !state.autoPlaying ? "steps" : state.tab,
        }));
    },

    setAutoPlaySpeed: (ms) => set({ autoPlaySpeed: ms }),

    setTab: (tab) => set({ tab }),

    setSelectedStep: (index) => set({ selectedStepIndex: index }),

    setSubject: (subject) =>
        set((state) => {
            const cleaned = deepClone(subject);
            const initialSubject = injectMarking(
                deepClone(subject),
                state.marking,
                state.meta
            );
            return {
                config: { ...state.config, subject: cleaned },
                initialSubject,
                subject:
                    state.history.length === 0
                        ? deepClone(initialSubject)
                        : state.subject,
                configDirty: true,
            };
        }),

    setEffect: (transitionName, effect) =>
        set((state) => {
            const effects = { ...(state.config.effects ?? {}) };
            if (effect === null) delete effects[transitionName];
            else effects[transitionName] = effect;
            return {
                config: { ...state.config, effects },
                configDirty: true,
            };
        }),

    addEffectPatch: (transitionName, patch) =>
        set((state) => {
            const effects = { ...(state.config.effects ?? {}) };
            const existing = effects[transitionName] ?? {};
            effects[transitionName] = {
                ...existing,
                patches: [...(existing.patches ?? []), patch],
            };
            return {
                config: { ...state.config, effects },
                configDirty: true,
            };
        }),

    updateEffectPatch: (transitionName, index, patch) =>
        set((state) => {
            const effects = { ...(state.config.effects ?? {}) };
            const existing = effects[transitionName];
            if (!existing?.patches) return state;
            const patches = existing.patches.map((p, i) =>
                i === index ? { ...p, ...patch } : p
            );
            effects[transitionName] = { ...existing, patches };
            return {
                config: { ...state.config, effects },
                configDirty: true,
            };
        }),

    removeEffectPatch: (transitionName, index) =>
        set((state) => {
            const effects = { ...(state.config.effects ?? {}) };
            const existing = effects[transitionName];
            if (!existing?.patches) return state;
            const patches = existing.patches.filter((_, i) => i !== index);
            effects[transitionName] = { ...existing, patches };
            return {
                config: { ...state.config, effects },
                configDirty: true,
            };
        }),

    loadTemplate: (config) => {
        const { engine, meta } = get();
        if (engine) engine.reset();
        const startMarking = engine ? engine.getMarking() : {};
        const initialSubject = injectMarking(
            deepClone(config.subject),
            startMarking,
            meta
        );
        set({
            config: ensureConfig(config),
            initialSubject,
            subject: deepClone(initialSubject),
            history: [],
            selectedStepIndex: null,
            configDirty: true,
            marking: startMarking,
            enabledTransitions: engine ? engine.getEnabledTransitions() : [],
            autoPlaying: false,
        });
    },

    markConfigSaved: () => set({ configDirty: false }),
}));
