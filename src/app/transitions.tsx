import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import TextField from '@/components/text-field';
import { MultiSelect } from '@/components/multi-select';
import { SelectItem } from '@/types/SelectItem';
import Metadata from '@/app/metadata';

interface TransitionsProps {
    control: any;
    places: SelectItem[];
}

const Transitions = React.memo<TransitionsProps>(({ control, places }) => {
    const { fields, append, remove } = useFieldArray({
        control: control,
        name: 'transitions',
    });

    const onAppend = React.useCallback(() => {
        append({ name: '', to: [], from: [] });
    }, [append]);

    return (
        <div className="flex flex-col gap-3">
            <p className="text-lg">Transitions</p>
            {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-2 border-2 border-primary rounded-md p-4">
                    <TextField
                        control={control}
                        name={`transitions.${index}.name`}
                        type="text"
                        placeholder="Transition name"
                        key={field.id}
                    />
                    <MultiSelect
                        control={control}
                        name={`transitions.${index}.from`}
                        className="w-[300px]"
                        label="From"
                        items={places}
                    />
                    <MultiSelect
                        control={control}
                        name={`transitions.${index}.to`}
                        className="w-[300px]"
                        label="To"
                        items={places}
                    />
                    <Metadata control={control} name={`transitions.${index}.metadata`} />
                    <Button variant="destructive" onClick={() => remove(index)}>
                        Remove
                    </Button>
                </div>
            ))}
            <Button variant="secondary" onClick={onAppend}>
                Add Transition
            </Button>
        </div>
    );
});

export default Transitions;
