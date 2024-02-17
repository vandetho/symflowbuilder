import React from 'react';
import { Metadata } from '@/types/Metadata';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { Input } from '@/components/ui/input';

type GraphMetadataProps = {
    id: string;
    metadata: Metadata[];
    onAddMetadata?: (id: string) => void;
    onRemoveMetadata?: (index: number, id: string) => void;
    onChangeMetadata?: (e: React.ChangeEvent<HTMLInputElement>, index: number, id: string) => void;
};

const GraphMetadata = React.memo<GraphMetadataProps>(
    ({ id, metadata, onAddMetadata, onRemoveMetadata, onChangeMetadata }) => {
        const handleAddMetadata = React.useCallback(() => {
            if (onAddMetadata) {
                onAddMetadata(id);
            }
        }, [id, onAddMetadata]);

        const handleRemoveMetadata = React.useCallback(
            (index: number) => () => {
                if (onRemoveMetadata) {
                    onRemoveMetadata(index, id);
                }
            },
            [id, onRemoveMetadata],
        );

        const handleChangeMetadata = React.useCallback(
            (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
                if (onChangeMetadata) {
                    onChangeMetadata(e, index, id);
                }
            },
            [id, onChangeMetadata],
        );

        return (
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center gap-3">
                    <p className="text-blue-300">Metadata:</p>
                    <Button variant="secondary" onClick={handleAddMetadata}>
                        <Icon icon="icons8:plus" width={24} height={24} />
                    </Button>
                </div>
                {metadata.map((meta, index) => (
                    <div key={`${id}-metadata-${index}`} className="flex gap-3">
                        <div className="flex-grow">
                            <Input name="name" type="text" placeholder="Name" value={meta.name} className="flex-grow" />
                        </div>
                        <div className="flex-grow">
                            <Input
                                name="value"
                                type="text"
                                placeholder="Value"
                                value={meta.value}
                                className="flex-grow"
                                onChange={handleChangeMetadata(index)}
                            />
                        </div>
                        <Button variant="destructive" onClick={handleRemoveMetadata(index)}>
                            <Icon icon="tabler:trash" width={24} />
                        </Button>
                    </div>
                ))}
            </div>
        );
    },
);

export default GraphMetadata;
