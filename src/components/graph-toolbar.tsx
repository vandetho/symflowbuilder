import React from 'react';
import { Button } from '@/components/ui/button';

type GraphToolbarProps = {
    addPlaceNode: () => void;
    addTransitionNode: () => void;
};

const GraphToolbar = React.memo<GraphToolbarProps>(({ addPlaceNode, addTransitionNode }) => {
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
        </aside>
    );
});

export default GraphToolbar;
