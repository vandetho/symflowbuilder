"use client";

import { useCallback, type DragEvent } from "react";
import {
    ReactFlow,
    Background,
    BackgroundVariant,
    MiniMap,
    ReactFlowProvider,
    useReactFlow,
    type NodeMouseHandler,
    type EdgeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useEditorStore } from "@/stores/editor";
import { StateNode } from "./nodes/StateNode";
import { InitialNode } from "./nodes/InitialNode";
import { FinalNode } from "./nodes/FinalNode";
import { TransitionEdge } from "./edges/TransitionEdge";
import { NodePalette } from "./panels/NodePalette";
import { EditorToolbar } from "./panels/EditorToolbar";
import { EditorControls } from "./panels/EditorControls";
import { PropertiesPanel } from "./panels/PropertiesPanel";
import type { StateNodeData } from "@/types/workflow";

const nodeTypes = {
    state: StateNode,
    initial: InitialNode,
    final: FinalNode,
};

const edgeTypes = {
    transition: TransitionEdge,
};

function EditorCanvasInner() {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode,
        setSelectedNode,
        setSelectedEdge,
        snapshot,
        setNodes,
    } = useEditorStore();

    const { screenToFlowPosition } = useReactFlow();

    const onDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (e: DragEvent) => {
            e.preventDefault();
            const type = e.dataTransfer.getData("application/reactflow");
            if (!type) return;

            const position = screenToFlowPosition({
                x: e.clientX,
                y: e.clientY,
            });

            const newNode = {
                id: `${type}-${Date.now()}`,
                type,
                position,
                data:
                    type === "state"
                        ? ({
                              label: "new_state",
                              isInitial: false,
                              isFinal: false,
                              metadata: {},
                          } satisfies StateNodeData)
                        : {},
            };

            addNode(newNode);
        },
        [screenToFlowPosition, addNode]
    );

    const onNodeClick: NodeMouseHandler = useCallback(
        (_event, node) => {
            setSelectedNode(node.id);
        },
        [setSelectedNode]
    );

    const onEdgeClick: EdgeMouseHandler = useCallback(
        (_event, edge) => {
            setSelectedEdge(edge.id);
        },
        [setSelectedEdge]
    );

    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
        setSelectedEdge(null);
    }, [setSelectedNode, setSelectedEdge]);

    const onNodeDragStop = useCallback(() => {
        snapshot();
    }, [snapshot]);

    return (
        <div className="relative w-full h-full">
            <EditorToolbar />

            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                onPaneClick={onPaneClick}
                onNodeDragStop={onNodeDragStop}
                fitView
                proOptions={{ hideAttribution: true }}
                defaultEdgeOptions={{ type: "transition" }}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1}
                    color="rgba(255,255,255,0.07)"
                />
                <MiniMap
                    className="!bg-[rgba(255,255,255,0.06)] !border !border-[var(--glass-border-hover)] !rounded-[14px] !shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                    nodeColor="rgba(124,111,247,0.4)"
                    maskColor="rgba(0,0,0,0.6)"
                />
            </ReactFlow>

            <NodePalette />
            <EditorControls />
            <PropertiesPanel />
        </div>
    );
}

export function EditorCanvas() {
    return (
        <ReactFlowProvider>
            <EditorCanvasInner />
        </ReactFlowProvider>
    );
}
