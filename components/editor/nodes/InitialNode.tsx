"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

export const InitialNode = memo(({ selected }: NodeProps) => (
    <div
        className={`
      w-8 h-8 rounded-full
      bg-[var(--accent)] shadow-[0_0_16px_var(--accent-glow)]
      border-2 ${selected ? "border-[var(--accent-bright)]" : "border-transparent"}
    `}
    >
        <Handle
            type="source"
            position={Position.Right}
            className="!bg-transparent !border-0"
        />
    </div>
));

InitialNode.displayName = "InitialNode";
