import React, { useId } from 'react';
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea, TextareaProps } from '@/components/ui/textarea';

interface TextAreaFieldProps extends TextareaProps {
    control: any;
    name: string;
    label?: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    description?: string;
}

export const TextAreaField = React.memo<TextAreaFieldProps>(
    ({ id, control, label, name, startIcon, endIcon, description, ...props }) => {
        const localId = useId();
        return (
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem className={props.className}>
                        {label && <FormLabel htmlFor={id || localId}>{label}</FormLabel>}
                        <div className="flex flex-row gap-2">
                            {startIcon && startIcon}
                            <Textarea
                                {...props}
                                {...field}
                                onChange={(event) => {
                                    field.onChange(event);
                                    props.onChange && props.onChange(event);
                                }}
                                id={id || localId}
                            />
                            {endIcon && endIcon}
                        </div>
                        <FormMessage />
                        {description && <FormDescription>{description}</FormDescription>}
                    </FormItem>
                )}
            />
        );
    },
);
