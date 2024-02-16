import React from 'react';
import {
    addEdge,
    Background,
    Connection,
    Controls,
    Edge,
    MiniMap,
    Node,
    ReactFlow,
    useEdgesState,
    useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import PlaceNode from '@/components/place-node';
import TransitionNode from '@/components/transition-node';
import { WorkflowPlace } from '@/types/WorkflowPlace';
import { WorkflowTransition } from '@/types/WorkflowTransition';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { generateToken } from '@/helpers/token.helper';
import GraphToolbar from '@/components/graph-toolbar';

const nodeTypes = { place: PlaceNode, transition: TransitionNode };

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
                const placeName = `${place.name}_${token}`;
                x = x + 400;
                places[place.name] = placeName;
                return {
                    id: `node_${placeName}`,
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
                const transitionName = `${transition.name}_${token}`;
                x = x + 400;
                transitions[transition.name] = transitionName;
                transitionNodes.push({
                    id: `node_${transitionName}`,
                    position: { x, y },
                    data: transition,
                    type: 'transition',
                });
            });
            const transitionEdges: Edge<WorkflowTransition>[] = [];
            config.transitions.forEach((transition) => {
                transition.from.forEach((from) => {
                    transitionEdges.push({
                        id: `edge_${from}_${transition.name}`,
                        source: `node_${places[from]}`,
                        target: `node_${transitions[transition.name]}`,
                    });
                });
                transition.to.forEach((to) => {
                    transitionEdges.push({
                        id: `edge_${transition.name}_${to}`,
                        source: `node_${transitions[transition.name]}`,
                        target: `node_${places[to]}`,
                    });
                });
            });
            setNodes([...placeNodes, ...transitionNodes]);
            setEdges(transitionEdges);
        }
    }, [config, setEdges, setNodes]);

    const onConnect = React.useCallback(
        (params: Edge | Connection) => {
            setEdges((eds) => addEdge(params, eds));
        },
        [setEdges],
    );

    const addPlaceNode = React.useCallback(() => {
        setNodes((prevState) => {
            return [
                ...prevState,
                {
                    id: `node_${Math.random()}`,
                    position: { x: 100, y: 100 },
                    data: { name: 'place' },
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
                    id: `node_${Math.random()}`,
                    position: { x: 100, y: 100 },
                    data: { name: 'transition' },
                    type: 'transition',
                },
            ];
        });
    }, [setNodes]);

    return (
        <div className="flex flex-col items-center justify-center gap-3" style={{ height: '85vh', width: '99vw' }}>
            <GraphToolbar addPlaceNode={addPlaceNode} addTransitionNode={addTransitionNode} />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
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
