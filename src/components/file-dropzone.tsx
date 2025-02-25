import React from 'react';
import Dropzone from 'react-dropzone';
import { useBoolean } from 'react-use';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type FileDropzoneProps = {
    onDrop?: (files: File) => void;
    children: React.ReactNode;
};

export const FileDropzone: React.FC<FileDropzoneProps> = ({ onDrop, children }) => {
    const [open, onToggle] = useBoolean(false);

    const handleDrop = React.useCallback(
        (files: File[]) => {
            if (onDrop) {
                onDrop(files[0]);
            }
            onToggle(false);
        },
        [onDrop, onToggle],
    );

    const onDragEnter = React.useCallback(() => {
        if (!open) {
            onToggle(true);
        }
    }, [onToggle, open]);

    return (
        <React.Fragment>
            <Dropzone noClick onDrop={handleDrop} onDragEnter={onDragEnter} multiple={false}>
                {({ getRootProps, getInputProps }) => (
                    <React.Fragment>
                        <div {...getRootProps()}>
                            <input {...getInputProps()} hidden />
                            {children}
                            <Dialog open={open} onOpenChange={onToggle}>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>File dropzone</DialogTitle>
                                    </DialogHeader>
                                    <div className="border-dashed border-4 rounded-md w-[375px] h-[375px] flex flex-col items-center justify-center">
                                        <p className="text-lg text-center font-bold">
                                            Drop your workflow configuration yaml file here
                                        </p>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </React.Fragment>
                )}
            </Dropzone>
        </React.Fragment>
    );
};

FileDropzone.displayName = 'FileDropzone';
