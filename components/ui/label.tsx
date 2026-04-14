"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Label = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
    ({ className, ...props }, ref) => (
        <label
            ref={ref}
            className={cn(
                "text-xs font-medium text-[var(--text-secondary)] select-none",
                className
            )}
            {...props}
        />
    )
);
Label.displayName = "Label";

export { Label };
