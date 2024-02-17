import React from 'react';
import { useForm } from 'react-hook-form';
import { Node } from 'reactflow';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import TextField from '@/components/text-field';
import Metadata from '@/app/metadata';
import { yupResolver } from '@hookform/resolvers/yup';
import { WorkflowPlace } from '@/types/WorkflowPlace';
import { isWorkflowTransition, WorkflowTransition } from '@/types/WorkflowTransition';
import { array, boolean, object, string } from 'yup';
import Select from '@/components/select';
import Switch from '@/components/switch';
import SupportEntities from '@/app/support-entities';
import { GraphWorkflowConfig, WorkflowConfig } from '@/types/WorkflowConfig';
import { WorkflowConfigHelper } from '@/helpers/workflow-config.helper';
import { downloadYaml } from '@/helpers/file.helper';

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
    type: string().required(),
    supports: array(
        object({
            entityName: string()
                .matches(entityNameRegex, { message: 'Support entity name must match the following: [a-zA-Z0-9\\]' })
                .required(),
        }),
    ).required(),
    initialMarking: string().required(),
});

type ExportFormProps = {
    nodes: Node<WorkflowPlace | WorkflowTransition>[];
};

const ExportForm = React.memo<ExportFormProps>(({ nodes }) => {
    const form = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            metadata: [],
            type: 'state_machine',
            auditTrail: false,
            markingStore: {
                type: 'method',
                property: 'marking',
            },
            supports: [],
        },
    });

    const places = React.useMemo(() => {
        return nodes
            .filter((node) => node.type === 'place')
            .map((node) => {
                return {
                    label: node.data.name,
                    value: node.data.name,
                };
            });
    }, [nodes]);

    const onSubmit = React.useCallback(
        (data: GraphWorkflowConfig) => {
            const placeNodes = nodes.reduce(
                (acc, node) => {
                    if (node.type === 'place') {
                        acc[node.id] = node.data;
                    }
                    return acc;
                },
                {} as Record<string, WorkflowPlace>,
            );
            const places = nodes.filter((node) => node.type === 'place').map((node) => node.data as WorkflowPlace);
            const transitions = nodes
                .filter((node) => node.type === 'transition')
                .map((node) => {
                    if (isWorkflowTransition(node.data)) {
                        const from = node.data.from || [];
                        const to = node.data.to || [];
                        return {
                            ...node.data,
                            from: from.map((id) => placeNodes[id].name),
                            to: to.map((id) => placeNodes[id].name),
                        };
                    }
                    return node.data as WorkflowTransition;
                });
            const config: WorkflowConfig = { ...data, places, transitions };
            const yaml = WorkflowConfigHelper.toYaml(config);
            downloadYaml(yaml);
        },
        [nodes],
    );

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
                    <Select
                        control={form.control}
                        name="initialMarking"
                        className="w-[300px]"
                        placeholder="Select a initial marking"
                        label="Initial Marking"
                        items={places}
                    />
                    <Button type="submit">Export</Button>
                </div>
            </form>
        </Form>
    );
});

export default ExportForm;
