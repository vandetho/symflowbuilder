import React from 'react';
import { Button } from '@/components/ui/button';
import ExportButton from '@/components/export-button';
import { Node } from 'reactflow';
import { WorkflowPlace } from '@/types/WorkflowPlace';
import { WorkflowTransition } from '@/types/WorkflowTransition';
import EmptyButton from '@/components/empty-button';

type GraphToolbarProps = {
    nodes: Node<WorkflowPlace | WorkflowTransition>[];
    addPlaceNode: () => void;
    addTransitionNode: () => void;
    onEmptyPanel: () => void;
};

const GraphToolbar = React.memo<GraphToolbarProps>(({ nodes, addPlaceNode, addTransitionNode, onEmptyPanel }) => {
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
            <EmptyButton onEmptyPanel={onEmptyPanel} />
            <ExportButton nodes={nodes} />
        </aside>
    );
});

export default GraphToolbar;
