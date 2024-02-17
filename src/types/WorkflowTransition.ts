import { Metadata } from '@/types/Metadata';

export type WorkflowTransition = {
    name: string;
    from: string[];
    to: string[];
    guard?: string;
    metadata?: Metadata[];
};

export function isWorkflowTransition(obj: any): obj is WorkflowTransition {
    return 'to' in obj && 'from' in obj;
}
