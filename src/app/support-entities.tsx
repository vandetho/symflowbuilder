import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { TextField } from '@/components/text-field';
import { Button } from '@/components/ui/button';

type SupportEntitiesProps = {
    control: any;
};

const SupportEntities = React.memo<SupportEntitiesProps>(({ control }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'supports',
    });

    const onAppend = React.useCallback(() => {
        append({ entityName: '' });
    }, [append]);

    return (
        <div className="flex flex-col gap-3">
            <p className="text-lg">Support Entities</p>
            {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3 border rounded-md">
                    <div className="flex-grow">
                        <TextField
                            control={control}
                            name={`supports.${index}.entityName`}
                            type="text"
                            placeholder="Support Entity Name"
                            key={field.id}
                        />
                    </div>
                    <Button variant="destructive" onClick={() => remove(index)}>
                        Remove
                    </Button>
                </div>
            ))}
            <Button variant="secondary" onClick={onAppend}>
                Add Support Entity
            </Button>
        </div>
    );
});

export default SupportEntities;
