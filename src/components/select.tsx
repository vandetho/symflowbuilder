import React, { useId } from 'react';
import {
    Select as BaseSelect,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Controller } from 'react-hook-form';

interface SelectProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
    control: any;
    name: string;
    items: Array<{ label: string; value: string }>;
    placeholder?: string;
    label?: string;
    className?: string;
}

const Select = React.memo<SelectProps>(({ id, control, name, className, placeholder, items }) => {
    const localId = useId();
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <BaseSelect>
                    <SelectTrigger id={id} className={cn('flex-1', className)}>
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {items.map((item, index) => (
                                <SelectItem value={item.value} key={`${id || localId}-select-item-${index}`}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </BaseSelect>
            )}
        />
    );
});

export default Select;
