import React from 'react';
import { useForm } from 'react-hook-form';
import { Node } from 'reactflow';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { TextField } from '@/components/text-field';
import { Metadata } from '@/components/metadata';
import { yupResolver } from '@hookform/resolvers/yup';
import { WorkflowPlace } from '@/types/WorkflowPlace';
import { isWorkflowTransition, WorkflowTransition } from '@/types/WorkflowTransition';
import { SelectField } from '@/components/select-field';
import { Switch } from '@/components/switch';
import { SupportEntities } from '@/components/support-entities';
import { GraphWorkflowConfig, WorkflowConfig } from '@/types/WorkflowConfig';
import { WorkflowConfigHelper } from '@/helpers/workflow-config.helper';
import { downloadYaml } from '@/helpers/file.helper';
import { exportSchema } from '@/schema/export-schema';

type ExportFormProps = {
    nodes: Node<WorkflowPlace | WorkflowTransition>[];
};

const ExportForm = React.memo<ExportFormProps>(({ nodes }) => {
    const form = useForm({
        resolver: yupResolver(exportSchema),
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
                            guard: node.data.guard || undefined,
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
                    <SelectField
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
                    <SelectField
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
