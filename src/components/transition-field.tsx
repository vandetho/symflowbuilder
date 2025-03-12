import React from 'react';
import { TextField } from '@/components/text-field';
import { Metadata } from '@/components/metadata';
import { useBoolean } from 'react-use';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { MultiSelectField } from '@/components/multi-select-field';
import { Option } from '@/components/ui/multi-select';
import { ChevronDown, ChevronUp, CircleX } from 'lucide-react';

type TransitionFieldProps = {
    control: any;
    index: number;
    places: Option[];
    onRemove: (index: number) => void;
};

export const TransitionField = React.memo<TransitionFieldProps>(({ control, index, places, onRemove }) => {
    const [open, onToggle] = useBoolean(true);

    const handleRemove = React.useCallback(() => {
        onRemove(index);
    }, [index, onRemove]);

    return (
        <Collapsible
            className="flex flex-col gap-2 border-2 border-primary rounded-md p-4"
            open={open}
            onOpenChange={onToggle}
        >
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
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                            {open ? <ChevronUp /> : <ChevronDown />}
                            <span className="sr-only">Toggle</span>
                        </Button>
                        <Button variant="destructive" onClick={handleRemove}>
                            <CircleX />
                        </Button>
                    </div>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="flex flex-col gap-2">
                <TextField
                    control={control}
                    name={`transitions.${index}.guard`}
                    type="text"
                    label="Guard"
                    placeholder="Guard"
                />
                <div className="flex flex-row gap-2 w-full">
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
                </div>
                <Metadata control={control} name={`transitions.${index}.metadata`} />
            </CollapsibleContent>
        </Collapsible>
    );
});

TransitionField.displayName = 'TransitionField';
