import React from 'react';
import { TextField } from '@/components/text-field';
import Metadata from '@/app/metadata';
import { useBoolean } from 'react-use';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { MultiSelectField } from '@/components/multi-select-field';
import { Option } from '@/components/ui/multi-select';

type TransitionFieldProps = {
    control: any;
    index: number;
    places: Option[];
};

const TransitionField = React.memo<TransitionFieldProps>(({ control, index, places }) => {
    const [open, onToggle] = useBoolean(true);
    return (
        <Collapsible open={open} onOpenChange={() => onToggle()}>
            <div className="flex flex-row justify-between items-center gap-3">
                <TextField
                    control={control}
                    name={`transitions.${index}.name`}
                    type="text"
                    label="Transition name"
                    placeholder="Transition name"
                    className="w-full"
                />
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <Icon icon={open ? 'fa:sort-desc' : 'fa:sort-asc'} width={12} />
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
                />
                <MultiSelectField
                    control={control}
                    name={`transitions.${index}.from`}
                    className="w-full"
                    label="From"
                    options={places}
                />
                <MultiSelectField
                    control={control}
                    name={`transitions.${index}.to`}
                    className="w-full"
                    label="To"
                    options={places}
                />
                <Metadata control={control} name={`transitions.${index}.metadata`} />
            </CollapsibleContent>
        </Collapsible>
    );
});

export default TransitionField;
