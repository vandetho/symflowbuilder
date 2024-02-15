'use client';

import React from 'react';
import Select from '@/components/select';
import { useForm, useWatch } from 'react-hook-form';
import TextField from '@/components/text-field';
import Switch from '@/components/switch';
import { Button } from '@/components/ui/button';
import { array, boolean, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from '@/components/ui/form';
import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import Transitions from '@/app/transitions';
import Places from '@/app/places';
import SupportEntities from '@/app/support-entities';
import { MetadataYaml } from '@/types/MetadataYaml';
import { WorkflowPlaceYaml } from '@/types/WorkflowPlaceYaml';
import { WorkflowTransitionYaml } from '@/types/WorkflowTransitionYaml';
import Metadata from '@/app/metadata';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import YamlMarkdown from '@/components/YamlMarkdown';
import Graphviz from '@/components/Graphviz';
import ScrollTop from '@/components/scroll-top';

const nameRegex = /^[a-zA-Z0-9_]+$/i;
const entityNameRegex = /^[a-zA-Z0-9\\]+$/i;

const schema = object({
    name: string().matches(nameRegex, { message: 'Workflow name must match the following: [a-zA-Z0-9_]' }).required(),
    metadata: array(
        object({
            name: string()
                .matches(nameRegex, { message: 'Metadata name must match the following: [a-zA-Z0-9_]' })
                .required(),
            value: string().required(),
        }),
    ),
    auditTrail: boolean().required(),
    markingStore: object({
        type: string().required(),
        property: string().required(),
    }).required(),
    type: string().oneOf(['state_machine', 'workflow']).required(),
    supports: array(
        object({
            entityName: string()
                .matches(entityNameRegex, { message: 'Support entity name must match the following: [a-zA-Z0-9\\]' })
                .required(),
        }),
    ).required(),
    places: array(
        object({
            name: string()
                .matches(nameRegex, { message: 'Place name must match the following: [a-zA-Z0-9_]' })
                .required(),
            metadata: array(
                object({
                    name: string()
                        .matches(nameRegex, { message: 'Metadata name must match the following: [a-zA-Z0-9_]' })
                        .required(),
                    value: string().required(),
                }),
            ),
        }),
    ).required(),
    initialMarking: string().required(),
    transitions: array(
        object({
            name: string()
                .matches(nameRegex, { message: 'Transition name must match the following: [a-zA-Z0-9_]' })
                .required(),
            from: array(string().required()).required(),
            to: array(string().required()).required(),
            guard: string(),
            metadata: array(
                object({
                    name: string()
                        .matches(nameRegex, { message: 'Metadata name must match the following: [a-zA-Z0-9_]' })
                        .required(),
                    value: string().required(),
                }),
            ),
        }),
    ).required(),
});

export default function Home() {
    const form = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            auditTrail: false,
            metadata: [],
            supports: [],
            markingStore: {
                type: 'method',
                property: 'marking',
            },
            type: 'state_machine',
            places: [],
            initialMarking: '',
            transitions: [],
        },
    });
    const watchPlaces = useWatch({ name: 'places', control: form.control });
    const [config, setConfig] = React.useState<WorkflowConfig>();
    const [yaml, setYaml] = React.useState<WorkflowConfigYaml>();

    const places = React.useMemo(() => {
        return watchPlaces.filter((field) => !!field.name).map((field) => ({ label: field.name, value: field.name }));
    }, [watchPlaces]);

    const onSubmit = React.useCallback((config: WorkflowConfig) => {
        const { name, metadata, auditTrail, places, supports, transitions, initialMarking, markingStore, ...data } =
            config;
        const realPlaces: WorkflowPlaceYaml = {};
        places.forEach((place) => {
            const metadata: MetadataYaml = {};
            if (place.metadata && place.metadata.length > 0) {
                place.metadata.forEach((meta) => {
                    metadata[meta.name] = meta.value;
                });
            }
            realPlaces[place.name] = Object.keys(metadata).length > 0 ? { metadata } : null;
        });
        const realTransitions: WorkflowTransitionYaml | undefined = transitions.length > 0 ? {} : undefined;
        transitions.forEach((transition) => {
            const metadata: MetadataYaml = {};
            if (realTransitions) {
                realTransitions[transition.name] = {
                    from: transition.from,
                    to: transition.to,
                    guard: transition.guard,
                };
                if (transition.metadata && transition.metadata.length > 0) {
                    transition.metadata.forEach((meta) => {
                        metadata[meta.name] = meta.value;
                    });
                }
                realTransitions[transition.name].metadata = Object.keys(metadata).length > 0 ? metadata : undefined;
            }
        });
        const realMetadata: MetadataYaml = {};
        if (metadata && metadata.length > 0) {
            metadata.forEach((meta) => {
                realMetadata[meta.name] = meta.value;
            });
        }
        setYaml({
            framework: {
                workflows: {
                    [name]: {
                        metadata: Object.keys(realMetadata).length > 0 ? realMetadata : undefined,
                        audit_trail: { enabled: auditTrail },
                        supports: supports.map((support) => support.entityName),
                        marking_store: markingStore,
                        ...data,
                        initial_marking: initialMarking,
                        places: realPlaces,
                        transitions: realTransitions,
                    },
                },
            },
        });
        setConfig(config);
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-6">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={50} minSize={25}>
                    <div className="flex flex-col h-full p-6 border-2  rounded-l-md">
                        <div className="flex flex-col gap-2">
                            <p className="text-2xl">Create new workflow configuration</p>
                            <p className="text-lg">The best way to build and visualize workflow for symfony</p>
                        </div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-4">
                                    <TextField
                                        control={form.control}
                                        id="workflowName"
                                        name="name"
                                        label="Workflow name"
                                        placeholder="Workflow name"
                                    />
                                    <Metadata control={form.control} name="metadata" />
                                    <Select
                                        control={form.control}
                                        name="type"
                                        className="w-[300px]"
                                        placeholder="Select a workflow type"
                                        items={[
                                            { label: 'State Machine', value: 'state_machine' },
                                            { label: 'Workflow', value: 'workflow' },
                                        ]}
                                    />
                                    <Switch
                                        control={form.control}
                                        name="auditTrail"
                                        id="audit-trail"
                                        label="Audit Trail"
                                    />
                                    <div className="flex flex-col gap-2">
                                        <p className="text-lg">Marking Store</p>
                                        <TextField
                                            control={form.control}
                                            name="markingStore.property"
                                            label="Property"
                                        />
                                    </div>
                                    <SupportEntities control={form.control} />
                                    <Places control={form.control} />
                                    <Select
                                        control={form.control}
                                        name="initialMarking"
                                        className="w-[300px]"
                                        placeholder="Select a initial marking"
                                        label="Initial Marking"
                                        items={places}
                                    />
                                    <Transitions control={form.control} places={places} />
                                </div>
                                <Button type="submit">Save</Button>
                            </form>
                        </Form>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} minSize={25}>
                    <div className="flex flex-col h-full p-6 border-2 rounded-r-md">
                        <div className="flex flex-col gap-2">
                            <p className="text-2xl">View your workflow configuration</p>
                            <p className="text-lg">The best way to build and visualize workflow for symfony</p>
                        </div>
                        <Tabs defaultValue="diagram">
                            <TabsList>
                                <TabsTrigger value="diagram">Diagram</TabsTrigger>
                                <TabsTrigger value="yaml">Yaml</TabsTrigger>
                            </TabsList>
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
        </main>
    );
}
