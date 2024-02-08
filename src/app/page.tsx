'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Select from '@/components/select';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import TextField from '@/components/text-field';
import Switch from '@/components/switch';
import { Button } from '@/components/ui/button';

type WorkflowPlace = {
    name: string;
};

type WorkflowTransition = {
    name: string;
    from: string;
    to: string;
};

type WorkflowConfig = {
    name: string;
    auditTrail: boolean;
    markingStore: {
        property: string;
    };
    type: string;
    places: WorkflowPlace[];
    initialMarking: string;
    transitions: WorkflowTransition[];
};

export default function Home() {
    const { control, handleSubmit } = useForm<WorkflowConfig>({
        defaultValues: {
            name: '',
            auditTrail: false,
            markingStore: {
                property: 'marking',
            },
            type: '',
            places: [],
            initialMarking: '',
            transitions: [],
        },
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'places',
    });
    const {
        fields: transitionFields,
        append: appendTransition,
        remove: removeTransition,
    } = useFieldArray({
        control,
        name: 'transitions',
    });
    const watchPlaces = useWatch({ name: 'places', control });

    const places = React.useMemo(() => {
        return watchPlaces.filter((field) => !!field.name).map((field) => ({ label: field.name, value: field.name }));
    }, [watchPlaces]);

    const onAddPlace = React.useCallback(() => {
        append({ name: '' });
    }, [append]);

    const onAddTransition = React.useCallback(() => {
        appendTransition({ name: '', to: '', from: '' });
    }, [appendTransition]);

    const onSubmit = (data: WorkflowConfig) => {
        console.log(data);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="flex items-center gap-4">
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Create new workflow configuration</CardTitle>
                        <CardDescription>The best way to build and visualize workflow for symfony</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <TextField
                                control={control}
                                id="workflowName"
                                name="name"
                                label="Workflow name"
                                placeholder="Workflow name"
                            />
                            <Select
                                control={control}
                                name="type"
                                className="w-[300px]"
                                placeholder="Select a workflow type"
                                items={[
                                    { label: 'State Machine', value: 'state_machine' },
                                    { label: 'Workflow', value: 'workflow' },
                                ]}
                            />
                            <Switch control={control} name="auditTrail" id="audit-trail" label="Audit Trail" />
                            <div className="flex flex-col gap-2">
                                <p className="text-lg">Marking Store</p>
                                <TextField control={control} name="markingStore.property" label="Property" />
                            </div>
                            <div className="flex flex-col gap-3">
                                <p className="text-lg">Places</p>
                                <Button variant="secondary" onClick={onAddPlace}>
                                    Add Place
                                </Button>
                                {fields.map((field, index) => (
                                    <div className={'flex gap-2'} key={field.id}>
                                        <TextField
                                            control={control}
                                            name={`places.${index}.value`}
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
                                control={control}
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
                                            control={control}
                                            name={`transitions.${index}.name`}
                                            type="text"
                                            placeholder="Transition name"
                                            key={field.id}
                                        />
                                        <Select
                                            control={control}
                                            name={`transitions.${index}.from`}
                                            className="w-[300px]"
                                            placeholder="From"
                                            items={places}
                                        />
                                        <Select
                                            control={control}
                                            name={`transitions.${index}.to`}
                                            className="w-[300px]"
                                            placeholder="To"
                                            items={places}
                                        />
                                        <Button variant="destructive" onClick={() => removeTransition(index)}>
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                <Button onClick={handleSubmit(onSubmit)}>Save</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>View your workflow configuration</CardTitle>
                        <CardDescription>The best way to build and visualize workflow for symfony</CardDescription>
                    </CardHeader>
                    <CardContent></CardContent>
                </Card>
            </div>
        </main>
    );
}
