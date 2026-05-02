"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareDialog } from "@/components/share/share-dialog";

export function ShareWorkflowButton({
    workflowId,
    shareId,
}: {
    workflowId: string;
    shareId: string | null;
}) {
    const [open, setOpen] = useState(false);
    const [currentShareId, setCurrentShareId] = useState(shareId);

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setOpen(true)}
            >
                <Share2 className="w-3 h-3" />
            </Button>

            <ShareDialog
                workflowId={workflowId}
                shareId={currentShareId}
                open={open}
                onOpenChange={setOpen}
                onShareIdChange={setCurrentShareId}
            />
        </>
    );
}
