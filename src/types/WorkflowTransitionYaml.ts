import { MetadataYaml } from '@/types/MetadataYaml';

export type WorkflowTransitionYaml = {
    [key: string]: {
        from: string[];
        to: string[];
        guard?: string;
        metadata?: MetadataYaml | null;
    };
};
