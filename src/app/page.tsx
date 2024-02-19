'use client';

import React from 'react';
import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import YamlMarkdown from '@/components/YamlMarkdown';
import Graphviz from '@/components/graphviz';
import ScrollTop from '@/components/scroll-top';
import { DownloadYaml } from '@/components/download-yaml';
import FileDropzone from '@/components/file-dropzone';
import jsYaml from 'js-yaml';
import { toast } from 'sonner';
import { WorkflowConfigHelper } from '@/helpers/workflow-config.helper';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import FormFields from '@/components/form-fields';
import GraphBuilder from '@/components/graph-builder';
import ReactMermaid from '@/components/react-mermaid';

export default function Home() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [config, setConfig] = React.useState<WorkflowConfig>();
    const [yaml, setYaml] = React.useState<WorkflowConfigYaml>();

    const onDrop = React.useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            try {
                const doc: WorkflowConfigYaml = jsYaml.load(text) as WorkflowConfigYaml;
                const config = WorkflowConfigHelper.toObject(doc);
                setConfig(config);
                setYaml(doc);
            } catch (e) {
                console.error('The file is not a valid yaml file. Please try again.');
                toast.error('The file is not a valid yaml file. Please try again.');
            }
        };
        reader.readAsText(file);
    }, []);

    const onChangeTab = React.useCallback(
        (value: string) => {
            router.push(`${pathname}?tab=${value}`);
        },
        [pathname, router],
    );

    return (
        <FileDropzone onDrop={onDrop}>
            <Tabs defaultValue="form">
                <div className="flex items-center justify-center p-4">
                    <TabsList>
                        <TabsTrigger value="form">Form Builder</TabsTrigger>
                        <TabsTrigger value="graph">Graph Builder</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="form">
                    <div className="flex min-h-screen flex-col items-center justify-between">
                        <ResizablePanelGroup direction="horizontal">
                            <ResizablePanel defaultSize={50} minSize={25}>
                                <div className="flex flex-col h-full p-6 border-2 rounded-l-md">
                                    <div className="flex flex-col gap-2">
                                        <p className="text-2xl">Create new workflow configuration</p>
                                        <p className="text-lg">
                                            The best way to build and visualize workflow for symfony
                                        </p>
                                        <p className="text-sm">
                                            Drop your workflow configuration file here or click the button below to
                                            upload
                                        </p>
                                    </div>
                                    <hr className="my-4" />
                                    <FormFields setYaml={setYaml} config={config} setConfig={setConfig} />
                                </div>
                            </ResizablePanel>
                            <ResizableHandle withHandle />
                            <ResizablePanel defaultSize={50} minSize={25}>
                                <div className="flex flex-col h-full p-6 border-2 rounded-r-md">
                                    <div className="flex flex-col gap-2">
                                        <p className="text-2xl">View your workflow configuration</p>
                                        <p className="text-lg">
                                            The best way to build and visualize workflow for symfony
                                        </p>
                                    </div>
                                    <Tabs
                                        defaultValue={searchParams.get('tab') || 'graphviz'}
                                        onValueChange={onChangeTab}
                                    >
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
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                        <ScrollTop />
                    </div>
                </TabsContent>
                <TabsContent value="graph">
                    <GraphBuilder config={config} />
                </TabsContent>
            </Tabs>
        </FileDropzone>
    );
}
