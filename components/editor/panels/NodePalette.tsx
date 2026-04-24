"use client";

import { type DragEvent } from "react";
import { CircleDot, Workflow } from "lucide-react";

function PaletteItem({
    label,
    icon: Icon,
    nodeType,
}: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    nodeType: string;
}) {
    const onDragStart = (e: DragEvent) => {
        e.dataTransfer.setData("application/reactflow", nodeType);
        e.dataTransfer.effectAllowed = "move";
    };

    return (
        <div
            draggable
            onDragStart={onDragStart}
            className="bg-[#12121f] flex items-center gap-2 px-3 py-2 rounded-[10px] text-[12px] font-mono text-[var(--text-secondary)] cursor-grab active:cursor-grabbing border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] hover:text-[var(--text-primary)] transition-colors"
        >
            <Icon className="w-3.5 h-3.5" />
            {label}
        </div>
    );
}

export function NodePalette() {
    return (
        <div className="absolute top-16 left-4 z-10 flex flex-col gap-2">
            <span className="text-sm font-medium text-[var(--text-primary)] px-1">
                Drag to canvas
            </span>
            <PaletteItem label="State (Place)" icon={CircleDot} nodeType="state" />
            <PaletteItem label="Sub-Workflow" icon={Workflow} nodeType="subworkflow" />
            <div className="mt-1 px-1 flex flex-col gap-1.5">
                <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                    <span className="text-[var(--text-primary)]">State:</span> Set initial
                    / final in the properties panel
                </p>
                <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                    <span className="text-[var(--text-primary)]">Sub-Workflow:</span>{" "}
                    Embed a saved workflow as a place node. Sign in to link it.
                </p>
            </div>
        </div>
    );
}
