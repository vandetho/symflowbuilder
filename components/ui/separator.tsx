import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: "horizontal" | "vertical";
}

const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
    ({ className, orientation = "horizontal", ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "shrink-0 bg-[var(--glass-border)]",
                orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
                className
            )}
            {...props}
        />
    )
);
Separator.displayName = "Separator";

export { Separator };
