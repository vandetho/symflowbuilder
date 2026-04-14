import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
    size?: number;
    className?: string;
}

export function Logo({ size = 28, className }: LogoProps) {
    return (
        <Image
            src="/logo.svg"
            alt="SymFlowBuilder"
            width={size}
            height={size}
            className={cn("rounded-[22%]", className)}
        />
    );
}

export function LogoWithText({ size = 28, className }: LogoProps) {
    return (
        <span className={cn("flex items-center gap-2.5", className)}>
            <Logo size={size} />
            <span className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
                SymFlowBuilder
            </span>
        </span>
    );
}
