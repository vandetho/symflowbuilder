"use client";

import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import {
    Play,
    RotateCcw,
    X,
    SkipBack,
    Pause,
    ShieldOff,
    Shield,
    FileText,
    ListChecks,
    SearchCode,
    Plus,
    Trash2,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectItem } from "@/components/ui/select";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSimulatorStore, type SimulationStep } from "@/stores/simulator";
import type { FieldPatch, JsonValue, TransitionEffect } from "@/types/simulation";
import { diffPaths } from "@/lib/simulation/apply-effect";
import { SIMULATION_TEMPLATES } from "@/lib/simulation/templates";

function formatJson(value: unknown): string {
    try {
        return JSON.stringify(value, null, 2);
    } catch {
        return "{}";
    }
}

function parseLiteral(input: string): JsonValue {
    const trimmed = input.trim();
    if (trimmed === "") return "";
    if (trimmed === "null") return null;
    if (trimmed === "true") return true;
    if (trimmed === "false") return false;
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
    if (
        (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
        (trimmed.startsWith('"') && trimmed.endsWith('"'))
    ) {
        try {
            return JSON.parse(trimmed);
        } catch {
            return input;
        }
    }
    return input;
}

function formatValue(value: JsonValue): string {
    if (typeof value === "string") return value;
    if (value === null) return "null";
    return JSON.stringify(value);
}

// Re-sync a JSON-textarea draft from a parent value WITHOUT clobbering local
// typing. Returns the draft to display: the current draft if it semantically
// matches the parent (or is mid-edit invalid), otherwise the formatted parent.
// This is what prevents cursor jumps when typing `{` Enter `}` produces valid
// JSON and the parent echoes back a re-stringified version.
function syncJsonDraft(
    current: string,
    parent: JsonValue | undefined,
    treatEmptyAs: JsonValue | undefined = undefined
): string {
    let parsedCurrent: JsonValue | undefined;
    try {
        parsedCurrent = current.trim() === "" ? treatEmptyAs : JSON.parse(current);
    } catch {
        return current; // mid-edit invalid JSON — keep typing intact
    }
    if (JSON.stringify(parsedCurrent) === JSON.stringify(parent)) {
        return current;
    }
    if (parent === undefined) return "";
    return formatJson(parent);
}

function TabButton({
    icon: Icon,
    label,
    active,
    onClick,
    badge,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    active: boolean;
    onClick: () => void;
    badge?: number;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-colors border-b-2 ${
                active
                    ? "text-[var(--accent-bright)] border-[var(--accent-bright)]"
                    : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-secondary)]"
            }`}
        >
            <Icon className="w-3 h-3" />
            {label}
            {badge !== undefined && badge > 0 && (
                <span className="text-[8px] px-1 py-px rounded bg-[var(--accent-dim)] text-[var(--accent-bright)] border border-[var(--accent-border)]">
                    {badge}
                </span>
            )}
        </button>
    );
}

function StepsTab() {
    const {
        marking,
        enabledTransitions,
        history,
        analysis,
        blockedGuards,
        autoPlaying,
        applyTransition,
        toggleGuard,
        engine,
        setSelectedStep,
        setTab,
    } = useSimulatorStore();

    const activePlaces = Object.entries(marking)
        .filter(([, count]) => count > 0)
        .map(([name, count]) => ({ name, count }));

    const isDeadEnd = enabledTransitions.length === 0;

    const guardedTransitions = engine
        ? engine.getDefinition().transitions.filter((t) => t.guard)
        : [];

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
                    Current State
                </span>
                <div className="flex flex-wrap gap-1.5">
                    {activePlaces.map(({ name, count }) => {
                        const pa = analysis?.places[name];
                        const hasXorSplit = pa?.patterns.includes("xor-split");
                        const hasOrSplit = pa?.patterns.includes("or-split");
                        const hasXorJoin = pa?.patterns.includes("xor-join");
                        const hasOrJoin = pa?.patterns.includes("or-join");
                        const patternHint = hasXorSplit
                            ? "XOR"
                            : hasOrSplit
                              ? "OR"
                              : hasXorJoin
                                ? "XOR-JOIN"
                                : hasOrJoin
                                  ? "MERGE"
                                  : null;
                        return (
                            <Badge
                                key={name}
                                variant="default"
                                className="text-[11px] font-mono bg-[var(--success-dim)] text-[var(--success)] border-[var(--success)] gap-1"
                            >
                                {name}
                                {count > 1 && ` ×${count}`}
                                {patternHint && (
                                    <span className="text-[8px] px-1 py-px rounded bg-[var(--warning-dim)] text-[var(--warning)] border border-[rgba(251,191,36,0.2)]">
                                        {patternHint}
                                    </span>
                                )}
                            </Badge>
                        );
                    })}
                    {activePlaces.length === 0 && (
                        <span className="text-[11px] text-[var(--text-disabled)] font-mono">
                            no active places
                        </span>
                    )}
                </div>
            </div>

            {guardedTransitions.length > 0 && (
                <>
                    <Separator />
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
                            Guards
                        </span>
                        <div className="flex flex-col gap-1">
                            {guardedTransitions.map((t) => {
                                const isBlocked = blockedGuards[t.name];
                                return (
                                    <div
                                        key={t.name}
                                        className="flex items-center gap-2 text-[10px] font-mono"
                                    >
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={`h-5 w-5 ${isBlocked ? "text-[var(--danger)]" : "text-[var(--success)]"}`}
                                                    onClick={() => toggleGuard(t.name)}
                                                >
                                                    {isBlocked ? (
                                                        <ShieldOff className="w-3 h-3" />
                                                    ) : (
                                                        <Shield className="w-3 h-3" />
                                                    )}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">
                                                {isBlocked
                                                    ? "Guard is blocked — click to allow"
                                                    : "Guard passes — click to block"}
                                            </TooltipContent>
                                        </Tooltip>
                                        <span
                                            className={
                                                isBlocked
                                                    ? "text-[var(--danger)] line-through"
                                                    : "text-[var(--text-secondary)]"
                                            }
                                        >
                                            {t.name}
                                        </span>
                                        <span className="text-[var(--text-muted)] truncate max-w-[200px]">
                                            {t.guard}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}

            <Separator />

            <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
                    Available Transitions
                </span>
                {isDeadEnd ? (
                    <span className="text-[11px] text-[var(--warning)] font-mono">
                        Dead end — no transitions available
                    </span>
                ) : (
                    <div className="flex flex-wrap gap-1.5">
                        {enabledTransitions.map((t) => {
                            const ta = analysis?.transitions[t.name];
                            const patternLabel =
                                ta?.pattern === "and-join"
                                    ? "AND"
                                    : ta?.pattern === "and-split"
                                      ? "FORK"
                                      : ta?.pattern === "and-split-join"
                                        ? "AND+FORK"
                                        : null;
                            return (
                                <Button
                                    key={t.name}
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-[11px] font-mono border border-[var(--success-dim)] text-[var(--success)] hover:bg-[var(--success-dim)] gap-1"
                                    onClick={() => applyTransition(t.name)}
                                    disabled={autoPlaying}
                                >
                                    {t.name}
                                    {patternLabel && (
                                        <span className="text-[8px] px-1 py-px rounded bg-[var(--accent-dim)] text-[var(--accent-bright)] border border-[var(--accent-border)]">
                                            {patternLabel}
                                        </span>
                                    )}
                                </Button>
                            );
                        })}
                    </div>
                )}
            </div>

            {history.length > 0 && (
                <>
                    <Separator />
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
                            History
                        </span>
                        <div className="flex flex-col gap-0.5 max-h-[140px] overflow-auto">
                            {[...history]
                                .map((step, i) => ({ step, originalIndex: i }))
                                .reverse()
                                .map(({ step, originalIndex }) => {
                                    const fromPlaces = Object.entries(step.fromMarking)
                                        .filter(([, c]) => c > 0)
                                        .map(([n]) => n);
                                    const toPlaces = Object.entries(step.toMarking)
                                        .filter(([, c]) => c > 0)
                                        .map(([n]) => n);
                                    const changedPaths = diffPaths(
                                        step.subjectBefore,
                                        step.subjectAfter
                                    );
                                    return (
                                        <button
                                            type="button"
                                            key={originalIndex}
                                            onClick={() => {
                                                setSelectedStep(originalIndex);
                                                setTab("inspector");
                                            }}
                                            className="text-[10px] font-mono text-[var(--text-secondary)] flex items-center gap-1 hover:bg-[rgba(255,255,255,0.04)] rounded px-1 py-0.5 text-left cursor-pointer"
                                        >
                                            <span className="text-[var(--text-muted)] w-4 text-right shrink-0">
                                                {originalIndex + 1}.
                                            </span>
                                            <span className="text-[var(--accent-bright)]">
                                                {step.transitionName}
                                            </span>
                                            <span className="text-[var(--text-muted)]">
                                                :
                                            </span>
                                            <span>{fromPlaces.join(", ")}</span>
                                            <span className="text-[var(--text-muted)]">
                                                →
                                            </span>
                                            <span>{toPlaces.join(", ")}</span>
                                            {changedPaths.length > 0 && (
                                                <span className="text-[8px] px-1 py-px rounded bg-[var(--success-dim)] text-[var(--success)] border border-[var(--success)]">
                                                    {changedPaths.length} changes
                                                </span>
                                            )}
                                            {step.resolvedRequest && (
                                                <span
                                                    className={`text-[8px] px-1 py-px rounded font-mono ${methodColor(step.resolvedRequest.method)}`}
                                                >
                                                    {step.resolvedRequest.method}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function ScenarioTab() {
    const {
        config,
        engine,
        history,
        setSubject,
        setEffect,
        addEffectPatch,
        updateEffectPatch,
        removeEffectPatch,
        loadTemplate,
    } = useSimulatorStore();

    const [subjectDraft, setSubjectDraft] = useState(() => formatJson(config.subject));
    const [subjectError, setSubjectError] = useState<string | null>(null);

    useEffect(() => {
        // Only re-sync when the external value differs semantically — preserves
        // the user's whitespace and indentation while typing, only resets on
        // template load.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSubjectDraft((current) =>
            syncJsonDraft(current, config.subject as JsonValue, {})
        );
    }, [config.subject]);

    const transitionNames = useMemo(
        () => engine?.getDefinition().transitions.map((t) => t.name) ?? [],
        [engine]
    );

    const handleSubjectChange = (next: string) => {
        setSubjectDraft(next);
        try {
            const parsed = JSON.parse(next || "{}");
            if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
                setSubjectError("Subject must be a JSON object");
                return;
            }
            setSubjectError(null);
            setSubject(parsed);
        } catch (e) {
            setSubjectError(e instanceof Error ? e.message : "Invalid JSON");
        }
    };

    const generateFromPlaces = () => {
        if (!engine) return;
        const places = engine.getDefinition().places.map((p) => p.name);
        const next: Record<string, JsonValue> = { ...config.subject };
        for (const place of places) {
            if (!(place in next)) next[place] = false;
        }
        setSubjectDraft(formatJson(next));
        setSubject(next);
    };

    const matchTemplate = (id: string) => {
        const tpl = SIMULATION_TEMPLATES.find((t) => t.id === id);
        if (!tpl) return;
        loadTemplate(tpl.config);
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 p-3 rounded-[10px] border border-[var(--accent-border)] bg-[var(--accent-dim)]">
                <span className="text-[11px] font-medium text-[var(--accent-bright)]">
                    What is a scenario?
                </span>
                <span className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                    A scenario is the <em>data</em> flowing through your workflow — an
                    article, an order, a document. Define a starting subject, declare how
                    each transition mutates it, and optionally attach a mock API request.
                    Then go to <strong>Steps</strong> to walk through it and{" "}
                    <strong>Inspector</strong> to see the diff.
                </span>
            </div>

            <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
                    Start with a template
                </span>
                <div className="flex flex-col gap-1.5">
                    {SIMULATION_TEMPLATES.map((tpl) => (
                        <button
                            key={tpl.id}
                            type="button"
                            onClick={() => matchTemplate(tpl.id)}
                            className="flex items-start gap-2 p-2 rounded-[10px] border border-[var(--glass-border)] bg-[rgba(255,255,255,0.02)] hover:border-[var(--accent-border)] hover:bg-[var(--accent-dim)] transition-colors text-left"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-bright)] mt-0.5 shrink-0" />
                            <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="text-[11px] font-medium text-[var(--text-primary)]">
                                    {tpl.name}
                                </span>
                                <span className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                                    {tpl.description}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
                        Starting Subject
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[9px] gap-1"
                        onClick={generateFromPlaces}
                    >
                        <Sparkles className="w-3 h-3" />
                        From places
                    </Button>
                </div>
                <Textarea
                    value={subjectDraft}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    rows={6}
                    className="text-[10px]"
                    spellCheck={false}
                    disabled={history.length > 0}
                />
                {subjectError ? (
                    <span className="text-[9px] text-[var(--danger)] font-mono">
                        {subjectError}
                    </span>
                ) : (
                    history.length > 0 && (
                        <span className="text-[9px] text-[var(--text-muted)] font-mono">
                            Reset the simulation to edit the starting subject
                        </span>
                    )
                )}
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
                <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
                    Transition Effects
                </span>
                {transitionNames.length === 0 && (
                    <span className="text-[10px] text-[var(--text-disabled)] font-mono">
                        No transitions defined yet
                    </span>
                )}
                {transitionNames.map((name) => {
                    const effect = config.effects?.[name];
                    const patches = effect?.patches ?? [];
                    return (
                        <div
                            key={name}
                            className="flex flex-col gap-1.5 p-2 rounded-[10px] border border-[var(--glass-border)] bg-[rgba(255,255,255,0.02)]"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-mono text-[var(--accent-bright)]">
                                    {name}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 text-[9px] gap-1"
                                        onClick={() =>
                                            addEffectPatch(name, {
                                                path: "",
                                                value: "",
                                                op: "set",
                                            })
                                        }
                                    >
                                        <Plus className="w-3 h-3" />
                                        Patch
                                    </Button>
                                    {!effect?.mockRequest && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 text-[9px] gap-1"
                                            onClick={() =>
                                                setEffect(name, {
                                                    ...(effect ?? {}),
                                                    mockRequest: {
                                                        method: "POST",
                                                        url: "",
                                                        response: {
                                                            status: 200,
                                                        },
                                                    },
                                                })
                                            }
                                        >
                                            <Plus className="w-3 h-3" />
                                            Request
                                        </Button>
                                    )}
                                </div>
                            </div>
                            {patches.length === 0 && !effect?.mockRequest && (
                                <span className="text-[9px] text-[var(--text-disabled)] font-mono">
                                    No effects — transition only updates the marking
                                </span>
                            )}
                            {patches.map((patch, idx) => (
                                <PatchRow
                                    key={idx}
                                    patch={patch}
                                    onUpdate={(p) => updateEffectPatch(name, idx, p)}
                                    onRemove={() => removeEffectPatch(name, idx)}
                                />
                            ))}
                            {effect?.mockRequest && (
                                <MockRequestEditor
                                    transitionName={name}
                                    request={effect.mockRequest}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function MockRequestEditor({
    transitionName,
    request,
}: {
    transitionName: string;
    request: NonNullable<TransitionEffect["mockRequest"]>;
}) {
    const setEffect = useSimulatorStore((s) => s.setEffect);
    const config = useSimulatorStore((s) => s.config);

    const [bodyDraft, setBodyDraft] = useState(() =>
        request.body === undefined ? "" : formatJson(request.body)
    );
    const [responseDraft, setResponseDraft] = useState(() =>
        request.response?.body === undefined ? "" : formatJson(request.response.body)
    );
    const [bodyError, setBodyError] = useState<string | null>(null);
    const [responseError, setResponseError] = useState<string | null>(null);

    useEffect(() => {
        // Only re-sync drafts when the external value differs semantically.
        // Pressing Enter or typing whitespace inside an in-progress JSON edit
        // no longer wipes the textarea or jumps the cursor.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBodyDraft((current) => syncJsonDraft(current, request.body));
        setResponseDraft((current) => syncJsonDraft(current, request.response?.body));
    }, [request]);

    const updateRequest = (next: typeof request) => {
        const existing = config.effects?.[transitionName] ?? {};
        setEffect(transitionName, { ...existing, mockRequest: next });
    };

    const removeRequest = () => {
        const existing = config.effects?.[transitionName];
        if (!existing) return;
        const { mockRequest: _, ...rest } = existing;
        if ((rest.patches?.length ?? 0) === 0 && !rest.description) {
            setEffect(transitionName, null);
        } else {
            setEffect(transitionName, rest);
        }
    };

    return (
        <div className="flex flex-col gap-1.5 mt-1 p-2 rounded-[8px] bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
            <div className="flex items-center gap-1">
                <Select
                    value={request.method}
                    onChange={(e) =>
                        updateRequest({
                            ...request,
                            method: e.target.value as typeof request.method,
                        })
                    }
                    className="h-7 w-[80px] text-[10px]"
                >
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                </Select>
                <Input
                    value={request.url}
                    onChange={(e) => updateRequest({ ...request, url: e.target.value })}
                    placeholder="/api/path/{{ id }}"
                    className="h-7 text-[10px] flex-1"
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-[var(--text-muted)] hover:text-[var(--danger)]"
                    onClick={removeRequest}
                >
                    <Trash2 className="w-3 h-3" />
                </Button>
            </div>

            <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
                    Request body
                </span>
                <Textarea
                    value={bodyDraft}
                    onChange={(e) => {
                        setBodyDraft(e.target.value);
                        const v = e.target.value.trim();
                        if (v === "") {
                            setBodyError(null);
                            updateRequest({ ...request, body: undefined });
                            return;
                        }
                        try {
                            updateRequest({ ...request, body: JSON.parse(v) });
                            setBodyError(null);
                        } catch (err) {
                            setBodyError(
                                err instanceof Error ? err.message : "Invalid JSON"
                            );
                        }
                    }}
                    rows={3}
                    className="text-[10px]"
                    spellCheck={false}
                    placeholder='{"key": "value"}'
                />
                {bodyError && (
                    <span className="text-[9px] text-[var(--danger)] font-mono">
                        {bodyError}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-1">
                <span className="text-[9px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
                    Status
                </span>
                <Input
                    type="number"
                    value={String(request.response?.status ?? 200)}
                    onChange={(e) =>
                        updateRequest({
                            ...request,
                            response: {
                                ...(request.response ?? {}),
                                status: Number(e.target.value) || 200,
                            },
                        })
                    }
                    className="h-7 w-[80px] text-[10px]"
                />
            </div>

            <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
                    Response body
                </span>
                <Textarea
                    value={responseDraft}
                    onChange={(e) => {
                        setResponseDraft(e.target.value);
                        const v = e.target.value.trim();
                        if (v === "") {
                            setResponseError(null);
                            updateRequest({
                                ...request,
                                response: {
                                    status: request.response?.status ?? 200,
                                },
                            });
                            return;
                        }
                        try {
                            updateRequest({
                                ...request,
                                response: {
                                    status: request.response?.status ?? 200,
                                    body: JSON.parse(v),
                                },
                            });
                            setResponseError(null);
                        } catch (err) {
                            setResponseError(
                                err instanceof Error ? err.message : "Invalid JSON"
                            );
                        }
                    }}
                    rows={3}
                    className="text-[10px]"
                    spellCheck={false}
                    placeholder='{"id": "{{ id }}"}'
                />
                {responseError && (
                    <span className="text-[9px] text-[var(--danger)] font-mono">
                        {responseError}
                    </span>
                )}
            </div>
        </div>
    );
}

function PatchRow({
    patch,
    onUpdate,
    onRemove,
}: {
    patch: FieldPatch;
    onUpdate: (patch: Partial<FieldPatch>) => void;
    onRemove: () => void;
}) {
    const [valueDraft, setValueDraft] = useState(() => formatValue(patch.value));

    useEffect(() => {
        // Re-sync row input when an external value update (template load) lands.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setValueDraft(formatValue(patch.value));
    }, [patch.value]);

    return (
        <div className="flex items-center gap-1">
            <Select
                value={patch.op ?? "set"}
                onChange={(e) => onUpdate({ op: e.target.value as FieldPatch["op"] })}
                className="h-7 w-[70px] text-[10px]"
            >
                <SelectItem value="set">set</SelectItem>
                <SelectItem value="push">push</SelectItem>
                <SelectItem value="remove">del</SelectItem>
            </Select>
            <Input
                value={patch.path}
                onChange={(e) => onUpdate({ path: e.target.value })}
                placeholder="path.to.field"
                className="h-7 text-[10px] flex-1"
            />
            {patch.op !== "remove" && (
                <Input
                    value={valueDraft}
                    onChange={(e) => {
                        setValueDraft(e.target.value);
                        onUpdate({ value: parseLiteral(e.target.value) });
                    }}
                    placeholder='"value"'
                    className="h-7 text-[10px] flex-1"
                />
            )}
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-[var(--text-muted)] hover:text-[var(--danger)]"
                onClick={onRemove}
            >
                <Trash2 className="w-3 h-3" />
            </Button>
        </div>
    );
}

function InspectorTab() {
    const { history, selectedStepIndex, subject, initialSubject } = useSimulatorStore();

    const step = selectedStepIndex !== null ? history[selectedStepIndex] : null;

    if (!step) {
        return (
            <div className="flex flex-col gap-2">
                <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
                    Live Subject
                </span>
                <pre className="text-[10px] font-mono leading-relaxed text-[var(--text-secondary)] bg-[rgba(255,255,255,0.02)] rounded-[10px] border border-[var(--glass-border)] p-2 overflow-auto max-h-[260px] whitespace-pre-wrap">
                    {formatJson(history.length === 0 ? initialSubject : subject)}
                </pre>
                <span className="text-[9px] text-[var(--text-disabled)] font-mono">
                    Click a history step to inspect its before/after payload
                </span>
            </div>
        );
    }

    const changedPaths = new Set(diffPaths(step.subjectBefore, step.subjectAfter));

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
                    Step {(selectedStepIndex ?? 0) + 1} ·{" "}
                    <span className="text-[var(--accent-bright)]">
                        {step.transitionName}
                    </span>
                </span>
            </div>
            {step.effect?.description && (
                <span className="text-[10px] text-[var(--text-secondary)] italic">
                    {step.effect.description}
                </span>
            )}

            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
                        Before
                    </span>
                    <DiffJson value={step.subjectBefore} changedPaths={changedPaths} />
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-[var(--success)] font-mono uppercase tracking-wider">
                        After
                    </span>
                    <DiffJson
                        value={step.subjectAfter}
                        changedPaths={changedPaths}
                        highlight
                    />
                </div>
            </div>

            {step.resolvedRequest && (
                <>
                    <Separator />
                    <MockRequestView request={step.resolvedRequest} />
                </>
            )}

            {step.events.length > 0 && (
                <>
                    <Separator />
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
                            Events Fired
                        </span>
                        <div className="flex flex-wrap gap-1">
                            {step.events.map((evt, i) => (
                                <Badge
                                    key={i}
                                    variant="default"
                                    className="text-[9px] font-mono bg-[var(--accent-dim)] text-[var(--accent-bright)] border-[var(--accent-border)]"
                                >
                                    {evt.type}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function methodColor(method: string): string {
    switch (method) {
        case "GET":
            return "bg-[var(--accent-dim)] text-[var(--accent-bright)] border-[var(--accent-border)]";
        case "POST":
            return "bg-[var(--success-dim)] text-[var(--success)] border-[var(--success)]";
        case "PUT":
        case "PATCH":
            return "bg-[var(--warning-dim)] text-[var(--warning)] border-[rgba(251,191,36,0.2)]";
        case "DELETE":
            return "bg-[rgba(248,113,113,0.1)] text-[var(--danger)] border-[rgba(248,113,113,0.2)]";
        default:
            return "bg-[var(--glass-base)] text-[var(--text-secondary)] border-[var(--glass-border)]";
    }
}

function statusColor(status: number): string {
    if (status >= 200 && status < 300)
        return "text-[var(--success)] border-[var(--success)] bg-[var(--success-dim)]";
    if (status >= 400)
        return "text-[var(--danger)] border-[rgba(248,113,113,0.2)] bg-[rgba(248,113,113,0.1)]";
    return "text-[var(--warning)] border-[rgba(251,191,36,0.2)] bg-[var(--warning-dim)]";
}

function MockRequestView({
    request,
}: {
    request: NonNullable<SimulationStep["resolvedRequest"]>;
}) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
                <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
                    Mock Request
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge
                        variant="default"
                        className={`text-[9px] font-mono ${methodColor(request.method)}`}
                    >
                        {request.method}
                    </Badge>
                    <span className="text-[10px] font-mono text-[var(--text-secondary)] truncate flex-1 min-w-0">
                        {request.url || "—"}
                    </span>
                </div>
                {request.body !== undefined && (
                    <pre className="text-[10px] font-mono leading-relaxed text-[var(--text-secondary)] bg-[rgba(255,255,255,0.02)] rounded-[10px] border border-[var(--glass-border)] p-2 overflow-auto max-h-[120px] whitespace-pre-wrap">
                        {formatJson(request.body)}
                    </pre>
                )}
            </div>

            {request.response && (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
                            Mock Response
                        </span>
                        <Badge
                            variant="default"
                            className={`text-[9px] font-mono ${statusColor(request.response.status)}`}
                        >
                            {request.response.status}
                        </Badge>
                    </div>
                    {request.response.body !== undefined && (
                        <pre className="text-[10px] font-mono leading-relaxed text-[var(--text-secondary)] bg-[rgba(255,255,255,0.02)] rounded-[10px] border border-[var(--glass-border)] p-2 overflow-auto max-h-[120px] whitespace-pre-wrap">
                            {formatJson(request.response.body)}
                        </pre>
                    )}
                </div>
            )}
        </div>
    );
}

function DiffJson({
    value,
    changedPaths,
    highlight = false,
}: {
    value: Record<string, JsonValue>;
    changedPaths: Set<string>;
    highlight?: boolean;
}) {
    return (
        <pre className="text-[10px] font-mono leading-relaxed bg-[rgba(255,255,255,0.02)] rounded-[10px] border border-[var(--glass-border)] p-2 overflow-auto max-h-[180px] whitespace-pre-wrap break-all">
            {Object.entries(value).map(([k, v]) => {
                const isChanged = [...changedPaths].some(
                    (p) => p === k || p.startsWith(`${k}.`)
                );
                return (
                    <div
                        key={k}
                        className={
                            isChanged
                                ? highlight
                                    ? "text-[var(--success)] break-all"
                                    : "text-[var(--warning)] break-all"
                                : "text-[var(--text-secondary)] break-all"
                        }
                    >
                        <span className="text-[var(--text-muted)]">{k}:</span>{" "}
                        {JSON.stringify(v)}
                    </div>
                );
            })}
        </pre>
    );
}

export function SimulatorPanel() {
    const {
        active,
        tab,
        history,
        autoPlaying,
        autoPlaySpeed,
        applyTransition,
        reset,
        stepBack,
        deactivate,
        toggleAutoPlay,
        setAutoPlaySpeed,
        setTab,
        enabledTransitions,
    } = useSimulatorStore();

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const autoStep = useCallback(() => {
        const enabled = useSimulatorStore.getState().enabledTransitions;
        if (enabled.length === 0) {
            useSimulatorStore.getState().toggleAutoPlay();
            return;
        }
        const random = enabled[Math.floor(Math.random() * enabled.length)];
        applyTransition(random.name);
    }, [applyTransition]);

    useEffect(() => {
        if (autoPlaying) {
            // Fire one step immediately so the user gets feedback without
            // waiting for the first interval tick.
            autoStep();
            intervalRef.current = setInterval(autoStep, autoPlaySpeed);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [autoPlaying, autoPlaySpeed, autoStep]);

    if (!active) return null;

    const isDeadEnd = enabledTransitions.length === 0;

    return (
        <div className="absolute top-16 right-4 bottom-4 z-20 w-[440px] bg-[#12121f] border border-[var(--glass-border)] rounded-[18px] flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-2">
                    <Play className="w-3.5 h-3.5 text-[var(--success)]" />
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                        Simulator
                    </span>
                    <Badge
                        variant="default"
                        className="text-[9px] bg-[var(--success-dim)] text-[var(--success)] border-[var(--success)]"
                    >
                        {history.length} steps
                    </Badge>
                </div>
                <div className="flex items-center gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={reset}
                                disabled={history.length === 0}
                            >
                                <RotateCcw className="w-3 h-3" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            Restart from initial state
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={deactivate}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Close simulator</TooltipContent>
                    </Tooltip>
                </div>
            </div>

            <div className="flex border-b border-[var(--glass-border)]">
                <TabButton
                    icon={ListChecks}
                    label="Steps"
                    active={tab === "steps"}
                    onClick={() => setTab("steps")}
                    badge={history.length}
                />
                <TabButton
                    icon={FileText}
                    label="Scenario"
                    active={tab === "scenario"}
                    onClick={() => setTab("scenario")}
                />
                <TabButton
                    icon={SearchCode}
                    label="Inspector"
                    active={tab === "inspector"}
                    onClick={() => setTab("inspector")}
                />
            </div>

            <div className="flex-1 overflow-auto p-4">
                {tab === "steps" && <StepsTab />}
                {tab === "scenario" && <ScenarioTab />}
                {tab === "inspector" && <InspectorTab />}
            </div>

            <div className="flex items-center gap-2 px-4 py-2.5 border-t border-[var(--glass-border)]">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[10px] gap-1"
                    onClick={stepBack}
                    disabled={history.length === 0}
                >
                    <SkipBack className="w-3 h-3" />
                    Step Back
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[10px] gap-1"
                    onClick={reset}
                    disabled={history.length === 0}
                >
                    <RotateCcw className="w-3 h-3" />
                    Restart
                </Button>

                <div className="flex-1" />

                <Select
                    value={String(autoPlaySpeed)}
                    onChange={(e) => setAutoPlaySpeed(Number(e.target.value))}
                    className="h-7 w-auto text-[10px]"
                >
                    <SelectItem value="500">0.5s</SelectItem>
                    <SelectItem value="1000">1s</SelectItem>
                    <SelectItem value="2000">2s</SelectItem>
                </Select>

                <Button
                    variant="ghost"
                    size="sm"
                    className={`h-7 text-[10px] gap-1 ${autoPlaying ? "text-[var(--warning)]" : "text-[var(--success)]"}`}
                    onClick={toggleAutoPlay}
                    disabled={isDeadEnd}
                >
                    {autoPlaying ? (
                        <Pause className="w-3 h-3" />
                    ) : (
                        <Play className="w-3 h-3" />
                    )}
                    {autoPlaying ? "Pause" : "Auto-play"}
                </Button>
            </div>
        </div>
    );
}
