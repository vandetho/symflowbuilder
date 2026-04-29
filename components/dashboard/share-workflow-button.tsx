"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Share2, Link2, Link2Off, Copy, Check, Code2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function ShareWorkflowButton({
    workflowId,
    shareId,
}: {
    workflowId: string;
    shareId: string | null;
}) {
    const [open, setOpen] = useState(false);
    const [currentShareId, setCurrentShareId] = useState(shareId);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [embedCopied, setEmbedCopied] = useState(false);
    const router = useRouter();

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = currentShareId ? `${origin}/w/${currentShareId}` : "";
    const embedUrl = currentShareId ? `${origin}/embed/${currentShareId}` : "";
    const embedSnippet = currentShareId
        ? `<iframe src="${embedUrl}" width="100%" height="500" style="border:0;border-radius:14px" loading="lazy" title="SymFlowBuilder workflow"></iframe>`
        : "";

    const handleShare = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/workflows/${workflowId}/share`, {
                method: "POST",
            });
            if (!res.ok) throw new Error("Failed");
            const data = await res.json();
            setCurrentShareId(data.shareId);
            toast.success("Workflow is now public");
            router.refresh();
        } catch {
            toast.error("Failed to share");
        } finally {
            setLoading(false);
        }
    };

    const handleUnshare = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/workflows/${workflowId}/share`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed");
            setCurrentShareId(null);
            toast.success("Workflow is now private");
            router.refresh();
        } catch {
            toast.error("Failed to unshare");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Link copied");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyEmbed = () => {
        navigator.clipboard.writeText(embedSnippet);
        setEmbedCopied(true);
        toast.success("Embed snippet copied");
        setTimeout(() => setEmbedCopied(false), 2000);
    };

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

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Share Workflow</DialogTitle>
                        <DialogDescription>
                            {currentShareId
                                ? "This workflow is publicly accessible via the link below."
                                : "Make this workflow public so anyone with the link can view it."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 mt-3">
                        {currentShareId ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <Input
                                        value={shareUrl}
                                        readOnly
                                        className="text-xs flex-1"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleCopy}
                                        className="shrink-0"
                                    >
                                        {copied ? (
                                            <Check className="w-3.5 h-3.5 text-[var(--success)]" />
                                        ) : (
                                            <Copy className="w-3.5 h-3.5" />
                                        )}
                                    </Button>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
                                        <Code2 className="w-3 h-3" />
                                        Embed
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            value={embedSnippet}
                                            readOnly
                                            className="text-[10px] font-mono flex-1"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleCopyEmbed}
                                            className="shrink-0"
                                        >
                                            {embedCopied ? (
                                                <Check className="w-3.5 h-3.5 text-[var(--success)]" />
                                            ) : (
                                                <Copy className="w-3.5 h-3.5" />
                                            )}
                                        </Button>
                                    </div>
                                    <p className="text-[10px] text-[var(--text-muted)]">
                                        Drop into MDX, HTML, or any docs site that allows
                                        iframes.
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--success)]">
                                        <Link2 className="w-3 h-3" />
                                        Public
                                    </div>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={handleUnshare}
                                        disabled={loading}
                                        className="gap-1.5"
                                    >
                                        <Link2Off className="w-3 h-3" />
                                        {loading ? "Removing..." : "Make Private"}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex justify-end">
                                <Button
                                    size="sm"
                                    onClick={handleShare}
                                    disabled={loading}
                                    className="gap-1.5"
                                >
                                    <Share2 className="w-3.5 h-3.5" />
                                    {loading ? "Sharing..." : "Make Public"}
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
