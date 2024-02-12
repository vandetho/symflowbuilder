import React from 'react';
import { Button } from '@/components/ui/button';
import TextField from '@/components/text-field';
import { useFieldArray } from 'react-hook-form';
import Metadata from '@/app/metadata';

interface PlacesProps {
    control: any;
}

const Places = React.memo<PlacesProps>(({ control }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'places',
    });

    const onAppend = React.useCallback(() => {
        append({ name: '' });
    }, [append]);

    return (
        <div className="flex flex-col gap-3">
            <p className="text-lg">Places</p>
            {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-2 border-2 border-primary rounded-md p-4">
                    <TextField
                        control={control}
                        name={`places.${index}.name`}
                        type="text"
                        placeholder="Place"
                        key={field.id}
                    />
                    <Metadata control={control} name={`places.${index}.metadata`} />
                    <Button variant="destructive" onClick={() => remove(index)}>
                        Remove
                    </Button>
                </div>
            ))}
            <Button variant="secondary" onClick={onAppend}>
                Add Place
            </Button>
        </div>
    );
});

export default Places;
