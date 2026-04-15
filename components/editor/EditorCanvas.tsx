"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";
import {
    ReactFlow,
    Background,
    BackgroundVariant,
    MiniMap,
    ReactFlowProvider,
    useReactFlow,
    reconnectEdge,
    type NodeMouseHandler,
    type EdgeMouseHandler,
    type OnReconnect,
    type Connection,
    type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useEditorStore } from "@/stores/editor";
import { StateNode } from "./nodes/StateNode";
import { TransitionEdge } from "./edges/TransitionEdge";
import { NodePalette } from "./panels/NodePalette";
import { EditorToolbar } from "./panels/EditorToolbar";
import { EditorControls } from "./panels/EditorControls";
import { PropertiesPanel } from "./panels/PropertiesPanel";
import { ContextMenu, type ContextMenuState } from "./panels/ContextMenu";
import type { StateNodeData, TransitionEdgeData } from "@/types/workflow";
import { uid, uniqueName } from "@/lib/utils";

const nodeTypes = {
    state: StateNode,
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
        onConnect: storeOnConnect,
        addNode,
        setSelectedNode,
        setSelectedEdge,
        selectedNodeId,
        selectedEdgeId,
        snapshot,
        setEdges,
    } = useEditorStore();

    const { screenToFlowPosition } = useReactFlow();
    const connectingFrom = useRef<{
        nodeId: string;
        handleType: string;
    } | null>(null);
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

    // Wrap onConnect to clear connectingFrom on successful connection
    const onConnect = useCallback(
        (connection: Connection) => {
            connectingFrom.current = null;
            storeOnConnect(connection);
        },
        [storeOnConnect]
    );

    // --- Drag & drop from palette ---
    const onDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (e: DragEvent) => {
            e.preventDefault();
            const type = e.dataTransfer.getData("application/reactflow");
            if (type !== "state") return;

            const position = screenToFlowPosition({
                x: e.clientX,
                y: e.clientY,
            });

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
        },
        [screenToFlowPosition, addNode, nodes]
    );

    // --- Selection ---
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
        setContextMenu(null);
    }, [setSelectedNode, setSelectedEdge]);

    // --- Context menu ---
    const onNodeContextMenu: NodeMouseHandler = useCallback((event, node) => {
        event.preventDefault();
        setContextMenu({
            type: "node",
            x: event.clientX,
            y: event.clientY,
            nodeId: node.id,
        });
    }, []);

    const onEdgeContextMenu: EdgeMouseHandler = useCallback((event, edge) => {
        event.preventDefault();
        setContextMenu({
            type: "edge",
            x: event.clientX,
            y: event.clientY,
            edgeId: edge.id,
        });
    }, []);

    const onPaneContextMenu = useCallback((event: MouseEvent | React.MouseEvent) => {
        event.preventDefault();
        setContextMenu({
            type: "pane",
            x: "clientX" in event ? event.clientX : 0,
            y: "clientY" in event ? event.clientY : 0,
        });
    }, []);

    // --- Snap undo history after drag ---
    const onNodeDragStop = useCallback(() => {
        snapshot();
    }, [snapshot]);

    // --- Reconnect: drag edge endpoint to a different state ---
    const edgeReconnectSuccessful = useRef(true);

    const onReconnectStart = useCallback(() => {
        edgeReconnectSuccessful.current = false;
    }, []);

    const onReconnect: OnReconnect = useCallback(
        (oldEdge: Edge, newConnection: Connection) => {
            edgeReconnectSuccessful.current = true;
            setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds));
            snapshot();
        },
        [setEdges, snapshot]
    );

    const onReconnectEnd = useCallback(
        (_event: MouseEvent | TouchEvent, edge: Edge) => {
            if (!edgeReconnectSuccessful.current) {
                // Edge was dropped on empty space — delete it
                setEdges((eds) => eds.filter((e) => e.id !== edge.id));
                snapshot();
            }
            edgeReconnectSuccessful.current = true;
        },
        [setEdges, snapshot]
    );

    // --- Connect start/end: drop on empty space creates a new state ---
    const onConnectStart = useCallback(
        (
            _event: MouseEvent | TouchEvent,
            params: { nodeId: string | null; handleType: string | null }
        ) => {
            if (params.nodeId && params.handleType) {
                connectingFrom.current = {
                    nodeId: params.nodeId,
                    handleType: params.handleType,
                };
            }
        },
        []
    );

    const onConnectEnd = useCallback(
        (event: MouseEvent | TouchEvent) => {
            if (!connectingFrom.current) return;

            const target = (event as MouseEvent).target as HTMLElement;
            // Only create node if dropped on the pane (not on another node/handle)
            const isPane = target.closest(".react-flow__pane");
            if (!isPane) {
                connectingFrom.current = null;
                return;
            }

            const clientX =
                "clientX" in event ? event.clientX : event.changedTouches[0].clientX;
            const clientY =
                "clientY" in event ? event.clientY : event.changedTouches[0].clientY;

            const position = screenToFlowPosition({ x: clientX, y: clientY });
            const newNodeId = uid("state");

            // Create the new state node
            const existingStateLabels = nodes.map(
                (n) => (n.data as unknown as StateNodeData).label
            );
            addNode({
                id: newNodeId,
                type: "state",
                position,
                data: {
                    label: uniqueName("state", existingStateLabels),
                    isInitial: false,
                    isFinal: false,
                    metadata: {},
                } satisfies StateNodeData,
            });

            // Create the transition edge
            const existingEdgeLabels = edges
                .map((e) => (e.data as unknown as TransitionEdgeData)?.label)
                .filter(Boolean) as string[];
            const isSource = connectingFrom.current.handleType === "source";
            const newEdge: Edge = {
                id: uid("edge"),
                source: isSource ? connectingFrom.current.nodeId : newNodeId,
                target: isSource ? newNodeId : connectingFrom.current.nodeId,
                type: "transition",
                data: {
                    label: uniqueName("transition", existingEdgeLabels),
                    guard: undefined,
                    listeners: [],
                    metadata: {},
                } satisfies TransitionEdgeData,
            };
            setEdges((eds) => [...eds, newEdge]);
            snapshot();

            connectingFrom.current = null;
        },
        [screenToFlowPosition, addNode, setEdges, snapshot, nodes, edges]
    );

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
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectEnd}
                onReconnect={onReconnect}
                onReconnectStart={onReconnectStart}
                onReconnectEnd={onReconnectEnd}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                onPaneClick={onPaneClick}
                onNodeContextMenu={onNodeContextMenu}
                onEdgeContextMenu={onEdgeContextMenu}
                onPaneContextMenu={onPaneContextMenu}
                onNodeDragStop={onNodeDragStop}
                fitView
                proOptions={{ hideAttribution: true }}
                defaultEdgeOptions={{ type: "transition" }}
                deleteKeyCode={["Backspace", "Delete"]}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1}
                    color="rgba(255,255,255,0.07)"
                />
                {!selectedNodeId && !selectedEdgeId && (
                    <MiniMap
                        className="!bg-[rgba(255,255,255,0.06)] !border !border-[var(--glass-border-hover)] !rounded-[14px] !shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                        nodeColor="rgba(124,111,247,0.4)"
                        maskColor="rgba(0,0,0,0.6)"
                    />
                )}
            </ReactFlow>

            <NodePalette />
            <EditorControls />
            <PropertiesPanel />
            {contextMenu && (
                <ContextMenu menu={contextMenu} onClose={() => setContextMenu(null)} />
            )}
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
