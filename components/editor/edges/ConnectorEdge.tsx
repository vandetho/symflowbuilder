"use client";

import { memo } from "react";
import { getBezierPath, type EdgeProps } from "@xyflow/react";
import { useSimulatorStore } from "@/stores/simulator";
import { useEditorStore } from "@/stores/editor";
import type { TransitionNodeData } from "@symflowbuilder/core";

/**
 * Simple connector edge with no label — just a line between
 * state nodes and transition nodes.
 */
export const ConnectorEdge = memo(
    ({
        id,
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        source,
        target,
        selected,
    }: EdgeProps) => {
        const simActive = useSimulatorStore((s) => s.active);
        const nodes = useEditorStore((s) => s.nodes);

        // Find the adjacent transition node to determine if enabled
        const isEnabled = useSimulatorStore((s) => {
            if (!s.active) return false;
            const sourceNode = nodes.find((n) => n.id === source);
            const targetNode = nodes.find((n) => n.id === target);
            const transitionNode =
                sourceNode?.type === "transition"
                    ? sourceNode
                    : targetNode?.type === "transition"
                      ? targetNode
                      : null;
            if (!transitionNode) return false;
            const label = (transitionNode.data as unknown as TransitionNodeData).label;
            return s.enabledTransitions.some((t) => t.name === label);
        });

        const simDimmed = simActive && !isEnabled;

        const [edgePath] = getBezierPath({
            sourceX,
            sourceY,
            sourcePosition,
            targetX,
            targetY,
            targetPosition,
        });

        return (
            <>
                {/* Invisible wider hit area */}
                <path
                    d={edgePath}
                    strokeWidth={20}
                    stroke="transparent"
                    fill="none"
                    className="react-flow__edge-interaction"
                />

                {/* Visible edge */}
                <path
                    id={id}
                    d={edgePath}
                    fill="none"
                    style={{
                        stroke: simActive
                            ? isEnabled
                                ? "var(--success)"
                                : "rgba(255,255,255,0.08)"
                            : selected
                              ? "var(--accent-bright)"
                              : "rgba(255,255,255,0.2)",
                        strokeWidth: selected ? 2 : 1.5,
                        opacity: simDimmed ? 0.3 : 1,
                    }}
                />
            </>
        );
    }
);

ConnectorEdge.displayName = "ConnectorEdge";
