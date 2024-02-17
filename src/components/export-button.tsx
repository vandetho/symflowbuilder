import React from 'react';
import { Node } from 'reactflow';
import { WorkflowPlace } from '@/types/WorkflowPlace';
import { WorkflowTransition } from '@/types/WorkflowTransition';
import { Button } from '@/components/ui/button';
import { object, string } from 'yup';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@radix-ui/react-menu';
import { Input } from 'postcss';
import ExportForm from '@/components/export-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

type ExportButtonProps = {
    nodes: Node<WorkflowPlace | WorkflowTransition>[];
};

const ExportButton = React.memo<ExportButtonProps>(({ nodes }) => (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="secondary" className="bg-primary text-white p-2 rounded-md shadow-md hover:shadow-lg">
                Export Workflow
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Export Workflow Configuration in YAML</DialogTitle>
            </DialogHeader>
            <ExportForm nodes={nodes} />
        </DialogContent>
    </Dialog>
));

export default ExportButton;
