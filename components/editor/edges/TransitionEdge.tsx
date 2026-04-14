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

                {/* Visible edge path */}
                <path
                    id={id}
                    className="react-flow__edge-path"
                    d={edgePath}
                    strokeWidth={selected ? 2 : 1.5}
                    stroke={selected ? "var(--accent-bright)" : "rgba(255,255,255,0.25)"}
                    fill="none"
                    strokeDasharray={data?.guard ? "6 3" : undefined}
                />

                {/* Animated dot */}
                <circle r="3" fill="var(--accent)" opacity="0.7">
                    <animateMotion dur="2s" repeatCount="indefinite">
                        <mpath href={`#${id}`} />
                    </animateMotion>
                </circle>

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
