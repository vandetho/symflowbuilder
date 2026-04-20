"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/ui/icons";

const NAV_LINKS = [
    { href: "/features", label: "Features" },
    { href: "/engine", label: "Engine" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/explore", label: "Explore" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
];

interface MobileMenuProps {
    activePath?: string;
    session?: { user?: { name?: string | null } } | null;
}

export function MobileMenu({ activePath, session }: MobileMenuProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="sm:hidden">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setOpen(!open)}
            >
                {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>

            {open && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/50"
                        onClick={() => setOpen(false)}
                    />

                    {/* Panel */}
                    <div className="fixed top-0 right-0 z-50 h-full w-[280px] glass-strong border-l border-[var(--glass-border)] shadow-[0_0_64px_rgba(0,0,0,0.5)] flex flex-col">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--glass-border)]">
                            <span className="text-sm font-medium text-[var(--text-primary)]">
                                Menu
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => setOpen(false)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex-1 flex flex-col gap-1 p-4">
                            {NAV_LINKS.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setOpen(false)}
                                    className={`px-3 py-2.5 rounded-[10px] text-sm transition-colors ${
                                        activePath === href
                                            ? "bg-[var(--accent-dim)] text-[var(--accent-bright)]"
                                            : "text-[var(--text-secondary)] hover:bg-[var(--glass-hover)] hover:text-[var(--text-primary)]"
                                    }`}
                                >
                                    {label}
                                </Link>
                            ))}

                            <div className="h-px bg-[var(--glass-border)] my-2" />

                            <Link
                                href="/editor"
                                onClick={() => setOpen(false)}
                                className="px-3 py-2.5 rounded-[10px] text-sm text-[var(--accent-bright)] hover:bg-[var(--accent-dim)] transition-colors"
                            >
                                Open Editor
                            </Link>

                            {session?.user ? (
                                <Link
                                    href="/dashboard"
                                    onClick={() => setOpen(false)}
                                    className="px-3 py-2.5 rounded-[10px] text-sm text-[var(--text-secondary)] hover:bg-[var(--glass-hover)] hover:text-[var(--text-primary)] transition-colors"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href="/auth/signin"
                                    onClick={() => setOpen(false)}
                                    className="px-3 py-2.5 rounded-[10px] text-sm text-[var(--text-secondary)] hover:bg-[var(--glass-hover)] hover:text-[var(--text-primary)] transition-colors"
                                >
                                    Sign in
                                </Link>
                            )}

                            <a
                                href="https://github.com/vandetho/symflowbuilder"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2.5 rounded-[10px] text-sm text-[var(--text-secondary)] hover:bg-[var(--glass-hover)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2"
                            >
                                <GitHubIcon className="w-4 h-4" />
                                GitHub
                            </a>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
