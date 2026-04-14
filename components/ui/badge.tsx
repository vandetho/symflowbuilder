import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-[6px] px-2 py-0.5 text-[10px] font-mono font-medium transition-colors",
    {
        variants: {
            variant: {
                default:
                    "bg-[var(--accent-dim)] border border-[var(--accent-border)] text-[var(--accent-bright)]",
                success:
                    "bg-[var(--success-dim)] border border-[rgba(52,211,153,0.3)] text-[var(--success)]",
                warning:
                    "bg-[var(--warning-dim)] border border-[rgba(251,191,36,0.3)] text-[var(--warning)]",
                danger: "bg-[var(--danger-dim)] border border-[rgba(248,113,113,0.3)] text-[var(--danger)]",
                outline:
                    "border border-[var(--glass-border)] text-[var(--text-secondary)]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
