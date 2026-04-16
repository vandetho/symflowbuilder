"use client";

import { useState, useCallback, useRef } from "react";
import {
    MessageCircle,
    X,
    Send,
    Bug,
    Lightbulb,
    HelpCircle,
    MessageSquare,
    ImagePlus,
    Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const FEEDBACK_TYPES = [
    { value: "bug", label: "Bug", icon: Bug, color: "var(--danger)" },
    {
        value: "feature",
        label: "Feature",
        icon: Lightbulb,
        color: "var(--warning)",
    },
    {
        value: "question",
        label: "Question",
        icon: HelpCircle,
        color: "var(--accent-bright)",
    },
    {
        value: "general",
        label: "General",
        icon: MessageSquare,
        color: "var(--success)",
    },
] as const;

type FeedbackType = (typeof FEEDBACK_TYPES)[number]["value"];

const MAX_IMAGES = 3;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

export function FeedbackFab() {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<FeedbackType>("general");
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [sending, setSending] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddImages = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        const valid = files.filter((f) => {
            if (f.size > MAX_IMAGE_SIZE) {
                toast.error(`${f.name} exceeds 2MB limit`);
                return false;
            }
            if (
                !["image/png", "image/jpeg", "image/webp", "image/gif"].includes(f.type)
            ) {
                toast.error(`${f.name} is not a supported image format`);
                return false;
            }
            return true;
        });
        setImages((prev) => [...prev, ...valid].slice(0, MAX_IMAGES));
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, []);

    const removeImage = useCallback((index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!message.trim()) {
            toast.error("Please enter a message");
            return;
        }

        setSending(true);
        try {
            const formData = new FormData();
            formData.append("type", type);
            formData.append("message", message.trim());
            if (name.trim()) formData.append("name", name.trim());
            if (email.trim()) formData.append("email", email.trim());
            if (subject.trim()) formData.append("subject", subject.trim());
            formData.append(
                "metadata",
                JSON.stringify({
                    source: "symflowbuilder",
                    url: window.location.href,
                })
            );
            images.forEach((img) => formData.append("images", img));

            const res = await fetch("https://supportdock.io/api/v1/feedback/remote", {
                method: "POST",
                headers: {
                    "x-api-key": "sdk_ffa1e065310e46b0bef30aa0131fa3d3",
                },
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to send");

            toast.success("Thanks for your feedback!");
            setMessage("");
            setName("");
            setEmail("");
            setSubject("");
            setImages([]);
            setType("general");
            setOpen(false);
        } catch {
            toast.error("Failed to send feedback. Please try again.");
        } finally {
            setSending(false);
        }
    }, [type, message, name, email, subject, images]);

    return (
        <>
            {/* FAB Button */}
            <motion.button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-linear-to-br from-[#7c6ff7] to-[#9d94ff] text-white shadow-[0_4px_24px_var(--accent-glow)] hover:shadow-[0_4px_32px_var(--accent-glow)] transition-shadow flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <AnimatePresence mode="wait">
                    {open ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <X className="w-5 h-5" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <MessageCircle className="w-5 h-5" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Feedback Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-20 right-6 z-50 w-[340px] rounded-[18px] shadow-[0_16px_64px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden max-h-[calc(100vh-120px)] border border-[var(--glass-border-strong)]"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(20, 20, 42, 0.92), rgba(12, 12, 28, 0.95))",
                            backdropFilter: "var(--blur-xl)",
                            WebkitBackdropFilter: "var(--blur-xl)",
                        }}
                    >
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
                        <div className="p-4 flex flex-col gap-3 overflow-auto">
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

                            {/* Subject */}
                            <div className="flex flex-col gap-1.5">
                                <Label>
                                    Subject{" "}
                                    <span className="text-[var(--text-disabled)]">
                                        (optional)
                                    </span>
                                </Label>
                                <Input
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Brief summary"
                                    className="h-8 text-xs"
                                />
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

                            {/* Images */}
                            <div className="flex flex-col gap-1.5">
                                <Label>
                                    Screenshots{" "}
                                    <span className="text-[var(--text-disabled)]">
                                        ({images.length}/{MAX_IMAGES})
                                    </span>
                                </Label>
                                {images.length > 0 && (
                                    <div className="flex gap-1.5 flex-wrap">
                                        {images.map((img, i) => (
                                            <div
                                                key={i}
                                                className="relative group w-14 h-14 rounded-[8px] overflow-hidden border border-[var(--glass-border)]"
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={URL.createObjectURL(img)}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    onClick={() => removeImage(i)}
                                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                                >
                                                    <Trash2 className="w-3 h-3 text-white" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {images.length < MAX_IMAGES && (
                                    <>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp,image/gif"
                                            multiple
                                            onChange={handleAddImages}
                                            className="hidden"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-fit gap-1.5 text-[10px]"
                                        >
                                            <ImagePlus className="w-3 h-3" />
                                            Add screenshot
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Name + Email row */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col gap-1">
                                    <Label className="text-[9px]">Name</Label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your name"
                                        className="h-7 text-[10px]"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label className="text-[9px]">Email</Label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="h-7 text-[10px]"
                                    />
                                </div>
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
                        <div className="px-4 py-2 border-t border-[var(--glass-border)] flex justify-center gap-1.5">
                            <span className="text-[9px] text-[var(--text-disabled)]">
                                Powered by
                            </span>
                            <a
                                href="https://supportdock.io"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[9px] text-[var(--text-disabled)] hover:text-[var(--text-muted)] transition-colors"
                            >
                                SupportDock
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
