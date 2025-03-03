import React from 'react';
import { ReactMarkdown } from '@/components/react-markdown';
import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';

interface JsonMarkdownProps {
    yamlConfig: WorkflowConfigYaml | undefined;
}

export const JsonMarkdown = React.memo<JsonMarkdownProps>(({ yamlConfig }) => {
    return (
        <div className="flex flex-col gap-3">
            <ReactMarkdown>{['```json'].concat(JSON.stringify(yamlConfig), '```').join('\n')}</ReactMarkdown>
        </div>
    );
});

JsonMarkdown.displayName = 'JsonMarkdown';
