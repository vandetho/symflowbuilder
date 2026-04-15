"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const TooltipContext = createContext<{
    open: boolean;
    setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

function TooltipProvider({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

function Tooltip({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    return (
        <TooltipContext.Provider value={{ open, setOpen }}>
            <div className="relative inline-flex">{children}</div>
        </TooltipContext.Provider>
    );
}

function TooltipTrigger({
    children,
    asChild,
}: {
    children: ReactNode;
    asChild?: boolean;
}) {
    const { setOpen } = useContext(TooltipContext);
    const props = {
        onMouseEnter: () => setOpen(true),
        onMouseLeave: () => setOpen(false),
        onFocus: () => setOpen(true),
        onBlur: () => setOpen(false),
    };

    if (asChild) {
        return <span {...props}>{children}</span>;
    }

    return <span {...props}>{children}</span>;
}

function TooltipContent({
    children,
    className,
    side = "top",
}: {
    children: ReactNode;
    className?: string;
    side?: "top" | "bottom" | "left" | "right";
}) {
    const { open } = useContext(TooltipContext);
    if (!open) return null;

    const positionClass = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
    }[side];

    return (
        <div
            className={cn(
                "absolute z-50 px-2.5 py-1.5 text-xs rounded-[8px] whitespace-nowrap",
                "bg-[#14142a] border border-[var(--glass-border-strong)] text-[var(--text-primary)] shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
                "animate-in fade-in-0 zoom-in-95",
                positionClass,
                className
            )}
        >
            {children}
        </div>
    );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
