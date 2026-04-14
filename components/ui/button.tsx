"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 rounded-[10px] text-sm font-medium transition-all duration-150 cursor-pointer disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-1.5 focus-visible:outline-[var(--accent-bright)] focus-visible:outline-offset-2",
    {
        variants: {
            variant: {
                default:
                    "bg-linear-to-br from-[#7c6ff7] to-[#9d94ff] text-white shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_var(--accent-glow)] hover:brightness-110",
                ghost: "glass-sm hover:bg-[var(--glass-hover)] hover:border-[var(--glass-border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                danger: "bg-[var(--danger-dim)] border border-[var(--danger)] text-[var(--danger)] hover:brightness-110",
                outline:
                    "border border-[var(--glass-border)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--glass-base)] hover:text-[var(--text-primary)] hover:border-[var(--glass-border-hover)]",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-7 px-3 text-xs",
                lg: "h-11 px-6 text-base",
                icon: "h-9 w-9 p-0",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
