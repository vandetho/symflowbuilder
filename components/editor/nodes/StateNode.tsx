"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { StateNodeData } from "@/types/workflow";
import { useSimulatorStore } from "@/stores/simulator";

export const StateNode = memo(
    ({ data, selected }: NodeProps & { data: StateNodeData }) => {
        const simActive = useSimulatorStore((s) => s.active);
        const tokenCount = useSimulatorStore((s) =>
            s.active ? (s.marking[data.label] ?? 0) : 0
        );
        const isMarked = simActive && tokenCount > 0;
        const isDimmed = simActive && tokenCount === 0;

        const bgColor = data.metadata?.bg_color;
        const description = data.metadata?.description;
        // Count metadata excluding Symfony styling keys
        const extraMetaCount = Object.keys(data.metadata).filter(
            (k) => k !== "bg_color" && k !== "description"
        ).length;

        return (
            <div
                className={`
          relative min-w-[140px] rounded-[14px]
          border transition-all duration-150
          ${
              isMarked
                  ? "border-[var(--success)]"
                  : selected
                    ? "border-[var(--accent-bright)] shadow-[0_0_0_2px_var(--accent-glow)]"
                    : "border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]"
          }
        `}
                style={{
                    backgroundColor: bgColor
                        ? `color-mix(in srgb, ${bgColor} 25%, #12121f)`
                        : selected
                          ? "#1a1a2e"
                          : "#12121f",
                    borderLeftColor: bgColor || undefined,
                    borderLeftWidth: bgColor ? 3 : undefined,
                    opacity: isDimmed ? 0.35 : 1,
                    animation: isMarked
                        ? "pulse-glow 2s ease-in-out infinite"
                        : undefined,
                }}
            >
                {data.isInitial && (
                    <div className="absolute top-0 left-4 right-4 h-[2px] rounded-full bg-[var(--accent)]" />
                )}

                <div className="flex items-center gap-2 px-3 pt-3 pb-2">
                    <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                            backgroundColor:
                                bgColor ||
                                (data.isInitial
                                    ? "var(--accent)"
                                    : "rgba(255,255,255,0.25)"),
                        }}
                    />
                    <span className="text-[13px] font-medium text-[var(--text-primary)] font-mono leading-none flex-1 truncate">
                        {data.label}
                    </span>
                    {data.isFinal && (
                        <span className="text-[10px] text-[var(--success)] border border-[var(--success-dim)] bg-[var(--success-dim)] px-1.5 py-0.5 rounded-md font-mono">
                            final
                        </span>
                    )}
                </div>

                {description && (
                    <div className="px-3 pb-1">
                        <span className="text-[10px] text-[var(--text-secondary)] leading-tight line-clamp-2">
                            {description}
                        </span>
                    </div>
                )}

                <div className="mx-3 h-px bg-[rgba(255,255,255,0.07)]" />

                <div className="px-3 py-2">
                    {extraMetaCount > 0 ? (
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">
                            {extraMetaCount} metadata
                        </span>
                    ) : (
                        <span className="text-[10px] text-[var(--text-disabled)] font-mono">
                            no metadata
                        </span>
                    )}
                </div>

                <Handle
                    type="target"
                    position={Position.Left}
                    className="!bg-[var(--accent)] !w-2 !h-2 !border-2 !border-[var(--bg-base)]"
                />
                <Handle
                    type="source"
                    position={Position.Right}
                    className="!bg-[var(--accent)] !w-2 !h-2 !border-2 !border-[var(--bg-base)]"
                />
            </div>
        );
    }
);

StateNode.displayName = "StateNode";
