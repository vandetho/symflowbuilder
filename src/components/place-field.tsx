import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useBoolean } from 'react-use';
import { TextField } from '@/components/text-field';
import { Button } from '@/components/ui/button';
import { Metadata } from '@/components/metadata';
import { ChevronDown, ChevronUp, CircleX } from 'lucide-react';

type PlaceFieldProps = {
    control: any;
    index: number;
    onRemove: (index: number) => void;
};

export const PlaceField = React.memo<PlaceFieldProps>(({ control, index, onRemove }) => {
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
                    name={`places.${index}.name`}
                    type="text"
                    label="Place"
                    placeholder="Place"
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
            <CollapsibleContent>
                <Metadata control={control} name={`places.${index}.metadata`} />
            </CollapsibleContent>
        </Collapsible>
    );
});

PlaceField.displayName = 'PlaceField';
