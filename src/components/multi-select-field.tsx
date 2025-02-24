import React from 'react';
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MultiSelect, Option } from '@/components/ui/multi-select';
import { Control } from 'react-hook-form';

interface MultiSelectFieldProps {
    control: Control<any>;
    name: string;
    label?: string;
    description?: string;
    options: Option[];
    disabled?: boolean;
    required?: boolean;
    className?: string;
}

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
    control,
    name,
    label,
    description,
    options,
    disabled,
    required,
    className,
}) => {
    const localId = React.useId();
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                console.log({ name, field: field.value });
                return (
                    <FormItem>
                        {label && (
                            <FormLabel htmlFor={localId} aria-required={required}>
                                {label}
                                {required && <span className="ml-1 text-red-500">*</span>}
                            </FormLabel>
                        )}
                        <MultiSelect
                            id={localId}
                            {...field}
                            className={className}
                            disabled={disabled}
                            options={options}
                            onValueChange={field.onChange}
                        />
                        <FormMessage />
                        {description && <FormDescription>{description}</FormDescription>}
                    </FormItem>
                );
            }}
        />
    );
};
