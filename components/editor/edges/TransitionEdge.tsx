"use client";

import { memo } from "react";
import { getBezierPath, EdgeLabelRenderer, type EdgeProps } from "@xyflow/react";
import type { TransitionEdgeData } from "@/types/workflow";

export const TransitionEdge = memo(
    ({
        id,
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        data,
        selected,
    }: EdgeProps & { data?: TransitionEdgeData }) => {
        const [edgePath, labelX, labelY] = getBezierPath({
            sourceX,
            sourceY,
            sourcePosition,
            targetX,
            targetY,
            targetPosition,
        });

        return (
            <>
                <path
                    id={id}
                    className="react-flow__edge-path"
                    d={edgePath}
                    strokeWidth={selected ? 2 : 1.5}
                    stroke={selected ? "var(--accent-bright)" : "rgba(255,255,255,0.25)"}
                    fill="none"
                    strokeDasharray={data?.guard ? "6 3" : undefined}
                />

                <circle r="3" fill="var(--accent)" opacity="0.7">
                    <animateMotion dur="2s" repeatCount="indefinite">
                        <mpath href={`#${id}`} />
                    </animateMotion>
                </circle>

                <EdgeLabelRenderer>
                    <div
                        style={{
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        }}
                        className="absolute pointer-events-all nopan"
                    >
                        <div
                            className={`
                px-2 py-1 rounded-[8px] text-[11px] font-mono font-medium
                border backdrop-blur-sm
                ${
                    selected
                        ? "bg-[var(--accent-dim)] border-[var(--accent-border)] text-[var(--accent-bright)]"
                        : "bg-[rgba(0,0,0,0.5)] border-[var(--glass-border)] text-[var(--text-secondary)]"
                }
              `}
                        >
                            {data?.label}
                        </div>

                        {data?.guard && (
                            <div className="mt-1 flex items-center justify-center gap-1 px-2 py-0.5 rounded-[6px] text-[10px] font-mono bg-[var(--warning-dim)] border border-[rgba(251,191,36,0.2)] text-[var(--warning)]">
                                <span>&#128274;</span>
                                <span className="truncate max-w-[120px]">
                                    {data.guard}
                                </span>
                            </div>
                        )}

                        {data?.listeners && data.listeners.length > 0 && (
                            <div className="mt-1 flex justify-center">
                                <span className="px-1.5 py-0.5 rounded-[5px] text-[9px] font-mono bg-[rgba(124,111,247,0.15)] border border-[var(--accent-border)] text-[var(--accent-bright)]">
                                    {data.listeners.length} listener
                                    {data.listeners.length > 1 ? "s" : ""}
                                </span>
                            </div>
                        )}
                    </div>
                </EdgeLabelRenderer>
            </>
        );
    }
);

TransitionEdge.displayName = "TransitionEdge";
