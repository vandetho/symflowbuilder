import * as React from 'react';
import { cn } from '@/lib/utils';

import { Check, X, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { MultiSelect as BaseMultiSelect } from '@/components/ui/multi-select';

interface MultiSelectProps {
    control: any;
    name: string;
    items: Array<{ label: string; value: string }>;
    label?: string;
    className?: string;
}

function MultiSelect({ control, name, className, label, items }: MultiSelectProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel>{label}</FormLabel>}
                    <BaseMultiSelect {...field} selected={field.value} options={items} className={className} />
                </FormItem>
            )}
        />
    );
}

export { MultiSelect };
