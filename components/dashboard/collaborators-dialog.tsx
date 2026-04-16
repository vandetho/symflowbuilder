"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Users, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import type { Collaborator, CollaboratorRole } from "@/types/collaboration";

interface CollaboratorsDialogProps {
    workflowId: string;
    workflowName: string;
}

export function CollaboratorsDialog({
    workflowId,
    workflowName,
}: CollaboratorsDialogProps) {
    const [open, setOpen] = useState(false);
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<CollaboratorRole>("viewer");
    const [adding, setAdding] = useState(false);

    const fetchCollaborators = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/workflows/${workflowId}/collaborators`);
            if (res.ok) {
                setCollaborators(await res.json());
            }
        } finally {
            setLoading(false);
        }
    }, [workflowId]);

    useEffect(() => {
        if (open) fetchCollaborators();
    }, [open, fetchCollaborators]);

    const handleAdd = async () => {
        if (!email.trim()) return;
        setAdding(true);
        try {
            const res = await fetch(`/api/workflows/${workflowId}/collaborators`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), role }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error ?? "Failed to add collaborator");
                return;
            }
            toast.success(`Added ${data.user.name ?? data.user.email}`);
            setEmail("");
            fetchCollaborators();
        } catch {
            toast.error("Failed to add collaborator");
        } finally {
            setAdding(false);
        }
    };

    const handleUpdateRole = async (
        collaboratorId: string,
        newRole: CollaboratorRole
    ) => {
        try {
            const res = await fetch(
                `/api/workflows/${workflowId}/collaborators/${collaboratorId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ role: newRole }),
                }
            );
            if (!res.ok) throw new Error();
            toast.success("Role updated");
            fetchCollaborators();
        } catch {
            toast.error("Failed to update role");
        }
    };

    const handleRemove = async (collaboratorId: string) => {
        try {
            const res = await fetch(
                `/api/workflows/${workflowId}/collaborators/${collaboratorId}`,
                { method: "DELETE" }
            );
            if (!res.ok) throw new Error();
            toast.success("Collaborator removed");
            fetchCollaborators();
        } catch {
            toast.error("Failed to remove collaborator");
        }
    };

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setOpen(true)}
            >
                <Users className="w-3 h-3" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Collaborators</DialogTitle>
                        <DialogDescription>
                            Manage who can access{" "}
                            <span className="font-mono text-[var(--text-primary)]">
                                {workflowName}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    {/* Add collaborator */}
                    <div className="flex gap-2 mt-2">
                        <Input
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 !font-sans"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleAdd();
                            }}
                        />
                        <div className="w-[100px]">
                            <Select
                                value={role}
                                onChange={(e) =>
                                    setRole(e.target.value as CollaboratorRole)
                                }
                            >
                                <SelectItem value="viewer">Viewer</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                            </Select>
                        </div>
                        <Button
                            size="sm"
                            onClick={handleAdd}
                            disabled={adding || !email.trim()}
                        >
                            {adding ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                "Add"
                            )}
                        </Button>
                    </div>

                    {/* List */}
                    <div className="flex flex-col gap-1 mt-3 max-h-[240px] overflow-y-auto">
                        {loading && (
                            <div className="flex justify-center py-4">
                                <Loader2 className="w-4 h-4 text-[var(--accent)] animate-spin" />
                            </div>
                        )}

                        {!loading && collaborators.length === 0 && (
                            <p className="text-xs text-[var(--text-muted)] text-center py-4">
                                No collaborators yet
                            </p>
                        )}

                        {collaborators.map((c) => (
                            <div
                                key={c.id}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-[10px] hover:bg-[var(--glass-base)] transition-colors"
                            >
                                {c.user.image ? (
                                    <Image
                                        src={c.user.image}
                                        alt=""
                                        width={20}
                                        height={20}
                                        className="w-5 h-5 rounded-full"
                                    />
                                ) : (
                                    <div className="w-5 h-5 rounded-full bg-[var(--glass-overlay)]" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-[var(--text-primary)] truncate">
                                        {c.user.name ?? c.user.email}
                                    </p>
                                    {c.user.name && c.user.email && (
                                        <p className="text-[10px] text-[var(--text-muted)] truncate">
                                            {c.user.email}
                                        </p>
                                    )}
                                </div>
                                <div className="w-[90px]">
                                    <Select
                                        value={c.role}
                                        onChange={(e) =>
                                            handleUpdateRole(
                                                c.id,
                                                e.target.value as CollaboratorRole
                                            )
                                        }
                                    >
                                        <SelectItem value="viewer">Viewer</SelectItem>
                                        <SelectItem value="editor">Editor</SelectItem>
                                    </Select>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 hover:!text-[var(--danger)]"
                                    onClick={() => handleRemove(c.id)}
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
