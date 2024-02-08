import React from 'react';
import { Input, InputProps } from '@/components/ui/input';
import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';

interface TextFieldProps extends InputProps {
    control: any;
    name: string;
    label?: string;
}

const TextField = React.memo<TextFieldProps>(({ id, control, label, name, ...props }) => (
    <Controller
        control={control}
        render={({ field }) => (
            <div className="flex flex-col gap-2">
                {label && <Label htmlFor={id}>{label}</Label>}
                <Input {...props} {...field} id={id} />
            </div>
        )}
        name={name}
    />
));

export default TextField;
