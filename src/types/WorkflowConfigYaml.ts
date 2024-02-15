import { WorkflowPlaceYaml } from '@/types/WorkflowPlaceYaml';
import { WorkflowTransitionYaml } from '@/types/WorkflowTransitionYaml';
import { MetadataYaml } from '@/types/MetadataYaml';

export type WorkflowConfigYaml = {
    framework: {
        workflows: {
            [key: string]: {
                audit_trail: {
                    enabled: boolean;
                };
                metadata?: MetadataYaml;
                events_to_dispatch?: string[];
                marking_store: {
                    type: string;
                    property: string;
                };
                supports: string[];
                type: string;
                places: WorkflowPlaceYaml;
                initial_marking: string;
                transitions?: WorkflowTransitionYaml;
            };
        };
    };
};
