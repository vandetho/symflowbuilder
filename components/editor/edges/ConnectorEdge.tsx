"use client";

import { memo } from "react";
import { getBezierPath, type EdgeProps } from "@xyflow/react";
import { useSimulatorStore } from "@/stores/simulator";
import { useEditorStore } from "@/stores/editor";
import type { TransitionNodeData } from "symflow/react-flow";

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

        // Narrow selector: returns just the adjacent transition's label (or null).
        // A scalar return makes Zustand skip re-render when other nodes mutate.
        const transitionLabel = useEditorStore((s) => {
            const sourceNode = s.nodes.find((n) => n.id === source);
            if (sourceNode?.type === "transition") {
                return (sourceNode.data as unknown as TransitionNodeData).label;
            }
            const targetNode = s.nodes.find((n) => n.id === target);
            if (targetNode?.type === "transition") {
                return (targetNode.data as unknown as TransitionNodeData).label;
            }
            return null;
        });

        const isEnabled = useSimulatorStore(
            (s) =>
                s.active &&
                transitionLabel !== null &&
                s.enabledTransitions.some((t) => t.name === transitionLabel)
        );

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
