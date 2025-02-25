import React from 'react';
import {
    addEdge,
    Background,
    Connection,
    Controls,
    Edge,
    EdgeChange,
    MarkerType,
    MiniMap,
    Node,
    NodeProps,
    ReactFlow,
    ReactFlowInstance,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { PlaceNode } from '@/components/place-node';
import { TransitionNode } from '@/components/transition-node';
import { WorkflowPlace } from '@/types/WorkflowPlace';
import { isWorkflowTransition, WorkflowTransition } from '@/types/WorkflowTransition';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { generateToken } from '@/helpers/token.helper';
import { GraphToolbar } from '@/components/graph-toolbar';
import { ExportImageButton } from '@/components/export-image-button';
import ElkConstructor from 'elkjs';
import { useSessionStorageDispatch, useSessionStorageState } from '@/hooks/session-storage-hook';

type GraphBuilderProps = {
    config: WorkflowConfig | undefined;
};

export const GraphBuilder = React.memo<GraphBuilderProps>(({ config }) => {
    const reactFlowWrapper = React.useRef<HTMLDivElement>(null);
    const { nodeConfig, edgeConfig } = useSessionStorageState();
    const dispatch = useSessionStorageDispatch();
    const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowPlace | WorkflowTransition>(nodeConfig || []);
    const [edges, setEdges, onEdgesChange] = useEdgesState(edgeConfig || []);
    const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | undefined>();

    React.useEffect(() => {
        if (config) {
            let x = 0;
            let y = 0;
            const places: { [key: string]: string } = {};
            const placeNodes = config.places.map((place) => {
                const token = generateToken({ size: 16 });
                const placeName = `place_${place.name}_${token}`;
                x = x + 400;
                places[place.name] = placeName;
                return {
                    id: placeName,
                    position: { x, y },
                    data: place,
                    type: 'place',
                };
            });
            x = 200;
            y = 0;
            const transitions: { [key: string]: string } = {};
            const transitionNodes: Node<WorkflowTransition>[] = [];
            config.transitions.forEach((transition) => {
                const token = generateToken({ size: 16 });
                const transitionName = `transition_${transition.name}_${token}`;
                x = x + 400;
                transitions[transition.name] = transitionName;
                transitionNodes.push({
                    id: transitionName,
                    position: { x, y },
                    data: {
                        ...transition,
                        from: transition.from.map((from) => places[from]),
                        to: transition.to.map((to) => places[to]),
                    },
                    type: 'transition',
                });
            });
            const transitionEdges: Edge<WorkflowTransition>[] = [];
            config.transitions.forEach((transition) => {
                transition.from.forEach((from) => {
                    transitionEdges.push({
                        id: `edge_${from}_${transition.name}`,
                        source: places[from],
                        target: transitions[transition.name],
                        type: 'smoothstep',
                        animated: true,
                        style: { strokeWidth: 5 },
                    });
                });
                transition.to.forEach((to) => {
                    transitionEdges.push({
                        id: `edge_${transition.name}_${to}`,
                        source: transitions[transition.name],
                        target: places[to],
                        type: 'smoothstep',
                        animated: true,
                        style: { strokeWidth: 5 },
                    });
                });
            });

            const nodes = [...placeNodes, ...transitionNodes];
            const edges = [...transitionEdges];

            const elk = new ElkConstructor();
            const graph = {
                id: 'root',
                layoutOptions: {
                    'elk.algorithm': 'layered',
                    'elk.direction': 'RIGHT',
                    'nodePlacement.strategy': 'SIMPLE',
                    'elk.spacing.nodeNode': '100', // Increase the distance between nodes
                    'elk.layered.spacing.nodeNodeBetweenLayers': '200', // Increase the distance between layers
                },
                children: nodes.map((node) => ({
                    ...node,
                    width: 210,
                    height: 150,
                })),
                edges: edges.map((edge) => ({
                    ...edge,
                    sources: [edge.source],
                    targets: [edge.target],
                })),
            };

            elk.layout(graph).then((layout) => {
                if (layout.children) {
                    const newNodes: any[] = layout.children.map((child) => ({
                        ...nodes.find((n) => n.id === child.id),
                        position: { x: child.x, y: child.y },
                    }));
                    setNodes(newNodes);
                    dispatch({ type: 'SET_NODE_CONFIG', payload: newNodes });
                }
                if (layout.edges) {
                    const newEdges: any[] = layout.edges.map((edge) => ({
                        ...edges.find((e) => e.id === edge.id),
                        source: edge.sources[0],
                        target: edge.targets[0],
                    }));

                    setEdges(newEdges);
                    dispatch({ type: 'SET_EDGE_CONFIG', payload: newEdges });
                }
            });
        }
    }, [config, dispatch, setEdges, setNodes]);

    const isValidConnection = React.useCallback(
        (connection: Connection) => !(connection.target?.includes('place') && connection.source?.includes('place')),
        [],
    );

    const onConnect = React.useCallback(
        (params: Edge | Connection) => {
            setEdges((eds) =>
                addEdge(
                    {
                        ...params,
                        animated: true,
                        type: 'smoothstep',
                        style: { strokeWidth: 5 },
                        markerEnd: { type: MarkerType.ArrowClosed },
                    },
                    eds,
                ),
            );
            const tmpNodes = [...nodes];
            const sourceIndex = tmpNodes.findIndex((node) => node.id === params.source);
            const targetIndex = tmpNodes.findIndex((node) => node.id === params.target);
            const source = tmpNodes[sourceIndex];
            const target = tmpNodes[targetIndex];
            if (
                target &&
                source &&
                source.type === 'place' &&
                target.type === 'transition' &&
                isWorkflowTransition(target.data)
            ) {
                target.data.from = (target.data.from ? [...target.data.from, source.id] : [source.id]).filter(
                    (value, index, array) => array.indexOf(value) === index,
                );
                tmpNodes[targetIndex] = target;
            }
            if (
                target &&
                source &&
                source.type === 'transition' &&
                target.type === 'place' &&
                isWorkflowTransition(source.data)
            ) {
                source.data.to = (source.data.to ? [...source.data.to, target.id] : [target.id]).filter(
                    (value, index, array) => array.indexOf(value) === index,
                );
                tmpNodes[targetIndex] = target;
            }
            setNodes(tmpNodes);
            dispatch({ type: 'SET_NODE_CONFIG', payload: tmpNodes });
        },
        [dispatch, nodes, setEdges, setNodes],
    );

    const addPlaceNode = React.useCallback(() => {
        setNodes((prevState) => {
            return [
                ...prevState,
                {
                    id: `place_${generateToken()}`,
                    position: { x: 100, y: 100 },
                    data: { name: 'place', metadata: [] },
                    type: 'place',
                },
            ];
        });
    }, [setNodes]);

    const addTransitionNode = React.useCallback(() => {
        setNodes((prevState) => {
            return [
                ...prevState,
                {
                    id: `transition_${generateToken()}`,
                    position: { x: 100, y: 100 },
                    data: { name: 'transition', to: [], from: [], metadata: [], guard: '' },
                    type: 'transition',
                },
            ];
        });
    }, [setNodes]);

    const onChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
            setNodes((prevState) => {
                return prevState.map((node) => {
                    if (node.id === id) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                [e.target.name]: e.target.value,
                            },
                        };
                    }
                    return node;
                });
            });
        },
        [setNodes],
    );

    const handleEdgeChange = React.useCallback(
        (edge: EdgeChange[]) => {
            edge.forEach((edge) => {
                if (edge.type === 'remove') {
                    const ids = edge.id.split('-').splice(1);
                    const placeIndex = ids.findIndex((id) => id.includes('place'));
                    const transitionIndex = ids.findIndex((id) => id.includes('transition'));
                    const placeId = ids[placeIndex];
                    const transitionId = ids[transitionIndex];
                    setNodes((prevNodes) => {
                        const placeIndex = prevNodes.findIndex((node) => node.id === placeId);
                        const transitionIndex = prevNodes.findIndex((node) => node.id === transitionId);
                        const place = prevNodes[placeIndex];
                        const transition = prevNodes[transitionIndex];
                        if (
                            placeIndex > transitionIndex &&
                            place &&
                            transition &&
                            isWorkflowTransition(transition.data)
                        ) {
                            transition.data.to = transition.data.to?.filter((id) => id !== placeId);
                            prevNodes[transitionIndex] = transition;
                        }
                        if (
                            placeIndex < transitionIndex &&
                            place &&
                            transition &&
                            isWorkflowTransition(transition.data)
                        ) {
                            transition.data.from = transition.data.from?.filter((id) => id !== placeId);
                            prevNodes[transitionIndex] = transition;
                        }
                        prevNodes[transitionIndex] = transition;
                        return prevNodes;
                    });
                }
            });
            onEdgesChange(edge);
        },
        [onEdgesChange, setNodes],
    );

    const onAddMetadata = React.useCallback(
        (id: string) => {
            setNodes((prevNodes) => {
                return prevNodes.map((node) => {
                    if (node.id === id) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                metadata: [...(node.data.metadata || []), { name: '', value: '' }],
                            },
                        };
                    }
                    return node;
                });
            });
        },
        [setNodes],
    );

    const onRemoveMetadata = React.useCallback(
        (index: number, id: string) => {
            setNodes((prevNodes) => {
                return prevNodes.map((node) => {
                    if (node.id === id) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                metadata: node.data.metadata?.filter((_, idx) => idx !== index),
                            },
                        };
                    }
                    return node;
                });
            });
        },
        [setNodes],
    );

    const onChangeMetadata = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, index: number, id: string) => {
            setNodes((prevNodes) => {
                return prevNodes.map((node) => {
                    if (node.id === id) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                metadata: node.data.metadata?.map((meta, idx) => {
                                    if (idx === index) {
                                        return {
                                            ...meta,
                                            [e.target.name]: e.target.value,
                                        };
                                    }
                                    return meta;
                                }),
                            },
                        };
                    }
                    return node;
                });
            });
        },
        [setNodes],
    );

    const NodeTypes = React.useMemo(
        () => ({
            place: (props: NodeProps) => (
                <PlaceNode
                    {...props}
                    onChange={onChange}
                    onAddMetadata={onAddMetadata}
                    onRemoveMetadata={onRemoveMetadata}
                    onChangeMetadata={onChangeMetadata}
                />
            ),
            transition: (props: NodeProps) => (
                <TransitionNode
                    {...props}
                    onChange={onChange}
                    onAddMetadata={onAddMetadata}
                    onRemoveMetadata={onRemoveMetadata}
                    onChangeMetadata={onChangeMetadata}
                />
            ),
        }),
        [onAddMetadata, onChangeMetadata, onChange, onRemoveMetadata],
    );

    const onEmptyPanel = React.useCallback(() => {
        setNodes([]);
        setEdges([]);
    }, [setEdges, setNodes]);

    const onDragOver = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = React.useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            if (reactFlowInstance) {
                const position = reactFlowInstance.screenToFlowPosition({
                    x: event.clientX,
                    y: event.clientY,
                });
                const newNode: Node<WorkflowPlace> = {
                    id: `${type}_${generateToken()}`,
                    type,
                    position,
                    data: { name: type, metadata: [] },
                };
                const tmpNodes = [...nodes, newNode];
                setNodes(tmpNodes);
                dispatch({ type: 'SET_NODE_CONFIG', payload: tmpNodes });
            }
        },
        [dispatch, nodes, reactFlowInstance, setNodes],
    );

    return (
        <ReactFlowProvider>
            <div
                ref={reactFlowWrapper}
                className="reactflow-wrapper flex flex-col items-center justify-center gap-3"
                style={{ height: '91vh', width: '99vw' }}
            >
                <GraphToolbar
                    nodes={nodes}
                    addPlaceNode={addPlaceNode}
                    addTransitionNode={addTransitionNode}
                    onEmptyPanel={onEmptyPanel}
                />
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={NodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={handleEdgeChange}
                    onConnect={onConnect}
                    isValidConnection={isValidConnection}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                >
                    <Controls />
                    <MiniMap className="dark:bg-background" zoomable pannable position="bottom-right" />
                    <Background gap={25} size={2} />
                    <ExportImageButton />
                </ReactFlow>
            </div>
        </ReactFlowProvider>
    );
});

GraphBuilder.displayName = 'GraphBuilder';
