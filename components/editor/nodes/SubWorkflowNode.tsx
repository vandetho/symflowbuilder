"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Workflow } from "lucide-react";
import type { SubWorkflowNodeData } from "@/types/subworkflow";

export const SubWorkflowNode = memo(
    ({ data, selected }: NodeProps & { data: SubWorkflowNodeData }) => {
        return (
            <div
                className={`
                    relative min-w-[160px] rounded-[14px]
                    border transition-all duration-150
                    ${
                        selected
                            ? "border-[var(--accent-bright)] shadow-[0_0_0_2px_var(--accent-glow)]"
                            : "border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]"
                    }
                `}
                style={{
                    backgroundColor: selected ? "#1a1a2e" : "#12121f",
                    borderLeftColor: "var(--warning)",
                    borderLeftWidth: 3,
                }}
            >
                <div className="flex items-center gap-2 px-3 pt-3 pb-2">
                    <Workflow className="w-3.5 h-3.5 text-[var(--warning)] shrink-0" />
                    <span className="text-[13px] font-medium text-[var(--text-primary)] font-mono leading-none flex-1 truncate">
                        {data.label}
                    </span>
                </div>

                {data.workflowName && (
                    <div className="px-3 pb-1">
                        <span className="text-[10px] text-[var(--warning)] font-mono truncate block">
                            {data.workflowName}
                        </span>
                    </div>
                )}

                <div className="mx-3 h-px bg-[rgba(255,255,255,0.07)]" />

                <div className="px-3 py-2">
                    {data.workflowId ? (
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">
                            linked workflow
                        </span>
                    ) : (
                        <span className="text-[10px] text-[var(--text-disabled)] font-mono">
                            no workflow linked
                        </span>
                    )}
                </div>

                <Handle
                    type="target"
                    position={Position.Left}
                    className="!bg-[var(--warning)] !w-2 !h-2 !border-2 !border-[var(--bg-base)]"
                />
                <Handle
                    type="source"
                    position={Position.Right}
                    className="!bg-[var(--warning)] !w-2 !h-2 !border-2 !border-[var(--bg-base)]"
                />
            </div>
        );
    }
);

SubWorkflowNode.displayName = "SubWorkflowNode";
