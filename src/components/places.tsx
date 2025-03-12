import React from 'react';
import { Button } from '@/components/ui/button';
import { useFieldArray } from 'react-hook-form';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useBoolean } from 'react-use';
import { PlaceField } from '@/components/place-field';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PlacesProps {
    control: any;
}

export const Places = React.memo<PlacesProps>(({ control }) => {
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
                <div className="flex flex-row justify-between items-center gap-3">
                    <p className="text-lg">Places</p>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                            {open ? <ChevronUp /> : <ChevronDown />}
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                    {fields.map((field, index) => (
                        <PlaceField control={control} index={index} onRemove={remove} key={field.id} />
                    ))}
                </CollapsibleContent>
                <Button variant="secondary" onClick={onAppend}>
                    Add Place
                </Button>
            </div>
        </Collapsible>
    );
});

Places.displayName = 'Places';
