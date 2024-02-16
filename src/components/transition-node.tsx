import React from 'react';
import { Handle, NodeProps, NodeToolbar, Position } from 'reactflow';
import { WorkflowTransition } from '@/types/WorkflowTransition';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface TransitionNodeProps extends NodeProps {
    data: WorkflowTransition;
}

const TransitionNode = React.memo<TransitionNodeProps>(({ data }) => {
    return (
        <React.Fragment>
            <NodeToolbar position={Position.Top}>
                <Card className="w-[350px]">
                    <CardContent>
                        <Input type="text" value={data.name} />
                    </CardContent>
                </Card>
            </NodeToolbar>
            <div className="px-4 py-2 shadow-md rounded-full border-2 border-teal-500">
                <div className="flex">
                    <div className="text-lg font-bold">{data.name}</div>
                </div>
                <Handle type="target" position={Position.Left} className="w-1 h-4 border-none rounded-sm bg-teal-500" />
                <Handle
                    type="source"
                    position={Position.Right}
                    className="w-1 h-4 border-none rounded-sm bg-teal-500"
                />
            </div>
        </React.Fragment>
    );
});

export default TransitionNode;
