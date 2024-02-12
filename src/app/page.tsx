'use client';

import React from 'react';
import Select from '@/components/select';
import { useForm, useWatch } from 'react-hook-form';
import TextField from '@/components/text-field';
import Switch from '@/components/switch';
import { Button } from '@/components/ui/button';
import ReactMarkdown from '@/components/react-markdown';
import jsYaml from 'js-yaml';
import { array, boolean, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from '@/components/ui/form';
import { Metadata } from '@/types/Metadata';
import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ExportButton } from '@/components/export-button';
import Transitions from '@/app/transitions';
import Places from '@/app/places';

const nameRegex = /^[a-zA-Z0-9_]+$/i;
const entityNameRegex = /^[a-zA-Z0-9/]+$/i;

const schema = object({
    name: string().matches(nameRegex).required(),
    auditTrail: boolean().required(),
    markingStore: object({
        type: string().required(),
        property: string().required(),
    }).required(),
    type: string().oneOf(['state_machine', 'workflow']).required(),
    supports: array(
        object({
            entityName: string().matches(entityNameRegex).required(),
        }),
    ).required(),
    places: array(
        object({
            name: string().matches(nameRegex).required(),
            metadata: array(),
        }),
    ).required(),
    initialMarking: string().required(),
    transitions: array(
        object({
            name: string().matches(nameRegex).required(),
            from: array(string().matches(nameRegex).required()).required(),
            to: array(string().matches(nameRegex).required()).required(),
            guard: string(),
            metadata: array(),
        }),
    ).required(),
});

export default function Home() {
    const form = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            auditTrail: false,
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
    const [yaml, setYaml] = React.useState<WorkflowConfigYaml>();

    const places = React.useMemo(() => {
        return watchPlaces.filter((field) => !!field.name).map((field) => ({ label: field.name, value: field.name }));
    }, [watchPlaces]);

    const onSubmit = React.useCallback(({ name, auditTrail, places, transitions, ...data }: WorkflowConfig) => {
        const realPlaces: { [key: string]: { metadata?: Metadata[] } | string | null } = {};
        places.forEach((place) => {
            realPlaces[place.name] = place.metadata ? { metadata: place.metadata } : null;
        });
        const realTransitions: { [key: string]: { from: string[]; to: string[]; guard?: string } } | undefined =
            transitions.length > 0 ? {} : undefined;
        transitions.forEach((transition) => {
            if (realTransitions) {
                realTransitions[transition.name] = {
                    from: transition.from,
                    to: transition.to,
                    guard: transition.guard,
                };
            }
        });
        setYaml({
            framework: {
                workflow: {
                    [name]: {
                        audit_trail: { enabled: auditTrail },
                        ...data,
                        places: realPlaces,
                        transitions: realTransitions,
                    },
                },
            },
        });
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
                        <div>
                            <ReactMarkdown>
                                {['```yaml']
                                    .concat(
                                        jsYaml.dump(yaml, {
                                            indent: 4,
                                            forceQuotes: true,
                                        }),
                                        '```',
                                    )
                                    .join('\n')}
                            </ReactMarkdown>
                            <ExportButton yaml={yaml} />
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </main>
    );
}
