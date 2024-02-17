import React from 'react';
import { Handle, NodeProps, NodeToolbar, Position } from 'reactflow';
import { WorkflowTransition } from '@/types/WorkflowTransition';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import GraphMetadata from '@/components/graph-metadata';

interface TransitionNodeProps extends NodeProps {
    data: WorkflowTransition;
    onAddMetadata?: (id: string) => void;
    onRemoveMetadata?: (index: number, id: string) => void;
    onChangeMetadata?: (e: React.ChangeEvent<HTMLInputElement>, index: number, id: string) => void;
    onChangeName?: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
}

const TransitionNode = React.memo<TransitionNodeProps>(
    ({ data, id, onChangeName, onChangeMetadata, onRemoveMetadata, onAddMetadata }) => {
        const handleNameChange = React.useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                if (onChangeName) {
                    onChangeName(e, id);
                }
            },
            [id, onChangeName],
        );

        return (
            <React.Fragment>
                <div className="p-4 shadow-md rounded-full border-2 border-teal-500">
                    <div className="flex flex-col">
                        <p className="text-sm font-bold">Transition</p>
                        <Input type="text" value={data.name} onChange={handleNameChange} />
                    </div>
                    <Handle
                        type="target"
                        position={Position.Left}
                        className="w-1 h-4 border-none rounded-sm bg-teal-500"
                    />
                    <Handle
                        type="source"
                        position={Position.Right}
                        className="w-1 h-4 border-none rounded-sm bg-teal-500"
                    />
                </div>
                <NodeToolbar position={Position.Bottom}>
                    <Card>
                        <CardContent className="p-4">
                            <GraphMetadata
                                id={id}
                                metadata={data.metadata || []}
                                onAddMetadata={onAddMetadata}
                                onChangeMetadata={onChangeMetadata}
                                onRemoveMetadata={onRemoveMetadata}
                            />
                        </CardContent>
                    </Card>
                </NodeToolbar>
            </React.Fragment>
        );
    },
);

export default TransitionNode;
