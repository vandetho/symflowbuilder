import { Metadata } from '@/types/Metadata';

export type WorkflowTransition = {
    name: string;
    from: string[];
    to: string[];
    guard?: string;
    metadata?: Metadata[];
};
