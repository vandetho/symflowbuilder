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
import { useSimulatorStore } from "@/stores/simulator";
import { StateNode } from "./nodes/StateNode";
import { TransitionNode } from "./nodes/TransitionNode";
import { SubWorkflowNode } from "./nodes/SubWorkflowNode";
import { ConnectorEdge } from "./edges/ConnectorEdge";
import { NodePalette } from "./panels/NodePalette";
import { EditorToolbar } from "./panels/EditorToolbar";
import { EditorControls } from "./panels/EditorControls";
import { PropertiesPanel } from "./panels/PropertiesPanel";
import { SimulatorPanel } from "./panels/SimulatorPanel";
import { ContextMenu, type ContextMenuState } from "./panels/ContextMenu";
import type { StateNodeData, TransitionNodeData } from "symflow/react-flow";
import type { SubWorkflowNodeData } from "@/types/subworkflow";
import { uid, uniqueName } from "@/lib/utils";

const nodeTypes = {
    state: StateNode,
    transition: TransitionNode,
    subworkflow: SubWorkflowNode,
};

const edgeTypes = {
    connector: ConnectorEdge,
};

function EditorCanvasInner() {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect: _storeOnConnect,
        addNode,
        setSelectedNode,
        setSelectedEdge,
        selectedNodeId,
        selectedEdgeId,
        snapshot,
        setEdges,
    } = useEditorStore();

    const simActive = useSimulatorStore((s) => s.active);
    const { screenToFlowPosition } = useReactFlow();
    const connectingFrom = useRef<{
        nodeId: string;
        handleType: string;
    } | null>(null);
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

    // Handle connections: create transition nodes between state nodes
    const onConnect = useCallback(
        (connection: Connection) => {
            connectingFrom.current = null;
            if (!connection.source || !connection.target) return;

            const sourceNode = nodes.find((n) => n.id === connection.source);
            const targetNode = nodes.find((n) => n.id === connection.target);
            if (!sourceNode || !targetNode) return;

            const sourceIsPlace =
                sourceNode.type === "state" || sourceNode.type === "subworkflow";
            const targetIsPlace =
                targetNode.type === "state" || targetNode.type === "subworkflow";

            if (sourceIsPlace && targetIsPlace) {
                // State→State: create an intermediate transition node + 2 edges
                const transitionId = uid("transition");
                const midX = (sourceNode.position.x + targetNode.position.x) / 2;
                const midY = (sourceNode.position.y + targetNode.position.y) / 2;

                const existingLabels = nodes
                    .filter((n) => n.type === "transition")
                    .map((n) => (n.data as unknown as TransitionNodeData).label);

                addNode({
                    id: transitionId,
                    type: "transition",
                    position: { x: midX, y: midY },
                    data: {
                        label: uniqueName("transition", existingLabels),
                        guard: undefined,
                        listeners: [],
                        metadata: {},
                    } satisfies TransitionNodeData,
                });
                setEdges((eds) => [
                    ...eds,
                    {
                        id: uid("edge"),
                        source: connection.source!,
                        target: transitionId,
                        type: "connector",
                    },
                    {
                        id: uid("edge"),
                        source: transitionId,
                        target: connection.target!,
                        type: "connector",
                    },
                ]);
                snapshot();
            } else if (
                (sourceIsPlace && targetNode.type === "transition") ||
                (sourceNode.type === "transition" && targetIsPlace)
            ) {
                // State→Transition or Transition→State: add a single connector edge
                setEdges((eds) => [
                    ...eds,
                    {
                        id: uid("edge"),
                        source: connection.source!,
                        target: connection.target!,
                        type: "connector",
                    },
                ]);
                snapshot();
            }
            // Block transition→transition connections (do nothing)
        },
        [nodes, addNode, setEdges, snapshot]
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
            if (type !== "state" && type !== "subworkflow") return;

            const position = screenToFlowPosition({
                x: e.clientX,
                y: e.clientY,
            });

            const existingLabels = nodes.map(
                (n) => (n.data as unknown as StateNodeData).label
            );

            if (type === "subworkflow") {
                addNode({
                    id: uid("subworkflow"),
                    type: "subworkflow",
                    position,
                    data: {
                        label: uniqueName("sub_workflow", existingLabels),
                        workflowId: null,
                        workflowName: null,
                        metadata: {},
                    } satisfies SubWorkflowNodeData,
                });
            } else {
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
            }
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
            const fromNode = nodes.find((n) => n.id === connectingFrom.current!.nodeId);
            const isSource = connectingFrom.current.handleType === "source";

            if (fromNode?.type === "transition") {
                // Dragging from a transition node → create a new state node + 1 edge
                const newStateId = uid("state");
                const existingStateLabels = nodes
                    .filter((n) => n.type === "state")
                    .map((n) => (n.data as unknown as StateNodeData).label);
                addNode({
                    id: newStateId,
                    type: "state",
                    position,
                    data: {
                        label: uniqueName("state", existingStateLabels),
                        isInitial: false,
                        isFinal: false,
                        metadata: {},
                    } satisfies StateNodeData,
                });
                setEdges((eds) => [
                    ...eds,
                    {
                        id: uid("edge"),
                        source: isSource ? fromNode.id : newStateId,
                        target: isSource ? newStateId : fromNode.id,
                        type: "connector",
                    },
                ]);
            } else {
                // Dragging from a state node → create transition node + new state + edges
                const newStateId = uid("state");
                const transitionId = uid("transition");
                const existingStateLabels = nodes
                    .filter((n) => n.type === "state")
                    .map((n) => (n.data as unknown as StateNodeData).label);
                const existingTransitionLabels = nodes
                    .filter((n) => n.type === "transition")
                    .map((n) => (n.data as unknown as TransitionNodeData).label);

                const midX = (fromNode!.position.x + position.x) / 2;
                const midY = (fromNode!.position.y + position.y) / 2;

                addNode({
                    id: transitionId,
                    type: "transition",
                    position: { x: midX, y: midY },
                    data: {
                        label: uniqueName("transition", existingTransitionLabels),
                        guard: undefined,
                        listeners: [],
                        metadata: {},
                    } satisfies TransitionNodeData,
                });
                addNode({
                    id: newStateId,
                    type: "state",
                    position,
                    data: {
                        label: uniqueName("state", existingStateLabels),
                        isInitial: false,
                        isFinal: false,
                        metadata: {},
                    } satisfies StateNodeData,
                });

                const sourceId = isSource ? fromNode!.id : newStateId;
                const targetId = isSource ? newStateId : fromNode!.id;
                setEdges((eds) => [
                    ...eds,
                    {
                        id: uid("edge"),
                        source: sourceId,
                        target: transitionId,
                        type: "connector",
                    },
                    {
                        id: uid("edge"),
                        source: transitionId,
                        target: targetId,
                        type: "connector",
                    },
                ]);
            }
            snapshot();
            connectingFrom.current = null;
        },
        [screenToFlowPosition, addNode, setEdges, snapshot, nodes]
    );

    return (
        <div className="relative w-full h-full">
            <EditorToolbar />

            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodesChange={simActive ? undefined : onNodesChange}
                onEdgesChange={simActive ? undefined : onEdgesChange}
                onConnect={simActive ? undefined : onConnect}
                onConnectStart={simActive ? undefined : onConnectStart}
                onConnectEnd={simActive ? undefined : onConnectEnd}
                onReconnect={simActive ? undefined : onReconnect}
                onReconnectStart={simActive ? undefined : onReconnectStart}
                onReconnectEnd={simActive ? undefined : onReconnectEnd}
                onDragOver={simActive ? undefined : onDragOver}
                onDrop={simActive ? undefined : onDrop}
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                onPaneClick={onPaneClick}
                onNodeContextMenu={simActive ? undefined : onNodeContextMenu}
                onEdgeContextMenu={simActive ? undefined : onEdgeContextMenu}
                onPaneContextMenu={simActive ? undefined : onPaneContextMenu}
                onNodeDragStop={simActive ? undefined : onNodeDragStop}
                nodesDraggable={!simActive}
                nodesConnectable={!simActive}
                fitView
                proOptions={{ hideAttribution: true }}
                defaultEdgeOptions={{ type: "connector" }}
                deleteKeyCode={simActive ? [] : ["Backspace", "Delete"]}
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

            {!simActive && <NodePalette />}
            <EditorControls />
            {!simActive && <PropertiesPanel />}
            <SimulatorPanel />
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
