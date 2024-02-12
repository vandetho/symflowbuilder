import React from 'react';
import { Button } from '@/components/ui/button';
import TextField from '@/components/text-field';
import { useFieldArray } from 'react-hook-form';

interface PlacesProps {
    control: any;
}

const Places = React.memo<PlacesProps>(({ control }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'places',
    });

    const onAddPlace = React.useCallback(() => {
        append({ name: '' });
    }, [append]);

    return (
        <div className="flex flex-col gap-3">
            <p className="text-lg">Places</p>
            <Button variant="secondary" onClick={onAddPlace}>
                Add Place
            </Button>
            {fields.map((field, index) => (
                <div className={'flex gap-2'} key={field.id}>
                    <TextField
                        control={control}
                        name={`places.${index}.name`}
                        type="text"
                        placeholder="Place"
                        key={field.id}
                    />
                    <Button variant="destructive" onClick={() => remove(index)}>
                        Remove
                    </Button>
                </div>
            ))}
        </div>
    );
});

export default Places;
