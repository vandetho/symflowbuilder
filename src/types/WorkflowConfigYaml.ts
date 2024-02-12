import { Metadata } from '@/types/Metadata';

export type WorkflowConfigYaml = {
    framework: {
        workflows: {
            [key: string]: {
                audit_trail: {
                    enabled: boolean;
                };
                marking_store: {
                    type: string;
                    property: string;
                };
                supports: string[];
                type: string;
                places: { [key: string]: { metadata?: Metadata[] } | string | null };
                initial_marking: string;
                transitions?: { [key: string]: { from: string[]; to: string[] } };
            };
        };
    };
};
