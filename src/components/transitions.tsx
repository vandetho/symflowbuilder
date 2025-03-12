import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useBoolean } from 'react-use';
import { TransitionField } from '@/components/transition-field';
import { Option } from '@/components/ui/multi-select';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TransitionsProps {
    control: any;
    places: Option[];
}

export const Transitions = React.memo<TransitionsProps>(({ control, places }) => {
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
                <div className="flex flex-row justify-between items-center gap-3">
                    <p className="text-lg">Transitions</p>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                            {open ? <ChevronUp /> : <ChevronDown />}
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="gap-2">
                    {fields.map((field, index) => (
                        <TransitionField
                            control={control}
                            index={index}
                            places={places}
                            onRemove={remove}
                            key={field.id}
                        />
                    ))}
                </CollapsibleContent>
                <Button variant="secondary" onClick={onAppend}>
                    Add Transition
                </Button>
            </div>
        </Collapsible>
    );
});

Transitions.displayName = 'Transitions';
