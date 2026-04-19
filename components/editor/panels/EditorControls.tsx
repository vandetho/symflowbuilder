"use client";

import { useCallback, useState } from "react";
import { useReactFlow, useStore } from "@xyflow/react";
import { useHotkeys } from "@tanstack/react-hotkeys";
import {
    Undo2,
    Redo2,
    Maximize2,
    ZoomIn,
    ZoomOut,
    Trash2,
    Keyboard,
    LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useEditorStore } from "@/stores/editor";
import { autoLayoutNodes } from "@symflowbuilder/core";

const isMac =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent);
const mod = isMac ? "\u2318" : "Ctrl";

const SHORTCUTS = [
    { keys: `${mod} + Z`, action: "Undo" },
    { keys: `${mod} + Shift + Z`, action: "Redo" },
    { keys: `${mod} + S`, action: "Save" },
    { keys: `${mod} + E`, action: "Export YAML" },
    { keys: `${mod} + Shift + F`, action: "Fit view" },
    { keys: `${mod} + Shift + L`, action: "Auto layout" },
    { keys: "Backspace / Delete", action: "Delete selected" },
    { keys: `${mod} + A`, action: "Select all" },
    { keys: "Escape", action: "Deselect / close panel" },
    { keys: `${mod} + =`, action: "Zoom in" },
    { keys: `${mod} + -`, action: "Zoom out" },
    { keys: "Space + Drag", action: "Pan canvas" },
];

function ToolbarButton({
    tip,
    shortcut,
    onClick,
    disabled,
    className,
    children,
}: {
    tip: string;
    shortcut?: string;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <Tooltip>
            <TooltipTrigger>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClick}
                    disabled={disabled}
                    className={`h-7 w-7 ${className ?? ""}`}
                >
                    {children}
                </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
                {tip}
                {shortcut && (
                    <span className="ml-1.5 text-[var(--text-disabled)]">{shortcut}</span>
                )}
            </TooltipContent>
        </Tooltip>
    );
}

function ZoomInput() {
    const { zoomTo } = useReactFlow();
    const zoomLevel = useStore((s) => Math.round(s.transform[2] * 100));
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const handleStartEdit = useCallback(() => {
        setInputValue(String(zoomLevel));
        setEditing(true);
    }, [zoomLevel]);

    const handleSubmit = useCallback(() => {
        const val = parseInt(inputValue, 10);
        if (!isNaN(val) && val >= 10 && val <= 400) {
            zoomTo(val / 100);
        }
        setEditing(false);
    }, [inputValue, zoomTo]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                handleSubmit();
            } else if (e.key === "Escape") {
                setEditing(false);
            }
        },
        [handleSubmit]
    );

    if (editing) {
        return (
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleSubmit}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-12 h-5 text-[10px] font-mono text-center bg-[var(--glass-base)] border border-[var(--accent-border)] rounded-[4px] text-[var(--text-primary)] outline-none"
            />
        );
    }

    return (
        <button
            onClick={handleStartEdit}
            className="text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] w-12 text-center select-none cursor-pointer transition-colors"
            title="Click to set zoom level"
        >
            {zoomLevel}%
        </button>
    );
}

