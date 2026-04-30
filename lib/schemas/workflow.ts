import { z } from "zod";

const SYMFONY_VERSIONS = ["5.4", "6.4", "7.4", "8.0"] as const;
const WORKFLOW_TYPES = ["workflow", "state_machine"] as const;

export const createWorkflowSchema = z.object({
    name: z.string().min(1).max(120).optional(),
    description: z.string().max(2000).nullish(),
    symfonyVersion: z.enum(SYMFONY_VERSIONS).optional(),
    type: z.enum(WORKFLOW_TYPES).optional(),
    graphJson: z.unknown().optional(),
    yamlCache: z.string().optional(),
    simulationConfig: z.unknown().nullish(),
});

export const updateWorkflowSchema = z.object({
    name: z.string().min(1).max(120).optional(),
    description: z.string().max(2000).nullish(),
    symfonyVersion: z.enum(SYMFONY_VERSIONS).optional(),
    type: z.enum(WORKFLOW_TYPES).optional(),
    graphJson: z.unknown().optional(),
    yamlCache: z.string().optional(),
    simulationConfig: z.unknown().nullish(),
});

export const createVersionSchema = z.object({
    label: z.string().min(1).max(120).optional(),
    graphJson: z.unknown().optional(),
    yamlSnapshot: z.string().optional(),
});

export type CreateWorkflowInput = z.infer<typeof createWorkflowSchema>;
export type UpdateWorkflowInput = z.infer<typeof updateWorkflowSchema>;
export type CreateVersionInput = z.infer<typeof createVersionSchema>;
