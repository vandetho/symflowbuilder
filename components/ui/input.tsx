"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-9 w-full rounded-[10px] px-3 py-1 text-sm font-mono",
                    "bg-[var(--glass-base)] border border-[var(--glass-border)]",
                    "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                    "transition-colors duration-150",
                    "hover:border-[var(--glass-border-hover)]",
                    "focus-visible:outline-none focus-visible:border-[var(--accent-bright)]",
                    "disabled:cursor-not-allowed disabled:opacity-40",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