export function EditorControls() {
    const { fitView, zoomIn, zoomOut } = useReactFlow();
    const {
        undo,
        redo,
        history,
        deleteSelected,
        reset,
        nodes,
        edges,
        setNodes,
        setSelectedNode,
        setSelectedEdge,
        snapshot,
    } = useEditorStore();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [shortcutsOpen, setShortcutsOpen] = useState(false);

    const canUndo = history.past.length > 0;
    const canRedo = history.future.length > 0;
    const hasContent = nodes.length > 0 || edges.length > 0;

    const handleRearrange = useCallback(() => {
        if (!hasContent) return;
        const laid = autoLayoutNodes(nodes, edges);
        setNodes(laid);
        snapshot();
        setTimeout(() => fitView({ padding: 0.2 }), 50);
    }, [nodes, edges, hasContent, setNodes, snapshot, fitView]);

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

    useHotkeys(
        [
            {
                hotkey: "Mod+S",
                callback: () => {
                    document.dispatchEvent(new CustomEvent("sfb:save"));
                },
            },
            {
                hotkey: "Mod+Z",
                callback: () => undo(),
            },
            {
                hotkey: "Mod+Shift+Z",
                callback: () => redo(),
            },
            {
                hotkey: "Mod+Shift+F",
                callback: () => fitView({ padding: 0.2 }),
            },
            {
                hotkey: "Mod+Shift+L",
                callback: () => handleRearrange(),
            },
            {
                hotkey: "Mod+=",
                callback: () => zoomIn(),
            },
            {
                hotkey: "Mod+-",
                callback: () => zoomOut(),
            },
            {
                hotkey: "Mod+E",
                callback: () => {
                    document.dispatchEvent(new CustomEvent("sfb:export"));
                },
            },
            {
                hotkey: "Escape",
                callback: () => {
                    setSelectedNode(null);
                    setSelectedEdge(null);
                },
                options: { preventDefault: false },
            },
            {
                hotkey: "Backspace",
                callback: (e) => {
                    const target = e.target as HTMLElement;
                    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
                        return;
                    deleteSelected();
                },
                options: { preventDefault: false },
            },
            {
                hotkey: "Delete",
                callback: (e) => {
                    const target = e.target as HTMLElement;
                    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
                        return;
                    deleteSelected();
                },
                options: { preventDefault: false },
            },
        ],
        { preventDefault: true }
    );

    return (
        <>
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1 bg-[#12121f] border border-[var(--glass-border)] rounded-[10px] p-1">
                <ToolbarButton
                    tip="Undo"
                    shortcut={`${mod}+Z`}
                    onClick={undo}
                    disabled={!canUndo}
                >
                    <Undo2 className="w-3.5 h-3.5" />
                </ToolbarButton>
                <ToolbarButton
                    tip="Redo"
                    shortcut={`${mod}+Shift+Z`}
                    onClick={redo}
                    disabled={!canRedo}
                >
                    <Redo2 className="w-3.5 h-3.5" />
                </ToolbarButton>
                <div className="w-px h-4 bg-[var(--glass-border)]" />
                <ToolbarButton
                    tip="Zoom Out"
                    shortcut={`${mod}+-`}
                    onClick={() => zoomOut()}
                >
                    <ZoomOut className="w-3.5 h-3.5" />
                </ToolbarButton>
                <ZoomInput />
                <ToolbarButton
                    tip="Zoom In"
                    shortcut={`${mod}+=`}
                    onClick={() => zoomIn()}
                >
                    <ZoomIn className="w-3.5 h-3.5" />
                </ToolbarButton>
                <ToolbarButton
                    tip="Fit View"
                    shortcut={`${mod}+Shift+F`}
                    onClick={() => fitView({ padding: 0.2 })}
                >
                    <Maximize2 className="w-3.5 h-3.5" />
                </ToolbarButton>
                <ToolbarButton
                    tip="Auto Layout"
                    shortcut={`${mod}+Shift+L`}
                    onClick={handleRearrange}
                    disabled={!hasContent}
                >
                    <LayoutGrid className="w-3.5 h-3.5" />
                </ToolbarButton>
                <div className="w-px h-4 bg-[var(--glass-border)]" />
                <ToolbarButton
                    tip="Keyboard Shortcuts"
                    onClick={() => setShortcutsOpen(true)}
                >
                    <Keyboard className="w-3.5 h-3.5" />
                </ToolbarButton>
                <div className="w-px h-4 bg-[var(--glass-border)]" />
                <ToolbarButton
                    tip="Clear Canvas"
                    onClick={() => setConfirmOpen(true)}
                    disabled={!hasContent}
                    className="hover:!text-[var(--danger)]"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </ToolbarButton>
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
