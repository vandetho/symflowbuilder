import React from 'react';
import { Label } from '@/components/ui/label';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { Switch as BaseSwitch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
    control: any;
    name: string;
    label?: string;
}

const Switch = React.memo<SwitchProps>(({ id, control, className, name, label, ...props }) => (
    <div className={cn('flex items-center space-x-2', className)}>
        <BaseSwitch {...props} id={id} />
        {label && <Label id={id}>{label}</Label>}
    </div>
));

export default Switch;
