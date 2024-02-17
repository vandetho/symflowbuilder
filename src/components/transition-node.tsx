import React from 'react';
import { Handle, NodeProps, NodeToolbar, Position } from 'reactflow';
import { WorkflowTransition } from '@/types/WorkflowTransition';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import GraphMetadata from '@/components/graph-metadata';
import { Label } from '@/components/ui/label';

interface TransitionNodeProps extends NodeProps {
    data: WorkflowTransition;
    onAddMetadata?: (id: string) => void;
    onRemoveMetadata?: (index: number, id: string) => void;
    onChangeMetadata?: (e: React.ChangeEvent<HTMLInputElement>, index: number, id: string) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
}

const TransitionNode = React.memo<TransitionNodeProps>(
    ({ data, id, onChange, onChangeMetadata, onRemoveMetadata, onAddMetadata }) => {
        const handleChange = React.useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                if (onChange) {
                    onChange(e, id);
                }
            },
            [id, onChange],
        );

        return (
            <React.Fragment>
                <div className="p-6 shadow-md rounded-full border-2 border-teal-500 gap-2">
                    <div className="flex flex-col">
                        <Label htmlFor={`${id}-name`} className="text-sm font-bold">
                            Transition
                        </Label>
                        <Input id={`${id}-name`} name="name" type="text" value={data.name} onChange={handleChange} />
                    </div>
                    <div className="flex flex-col">
                        <Label htmlFor={`${id}-guard`} className="text-sm font-bold">
                            Guard
                        </Label>
                        <Input id={`${id}-guard`} name="guard" type="text" value={data.guard} onChange={handleChange} />
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
