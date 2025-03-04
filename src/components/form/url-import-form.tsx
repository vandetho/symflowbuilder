import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { urlImportSchema } from '@/schema/url-import-schema';
import axios from 'axios';
import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';
import jsYaml from 'js-yaml';
import { WorkflowConfigHelper } from '@/helpers/workflow-config.helper';
import { toast } from 'sonner';
import { TextField } from '@/components/text-field';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { inspect } from 'util';

interface UrlImportFormProps {
    buttonTitle?: string;
    workflowUrl?: string;
    workflowName?: string;
    onValid: (params: {
        config: WorkflowConfig;
        yamlConfig: WorkflowConfigYaml;
        workflowUrl?: string;
        workflowName?: string;
    }) => void;
}

export const UrlImportForm: React.FC<UrlImportFormProps> = ({
    onValid,
    workflowUrl,
    workflowName,
    buttonTitle = 'Validate',
}) => {
    const [valid, setValid] = React.useState(false);
    const [validating, setValidating] = React.useState(false);
    const form = useForm({
        resolver: yupResolver(urlImportSchema),
        defaultValues: {
            workflowUrl: workflowUrl || '',
            workflowName: workflowName || '',
        },
    });

    const onValidate = React.useCallback(
        (data: { workflowUrl: string; workflowName: string }) => {
            setValidating(true);
            axios.get(data.workflowUrl).then((response) => {
                console.log(inspect(response, true, null, true));
                try {
                    const doc: WorkflowConfigYaml = jsYaml.load(response.data) as WorkflowConfigYaml;
                    const config = WorkflowConfigHelper.toObject(doc, data.workflowName);
                    onValid({
                        config,
                        yamlConfig: doc,
                        workflowUrl: data.workflowUrl,
                        workflowName: data.workflowName,
                    });
                    setValid(true);
                } catch (e) {
                    toast.error('The file is not a valid yaml file. Please try again.');
                }
                setValidating(false);
            });
        },
        [onValid],
    );

    return (
        <Form {...form}>
            <form className="flex flex-col gap-4 w-full" onSubmit={form.handleSubmit(onValidate)}>
                <TextField
                    control={form.control}
                    name="workflowUrl"
                    label="Workflow Url"
                    disabled={validating}
                    className={`w-full ${valid ? 'border-green-500' : ''}`}
                    placeholder="https://example.com/your-file.yml"
                />
                <TextField
                    control={form.control}
                    name="workflowName"
                    label="Workflow name"
                    disabled={validating}
                    className={`w-full ${valid ? 'border-green-500' : ''}`}
                    placeholder="task_workflow"
                />
                <Button type="submit">
                    {validating ? (
                        <React.Fragment>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Validating...
                        </React.Fragment>
                    ) : (
                        buttonTitle
                    )}
                </Button>
            </form>
        </Form>
    );
};
