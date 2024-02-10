'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Select from '@/components/select';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import TextField from '@/components/text-field';
import Switch from '@/components/switch';
import { Button } from '@/components/ui/button';
import ReactMarkdown from '@/components/react-markdown';
import jsYaml from 'js-yaml';
import { array, boolean, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from '@/components/ui/form';
import { MultiSelect } from '@/components/multi-select';

type Metadata = { [key: string]: string };

type WorkflowPlace = {
    name: string;
    metadata?: Metadata[];
};

type WorkflowTransition = {
    name: string;
    from: string[];
    to: string[];
    guard?: string;
    metadata?: Metadata[];
};

type WorkflowConfig = {
    name: string;
    auditTrail: boolean;
    events_to_dispatch?: string[];
    markingStore: {
        type: string;
        property: string;
    };
    type: string;
    places: WorkflowPlace[];
    initialMarking: string;
    transitions: WorkflowTransition[];
};

type WorkflowConfigYaml = {
    framework: {
        workflow: {
            [key: string]: {
                audit_trail: {
                    enabled: boolean;
                };
                markingStore: {
                    type: string;
                    property: string;
                };
                type: string;
                places: { [key: string]: { metadata?: Metadata[] } | string | null };
                initialMarking: string;
                transitions?: { [key: string]: { from: string[]; to: string[] } };
            };
        };
    };
};

const nameRegex = /^[a-zA-Z0-9_]+$/i;

const schema = object({
    name: string().matches(nameRegex).required(),
    auditTrail: boolean().required(),
    markingStore: object({
        type: string().required(),
        property: string().required(),
    }).required(),
    type: string().oneOf(['state_machine', 'workflow']).required(),
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
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'places',
    });
    const {
        fields: transitionFields,
        append: appendTransition,
        remove: removeTransition,
    } = useFieldArray({
        control: form.control,
        name: 'transitions',
    });
    const watchPlaces = useWatch({ name: 'places', control: form.control });
    const [yaml, setYaml] = React.useState<WorkflowConfigYaml>();

    const places = React.useMemo(() => {
        return watchPlaces.filter((field) => !!field.name).map((field) => ({ label: field.name, value: field.name }));
    }, [watchPlaces]);

    const onAddPlace = React.useCallback(() => {
        append({ name: '' });
    }, [append]);

    const onAddTransition = React.useCallback(() => {
        appendTransition({ name: '', to: [], from: [] });
    }, [appendTransition]);

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
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="flex flex-row gap-4">
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Create new workflow configuration</CardTitle>
                        <CardDescription>The best way to build and visualize workflow for symfony</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                                    <div className="flex flex-col gap-3">
                                        <p className="text-lg">Places</p>
                                        <Button variant="secondary" onClick={onAddPlace}>
                                            Add Place
                                        </Button>
                                        {fields.map((field, index) => (
                                            <div className={'flex gap-2'} key={field.id}>
                                                <TextField
                                                    control={form.control}
                                                    name={`places.${index}.name`}
                                                    type="text"
                                                    placeholder="Place"
                                                    key={field.id}
                                                />
                                                <Button variant="destructive" onClick={() => remove(index)}>
                                                    Remove
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Select
                                        control={form.control}
                                        name="initialMarking"
                                        className="w-[300px]"
                                        placeholder="Select a initial marking"
                                        label="Initial Marking"
                                        items={places}
                                    />
                                    <div className="flex flex-col gap-3">
                                        <p className="text-lg">Transitions</p>
                                        <Button variant="secondary" onClick={onAddTransition}>
                                            Add Transition
                                        </Button>
                                        {transitionFields.map((field, index) => (
                                            <div className={'flex flex-col gap-2'} key={field.id}>
                                                <TextField
                                                    control={form.control}
                                                    name={`transitions.${index}.name`}
                                                    type="text"
                                                    placeholder="Transition name"
                                                    key={field.id}
                                                />
                                                <MultiSelect
                                                    control={form.control}
                                                    name={`transitions.${index}.from`}
                                                    className="w-[300px]"
                                                    label="From"
                                                    items={places}
                                                />
                                                <MultiSelect
                                                    control={form.control}
                                                    name={`transitions.${index}.to`}
                                                    className="w-[300px]"
                                                    label="To"
                                                    items={places}
                                                />
                                                <Button variant="destructive" onClick={() => removeTransition(index)}>
                                                    Remove
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Button type="submit">Save</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
                <Card className="w-[450px]">
                    <CardHeader>
                        <CardTitle>View your workflow configuration</CardTitle>
                        <CardDescription>The best way to build and visualize workflow for symfony</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {yaml && (
                            <ReactMarkdown>
                                {['```yaml']
                                    .concat(jsYaml.dump(yaml, { indent: 4, forceQuotes: true }), '```')
                                    .join('\n')}
                            </ReactMarkdown>
                        )}
                        <Button>Export</Button>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
