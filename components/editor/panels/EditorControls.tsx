"use client";

import { useCallback, useEffect, useState } from "react";
import { useReactFlow, useStore } from "@xyflow/react";
import { Undo2, Redo2, Maximize2, ZoomIn, ZoomOut, Trash2, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useEditorStore } from "@/stores/editor";

const isMac =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent);
const mod = isMac ? "\u2318" : "Ctrl";

const SHORTCUTS = [
    { keys: `${mod} + Z`, action: "Undo" },
    { keys: `${mod} + Shift + Z`, action: "Redo" },
    { keys: `${mod} + S`, action: "Save" },
    { keys: `${mod} + E`, action: "Export YAML" },
    { keys: `${mod} + Shift + F`, action: "Fit view" },
    { keys: "Backspace / Delete", action: "Delete selected" },
    { keys: `${mod} + A`, action: "Select all" },
    { keys: "Escape", action: "Deselect / close panel" },
    { keys: "Scroll", action: "Zoom in / out" },
    { keys: "Space + Drag", action: "Pan canvas" },
];

export function EditorControls() {
    const { fitView, zoomIn, zoomOut } = useReactFlow();
    const { undo, redo, history, deleteSelected, reset, nodes, edges } = useEditorStore();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [shortcutsOpen, setShortcutsOpen] = useState(false);

    const zoomLevel = useStore((s) => Math.round(s.transform[2] * 100));

    const canUndo = history.past.length > 0;
    const canRedo = history.future.length > 0;
    const hasContent = nodes.length > 0 || edges.length > 0;

    const handleClear = useCallback(() => {
        reset();
        try {
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key?.startsWith("sfb_draft_")) {
                    localStorage.removeItem(key);
                }
            }
        } catch {
            // Ignore
        }
        setConfirmOpen(false);
    }, [reset]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            const modKey = e.metaKey || e.ctrlKey;

            if (modKey && e.key === "z" && !e.shiftKey) {
                e.preventDefault();
                undo();
            }
            if (modKey && e.key === "z" && e.shiftKey) {
                e.preventDefault();
                redo();
            }
            if (modKey && e.shiftKey && e.key === "f") {
                e.preventDefault();
                fitView({ padding: 0.2 });
            }
            if (e.key === "Backspace" || e.key === "Delete") {
                const target = e.target as HTMLElement;
                if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
                deleteSelected();
            }
        },
        [undo, redo, fitView, deleteSelected]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <>
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1 glass-sm rounded-[10px] p-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={undo}
                    disabled={!canUndo}
                    className="h-7 w-7"
                    title="Undo (Cmd+Z)"
                >
                    <Undo2 className="w-3.5 h-3.5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={redo}
                    disabled={!canRedo}
                    className="h-7 w-7"
                    title="Redo (Cmd+Shift+Z)"
                >
                    <Redo2 className="w-3.5 h-3.5" />
                </Button>
                <div className="w-px h-4 bg-[var(--glass-border)]" />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => zoomOut()}
                    className="h-7 w-7"
                    title="Zoom Out"
                >
                    <ZoomOut className="w-3.5 h-3.5" />
                </Button>
                <span className="text-[10px] font-mono text-[var(--text-muted)] w-10 text-center select-none">
                    {zoomLevel}%
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => zoomIn()}
                    className="h-7 w-7"
                    title="Zoom In"
                >
                    <ZoomIn className="w-3.5 h-3.5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => fitView({ padding: 0.2 })}
                    className="h-7 w-7"
                    title="Fit View (Cmd+Shift+F)"
                >
                    <Maximize2 className="w-3.5 h-3.5" />
                </Button>
                <div className="w-px h-4 bg-[var(--glass-border)]" />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShortcutsOpen(true)}
                    className="h-7 w-7"
                    title="Keyboard Shortcuts"
                >
                    <Keyboard className="w-3.5 h-3.5" />
                </Button>
                <div className="w-px h-4 bg-[var(--glass-border)]" />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setConfirmOpen(true)}
                    disabled={!hasContent}
                    className="h-7 w-7 hover:!text-[var(--danger)]"
                    title="Clear Canvas"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </Button>
            </div>

            {/* Keyboard shortcuts dialog */}
            <Dialog open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Keyboard Shortcuts</DialogTitle>
                        <DialogDescription>
                            Available shortcuts in the editor
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-3 flex flex-col gap-1">
                        {SHORTCUTS.map((s) => (
                            <div
                                key={s.action}
                                className="flex items-center justify-between py-1.5 px-1"
                            >
                                <span className="text-xs text-[var(--text-secondary)]">
                                    {s.action}
                                </span>
                                <kbd className="text-[10px] font-mono px-2 py-0.5 rounded-[6px] bg-[var(--glass-base)] border border-[var(--glass-border)] text-[var(--text-muted)]">
                                    {s.keys}
                                </kbd>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Clear confirmation dialog */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="max-w-xs">
                    <DialogHeader>
                        <DialogTitle>Clear canvas?</DialogTitle>
                        <DialogDescription>
                            This will remove all states and transitions. This action
                            cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="danger" size="sm" onClick={handleClear}>
                            <Trash2 className="w-3.5 h-3.5" />
                            Clear
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
