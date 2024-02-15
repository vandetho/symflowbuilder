import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useBoolean } from 'react-use';
import TextField from '@/components/text-field';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import Metadata from '@/app/metadata';

type PlaceFieldProps = {
    control: any;
    index: number;
};

const PlaceField = React.memo<PlaceFieldProps>(({ control, index }) => {
    const [open, onToggle] = useBoolean(true);
    return (
        <Collapsible open={open} onOpenChange={() => onToggle()}>
            <div className="flex flex-row justify-between gap-3">
                <TextField
                    control={control}
                    name={`places.${index}.name`}
                    type="text"
                    label="Place"
                    placeholder="Place"
                />
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <Icon icon={open ? 'fa:sort-desc' : 'fa:sort-asc'} width={12} />
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
                <Metadata control={control} name={`places.${index}.metadata`} />
            </CollapsibleContent>
        </Collapsible>
    );
});

export default PlaceField;
