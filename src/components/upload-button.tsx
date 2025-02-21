import React from 'react';
import {
    Dialog,
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

const schema = object({
    url: string().url().required(),
});

interface UploadButtonProps {
    onDone: (file: File) => void;
}

export const UploadButton: React.FC<UploadButtonProps> = ({ onDone }) => {
    const form = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            url: '',
        },
    });

    const onSubmit = React.useCallback((data: { url: string }) => {
        axios.get(data.url).then((response) => {
            console.log({ response });
        });
    }, []);

    return (
        <Dialog>
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
                        <form className="flex gap-4 w-full items-end" onSubmit={form.handleSubmit(onSubmit)}>
                            <TextField
                                control={form.control}
                                name="url"
                                label="Url"
                                className="w-full"
                                placeholder="https://example.com/your-file.yml"
                            />
                            <Button type="submit">Validate</Button>
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
