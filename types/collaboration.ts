export type CollaboratorRole = "viewer" | "editor";
export type AccessLevel = "none" | "viewer" | "editor" | "owner";

export interface Collaborator {
    id: string;
    userId: string;
    role: CollaboratorRole;
    createdAt: string;
    user: {
        name: string | null;
        email: string | null;
        image: string | null;
    };
}
