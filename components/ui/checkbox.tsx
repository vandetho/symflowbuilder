"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
    React.ComponentRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
            "peer h-4 w-4 shrink-0 rounded-[4px] border border-[var(--glass-border-hover)] bg-[var(--glass-base)]",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-bright)] focus-visible:ring-offset-1 focus-visible:ring-offset-transparent",
            "data-[state=checked]:bg-[var(--accent)] data-[state=checked]:border-[var(--accent)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "cursor-pointer transition-colors",
            className
        )}
        {...props}
    >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
            <Check className="h-3 w-3" strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
