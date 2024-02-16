import React from 'react';
import type { Edge, Node } from 'reactflow';
import { addEdge, Background, Connection, Controls, MiniMap, ReactFlow, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';
import PlaceNode from '@/components/place-node';
import TransitionNode from '@/components/transition-node';
import { WorkflowPlace } from '@/types/WorkflowPlace';
import { WorkflowTransition } from '@/types/WorkflowTransition';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { generateToken } from '@/helpers/token.helper';

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
            const placeNodes = config.places.map((place, index) => {
                const token = generateToken({ size: 16 });
                const placeName = `${place.name}_${token}`;
                x = x + index * 200;
                places[place.name] = placeName;
                return {
                    id: `node_${placeName}`,
                    position: { x, y },
                    data: place,
                    type: 'place',
                };
            });
            x = 100;
            y = 0;
            const transitions: { [key: string]: string } = {};
            const transitionNodes: Node<WorkflowTransition>[] = [];
            config.transitions.forEach((transition, index) => {
                const token = generateToken({ size: 16 });
                const transitionName = `${transition.name}_${token}`;
                x = x + index * 200;
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
        (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    return (
        <div className="flex flex-col items-center justify-center" style={{ height: '85vh', width: '99vw' }}>
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
