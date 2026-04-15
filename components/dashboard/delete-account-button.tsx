"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export function DeleteAccountButton() {
    const [open, setOpen] = useState(false);
    const [confirmation, setConfirmation] = useState("");
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirmation !== "DELETE") return;
        setDeleting(true);
        try {
            const res = await fetch("/api/account", { method: "DELETE" });
            if (!res.ok) throw new Error("Failed");
            toast.success("Account deleted");
            await signOut({ callbackUrl: "/" });
        } catch {
            toast.error("Failed to delete account");
            setDeleting(false);
        }
    };

    return (
        <>
            <Button
                variant="danger"
                size="sm"
                className="gap-1.5"
                onClick={() => setOpen(true)}
            >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Account
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete your account?</DialogTitle>
                        <DialogDescription>
                            This will permanently delete your account and all your
                            workflows. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 mt-3">
                        <div className="flex flex-col gap-1.5">
                            <Label>
                                Type{" "}
                                <span className="font-mono text-[var(--danger)]">
                                    DELETE
                                </span>{" "}
                                to confirm
                            </Label>
                            <Input
                                value={confirmation}
                                onChange={(e) => setConfirmation(e.target.value)}
                                placeholder="DELETE"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setOpen(false);
                                    setConfirmation("");
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={handleDelete}
                                disabled={confirmation !== "DELETE" || deleting}
                                className="gap-1.5"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                {deleting ? "Deleting..." : "Delete Account"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
