'use client';

import React from 'react';
import { Input, InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';

interface TextFieldProps extends InputProps {
    control: any;
    name: string;
    label?: string;
}

const TextField = React.memo<TextFieldProps>(({ id, control, label, name, ...props }) => (
    <FormField
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
            <FormItem>
                {label && <Label htmlFor={id}>{label}</Label>}
                <Input {...props} {...field} id={id} />
                <FormMessage />
            </FormItem>
        )}
    />
));

export default TextField;
