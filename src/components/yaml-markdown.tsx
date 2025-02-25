import React from 'react';
import jsYaml from 'js-yaml';
import { ReactMarkdown } from '@/components/react-markdown';
import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';

interface YamlMarkdownProps {
    yamlConfig: WorkflowConfigYaml | undefined;
}

export const YamlMarkdown = React.memo<YamlMarkdownProps>(({ yamlConfig }) => {
    return (
        <div className="flex flex-col gap-3">
            <ReactMarkdown>
                {['```yaml']
                    .concat(
                        jsYaml.dump(yamlConfig, {
                            indent: 4,
                            forceQuotes: true,
                        }),
                        '```',
                    )
                    .join('\n')}
            </ReactMarkdown>
        </div>
    );
});

YamlMarkdown.displayName = 'YamlMarkdown';
