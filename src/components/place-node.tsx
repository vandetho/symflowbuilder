import React from 'react';
import { Handle, NodeProps, NodeToolbar, Position } from 'reactflow';
import { WorkflowPlace } from '@/types/WorkflowPlace';
import { Input } from '@/components/ui/input';
import { GraphMetadata } from '@/components/graph-metadata';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import '@/styles/react-flow.css';

interface PlaceNodeProps extends NodeProps {
    data: WorkflowPlace;
    onAddMetadata?: (id: string) => void;
    onRemoveMetadata?: (index: number, id: string) => void;
    onChangeMetadata?: (e: React.ChangeEvent<HTMLInputElement>, index: number, id: string) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
}

export const PlaceNode = React.memo<PlaceNodeProps>(
    ({ data, id, onChange, onChangeMetadata, onAddMetadata, onRemoveMetadata }) => {
        const handleChange = React.useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                if (onChange) {
                    onChange(e, id);
                }
            },
            [id, onChange],
        );

        const handleClassName = '!w-6 !h-6 border-none rounded-sm !bg-primary';

        return (
            <React.Fragment>
                <div className="shadow-md rounded-lg border-b-2 border-l-2 border-r-2 border-primary">
                    <div className="bg-primary rounded-t-md p-2 m-0 flex justify-center items-center">
                        <Label htmlFor={`${id}-name`} className="text-black text-sm font-bold">
                            Place
                        </Label>
                    </div>
                    <div className="p-2">
                        <Input id={`${id}-name`} name="name" type="text" value={data.name} onChange={handleChange} />
                    </div>
                    <Handle type="target" position={Position.Left} className={`${handleClassName} !-translate-x-1/3`} />
                    <Handle type="source" position={Position.Right} className={`${handleClassName} !translate-x-1/3`} />
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

PlaceNode.displayName = 'PlaceNode';
