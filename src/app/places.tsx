import React from 'react';
import { Button } from '@/components/ui/button';
import { useFieldArray } from 'react-hook-form';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Icon } from '@iconify/react';
import { useBoolean } from 'react-use';
import PlaceField from '@/components/place-field';

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
                            <Icon icon={open ? 'fa:sort-desc' : 'fa:sort-asc'} width={12} />
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex flex-col gap-2 border-2 border-primary rounded-md p-4">
                            <PlaceField control={control} index={index} />
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
