"use client";

import { memo, useCallback } from "react";
import {
    getBezierPath,
    EdgeLabelRenderer,
    useReactFlow,
    type EdgeProps,
} from "@xyflow/react";
import type { TransitionEdgeData } from "@/types/workflow";
import { useEditorStore } from "@/stores/editor";

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
        const setSelectedEdge = useEditorStore((s) => s.setSelectedEdge);
        const { setEdges } = useReactFlow();

        const handleLabelClick = useCallback(
            (e: React.MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                // Select in React Flow's internal state
                setEdges((edges) =>
                    edges.map((edge) => ({
                        ...edge,
                        selected: edge.id === id,
                    }))
                );
                // Select in our Zustand store
                setSelectedEdge(id);
            },
            [id, setSelectedEdge, setEdges]
        );

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
                {/* Invisible wider hit area for easier clicking */}
                <path
                    d={edgePath}
                    strokeWidth={20}
                    stroke="transparent"
                    fill="none"
                    className="react-flow__edge-interaction"
                />

                {/* Visible edge path — animated dashes */}
                <path
                    id={id}
                    className="react-flow__edge-path"
                    d={edgePath}
                    strokeWidth={selected ? 2 : 1.5}
                    stroke={
                        selected
                            ? "var(--accent-bright)"
                            : data?.metadata?.arrow_color || "rgba(255,255,255,0.25)"
                    }
                    fill="none"
                    strokeDasharray="6 4"
                >
                    <animate
                        attributeName="stroke-dashoffset"
                        from="0"
                        to="-20"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                </path>

                {/* Arrow marker at target end */}
                <defs>
                    <marker
                        id={`arrow-${id}`}
                        markerWidth="8"
                        markerHeight="8"
                        refX="7"
                        refY="4"
                        orient="auto"
                    >
                        <path
                            d="M 0 0 L 8 4 L 0 8 z"
                            fill={
                                selected
                                    ? "var(--accent-bright)"
                                    : data?.metadata?.arrow_color ||
                                      "rgba(255,255,255,0.25)"
                            }
                        />
                    </marker>
                </defs>
                <path
                    d={edgePath}
                    strokeWidth={0}
                    fill="none"
                    markerEnd={`url(#arrow-${id})`}
                />

                {/* Label + guard badge */}
                <EdgeLabelRenderer>
                    {/*
                        onMouseDown + onClick both stop propagation to prevent
                        the pane click handler from deselecting immediately
                    */}
                    <div
                        style={{
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        }}
                        className="absolute pointer-events-auto nopan nodrag cursor-pointer"
                        onClick={handleLabelClick}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <div
                            className={`
                                px-2.5 py-1 rounded-[8px] text-[11px] font-mono font-medium
                                border backdrop-blur-sm transition-colors
                                ${
                                    selected
                                        ? "bg-[var(--accent-dim)] border-[var(--accent-border)] text-[var(--accent-bright)]"
                                        : "bg-[rgba(0,0,0,0.5)] border-[var(--glass-border)] text-[var(--text-secondary)] hover:border-[var(--glass-border-hover)] hover:text-[var(--text-primary)]"
                                }
                            `}
                            style={
                                !selected && data?.metadata?.color
                                    ? {
                                          color: data.metadata.color,
                                          borderColor: data.metadata.color,
                                      }
                                    : undefined
                            }
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
