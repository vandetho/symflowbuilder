"use client";

import { useState, useCallback } from "react";
import {
    MessageCircle,
    X,
    Send,
    Bug,
    Lightbulb,
    HelpCircle,
    MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const FEEDBACK_TYPES = [
    { value: "bug", label: "Bug", icon: Bug, color: "var(--danger)" },
    { value: "feature", label: "Feature", icon: Lightbulb, color: "var(--warning)" },
    {
        value: "question",
        label: "Question",
        icon: HelpCircle,
        color: "var(--accent-bright)",
    },
    { value: "general", label: "General", icon: MessageSquare, color: "var(--success)" },
] as const;

type FeedbackType = (typeof FEEDBACK_TYPES)[number]["value"];

export function FeedbackFab() {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<FeedbackType>("general");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);

    const handleSubmit = useCallback(async () => {
        if (!message.trim()) {
            toast.error("Please enter a message");
            return;
        }

        setSending(true);
        try {
            const res = await fetch("https://supportdock.io/api/v1/feedback/remote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "sdk_ffa1e065310e46b0bef30aa0131fa3d3",
                },
                body: JSON.stringify({
                    type,
                    message: message.trim(),
                    email: email.trim() || undefined,
                    metadata: {
                        source: "symflowbuilder",
                        url: window.location.href,
                    },
                }),
            });

            if (!res.ok) throw new Error("Failed to send");

            toast.success("Thanks for your feedback!");
            setMessage("");
            setEmail("");
            setType("general");
            setOpen(false);
        } catch {
            toast.error("Failed to send feedback. Please try again.");
        } finally {
            setSending(false);
        }
    }, [type, message, email]);

    return (
        <>
            {/* FAB Button */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-linear-to-br from-[#7c6ff7] to-[#9d94ff] text-white shadow-[0_4px_24px_var(--accent-glow)] hover:shadow-[0_4px_32px_var(--accent-glow)] hover:brightness-110 transition-all duration-200 flex items-center justify-center cursor-pointer"
            >
                {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
            </button>

            {/* Feedback Panel */}
            {open && (
                <div className="fixed bottom-20 right-6 z-50 w-[320px] glass-strong rounded-[18px] shadow-[0_16px_64px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-[var(--glass-border)]">
                        <h3 className="text-sm font-medium text-[var(--text-primary)]">
                            Send Feedback
                        </h3>
                        <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                            Help us improve SymFlowBuilder
                        </p>
                    </div>

                    {/* Body */}
                    <div className="p-4 flex flex-col gap-3">
                        {/* Type selector */}
                        <div className="flex flex-col gap-1.5">
                            <Label>Type</Label>
                            <div className="grid grid-cols-4 gap-1.5">
                                {FEEDBACK_TYPES.map((ft) => (
                                    <button
                                        key={ft.value}
                                        onClick={() => setType(ft.value)}
                                        className={`flex flex-col items-center gap-1 px-2 py-2 rounded-[8px] text-[9px] font-mono transition-all cursor-pointer ${
                                            type === ft.value
                                                ? "bg-[var(--accent-dim)] border border-[var(--accent-border)] text-[var(--text-primary)]"
                                                : "bg-[var(--glass-base)] border border-[var(--glass-border)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-[var(--glass-border-hover)]"
                                        }`}
                                    >
                                        <ft.icon
                                            className="w-3.5 h-3.5"
                                            style={{
                                                color:
                                                    type === ft.value
                                                        ? ft.color
                                                        : undefined,
                                            }}
                                        />
                                        {ft.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Message */}
                        <div className="flex flex-col gap-1.5">
                            <Label>Message</Label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Describe your feedback..."
                                rows={3}
                                className="w-full rounded-[10px] px-3 py-2 text-sm font-mono bg-[var(--glass-base)] border border-[var(--glass-border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors hover:border-[var(--glass-border-hover)] focus-visible:outline-none focus-visible:border-[var(--accent-bright)] resize-none"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <Label>
                                Email{" "}
                                <span className="text-[var(--text-disabled)]">
                                    (optional)
                                </span>
                            </Label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="h-8 text-xs"
                            />
                        </div>

                        {/* Submit */}
                        <Button
                            onClick={handleSubmit}
                            disabled={sending || !message.trim()}
                            className="w-full gap-2"
                            size="sm"
                        >
                            <Send className="w-3.5 h-3.5" />
                            {sending ? "Sending..." : "Send Feedback"}
                        </Button>
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2 border-t border-[var(--glass-border)] flex justify-center">
                        <a
                            href="https://supportdock.io"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] text-[var(--text-disabled)] hover:text-[var(--text-muted)] transition-colors"
                        >
                            Powered by SupportDock
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}
