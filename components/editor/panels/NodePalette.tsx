"use client";

import { type DragEvent } from "react";
import { CircleDot } from "lucide-react";

function PaletteItem({
    label,
    icon: Icon,
}: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}) {
    const onDragStart = (e: DragEvent) => {
        e.dataTransfer.setData("application/reactflow", "state");
        e.dataTransfer.effectAllowed = "move";
    };

    return (
        <div
            draggable
            onDragStart={onDragStart}
            className="glass-sm flex items-center gap-2 px-3 py-2 rounded-[10px] text-[12px] font-mono text-[var(--text-secondary)] cursor-grab active:cursor-grabbing border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] hover:text-[var(--text-primary)] transition-colors"
        >
            <Icon className="w-3.5 h-3.5" />
            {label}
        </div>
    );
}

export function NodePalette() {
    return (
        <div className="absolute top-16 left-4 z-10 flex flex-col gap-2">
            <span className="text-sm font-medium text-[var(--text-muted)] px-1">
                Drag to canvas
            </span>
            <PaletteItem label="State (Place)" icon={CircleDot} />
            <div className="mt-1 px-1">
                <p className="text-xs text-[var(--text-disabled)] leading-relaxed">
                    Set initial / final in
                    <br />
                    the properties panel
                </p>
            </div>
        </div>
    );
}
