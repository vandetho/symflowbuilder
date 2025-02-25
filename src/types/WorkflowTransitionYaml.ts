import { MetadataYaml } from '@/types/MetadataYaml';

export type WorkflowTransitionYaml = {
    [key: string]: {
        from: string | string[];
        to: string | string[];
        guard?: string;
        metadata?: MetadataYaml | null;
    };
};
