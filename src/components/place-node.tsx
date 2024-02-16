import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { WorkflowPlace } from '@/types/WorkflowPlace';

interface PlaceNodeProps extends NodeProps {
    data: WorkflowPlace;
}

const PlaceNode = React.memo<PlaceNodeProps>(({ data }) => {
    return (
        <div className="px-4 py-2 shadow-md rounded-lg border-2 border-primary">
            <div className="flex">
                <div className="text-lg font-bold">{data.name}</div>
            </div>
            <Handle type="target" position={Position.Left} className="w-1 h-8 border-none rounded-sm !bg-primary" />
            <Handle type="source" position={Position.Right} className="w-1 h-8 border-none rounded-sm !bg-primary" />
        </div>
    );
});

export default PlaceNode;
