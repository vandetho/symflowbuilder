import { WorkflowPlace } from '@/types/WorkflowPlace';
import { WorkflowTransition } from '@/types/WorkflowTransition';

export type WorkflowConfig = {
    name: string;
    auditTrail: boolean;
    events_to_dispatch?: string[];
    supports: { entityName: string }[];
    markingStore: {
        type: string;
        property: string;
    };
    type: string;
    places: WorkflowPlace[];
    initialMarking: string;
    transitions: WorkflowTransition[];
};
