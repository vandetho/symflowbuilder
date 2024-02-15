import React from 'react';
import { SelectItem } from '@/types/SelectItem';
import TextField from '@/components/text-field';
import { MultiSelect } from '@/components/multi-select';
import Metadata from '@/app/metadata';
import { useBoolean } from 'react-use';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';

type TransitionFieldProps = {
    control: any;
    field: any;
    index: number;
    places: SelectItem[];
};

const TransitionField = React.memo<TransitionFieldProps>(({ control, field, index, places }) => {
    const [open, onToggle] = useBoolean(true);
    return (
        <Collapsible open={open} onOpenChange={() => onToggle()}>
            <div className="flex flex-row justify-between gap-3">
                <TextField
                    control={control}
                    name={`transitions.${index}.name`}
                    type="text"
                    label="Transition name"
                    placeholder="Transition name"
                    key={field.id}
                />
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <Icon icon="flowbite:chevron-sort-outline" width={24} />
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="gap-2">
                <TextField
                    control={control}
                    name={`transitions.${index}.guard`}
                    type="text"
                    label="Guard"
                    placeholder="Guard"
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
            </CollapsibleContent>
        </Collapsible>
    );
});

export default TransitionField;
