import React from 'react';
import { Handle, NodeProps, NodeToolbar, Position } from 'reactflow';
import { WorkflowPlace } from '@/types/WorkflowPlace';
import { Input } from '@/components/ui/input';
import GraphMetadata from '@/components/graph-metadata';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface PlaceNodeProps extends NodeProps {
    data: WorkflowPlace;
    onAddMetadata?: (id: string) => void;
    onRemoveMetadata?: (index: number, id: string) => void;
    onChangeMetadata?: (e: React.ChangeEvent<HTMLInputElement>, index: number, id: string) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
}

const PlaceNode = React.memo<PlaceNodeProps>(
    ({ data, id, onChange, onChangeMetadata, onAddMetadata, onRemoveMetadata }) => {
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
                <div className="shadow-md rounded-lg border-b-2 border-l-2 border-r-2 border-primary dark:bg-black light:bg-white">
                    <div className="bg-primary rounded-t-md p-2 m-0">
                        <Label htmlFor={`${id}-name`} className="text-white text-sm font-bold">
                            Place
                        </Label>
                    </div>
                    <div className="p-2">
                        <Input id={`${id}-name`} name="name" type="text" value={data.name} onChange={handleChange} />
                    </div>
                    <Handle
                        type="target"
                        position={Position.Left}
                        className="w-1 h-8 border-none rounded-sm !bg-primary"
                    />
                    <Handle
                        type="source"
                        position={Position.Right}
                        className="w-1 h-8 border-none rounded-sm !bg-primary"
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

export default PlaceNode;
