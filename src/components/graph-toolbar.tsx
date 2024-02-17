import React from 'react';
import { Button } from '@/components/ui/button';
import ExportButton from '@/components/export-button';
import { Node } from 'reactflow';
import { WorkflowPlace } from '@/types/WorkflowPlace';
import { WorkflowTransition } from '@/types/WorkflowTransition';

type GraphToolbarProps = {
    nodes: Node<WorkflowPlace | WorkflowTransition>[];
    addPlaceNode: () => void;
    addTransitionNode: () => void;
};

const GraphToolbar = React.memo<GraphToolbarProps>(({ nodes, addPlaceNode, addTransitionNode }) => {
    return (
        <aside className="flex flex-row gap-3">
            <Button
                variant="ghost"
                className="px-4 py-2 shadow-md rounded-lg border-2 border-primary"
                onClick={addPlaceNode}
            >
                Add Place
            </Button>
            <Button
                variant="ghost"
                className="px-4 py-2 shadow-md rounded-full border-2 border-teal-500"
                onClick={addTransitionNode}
            >
                Add Transition
            </Button>
            <ExportButton nodes={nodes} />
        </aside>
    );
});

export default GraphToolbar;
