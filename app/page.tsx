import Link from "next/link";
import {
    FileCode2,
    Upload,
    ArrowRight,
    Shield,
    Zap,
    MousePointerClick,
    Eye,
    Check,
    Workflow,
} from "lucide-react";
import { GitHubIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroGraph } from "@/components/landing/HeroGraph";
import { YamlPreview } from "@/components/landing/YamlPreview";

const FEATURES = [
    {
        icon: MousePointerClick,
        title: "Drag & Drop",
        description:
            "Add states and transitions by dragging from the palette. Connect them visually — no config files to edit by hand.",
    },
    {
        icon: FileCode2,
        title: "Production-Ready YAML",
        description:
            "Export valid Symfony workflow YAML for versions 5.4, 6.4, 7.0, and 7.1. Copy to clipboard or download directly.",
    },
    {
        icon: Upload,
        title: "Import Existing Workflows",
        description:
            "Drop in your existing YAML files. SymFlowBuilder parses and renders them instantly with auto-layout.",
    },
    {
        icon: Shield,
        title: "Guards & Metadata",
        description:
            "Configure guard expressions, transition listeners, and metadata on states and transitions visually.",
    },
    {
        icon: Zap,
        title: "Undo / Redo",
        description:
            "Full 50-step history with Cmd+Z / Cmd+Shift+Z. Snapshot on every meaningful change.",
    },
    {
        icon: Eye,
        title: "Shareable Links",
        description:
            "Generate read-only public links to share your workflow designs with teammates. No account required to view.",
    },
];

const STEPS = [
    {
        step: "01",
        title: "Design your states",
        description:
            "Drag state nodes onto the canvas. Mark which are initial and final. Add metadata.",
    },
    {
        step: "02",
        title: "Connect transitions",
        description:
            "Draw edges between states to create transitions. Add guards, listeners, and names.",
    },
    {
        step: "03",
        title: "Export YAML",
        description:
            "Hit export and get production-ready Symfony workflow YAML. Paste it into your project.",
    },
];

