import Link from "next/link";
import {
    Sparkles,
    MousePointerClick,
    FileCode2,
    Upload,
    GitFork,
    Play,
    AlertTriangle,
    Shield,
    Palette,
    Zap,
    Eye,
    Cloud,
    Users,
    type LucideIcon,
} from "lucide-react";
import { LogoWithText } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/auth";

interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
}

const CATEGORIES: { title: string; features: Feature[] }[] = [
    {
        title: "Editor",
        features: [
            {
                icon: MousePointerClick,
                title: "Drag & Drop",
                description:
                    "Add states and transitions by dragging from the palette. Connect them visually by drawing edges between nodes. No config files to edit by hand.",
            },
            {
                icon: GitFork,
                title: "AND / OR Patterns",
                description:
                    "Transition nodes properly model Petri-net semantics. AND-split forks into parallel states, AND-join synchronizes them. OR patterns use separate transitions for exclusive choices.",
            },
            {
                icon: Zap,
                title: "Undo / Redo",
                description:
                    "Full 50-step history with Cmd+Z / Cmd+Shift+Z. Every meaningful change — node move, edge add, property edit — creates a snapshot you can revert to.",
            },
            {
                icon: Shield,
                title: "Guards & Metadata",
                description:
                    "Configure guard expressions using Symfony ExpressionLanguage syntax. Add transition listeners, key-value metadata on states and transitions.",
            },
            {
                icon: Palette,
                title: "Styling Metadata",
                description:
                    "Set bg_color, description, color, and arrow_color matching Symfony's workflow dump styling. Pick colors with a built-in color picker that previews on the canvas.",
            },
        ],
    },
    {
        title: "Import / Export",
        features: [
            {
                icon: FileCode2,
                title: "Production-Ready YAML",
                description:
                    "Export valid Symfony workflow YAML for versions 5.4, 6.4, 7.4, and 8.0. Uses tilde nulls, flow arrays, and scalar initial_marking — ready to paste into your project.",
            },
            {
                icon: Upload,
                title: "Import Existing Workflows",
                description:
                    "Drop in your existing YAML files or paste them directly. SymFlowBuilder parses the YAML, detects the workflow type, and renders the graph with automatic topological layout.",
            },
        ],
    },
    {
        title: "Simulation & Validation",
        features: [
            {
                icon: Play,
                title: "Workflow Simulator",
                description:
                    "Toggle simulate mode to step through your workflow visually. Active states glow green, available transitions highlight. Toggle guards on/off to test different paths. See Symfony events (guard, leave, transition, enter, entered, completed) fire in real-time. Use auto-play with configurable speed, step back through history, or reset to the initial marking.",
            },
            {
                icon: AlertTriangle,
                title: "Validation",
                description:
                    "Detect unreachable states, dead transitions, orphan places, and invalid references before exporting. Catch structural errors in the editor, not in production.",
            },
        ],
    },
    {
        title: "Collaboration",
        features: [
            {
                icon: Eye,
                title: "Shareable Links",
                description:
                    "Generate read-only public links to share your workflow designs. Recipients can view the workflow and export its YAML without creating an account.",
            },
            {
                icon: Cloud,
                title: "Cloud Save",
                description:
                    "Authenticated users get auto-save with debounced sync to the cloud. Guest drafts persist to localStorage and migrate automatically on sign-in.",
            },
            {
                icon: Users,
                title: "Collaborators",
                description:
                    "Invite teammates by email with viewer or editor roles. Collaborators see shared workflows in their dashboard alongside their own.",
            },
        ],
    },
];

export const metadata = {
    title: "Features — SymFlowBuilder",
    description:
        "Explore all features of SymFlowBuilder: visual editor, YAML export/import, workflow simulator, validation, and collaboration tools.",
};

export default async function FeaturesPage() {
    const session = await auth();

    return (
        <div className="flex flex-col min-h-screen">
            <nav className="sticky top-0 z-50 glass-strong border-b border-[var(--glass-border)]">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
                    <Link href="/">
                        <LogoWithText />
                    </Link>
                    <div className="hidden sm:flex items-center gap-6">
                        <Link
                            href="/features"
                            className="text-xs text-[var(--accent-bright)] transition-colors"
                        >
                            Features
                        </Link>
                        <Link
                            href="/how-it-works"
                            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            How It Works
                        </Link>
                        <Link
                            href="/explore"
                            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            Explore
                        </Link>
                        <Link
                            href="/blog"
                            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            Blog
                        </Link>
                        <Link
                            href="/faq"
                            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            FAQ
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

            <section className="relative px-6 pt-14 pb-8">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, rgba(124,111,247,0.1) 0%, transparent 70%)",
                    }}
                />
                <div className="relative max-w-3xl mx-auto text-center flex flex-col items-center gap-4">
                    <Badge variant="default" className="text-[10px] gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        Features
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl font-light text-[var(--text-primary)] tracking-tight">
                        Everything you need to{" "}
                        <span className="font-medium">build workflows</span>
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] max-w-md">
                        From a blank canvas to production-ready Symfony YAML in minutes.
                    </p>
                </div>
            </section>

            <section className="flex-1 px-6 pb-16">
                <div className="max-w-5xl mx-auto flex flex-col gap-12">
                    {CATEGORIES.map((category) => (
                        <div key={category.title} className="flex flex-col gap-4">
                            <h2 className="text-lg font-medium text-[var(--text-primary)] tracking-tight">
                                {category.title}
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {category.features.map((feature) => (
                                    <Card key={feature.title}>
                                        <CardContent className="flex gap-4 p-5">
                                            <div className="shrink-0 w-10 h-10 rounded-[10px] bg-[var(--accent-dim)] border border-[var(--accent-border)] flex items-center justify-center">
                                                <feature.icon className="w-5 h-5 text-[var(--accent-bright)]" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <h3 className="text-sm font-medium text-[var(--text-primary)]">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
