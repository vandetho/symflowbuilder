"use client";

import { useEffect, useRef, useCallback } from "react";
import { Play, RotateCcw, X, SkipBack, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectItem } from "@/components/ui/select";
import { useSimulatorStore } from "@/stores/simulator";

export function SimulatorPanel() {
    const {
        active,
        marking,
        enabledTransitions,
        history,
        analysis,
        autoPlaying,
        autoPlaySpeed,
        applyTransition,
        reset,
        stepBack,
        deactivate,
        toggleAutoPlay,
        setAutoPlaySpeed,
    } = useSimulatorStore();

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Auto-play logic
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

    const activePlaces = Object.entries(marking)
        .filter(([, count]) => count > 0)
        .map(([name, count]) => ({ name, count }));

    const isDeadEnd = enabledTransitions.length === 0;

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[480px] max-h-[360px] bg-[#12121f] border border-[var(--glass-border)] rounded-[18px] flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
            {/* Header */}
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
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={reset}
                    >
                        <RotateCcw className="w-3 h-3" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={deactivate}
                    >
                        <X className="w-3 h-3" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4 flex flex-col gap-3">
                {/* Current marking */}
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

                <Separator />

                {/* Available transitions */}
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

                {/* History */}
                {history.length > 0 && (
                    <>
                        <Separator />
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
                                History
                            </span>
                            <div className="flex flex-col gap-0.5 max-h-[100px] overflow-auto">
                                {[...history].reverse().map((step, i) => {
                                    const fromPlaces = Object.entries(step.fromMarking)
                                        .filter(([, c]) => c > 0)
                                        .map(([n]) => n);
                                    const toPlaces = Object.entries(step.toMarking)
                                        .filter(([, c]) => c > 0)
                                        .map(([n]) => n);
                                    return (
                                        <div
                                            key={history.length - i}
                                            className="text-[10px] font-mono text-[var(--text-secondary)] flex items-center gap-1"
                                        >
                                            <span className="text-[var(--text-muted)] w-4 text-right shrink-0">
                                                {history.length - i}.
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
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Footer controls */}
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
