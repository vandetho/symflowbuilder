"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { SketchPicker, type ColorResult } from "react-color";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ColorInputProps {
    value: string;
    onChange: (value: string) => void;
    onClear?: () => void;
    placeholder?: string;
    className?: string;
}

export function ColorInput({
    value,
    onChange,
    onClear,
    placeholder,
    className,
}: ColorInputProps) {
    const [open, setOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const swatchRef = useRef<HTMLButtonElement>(null);

    const handleChange = useCallback(
        (color: ColorResult) => {
            onChange(color.hex);
        },
        [onChange]
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            if (val) {
                onChange(val);
            } else {
                onClear?.();
            }
        },
        [onChange, onClear]
    );

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(e.target as Node) &&
                swatchRef.current &&
                !swatchRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const isValidColor = value && (value.startsWith("#") || /^[a-zA-Z]+$/.test(value));

    return (
        <div className={cn("relative flex items-center gap-1.5", className)}>
            <button
                ref={swatchRef}
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-7 h-7 rounded-[6px] shrink-0 border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] transition-colors cursor-pointer"
                style={{
                    backgroundColor: isValidColor ? value : "var(--glass-base)",
                }}
            />
            <Input
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="flex-1 h-7 text-xs font-mono"
            />
            {open && (
                <div ref={popoverRef} className="absolute top-full left-0 mt-1 z-50">
                    <SketchPicker
                        color={value || "#7c6ff7"}
                        onChange={handleChange}
                        disableAlpha
                        styles={{
                            default: {
                                picker: {
                                    background: "#1a1a2e",
                                    borderRadius: "14px",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                                },
                                activeColor: {
                                    borderRadius: "6px",
                                },
                            },
                        }}
                    />
                </div>
            )}
        </div>
    );
}
