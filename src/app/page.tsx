'use client';

import React, { Suspense } from 'react';
import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import jsYaml from 'js-yaml';
import { toast } from 'sonner';
import { WorkflowConfigHelper } from '@/helpers/workflow-config.helper';
import FormFields from '@/components/form-fields';
import GraphBuilder from '@/components/graph-builder';
import ScrollTop from '@/components/scroll-top';
import FileDropzone from '@/components/file-dropzone';
import ConfigTabRenderer from '@/app/config-tab-renderer';
import { SessionStorageContext } from '@/contexts/session-storage-context';

export default function Home() {
    const { workflowConfig, setWorkflowConfig } = React.useContext(SessionStorageContext);
    const [config, setConfig] = React.useState<WorkflowConfig | undefined>(workflowConfig);
    const [yaml, setYaml] = React.useState<WorkflowConfigYaml>();

    React.useEffect(() => {
        if (workflowConfig) {
            setConfig(workflowConfig);
            setYaml(WorkflowConfigHelper.toYaml(workflowConfig));
        }
    }, [workflowConfig]);

    const onDrop = React.useCallback(
        (file: File) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const text = e.target?.result as string;
                try {
                    const doc: WorkflowConfigYaml = jsYaml.load(text) as WorkflowConfigYaml;
                    const config = WorkflowConfigHelper.toObject(doc);
                    setConfig(config);
                    setYaml(doc);
                    setWorkflowConfig(config);
                } catch (e) {
                    console.error('The file is not a valid yaml file. Please try again.');
                    toast.error('The file is not a valid yaml file. Please try again.');
                }
            };
            reader.readAsText(file);
        },
        [setWorkflowConfig],
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
                                    <Suspense fallback={<div>Loading...</div>}>
                                        <ConfigTabRenderer config={config} yaml={yaml} />
                                    </Suspense>
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
