"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { StateNodeData } from "@/types/workflow";

export const StateNode = memo(
    ({ data, selected }: NodeProps & { data: StateNodeData }) => {
        return (
            <div
                className={`
          relative min-w-[140px] rounded-[14px]
          border transition-all duration-150
          ${
              selected
                  ? "border-[var(--accent-bright)] shadow-[0_0_0_2px_var(--accent-glow)] bg-[#1a1a2e]"
                  : "border-[var(--glass-border)] bg-[#12121f] hover:border-[var(--glass-border-hover)]"
          }
        `}
            >
                {data.isInitial && (
                    <div className="absolute top-0 left-4 right-4 h-[2px] rounded-full bg-[var(--accent)]" />
                )}

                <div className="flex items-center gap-2 px-3 pt-3 pb-2">
                    <span
                        className={`
              w-2 h-2 rounded-full shrink-0
              ${data.isInitial ? "bg-[var(--accent)]" : "bg-[rgba(255,255,255,0.25)]"}
            `}
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

                <div className="mx-3 h-px bg-[rgba(255,255,255,0.07)]" />

                <div className="px-3 py-2">
                    {Object.keys(data.metadata).length > 0 ? (
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">
                            {Object.keys(data.metadata).length} metadata
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
