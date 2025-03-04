import React from 'react';
import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';
import dynamic from 'next/dynamic';

const DynamicReactJson = dynamic(() => import('react-json-view'), { ssr: false });

interface ReactJsonViewerProps {
    yamlConfig: WorkflowConfigYaml | undefined;
}

export const ReactJsonViewer = React.memo<ReactJsonViewerProps>(({ yamlConfig }) => {
    return (
        <div className="flex flex-col gap-3">{yamlConfig && <DynamicReactJson theme="monokai" src={yamlConfig} />}</div>
    );
});

ReactJsonViewer.displayName = 'JsonMarkdown';
