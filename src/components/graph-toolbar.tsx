import React from 'react';
import { Node } from 'reactflow';
import { Button } from '@/components/ui/button';
import { ExportButton } from '@/components/button/export-button';
import { WorkflowPlace } from '@/types/WorkflowPlace';
import { WorkflowTransition } from '@/types/WorkflowTransition';
import { EmptyButton } from '@/components/button/empty-button';
import { UploadButton } from '@/components/button/upload-button';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';

type GraphToolbarProps = {
    nodes: Node<WorkflowPlace | WorkflowTransition>[];
    addPlaceNode: () => void;
    addTransitionNode: () => void;
    onEmptyPanel: () => void;
    onChangeConfig: (params: {
        config: WorkflowConfig;
        yamlConfig: WorkflowConfigYaml;
        workflowUrl?: string;
        workflowName?: string;
    }) => void;
};

export const GraphToolbar = React.memo<GraphToolbarProps>(
    ({ nodes, addPlaceNode, addTransitionNode, onEmptyPanel, onChangeConfig }) => {
        const onDragStart = (event: React.DragEvent<HTMLButtonElement>, nodeType: 'place' | 'transition') => {
            event.dataTransfer.setData('application/reactflow', nodeType);
            event.dataTransfer.effectAllowed = 'move';
        };

        return (
            <aside className="flex flex-row gap-3">
                <Button
                    variant="ghost"
                    className="px-4 py-2 shadow-md rounded-lg border-2 border-primary"
                    onDragStart={(event) => onDragStart(event, 'place')}
                    onClick={addPlaceNode}
                    draggable
                >
                    Add Place
                </Button>
                <Button
                    variant="ghost"
                    className="px-4 py-2 shadow-md rounded-full border-2 border-teal-500"
                    onClick={addTransitionNode}
                    onDragStart={(event) => onDragStart(event, 'transition')}
                    draggable
                >
                    Add Transition
                </Button>
                <EmptyButton onEmptyPanel={onEmptyPanel} />
                <ExportButton nodes={nodes} />
                <UploadButton onDone={onChangeConfig} />
            </aside>
        );
    },
);

GraphToolbar.displayName = 'GraphToolbar';
