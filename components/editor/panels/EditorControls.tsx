"use client";

import { useCallback, useEffect } from "react";
import { useReactFlow } from "@xyflow/react";
import { Undo2, Redo2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/stores/editor";

export function EditorControls() {
    const { fitView } = useReactFlow();
    const { undo, redo, history, deleteSelected } = useEditorStore();

    const canUndo = history.past.length > 0;
    const canRedo = history.future.length > 0;

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
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1 glass-sm rounded-[10px] p-1">
            <Button
                variant="ghost"
                size="icon"
                onClick={undo}
                disabled={!canUndo}
                className="h-7 w-7"
            >
                <Undo2 className="w-3.5 h-3.5" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={redo}
                disabled={!canRedo}
                className="h-7 w-7"
            >
                <Redo2 className="w-3.5 h-3.5" />
            </Button>
            <div className="w-px h-4 bg-[var(--glass-border)]" />
            <Button
                variant="ghost"
                size="icon"
                onClick={() => fitView({ padding: 0.2 })}
                className="h-7 w-7"
            >
                <Maximize2 className="w-3.5 h-3.5" />
            </Button>
        </div>
    );
}
