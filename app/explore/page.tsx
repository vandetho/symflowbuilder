import Image from "next/image";
import Link from "next/link";
import { Compass } from "lucide-react";
import { LogoWithText } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { ExploreGrid } from "./ExploreGrid";

export const metadata = {
    title: "Explore Public Workflows — SymFlowBuilder",
    description:
        "Browse publicly shared Symfony workflow configurations built by the community.",
};

export default async function ExplorePage() {
    const session = await auth();

    return (
        <div className="flex flex-col min-h-screen">
            {/* ─── Navbar ─── */}
            <nav className="sticky top-0 z-50 glass border-b border-[var(--glass-border)]">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
                    <Link href="/">
                        <LogoWithText />
                    </Link>

                    <div className="hidden sm:flex items-center gap-6">
                        <Link
                            href="/explore"
                            className="text-xs text-[var(--accent-bright)] transition-colors"
                        >
                            Explore
                        </Link>
                        <Link
                            href="/editor"
                            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            Editor
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href="https://github.com/vandetho/symflowbuilder"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="ghost" size="sm" className="gap-1.5">
                                <GitHubIcon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">GitHub</span>
                            </Button>
                        </a>
                        {session?.user ? (
                            <Link href="/dashboard">
                                <Button variant="outline" size="sm">
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/auth/signin">
                                <Button variant="outline" size="sm">
                                    Sign in
                                </Button>
                            </Link>
                        )}
                        <Link href="/editor">
                            <Button size="sm">Open Editor</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ─── Header ─── */}
            <section className="relative px-6 pt-14 pb-8">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, rgba(124,111,247,0.1) 0%, transparent 70%)",
                    }}
                />
                <div className="relative max-w-5xl mx-auto text-center flex flex-col items-center gap-4">
                    <Badge variant="default" className="text-[10px] gap-1.5">
                        <Compass className="w-3 h-3" />
                        Community
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl font-light text-[var(--text-primary)] tracking-tight">
                        Explore Public <span className="font-medium">Workflows</span>
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] max-w-md">
                        Browse Symfony workflow configurations shared by the community.
                        Open any workflow in the editor or export its YAML directly.
                    </p>
                </div>
            </section>

            {/* ─── Grid ─── */}
            <section className="flex-1 px-6 pb-16">
                <div className="max-w-5xl mx-auto">
                    <ExploreGrid />
                </div>
            </section>

            {/* ─── Footer ─── */}
            <footer className="border-t border-[var(--glass-border)] px-6 py-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <LogoWithText size={24} />
                        <div className="flex items-center gap-6 text-[11px] text-[var(--text-muted)]">
                            <a
                                href="https://github.com/vandetho/symflowbuilder"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[var(--text-secondary)] transition-colors"
                            >
                                GitHub
                            </a>
                            <Link
                                href="/editor"
                                className="hover:text-[var(--text-secondary)] transition-colors"
                            >
                                Editor
                            </Link>
                            <Link
                                href="/explore"
                                className="hover:text-[var(--text-secondary)] transition-colors"
                            >
                                Explore
                            </Link>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)]">
                            <span>Sponsored by</span>
                            <a
                                href="https://supportdock.io"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                            >
                                <Image
                                    src="/supportdock-logo.png"
                                    alt="SupportDock"
                                    width={14}
                                    height={14}
                                    className="rounded-sm"
                                />
                                SupportDock
                            </a>
                            <a
                                href="https://basilbook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                            >
                                <Image
                                    src="/basilbook-logo.png"
                                    alt="BasilBook"
                                    width={14}
                                    height={14}
                                    className="rounded-sm"
                                />
                                BasilBook
                            </a>
                            <a
                                href="https://dailybrew.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                            >
                                <Image
                                    src="/dailybrew-logo.svg"
                                    alt="DailyBrew"
                                    width={14}
                                    height={14}
                                    className="rounded-sm"
                                />
                                DailyBrew
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
