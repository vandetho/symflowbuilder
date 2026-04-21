"use client";

import { useCallback, useEffect, useRef } from "react";
import { Trash2, Copy, CircleDot, FlagOff, Play, Square, Plus } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { useEditorStore } from "@/stores/editor";
import type { StateNodeData } from "symflow/react-flow";
import { uid, uniqueName } from "@/lib/utils";

export interface ContextMenuState {
    type: "node" | "edge" | "pane";
    x: number;
    y: number;
    nodeId?: string;
    edgeId?: string;
}

interface ContextMenuProps {
    menu: ContextMenuState;
    onClose: () => void;
}

export function ContextMenu({ menu, onClose }: ContextMenuProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { screenToFlowPosition } = useReactFlow();
    const {
        nodes,
        updateNodeData,
        setSelectedNode,
        setSelectedEdge,
        addNode,
        snapshot,
        setEdges,
    } = useEditorStore();

    // Close on click outside or scroll
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
                onClose();
            }
        };
        const handleScroll = () => onClose();
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("scroll", handleScroll, true);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("scroll", handleScroll, true);
        };
    }, [onClose]);

    const selectedNode = menu.nodeId ? nodes.find((n) => n.id === menu.nodeId) : null;
    const nodeData = selectedNode?.data as unknown as StateNodeData | undefined;

    // --- Node actions ---
    const handleDeleteNode = useCallback(() => {
        if (!menu.nodeId) return;
        const store = useEditorStore.getState();
        store.setSelectedNode(menu.nodeId);
        store.deleteSelected();
        onClose();
    }, [menu.nodeId, onClose]);

    const handleToggleInitial = useCallback(() => {
        if (!menu.nodeId || !nodeData) return;
        updateNodeData(menu.nodeId, { isInitial: !nodeData.isInitial });
        snapshot();
        onClose();
    }, [menu.nodeId, nodeData, updateNodeData, snapshot, onClose]);

    const handleToggleFinal = useCallback(() => {
        if (!menu.nodeId || !nodeData) return;
        updateNodeData(menu.nodeId, { isFinal: !nodeData.isFinal });
        snapshot();
        onClose();
    }, [menu.nodeId, nodeData, updateNodeData, snapshot, onClose]);

    const handleEditNode = useCallback(() => {
        if (!menu.nodeId) return;
        setSelectedNode(menu.nodeId);
        onClose();
    }, [menu.nodeId, setSelectedNode, onClose]);

    const handleDuplicateNode = useCallback(() => {
        if (!selectedNode) return;
        const position = {
            x: selectedNode.position.x + 40,
            y: selectedNode.position.y + 40,
        };
        const existingLabels = nodes.map(
            (n) => (n.data as unknown as StateNodeData).label
        );
        addNode({
            id: uid("state"),
            type: "state",
            position,
            data: {
                ...(selectedNode.data as unknown as StateNodeData),
                label: uniqueName(`${nodeData?.label}_copy`, existingLabels),
            },
        });
        onClose();
    }, [selectedNode, nodeData, addNode, nodes, onClose]);

    // --- Edge actions ---
    const handleDeleteEdge = useCallback(() => {
        if (!menu.edgeId) return;
        setEdges((eds) => eds.filter((e) => e.id !== menu.edgeId));
        snapshot();
        onClose();
    }, [menu.edgeId, setEdges, snapshot, onClose]);

    const handleEditEdge = useCallback(() => {
        if (!menu.edgeId) return;
        setSelectedEdge(menu.edgeId);
        onClose();
    }, [menu.edgeId, setSelectedEdge, onClose]);

    // --- Pane actions ---
    const handleAddState = useCallback(() => {
        const position = screenToFlowPosition({ x: menu.x, y: menu.y });
        const existingLabels = nodes.map(
            (n) => (n.data as unknown as StateNodeData).label
        );
        addNode({
            id: uid("state"),
            type: "state",
            position,
            data: {
                label: uniqueName("state", existingLabels),
                isInitial: false,
                isFinal: false,
                metadata: {},
            } satisfies StateNodeData,
        });
        onClose();
    }, [menu.x, menu.y, screenToFlowPosition, addNode, nodes, onClose]);

    const items: {
        label: string;
        icon: React.ComponentType<{ className?: string }>;
        onClick: () => void;
        danger?: boolean;
    }[] = [];

    if (menu.type === "node") {
        items.push(
            { label: "Edit properties", icon: CircleDot, onClick: handleEditNode },
            { label: "Duplicate", icon: Copy, onClick: handleDuplicateNode },
            {
                label: nodeData?.isInitial ? "Unset initial" : "Set as initial",
                icon: nodeData?.isInitial ? FlagOff : Play,
                onClick: handleToggleInitial,
            },
            {
                label: nodeData?.isFinal ? "Unset final" : "Set as final",
                icon: nodeData?.isFinal ? FlagOff : Square,
                onClick: handleToggleFinal,
            },
            {
                label: "Delete state",
                icon: Trash2,
                onClick: handleDeleteNode,
                danger: true,
            }
        );
    } else if (menu.type === "edge") {
        items.push(
            { label: "Edit transition", icon: CircleDot, onClick: handleEditEdge },
            {
                label: "Delete transition",
                icon: Trash2,
                onClick: handleDeleteEdge,
                danger: true,
            }
        );
    } else {
        items.push({ label: "Add state here", icon: Plus, onClick: handleAddState });
    }

    return (
        <div
            ref={ref}
            style={{ top: menu.y, left: menu.x }}
            className="fixed z-50 min-w-[180px] bg-[#12121f] border border-[var(--glass-border)] rounded-[12px] p-1 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
            {items.map((item, i) => (
                <button
                    key={i}
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs transition-colors cursor-pointer ${
                        item.danger
                            ? "text-[var(--danger)] hover:bg-[var(--danger-dim)]"
                            : "text-[var(--text-secondary)] hover:bg-[var(--glass-hover)] hover:text-[var(--text-primary)]"
                    }`}
                >
                    <item.icon className="w-3.5 h-3.5 shrink-0" />
                    {item.label}
                </button>
            ))}
        </div>
    );
}
