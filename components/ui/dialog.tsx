"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogContextType {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType>({
    open: false,
    setOpen: () => {},
});

function Dialog({
    children,
    open: controlledOpen,
    onOpenChange,
}: {
    children: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const open = controlledOpen ?? uncontrolledOpen;
    const setOpen = onOpenChange ?? setUncontrolledOpen;

    return (
        <DialogContext.Provider value={{ open, setOpen }}>
            {children}
        </DialogContext.Provider>
    );
}

function DialogTrigger({
    children,
    asChild,
}: {
    children: ReactNode;
    asChild?: boolean;
}) {
    const { setOpen } = useContext(DialogContext);
    return (
        <span onClick={() => setOpen(true)} className="cursor-pointer">
            {children}
        </span>
    );
}

function DialogContent({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    const { open, setOpen } = useContext(DialogContext);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        },
        [setOpen]
    );

    useEffect(() => {
        if (open) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
            return () => {
                document.removeEventListener("keydown", handleKeyDown);
                document.body.style.overflow = "";
            };
        }
    }, [open, handleKeyDown]);

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setOpen(false)}
            />
            <div
                className={cn(
                    "relative z-50 w-full max-w-lg mx-4",
                    "glass-strong rounded-[24px] p-6",
                    "shadow-[0_24px_64px_rgba(0,0,0,0.6)]",
                    className
                )}
            >
                <button
                    onClick={() => setOpen(false)}
                    className="absolute right-4 top-4 p-1 rounded-[8px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)] transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
}

function DialogHeader({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return <div className={cn("flex flex-col gap-1.5 pr-8", className)}>{children}</div>;
}

function DialogTitle({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <h2 className={cn("text-lg font-semibold text-[var(--text-primary)]", className)}>
            {children}
        </h2>
    );
}

function DialogDescription({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <p className={cn("text-sm text-[var(--text-secondary)]", className)}>
            {children}
        </p>
    );
}

export {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
};
