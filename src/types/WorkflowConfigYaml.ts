import { Metadata } from '@/types/Metadata';

export type WorkflowConfigYaml = {
    framework: {
        workflow: {
            [key: string]: {
                audit_trail: {
                    enabled: boolean;
                };
                markingStore: {
                    type: string;
                    property: string;
                };
                type: string;
                places: { [key: string]: { metadata?: Metadata[] } | string | null };
                initialMarking: string;
                transitions?: { [key: string]: { from: string[]; to: string[] } };
            };
        };
    };
};
