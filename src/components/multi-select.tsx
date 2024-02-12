import * as React from 'react';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { MultiSelect as BaseMultiSelect } from '@/components/ui/multi-select';
import { SelectItem } from '@/types/SelectItem';

interface MultiSelectProps {
    control: any;
    name: string;
    items: Array<SelectItem>;
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
