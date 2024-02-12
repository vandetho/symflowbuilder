import React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { useFieldArray } from 'react-hook-form';
import TextField from '@/components/text-field';

interface MetadataProps {
    control: any;
    name: string;
}

const Metadata = React.memo<MetadataProps>(({ control, name }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <p className="text-blue-300">Metadata:</p>
                <Button variant="secondary" onClick={() => append({ name: '', value: '' })}>
                    <Icon icon="icons8:plus" width={24} height={24} />
                </Button>
            </div>
            {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3">
                    <div className="flex-grow">
                        <TextField
                            control={control}
                            name={`${name}.${index}.name`}
                            type="text"
                            placeholder="Name"
                            key={field.id}
                            className="flex-grow"
                        />
                    </div>
                    <div className="flex-grow">
                        <TextField
                            control={control}
                            name={`${name}.${index}.value`}
                            type="text"
                            placeholder="Value"
                            key={field.id}
                        />
                    </div>
                    <Button variant="destructive" onClick={() => remove(index)}>
                        <Icon icon="tabler:trash" width={24} />
                    </Button>
                </div>
            ))}
        </div>
    );
});

export default Metadata;
