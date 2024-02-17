import React, { useState } from 'react';
import { getRectOfNodes, getTransformForBounds, Panel, useReactFlow } from 'reactflow';
import { Button } from '@/components/ui/button';
import { toPng } from 'html-to-image';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

function downloadImage(dataUrl: string) {
    const a = document.createElement('a');

    a.setAttribute('download', 'reactflow.png');
    a.setAttribute('href', dataUrl);
    a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

type ExportImageButtonProps = {};

const ExportImageButton = React.memo<ExportImageButtonProps>(() => {
    const { getNodes } = useReactFlow();
    const [width, setWidth] = React.useState(imageWidth);
    const [height, setHeight] = React.useState(imageHeight);

    const onClick = React.useCallback(() => {
        const nodesBounds = getRectOfNodes(getNodes());
        const transform = getTransformForBounds(nodesBounds, width, height, 0.5, 2);
        toPng(document.querySelector('.react-flow__viewport') as HTMLElement, {
            backgroundColor: '#1a365d',
            width: width,
            height: height,
            style: {
                width: `${width}`,
                height: `${height}`,
                transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
            },
        }).then(downloadImage);
    }, []);

    return (
        <Panel position="top-right">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost">Export Image</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Dimension</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="width" className="text-right">
                                Width
                            </Label>
                            <Input
                                id="width"
                                value={width}
                                className="col-span-3"
                                onChange={(e) => {
                                    setWidth(Number(e.target.value));
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="height" className="text-right">
                                Height
                            </Label>
                            <Input
                                id="height"
                                value={height}
                                className="col-span-3"
                                onChange={(e) => {
                                    setHeight(Number(e.target.value));
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={onClick}>Download</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Panel>
    );
});

export default ExportImageButton;
