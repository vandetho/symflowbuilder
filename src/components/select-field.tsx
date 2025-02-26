import React, { useId } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import * as SelectPrimitive from '@radix-ui/react-select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface SelectFieldProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
    control: any;
    name: string;
    items: Array<{ label: string; value: string }>;
    placeholder?: string;
    label?: string;
    className?: string;
}

export const SelectField = React.memo<SelectFieldProps>(
    ({ id, control, label, name, className, placeholder, items, ...props }) => {
        const localId = useId();
        return (
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        {label && <FormLabel>{label}</FormLabel>}
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger {...props} id={id} className={cn('flex-1', className)}>
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {items.map((item, index) => (
                                    <SelectItem value={item.value} key={`${id || localId}-select-item-${index}`}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    },
);

SelectField.displayName = 'SelectField';
