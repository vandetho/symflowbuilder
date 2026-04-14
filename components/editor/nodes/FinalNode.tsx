"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

export const FinalNode = memo(({ selected }: NodeProps) => (
    <div
        className={`
      w-9 h-9 rounded-full flex items-center justify-center
      border-2 ${selected ? "border-[var(--accent-bright)]" : "border-[var(--text-secondary)]"}
    `}
    >
        <div className="w-5 h-5 rounded-full bg-[var(--text-secondary)]" />
        <Handle
            type="target"
            position={Position.Left}
            className="!bg-transparent !border-0"
        />
    </div>
));

FinalNode.displayName = "FinalNode";