const SYMFONY_VERSIONS = [
    { version: "5.4", label: "LTS", status: "success" as const },
    { version: "6.4", label: "LTS", status: "success" as const },
    { version: "7.0", label: "Current", status: "default" as const },
    { version: "7.1", label: "Latest", status: "default" as const },
];

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen overflow-x-hidden">
            {/* ─── Navbar ─── */}
            <nav className="sticky top-0 z-50 glass border-b border-[var(--glass-border)]">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-[8px] bg-linear-to-br from-[#7c6ff7] to-[#9d94ff] flex items-center justify-center">
                            <Workflow className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
                            SymFlowBuilder
                        </span>
                    </Link>

                    <div className="hidden sm:flex items-center gap-6">
                        <a
                            href="#features"
                            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            Features
                        </a>
                        <a
                            href="#how-it-works"
                            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            How it works
                        </a>
                        <a
                            href="#yaml"
                            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            YAML
                        </a>
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
                        <Link href="/auth/signin">
                            <Button variant="outline" size="sm">
                                Sign in
                            </Button>
                        </Link>
                        <Link href="/editor">
                            <Button size="sm">Open Editor</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ─── Hero ─── */}
            <section className="relative px-6 pt-20 pb-8">
                {/* Glow orb behind hero */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, rgba(124,111,247,0.12) 0%, transparent 70%)",
                    }}
                />

                <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center gap-5">
                    <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-[10px] gap-1">
                            <GitHubIcon className="w-2.5 h-2.5" />
                            Open Source &middot; MIT
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                            v0.1.0
                        </Badge>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[var(--text-primary)] leading-[1.1] tracking-tight max-w-2xl">
                        Design Symfony Workflows{" "}
                        <span className="font-semibold bg-linear-to-r from-[#7c6ff7] to-[#9d94ff] bg-clip-text text-transparent">
                            Visually
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-lg leading-relaxed">
                        A drag-and-drop builder for Symfony Workflow configurations.
                        Design state machines graphically, then export production-ready
                        YAML.
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                        <Link href="/editor">
                            <Button size="lg" className="gap-2 text-sm">
                                Start Building
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <a
                            href="https://github.com/vandetho/symflowbuilder"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="outline" size="lg" className="gap-2 text-sm">
                                <GitHubIcon className="w-4 h-4" />
                                Star on GitHub
                            </Button>
                        </a>
                    </div>

                    <p className="text-[11px] text-[var(--text-muted)]">
                        No account required. Free and open source forever.
                    </p>
                </div>
            </section>

            {/* ─── Hero Graph Preview ─── */}
            <section className="px-6 pb-20 pt-6">
                <div className="max-w-4xl mx-auto">
                    <HeroGraph />
                    <p className="text-center text-[10px] text-[var(--text-muted)] mt-3 font-mono">
                        Live workflow preview &mdash; this is what you build in the editor
                    </p>
                </div>
            </section>

            {/* ─── Logos / Version Support ─── */}
            <section className="px-6 pb-16">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest mb-4">
                        Symfony Version Support
                    </p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        {SYMFONY_VERSIONS.map((sv) => (
                            <div
                                key={sv.version}
                                className="glass-sm rounded-[10px] px-5 py-3 flex items-center gap-2.5"
                            >
                                <span className="text-lg font-light text-[var(--text-primary)] font-mono">
                                    {sv.version}
                                </span>
                                <Badge variant={sv.status} className="text-[9px]">
                                    {sv.label}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Features ─── */}
            <section id="features" className="px-6 py-20">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <Badge variant="default" className="text-[10px] mb-4">
                            Features
                        </Badge>
                        <h2 className="text-3xl sm:text-4xl font-light text-[var(--text-primary)] tracking-tight">
                            Everything you need to build{" "}
                            <span className="font-medium">workflows</span>
                        </h2>
                        <p className="text-sm text-[var(--text-secondary)] mt-3 max-w-md mx-auto">
                            From a blank canvas to production YAML in minutes. No
                            documentation required.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {FEATURES.map((feature) => (
                            <Card
                                key={feature.title}
                                className="group hover:border-[var(--glass-border-hover)] transition-all duration-200"
                            >
                                <CardContent className="flex flex-col gap-3">
                                    <div className="w-10 h-10 rounded-[12px] bg-[var(--accent-dim)] border border-[var(--accent-border)] flex items-center justify-center group-hover:shadow-[0_0_20px_var(--accent-glow)] transition-shadow">
                                        <feature.icon className="w-4.5 h-4.5 text-[var(--accent-bright)]" />
                                    </div>
                                    <h3 className="text-sm font-medium text-[var(--text-primary)]">
                                        {feature.title}
                                    </h3>
                                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── How It Works ─── */}
            <section id="how-it-works" className="px-6 py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <Badge variant="default" className="text-[10px] mb-4">
                            How it works
                        </Badge>
                        <h2 className="text-3xl sm:text-4xl font-light text-[var(--text-primary)] tracking-tight">
                            Three steps to{" "}
                            <span className="font-medium">production YAML</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {STEPS.map((step, i) => (
                            <div key={step.step} className="relative flex flex-col gap-4">
                                {/* Connector line */}
                                {i < STEPS.length - 1 && (
                                    <div className="hidden md:block absolute top-6 left-full w-full h-px bg-linear-to-r from-[var(--accent-border)] to-transparent z-0" />
                                )}

                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-light text-[var(--accent)] font-mono">
                                        {step.step}
                                    </span>
                                    <div className="h-px flex-1 bg-[var(--glass-border)]" />
                                </div>
                                <h3 className="text-base font-medium text-[var(--text-primary)]">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── YAML Export Preview ─── */}
            <section id="yaml" className="px-6 py-20">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Left: description */}
                        <div className="flex flex-col gap-5">
                            <Badge variant="default" className="text-[10px] w-fit">
                                YAML Export
                            </Badge>
                            <h2 className="text-3xl sm:text-4xl font-light text-[var(--text-primary)] tracking-tight leading-tight">
                                Production-ready{" "}
                                <span className="font-medium">Symfony YAML</span>
                            </h2>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                Every graph you build is backed by a real-time YAML
                                exporter. The output is structured exactly how Symfony
                                expects it &mdash; complete with marking stores, guards,
                                metadata, and version-specific compatibility.
                            </p>

                            <ul className="flex flex-col gap-2.5 mt-2">
                                {[
                                    "Valid framework.workflows config structure",
                                    "Guard expressions with Symfony ExpressionLanguage",
                                    "Metadata on states and transitions",
                                    "Copy to clipboard or download as .yaml file",
                                    "Version-aware: 5.4, 6.4, 7.0, 7.1",
                                ].map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-start gap-2 text-xs text-[var(--text-secondary)]"
                                    >
                                        <Check className="w-3.5 h-3.5 text-[var(--success)] shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-2">
                                <Link href="/editor">
                                    <Button size="default" className="gap-2">
                                        Try the Editor
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Right: YAML preview */}
                        <YamlPreview />
                    </div>
                </div>
            </section>

            {/* ─── Open Source ─── */}
            <section className="px-6 py-20">
                <div className="max-w-3xl mx-auto">
                    <Card className="p-8 sm:p-12 text-center">
                        <CardContent className="flex flex-col items-center gap-5">
                            <div className="w-14 h-14 rounded-[16px] bg-linear-to-br from-[#7c6ff7] to-[#9d94ff] flex items-center justify-center shadow-[0_0_40px_var(--accent-glow)]">
                                <Workflow className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-light text-[var(--text-primary)] tracking-tight">
                                Free & Open Source
                            </h2>
                            <p className="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
                                SymFlowBuilder is MIT licensed and free forever. The
                                editor is fully public &mdash; no account required. Sign
                                in to unlock cloud save, versioning, and shareable links.
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                                <Link href="/editor">
                                    <Button size="lg" className="gap-2">
                                        Start Building
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <a
                                    href="https://github.com/vandetho/symflowbuilder"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="outline" size="lg" className="gap-2">
                                        <GitHubIcon className="w-4 h-4" />
                                        View Source
                                    </Button>
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* ─── Footer ─── */}
            <footer className="border-t border-[var(--glass-border)] px-6 py-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-[6px] bg-linear-to-br from-[#7c6ff7] to-[#9d94ff] flex items-center justify-center">
                                <Workflow className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xs font-medium text-[var(--text-secondary)]">
                                SymFlowBuilder
                            </span>
                        </div>

                        <div className="flex items-center gap-6 text-[11px] text-[var(--text-muted)]">
                            <a
                                href="https://github.com/vandetho/symflowbuilder"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[var(--text-secondary)] transition-colors"
                            >
                                GitHub
                            </a>
                            <a
                                href="https://github.com/vandetho/symflowbuilder/blob/main/LICENSE"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[var(--text-secondary)] transition-colors"
                            >
                                MIT License
                            </a>
                            <Link
                                href="/editor"
                                className="hover:text-[var(--text-secondary)] transition-colors"
                            >
                                Editor
                            </Link>
                        </div>

                        <p className="text-[10px] text-[var(--text-muted)]">
                            Built for Symfony developers
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
