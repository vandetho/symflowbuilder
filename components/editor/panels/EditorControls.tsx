"use client";

import { useCallback, useEffect, useState } from "react";
import { useReactFlow, useStore } from "@xyflow/react";
import { Undo2, Redo2, Maximize2, ZoomIn, ZoomOut, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useEditorStore } from "@/stores/editor";

export function EditorControls() {
    const { fitView, zoomIn, zoomOut } = useReactFlow();
    const { undo, redo, history, deleteSelected, reset, nodes, edges } = useEditorStore();
    const [confirmOpen, setConfirmOpen] = useState(false);

    const zoomLevel = useStore((s) => Math.round(s.transform[2] * 100));

    const canUndo = history.past.length > 0;
    const canRedo = history.future.length > 0;
    const hasContent = nodes.length > 0 || edges.length > 0;

    const handleClear = useCallback(() => {
        reset();
        // Clear localStorage drafts
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
            const mod = e.metaKey || e.ctrlKey;

            if (mod && e.key === "z" && !e.shiftKey) {
                e.preventDefault();
                undo();
            }
            if (mod && e.key === "z" && e.shiftKey) {
                e.preventDefault();
                redo();
            }
            if (mod && e.shiftKey && e.key === "f") {
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
                    onClick={() => setConfirmOpen(true)}
                    disabled={!hasContent}
                    className="h-7 w-7 hover:!text-[var(--danger)]"
                    title="Clear Canvas"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </Button>
            </div>

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
