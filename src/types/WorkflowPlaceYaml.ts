import { MetadataYaml } from '@/types/MetadataYaml';

export type WorkflowPlaceYaml = { [key: string]: { metadata?: MetadataYaml } | string | null };
