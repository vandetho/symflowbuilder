import React from 'react';
import {
    addEdge,
    Background,
    Connection,
    Controls,
    Edge,
    MiniMap,
    Node,
    NodeProps,
    ReactFlow,
    useEdgesState,
    useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import PlaceNode from '@/components/place-node';
import TransitionNode from '@/components/transition-node';
import { WorkflowPlace } from '@/types/WorkflowPlace';
import { isWorkflowTransition, WorkflowTransition } from '@/types/WorkflowTransition';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { generateToken } from '@/helpers/token.helper';
import GraphToolbar from '@/components/graph-toolbar';

type GraphBuilderProps = {
    config: WorkflowConfig | undefined;
};

export const GraphBuilder = React.memo<GraphBuilderProps>(({ config }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowPlace | WorkflowTransition>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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
                    });
                });
                transition.to.forEach((to) => {
                    transitionEdges.push({
                        id: `edge_${transition.name}_${to}`,
                        source: transitions[transition.name],
                        target: places[to],
                    });
                });
            });
            setNodes((prevNode) => [...prevNode, ...placeNodes, ...transitionNodes]);
            setEdges((prevEdges) => [...prevEdges, ...transitionEdges]);
        }
    }, [config, setEdges, setNodes]);

    const onConnect = React.useCallback(
        (params: Edge | Connection) => {
            console.log({ params });
            setEdges((eds) => addEdge(params, eds));
            setNodes((prevNodes) => {
                const sourceIndex = prevNodes.findIndex((node) => node.id === params.source);
                const targetIndex = prevNodes.findIndex((node) => node.id === params.target);
                const source = prevNodes[sourceIndex];
                const target = prevNodes[targetIndex];
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
                    prevNodes[targetIndex] = target;
                }
                if (
                    target &&
                    source &&
                    source.type === 'transition' &&
                    target.type === 'place' &&
                    isWorkflowTransition(source.data)
                ) {
                    source.data.to = (source.data.from ? [...source.data.from, target.id] : [target.id]).filter(
                        (value, index, array) => array.indexOf(value) === index,
                    );
                    prevNodes[targetIndex] = target;
                }
                return prevNodes;
            });
        },
        [setEdges, setNodes],
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

    const onChangeName = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
            setNodes((prevState) => {
                return prevState.map((node) => {
                    if (node.id === id) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                name: e.target.value,
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
            place: (props: NodeProps) => <PlaceNode {...props} onChangeName={onChangeName} />,
            transition: (props: NodeProps) => <TransitionNode {...props} onChangeName={onChangeName} />,
        }),
        [onChangeName],
    );
    return (
        <div className="flex flex-col items-center justify-center gap-3" style={{ height: '85vh', width: '99vw' }}>
            <GraphToolbar addPlaceNode={addPlaceNode} addTransitionNode={addTransitionNode} />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={NodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
            >
                <Controls />
                <MiniMap zoomable pannable position="top-right" />
                <Background gap={12} size={1} />
            </ReactFlow>
        </div>
    );
});

export default GraphBuilder;
