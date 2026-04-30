"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex w-full rounded-[10px] px-3 py-2 text-xs font-mono leading-relaxed resize-y",
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
Textarea.displayName = "Textarea";

export { Textarea };
