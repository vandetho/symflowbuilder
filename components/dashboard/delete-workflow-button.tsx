"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export function DeleteWorkflowButton({
    workflowId,
    workflowName,
}: {
    workflowId: string;
    workflowName: string;
}) {
    const [open, setOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/workflows/${workflowId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed");
            toast.success("Workflow deleted");
            setOpen(false);
            router.refresh();
        } catch {
            toast.error("Failed to delete workflow");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:!text-[var(--danger)]"
                onClick={() => setOpen(true)}
            >
                <Trash2 className="w-3 h-3" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-xs">
                    <DialogHeader>
                        <DialogTitle>Delete workflow?</DialogTitle>
                        <DialogDescription>
                            This will permanently delete{" "}
                            <span className="font-mono text-[var(--text-primary)]">
                                {workflowName}
                            </span>{" "}
                            and all its versions. This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="gap-1.5"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            {deleting ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
