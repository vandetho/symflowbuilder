import React from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from '@/components/ui/form';
import axios from 'axios';
import { TextField } from '@/components/text-field';
import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';
import jsYaml from 'js-yaml';
import { toast } from 'sonner';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { WorkflowConfigHelper } from '@/helpers/workflow-config.helper';
import { Loader2 } from 'lucide-react';

const schema = object({
    workflowUrl: string().url().required(),
    workflowName: string().required(),
});

interface UploadButtonProps {
    onDone: (params: {
        config: WorkflowConfig;
        yamlConfig: WorkflowConfigYaml;
        workflowUrl?: string;
        workflowName?: string;
    }) => void;
}

export const UploadButton: React.FC<UploadButtonProps> = ({ onDone }) => {
    const [open, setOpen] = React.useState(false);
    const [config, setConfig] = React.useState<WorkflowConfig>();
    const [yaml, setYaml] = React.useState<WorkflowConfigYaml>();
    const [valid, setValid] = React.useState(false);
    const [validating, setValidating] = React.useState(false);
    const [workflowUrl, setWorkflowUrl] = React.useState<string>();
    const [workflowName, setWorkflowName] = React.useState<string>();

    const form = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            workflowUrl: '',
            workflowName: '',
        },
    });

    const handleDone = React.useCallback(() => {
        if (config && yaml) {
            onDone({ config, yamlConfig: yaml, workflowUrl, workflowName });
        }
        setOpen(false);
    }, [config, onDone, workflowName, workflowUrl, yaml]);

    const onSubmit = React.useCallback((data: { workflowUrl: string; workflowName: string }) => {
        setValidating(true);
        axios.get(data.workflowUrl).then((response) => {
            try {
                const doc: WorkflowConfigYaml = jsYaml.load(response.data) as WorkflowConfigYaml;
                const config = WorkflowConfigHelper.toObject(doc, data.workflowName);
                setConfig(config);
                setYaml(doc);
                setWorkflowUrl(data.workflowUrl);
                setWorkflowName(data.workflowName);
                setValid(true);
            } catch (e) {
                toast.error('The file is not a valid yaml file. Please try again.');
            }
            setValidating(false);
        });
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Upload File</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload a file</DialogTitle>
                    <DialogDescription>
                        You can upload a file to import your workflow configuration from a yaml or xml file.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4 w-full">
                    <div className="space-y-2 text-sm w-full">
                        <Label htmlFor="file" className="text-sm font-medium">
                            File (.xml, .yml, .yaml)
                        </Label>
                        <Input id="file" type="file" placeholder="File" accept=".xml,.yml,.yaml" />
                    </div>
                    <p>Or</p>
                    <Form {...form}>
                        <form className="flex flex-col gap-4 w-full" onSubmit={form.handleSubmit(onSubmit)}>
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
                                    'Validate'
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    <Button onClick={handleDone}>Done</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
