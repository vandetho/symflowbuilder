'use client';

import React from 'react';
import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import YamlMarkdown from '@/components/YamlMarkdown';
import Graphviz from '@/components/Graphviz';
import ScrollTop from '@/components/scroll-top';
import { DownloadYaml } from '@/components/download-yaml';
import FileDropzone from '@/components/file-dropzone';
import jsYaml from 'js-yaml';
import { toast } from 'sonner';
import { WorkflowConfigHelper } from '@/helpers/workflow-config.helper';
import FormFields from '@/components/form-fields';
import Graph from '@/components/graph';

export default function Home() {
    const [config, setConfig] = React.useState<WorkflowConfig>();
    const [yaml, setYaml] = React.useState<WorkflowConfigYaml>();

    const onDrop = React.useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            try {
                const doc: WorkflowConfigYaml = jsYaml.load(text) as WorkflowConfigYaml;
                console.log({ doc });
                const config = WorkflowConfigHelper.toObject(doc);
                console.log({ config });
            } catch (e) {
                console.error('The file is not a valid yaml file. Please try again.');
                toast.error('The file is not a valid yaml file. Please try again.');
            }
        };
        reader.readAsText(file);
    }, []);

    return (
        <FileDropzone onDrop={onDrop}>
            <main className="flex min-h-screen flex-col items-center justify-between p-6">
                <TabsList>
                    <TabsTrigger value="form">Form</TabsTrigger>
                    <TabsTrigger value="graph">Graph</TabsTrigger>
                </TabsList>
                <TabsContent value="form">
                    <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={50} minSize={25}>
                            <div className="flex flex-col h-full p-6 border-2  rounded-l-md">
                                <div className="flex flex-col gap-2">
                                    <p className="text-2xl">Create new workflow configuration</p>
                                    <p className="text-lg">The best way to build and visualize workflow for symfony</p>
                                </div>
                            </div>
                            <FormFields setYaml={setYaml} setConfig={setConfig} />
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={50} minSize={25}>
                            <div className="flex flex-col h-full p-6 border-2 rounded-r-md">
                                <div className="flex flex-col gap-2">
                                    <p className="text-2xl">View your workflow configuration</p>
                                    <p className="text-lg">The best way to build and visualize workflow for symfony</p>
                                </div>
                                <Tabs defaultValue="diagram">
                                    <div className="flex flex-row justify-between items-center">
                                        <TabsList>
                                            <TabsTrigger value="diagram">Diagram</TabsTrigger>
                                            <TabsTrigger value="yaml">Yaml</TabsTrigger>
                                        </TabsList>
                                        <DownloadYaml yaml={yaml} />
                                    </div>
                                    <TabsContent value="diagram">
                                        <Graphviz workflowConfig={config} workflowConfigYaml={yaml} />
                                    </TabsContent>
                                    <TabsContent value="yaml">
                                        <YamlMarkdown yamlConfig={yaml} />
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                    <ScrollTop />
                </TabsContent>
                <TabsContent value="graph">
                    <Graph />
                </TabsContent>
            </main>
        </FileDropzone>
    );
}
