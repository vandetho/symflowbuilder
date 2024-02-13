import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import TextField from '@/components/text-field';
import { MultiSelect } from '@/components/multi-select';
import { SelectItem } from '@/types/SelectItem';
import Metadata from '@/app/metadata';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Icon } from '@iconify/react';
import { useBoolean } from 'react-use';

interface TransitionsProps {
    control: any;
    places: SelectItem[];
}

const Transitions = React.memo<TransitionsProps>(({ control, places }) => {
    const [open, onToggle] = useBoolean(true);
    const { fields, append, remove } = useFieldArray({
        control: control,
        name: 'transitions',
    });

    const onAppend = React.useCallback(() => {
        append({ name: '', to: [], from: [] });
    }, [append]);

    return (
        <Collapsible open={open} onOpenChange={() => onToggle()}>
            <div className="flex flex-col gap-3">
                <div className="flex flex-row justify-between gap-3">
                    <p className="text-lg">Transitions</p>
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
                                name={`transitions.${index}.name`}
                                type="text"
                                label="Transition name"
                                placeholder="Transition name"
                                key={field.id}
                            />
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
                            <Button variant="destructive" onClick={() => remove(index)}>
                                Remove
                            </Button>
                        </div>
                    ))}
                </CollapsibleContent>
                <Button variant="secondary" onClick={onAppend}>
                    Add Transition
                </Button>
            </div>
        </Collapsible>
    );
});

export default Transitions;
