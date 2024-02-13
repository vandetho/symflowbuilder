import React from 'react';
import { Button } from '@/components/ui/button';
import TextField from '@/components/text-field';
import { useFieldArray } from 'react-hook-form';
import Metadata from '@/app/metadata';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Icon } from '@iconify/react';
import { useBoolean } from 'react-use';

interface PlacesProps {
    control: any;
}

const Places = React.memo<PlacesProps>(({ control }) => {
    const [open, onToggle] = useBoolean(true);
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'places',
    });

    const onAppend = React.useCallback(() => {
        append({ name: '' });
    }, [append]);

    return (
        <Collapsible open={open} onOpenChange={() => onToggle()}>
            <div className="flex flex-col gap-3">
                <div className="flex flex-row justify-between gap-3">
                    <p className="text-lg">Places</p>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <Icon icon="flowbite:chevron-sort-outline" width={24} />
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
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
                </CollapsibleContent>
                <Button variant="secondary" onClick={onAppend}>
                    Add Place
                </Button>
            </div>
        </Collapsible>
    );
});

export default Places;
