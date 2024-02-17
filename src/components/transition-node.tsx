import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { WorkflowTransition } from '@/types/WorkflowTransition';
import { Input } from '@/components/ui/input';

interface TransitionNodeProps extends NodeProps {
    data: WorkflowTransition;
    onChangeName?: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
}

const TransitionNode = React.memo<TransitionNodeProps>(({ data, id, onChangeName }) => {
    const handleNameChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (onChangeName) {
                onChangeName(e, id);
            }
        },
        [id, onChangeName],
    );

    return (
        <div className="p-4 shadow-md rounded-full border-2 border-teal-500">
            <div className="flex flex-col">
                <p className="text-sm font-bold">Transition</p>
                <Input type="text" value={data.name} onChange={handleNameChange} />
            </div>
            <Handle type="target" position={Position.Left} className="w-1 h-4 border-none rounded-sm bg-teal-500" />
            <Handle type="source" position={Position.Right} className="w-1 h-4 border-none rounded-sm bg-teal-500" />
        </div>
    );
});

export default TransitionNode;
