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
import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { UrlImportForm } from '@/components/form/url-import-form';

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
    const [workflowUrl, setWorkflowUrl] = React.useState<string>();
    const [workflowName, setWorkflowName] = React.useState<string>();

    const handleDone = React.useCallback(() => {
        if (config && yaml) {
            onDone({ config, yamlConfig: yaml, workflowUrl, workflowName });
        }
        setOpen(false);
    }, [config, onDone, workflowName, workflowUrl, yaml]);

    const onValid = React.useCallback(
        (data: {
            config: WorkflowConfig;
            yamlConfig: WorkflowConfigYaml;
            workflowUrl?: string;
            workflowName?: string;
        }) => {
            setConfig(data.config);
            setYaml(data.yamlConfig);
            setWorkflowUrl(data.workflowUrl);
            setWorkflowName(data.workflowName);
        },
        [],
    );

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
                    <UrlImportForm onValid={onValid} />
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
