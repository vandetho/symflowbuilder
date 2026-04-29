"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
    children: ReactNode;
    className?: string;
    align?: "left" | "right";
}

export function DropdownMenu({
    children,
    className,
    align = "right",
}: DropdownMenuProps) {
    return (
        <div
            className={cn(
                "absolute top-full mt-1 z-50 overflow-hidden",
                "glass-strong border border-[var(--glass-border)] rounded-[10px]",
                "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
                align === "right" ? "right-0" : "left-0",
                className
            )}
        >
            {children}
        </div>
    );
}

interface DropdownMenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ReactNode;
}

export const DropdownMenuItem = forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
    ({ icon, className, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                type="button"
                className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-xs whitespace-nowrap",
                    "text-[var(--text-secondary)] transition-colors",
                    "hover:bg-[var(--glass-hover)] hover:text-[var(--text-primary)]",
                    "disabled:pointer-events-none disabled:opacity-40",
                    className
                )}
                {...props}
            >
                {icon && <span className="shrink-0">{icon}</span>}
                {children}
            </button>
        );
    }
);
DropdownMenuItem.displayName = "DropdownMenuItem";
