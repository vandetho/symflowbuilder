import { WorkflowPlace } from '@/types/WorkflowPlace';
import { WorkflowTransition } from '@/types/WorkflowTransition';
import { Metadata } from '@/types/Metadata';

export type WorkflowConfig = {
    name: string;
    metadata?: Metadata[];
    auditTrail: boolean;
    eventsToDispatch?: string[];
    supports: { entityName: string }[];
    markingStore: {
        type: string;
        property: string;
    };
    type: string;
    places: WorkflowPlace[];
    initialMarking?: string;
    transitions: WorkflowTransition[];
};

export type GraphWorkflowConfig = {
    name: string;
    metadata?: Metadata[];
    eventsToDispatch?: string[];
    auditTrail: boolean;
    supports: { entityName: string }[];
    markingStore: {
        type: string;
        property: string;
    };
    type: string;
    initialMarking: string;
};
