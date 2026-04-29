import { z } from "zod";

const COLLABORATOR_ROLES = ["viewer", "editor"] as const;

export const addCollaboratorSchema = z.object({
    email: z.string().email(),
    role: z.enum(COLLABORATOR_ROLES),
});

export const updateCollaboratorRoleSchema = z.object({
    role: z.enum(COLLABORATOR_ROLES),
});

export type AddCollaboratorInput = z.infer<typeof addCollaboratorSchema>;
export type UpdateCollaboratorRoleInput = z.infer<typeof updateCollaboratorRoleSchema>;
