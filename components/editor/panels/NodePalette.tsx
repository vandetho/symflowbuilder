"use client";

import { type DragEvent } from "react";
import { CircleDot, Circle, CircleDashed } from "lucide-react";

const PALETTE_ITEMS = [
    { type: "state", label: "State", icon: CircleDot },
    { type: "initial", label: "Initial", icon: Circle },
    { type: "final", label: "Final", icon: CircleDashed },
] as const;

function PaletteItem({
    type,
    label,
    icon: Icon,
}: {
    type: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}) {
    const onDragStart = (e: DragEvent) => {
        e.dataTransfer.setData("application/reactflow", type);
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
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider px-1">
                Nodes
            </span>
            {PALETTE_ITEMS.map((item) => (
                <PaletteItem
                    key={item.type}
                    type={item.type}
                    label={item.label}
                    icon={item.icon}
                />
            ))}
        </div>
    );
}
