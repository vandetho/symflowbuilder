import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DownloadYaml from '@/components/download-yaml';
import Graphviz from '@/components/graphviz';
import ReactMermaid from '@/components/react-mermaid';
import YamlMarkdown from '@/components/yaml-markdown';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';
import { WorkflowConfig } from '@/types/WorkflowConfig';

type ConfigTabRendererProps = {
    config: WorkflowConfig | undefined;
    yaml: WorkflowConfigYaml | undefined;
};

const ConfigTabRenderer = React.memo<ConfigTabRendererProps>(({ config, yaml }) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const onChangeDisplay = React.useCallback(
        (display: string) => {
            const query = new URLSearchParams({
                display,
                builder: searchParams.get('builder') || 'form',
            });
            router.push(`${pathname}?${query.toString()}`);
        },
        [pathname, router, searchParams],
    );

    return (
        <Tabs defaultValue={searchParams.get('display') || 'graphviz'} onValueChange={onChangeDisplay}>
            <div className="flex flex-row justify-between items-center">
                <TabsList>
                    <TabsTrigger value="graphviz">Graphviz</TabsTrigger>
                    <TabsTrigger value="mermaid">Mermaid</TabsTrigger>
                    <TabsTrigger value="yaml">Yaml</TabsTrigger>
                </TabsList>
                <DownloadYaml yaml={yaml} />
            </div>
            <TabsContent value="graphviz">
                <Graphviz workflowConfig={config} />
            </TabsContent>
            <TabsContent value="mermaid">
                <ReactMermaid workflowConfig={config} />
            </TabsContent>
            <TabsContent value="yaml">
                <YamlMarkdown yamlConfig={yaml} />
            </TabsContent>
        </Tabs>
    );
});

export default ConfigTabRenderer;
