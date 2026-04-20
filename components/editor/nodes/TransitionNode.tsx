"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { TransitionNodeData } from "@symflow/core/react-flow";
import { useSimulatorStore } from "@/stores/simulator";

export const TransitionNode = memo(
    ({ data, selected }: NodeProps & { data: TransitionNodeData }) => {
        const simActive = useSimulatorStore((s) => s.active);
        const isEnabled = useSimulatorStore((s) =>
            s.active ? s.enabledTransitions.some((t) => t.name === data.label) : false
        );
        const simDimmed = simActive && !isEnabled;

        return (
            <div
                className="flex flex-col items-center gap-1"
                style={{ opacity: simDimmed ? 0.3 : 1 }}
            >
                {/* Transition bar */}
                <div
                    className={`
                        w-[60px] h-[8px] rounded-[3px] transition-all duration-150
                        ${
                            simActive && isEnabled
                                ? "bg-[var(--success)] shadow-[0_0_12px_var(--success)]"
                                : selected
                                  ? "bg-[var(--accent-bright)] shadow-[0_0_12px_var(--accent-glow)]"
                                  : "bg-[rgba(255,255,255,0.35)]"
                        }
                    `}
                />

                {/* Label */}
                <span
                    className={`
                        text-[10px] font-mono leading-none max-w-[100px] truncate
                        ${
                            simActive && isEnabled
                                ? "text-[var(--success)]"
                                : selected
                                  ? "text-[var(--accent-bright)]"
                                  : "text-[var(--text-secondary)]"
                        }
                    `}
                >
                    {data.label}
                </span>

                {/* Guard indicator */}
                {data.guard && (
                    <span className="text-[8px] font-mono text-[var(--warning)] truncate max-w-[100px]">
                        &#128274; {data.guard}
                    </span>
                )}

                {/* Handles */}
                <Handle
                    type="target"
                    position={Position.Left}
                    className="!bg-[var(--accent)] !w-2 !h-2 !border-2 !border-[#12121f]"
                />
                <Handle
                    type="source"
                    position={Position.Right}
                    className="!bg-[var(--accent)] !w-2 !h-2 !border-2 !border-[#12121f]"
                />
            </div>
        );
    }
);

TransitionNode.displayName = "TransitionNode";
