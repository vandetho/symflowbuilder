import React from 'react';
import { Handle, NodeProps, NodeToolbar, Position } from 'reactflow';
import { WorkflowPlace } from '@/types/WorkflowPlace';
import { Input } from '@/components/ui/input';
import GraphMetadata from '@/components/graph-metadata';
import { Card, CardContent } from '@/components/ui/card';

interface PlaceNodeProps extends NodeProps {
    data: WorkflowPlace;
    onAddMetadata?: (id: string) => void;
    onRemoveMetadata?: (index: number, id: string) => void;
    onChangeMetadata?: (e: React.ChangeEvent<HTMLInputElement>, index: number, id: string) => void;
    onChangeName?: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
}

const PlaceNode = React.memo<PlaceNodeProps>(
    ({ data, id, onChangeName, onChangeMetadata, onAddMetadata, onRemoveMetadata }) => {
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
                <div className="p-4 shadow-md rounded-lg border-2 border-primary dark:bg-black light:bg-white">
                    <div className="flex flex-col">
                        <p className="text-sm font-bold">Place</p>
                        <Input type="text" value={data.name} onChange={handleNameChange} />
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
