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
    addEdge,
    type NodeMouseHandler,
    type EdgeMouseHandler,
    type OnReconnect,
    type OnConnectEnd,
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
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

    // Handle connections: create transition nodes between state nodes.
    // Reads nodes/edges via getState() so the callback identity is stable across
    // graph mutations and doesn't churn ReactFlow's prop diff during drag.
    const onConnect = useCallback(
        (connection: Connection) => {
            if (!connection.source || !connection.target) return;
            const { nodes: currentNodes, edges: currentEdges } =
                useEditorStore.getState();

            const sourceNode = currentNodes.find((n) => n.id === connection.source);
            const targetNode = currentNodes.find((n) => n.id === connection.target);
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

                const existingLabels = currentNodes
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
                // addEdge() returns same ref on duplicate — skip snapshot on no-op.
                const newEdge: Edge = {
                    id: uid("edge"),
                    source: connection.source,
                    target: connection.target,
                    type: "connector",
                };
                const next = addEdge(newEdge, currentEdges);
                if (next === currentEdges) return;
                setEdges(next);
                snapshot();
            }
            // Block transition→transition connections (do nothing)
        },
        [addNode, setEdges, snapshot]
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

            const existingLabels = useEditorStore
                .getState()
                .nodes.map((n) => (n.data as unknown as StateNodeData).label);

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
        [screenToFlowPosition, addNode]
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
            const currentEdges = useEditorStore.getState().edges;
            const wouldDuplicate = currentEdges.some(
                (e) =>
                    e.id !== oldEdge.id &&
                    e.source === newConnection.source &&
                    e.target === newConnection.target
            );
            if (wouldDuplicate) return;
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

    // Drop on empty pane → auto-create.
    const onConnectEnd: OnConnectEnd = useCallback(
        (_event, connectionState) => {
            const { fromNode, fromHandle, toNode, to } = connectionState;
            // Drops onto an existing node are handled by onConnect; bail here.
            if (!fromNode || !fromHandle || toNode || !to) return;

            const isSource = fromHandle.type === "source";
            const currentNodes = useEditorStore.getState().nodes;

            if (fromNode.type === "transition") {
                // Transition → empty pane: create a state + 1 edge
                const newStateId = uid("state");
                const existingStateLabels = currentNodes
                    .filter((n) => n.type === "state")
                    .map((n) => (n.data as unknown as StateNodeData).label);
                addNode({
                    id: newStateId,
                    type: "state",
                    position: to,
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
                // State/sub-workflow → empty pane: create a transition + state + 2 edges
                const newStateId = uid("state");
                const transitionId = uid("transition");
                const existingStateLabels = currentNodes
                    .filter((n) => n.type === "state")
                    .map((n) => (n.data as unknown as StateNodeData).label);
                const existingTransitionLabels = currentNodes
                    .filter((n) => n.type === "transition")
                    .map((n) => (n.data as unknown as TransitionNodeData).label);

                const midX = (fromNode.position.x + to.x) / 2;
                const midY = (fromNode.position.y + to.y) / 2;

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
                    position: to,
                    data: {
                        label: uniqueName("state", existingStateLabels),
                        isInitial: false,
                        isFinal: false,
                        metadata: {},
                    } satisfies StateNodeData,
                });

                const sourceId = isSource ? fromNode.id : newStateId;
                const targetId = isSource ? newStateId : fromNode.id;
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
        },
        [addNode, setEdges, snapshot]
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
