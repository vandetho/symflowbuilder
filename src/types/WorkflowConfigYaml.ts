import { WorkflowPlaceYaml } from '@/types/WorkflowPlaceYaml';
import { WorkflowTransitionYaml } from '@/types/WorkflowTransitionYaml';

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
                places: WorkflowPlaceYaml;
                initial_marking: string;
                transitions?: WorkflowTransitionYaml;
            };
        };
    };
};
