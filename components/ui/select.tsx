"use client";

import {
    createContext,
    useContext,
    useState,
    useRef,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectContextType {
    open: boolean;
    setOpen: (open: boolean) => void;
    value: string;
    onSelect: (value: string) => void;
}

const SelectContext = createContext<SelectContextType>({
    open: false,
    setOpen: () => {},
    value: "",
    onSelect: () => {},
});

interface SelectProps {
    value: string;
    onChange: (e: { target: { value: string } }) => void;
    children: ReactNode;
    className?: string;
    placeholder?: string;
}

export function Select({
    value,
    onChange,
    children,
    className,
    placeholder,
}: SelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const onSelect = useCallback(
        (val: string) => {
            onChange({ target: { value: val } });
            setOpen(false);
        },
        [onChange]
    );

    // Close on click outside
    useEffect(() => {
        if (!open) return;
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [open]);

    // Find the label for the current value
    let selectedLabel: string | null = null;
    const flattenText = (node: ReactNode): string => {
        if (node === null || node === undefined || typeof node === "boolean") return "";
        if (typeof node === "string" || typeof node === "number") return String(node);
        if (Array.isArray(node)) return node.map(flattenText).join("");
        if (typeof node === "object" && "props" in node)
            return flattenText(
                (node as { props: { children?: ReactNode } }).props.children
            );
        return "";
    };
    const findLabel = (nodes: ReactNode): void => {
        const arr = Array.isArray(nodes) ? nodes : [nodes];
        for (const child of arr) {
            if (
                child &&
                typeof child === "object" &&
                "props" in child &&
                child.props?.value === value
            ) {
                selectedLabel = flattenText(child.props.children);
            }
            if (
                child &&
                typeof child === "object" &&
                "props" in child &&
                child.props?.children
            ) {
                if (Array.isArray(child.props.children)) {
                    findLabel(child.props.children);
                }
            }
        }
    };
    findLabel(children);

    return (
        <SelectContext.Provider value={{ open, setOpen, value, onSelect }}>
            <div ref={ref} className="relative">
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className={cn(
                        "flex w-full items-center justify-between gap-2 rounded-[10px] px-3 py-1 text-sm font-mono",
                        "bg-[var(--glass-base)] border border-[var(--glass-border)]",
                        "text-[var(--text-primary)]",
                        "transition-colors duration-150 cursor-pointer",
                        "hover:border-[var(--glass-border-hover)]",
                        open && "border-[var(--accent-bright)]",
                        className
                    )}
                >
                    <span className="truncate">
                        {selectedLabel ?? placeholder ?? value}
                    </span>
                    <ChevronDown
                        className={cn(
                            "w-3 h-3 shrink-0 text-[var(--text-muted)] transition-transform",
                            open && "rotate-180"
                        )}
                    />
                </button>
                {open && (
                    <div className="absolute top-full left-0 mt-1 min-w-full z-50 bg-[#14142a] border border-[var(--glass-border-strong)] rounded-[10px] p-1 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                        {children}
                    </div>
                )}
            </div>
        </SelectContext.Provider>
    );
}

interface SelectItemProps {
    value: string;
    children: ReactNode;
}

export function SelectItem({ value: itemValue, children }: SelectItemProps) {
    const { value, onSelect } = useContext(SelectContext);
    const isSelected = value === itemValue;

    return (
        <button
            type="button"
            onClick={() => onSelect(itemValue)}
            className={cn(
                "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[8px] text-xs font-mono transition-colors cursor-pointer text-left",
                isSelected
                    ? "bg-[var(--accent-dim)] text-[var(--accent-bright)]"
                    : "text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--text-primary)]"
            )}
        >
            <Check
                className={cn(
                    "w-3 h-3 shrink-0",
                    isSelected ? "opacity-100" : "opacity-0"
                )}
            />
            {children}
        </button>
    );
}
