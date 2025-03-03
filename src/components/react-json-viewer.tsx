import React from 'react';
import ReactJson from 'react-json-view';
import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';

interface ReactJsonViewerProps {
    yamlConfig: WorkflowConfigYaml | undefined;
}

export const ReactJsonViewer = React.memo<ReactJsonViewerProps>(({ yamlConfig }) => {
    return <div className="flex flex-col gap-3">{yamlConfig && <ReactJson theme="monokai" src={yamlConfig} />}</div>;
});

ReactJsonViewer.displayName = 'JsonMarkdown';
