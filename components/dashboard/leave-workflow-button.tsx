"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export function LeaveWorkflowButton({
    workflowId,
    workflowName,
}: {
    workflowId: string;
    workflowName: string;
}) {
    const [open, setOpen] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const router = useRouter();

    const handleLeave = async () => {
        setLeaving(true);
        try {
            const res = await fetch(`/api/workflows/${workflowId}/leave`, {
                method: "POST",
            });
            if (!res.ok) throw new Error("Failed");
            toast.success("Left workflow");
            setOpen(false);
            router.refresh();
        } catch {
            toast.error("Failed to leave workflow");
        } finally {
            setLeaving(false);
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
                <LogOut className="w-3 h-3" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-xs">
                    <DialogHeader>
                        <DialogTitle>Leave workflow?</DialogTitle>
                        <DialogDescription>
                            You will lose access to{" "}
                            <span className="font-mono text-[var(--text-primary)]">
                                {workflowName}
                            </span>
                            . The owner can re-invite you later.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={handleLeave}
                            disabled={leaving}
                            className="gap-1.5"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            {leaving ? "Leaving..." : "Leave"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
