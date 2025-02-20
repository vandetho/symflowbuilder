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

interface UploadButtonProps {}

export const UploadButton: React.FC<UploadButtonProps> = ({}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Upload File</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload a file</DialogTitle>
                    <DialogDescription>
                        You can upload a file to import your workflow configuration from a yaml or xml file.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <div className="space-y-2 text-sm">
                                <Label htmlFor="file" className="text-sm font-medium">
                                    File (.xml, .yml, .yaml)
                                </Label>
                                <Input id="file" type="file" placeholder="File" accept=".xml,.yml,.yaml" />
                            </div>
                        </div>
                    </div>
                    <p>Or</p>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Username
                        </Label>
                        <Input id="username" value="@peduarte" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
