import { TextField } from '@/components/text-field';
import Metadata from '@/app/metadata';
import Select from '@/components/select';
import Switch from '@/components/switch';
import SupportEntities from '@/app/support-entities';
import Places from '@/app/places';
import Transitions from '@/app/transitions';
import { Button } from '@/components/ui/button';
import React from 'react';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { useForm, useWatch } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';
import { WorkflowConfigHelper } from '@/helpers/workflow-config.helper';
import { Option } from '@/components/ui/multi-select';
import { useSessionStorageDispatch } from '@/hooks/session-storage-hook';
import { formFieldSchema } from '@/schema/form-field-schema';

interface FormFieldsProps {
    config: WorkflowConfig | undefined;
    setYaml: (yaml: WorkflowConfigYaml | undefined) => void;
    setConfig: (config: WorkflowConfig | undefined) => void;
}

export const FormFields = React.memo<FormFieldsProps>(({ config, setYaml, setConfig }) => {
    const dispatch = useSessionStorageDispatch();
    const form = useForm({
        resolver: yupResolver(formFieldSchema),
        mode: 'onBlur',
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
    const places = React.useMemo<Option[]>(() => {
        return watchPlaces.filter((field) => !!field.name).map((field) => ({ label: field.name, value: field.name }));
    }, [watchPlaces]);

    React.useEffect(() => {
        if (config) {
            form.reset(config);
        }
    }, [config, form]);

    const onSubmit = React.useCallback(
        (config: WorkflowConfig) => {
            const yaml = WorkflowConfigHelper.toYaml(config);
            setYaml(yaml);
            setConfig(config);
            dispatch({ type: 'SET_WORKFLOW_CONFIG', payload: config });
        },
        [setYaml, setConfig, dispatch],
    );

    const handleReset = React.useCallback(() => {
        form.reset({
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
        });
        setYaml(undefined);
        setConfig(undefined);
        dispatch({ type: 'SET_WORKFLOW_CONFIG', payload: undefined });
    }, [form, setYaml, setConfig, dispatch]);

    return (
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
                    <Switch control={form.control} name="auditTrail" id="audit-trail" label="Audit Trail" />
                    <div className="flex flex-col gap-2">
                        <p className="text-lg">Marking Store</p>
                        <TextField control={form.control} name="markingStore.property" label="Property" />
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
                <div className="flex gap-3 justify-between">
                    <Button className="flex-grow" variant="secondary" onClick={handleReset}>
                        Reset
                    </Button>
                    <Button className="flex-grow" type="submit">
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    );
});

FormFields.displayName = 'FormFields';
