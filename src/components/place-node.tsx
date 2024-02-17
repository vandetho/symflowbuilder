import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { WorkflowPlace } from '@/types/WorkflowPlace';
import { Input } from '@/components/ui/input';

interface PlaceNodeProps extends NodeProps {
    data: WorkflowPlace;
    onChangeName?: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
}

const PlaceNode = React.memo<PlaceNodeProps>(({ data, id, onChangeName }) => {
    const handleNameChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (onChangeName) {
                onChangeName(e, id);
            }
        },
        [id, onChangeName],
    );

    return (
        <div className="p-4 shadow-md rounded-lg border-2 border-primary">
            <div className="flex flex-col">
                <p className="text-sm font-bold">Place</p>
                <Input type="text" value={data.name} onChange={handleNameChange} />
            </div>
            <Handle type="target" position={Position.Left} className="w-1 h-8 border-none rounded-sm !bg-primary" />
            <Handle type="source" position={Position.Right} className="w-1 h-8 border-none rounded-sm !bg-primary" />
        </div>
    );
});

export default PlaceNode;
