import { Metadata } from '@/types/Metadata';

export type WorkflowPlace = {
    name: string;
    metadata?: Metadata[];
};

export function isWorkflowPlace(obj: any): obj is WorkflowPlace {
    return !('to' in obj) && !('from' in obj);
}
