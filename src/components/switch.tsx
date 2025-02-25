import React from 'react';
import { Label } from '@/components/ui/label';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { Switch as BaseSwitch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Controller } from 'react-hook-form';

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
    control: any;
    name: string;
    label?: string;
}

export const Switch = React.memo<SwitchProps>(({ id, control, className, name, label, ...props }) => (
    <Controller
        control={control}
        name={name}
        render={({ field }) => (
            <div className={cn('flex items-center space-x-2', className)}>
                <BaseSwitch {...props} id={id} checked={field.value} onCheckedChange={field.onChange} />
                {label && <Label id={id}>{label}</Label>}
            </div>
        )}
    ></Controller>
));

Switch.displayName = 'Switch';
