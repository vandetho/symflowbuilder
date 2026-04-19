import Image from "next/image";
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
    Play,
    AlertTriangle,
    GitFork,
    Palette,
} from "lucide-react";
import { GitHubIcon } from "@/components/ui/icons";
import { Logo, LogoWithText } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroGraph } from "@/components/landing/HeroGraph";
import { YamlPreview } from "@/components/landing/YamlPreview";
import { FlowConnector, FlowNode } from "@/components/landing/FlowConnector";
import { auth } from "@/auth";
import { version } from "@/package.json";

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
            "Export valid Symfony workflow YAML for versions 5.4, 6.4, 7.4, and 8.0. Copy to clipboard or download directly.",
    },
    {
        icon: Upload,
        title: "Import Existing Workflows",
        description:
            "Drop in your existing YAML files. SymFlowBuilder parses and renders them instantly with auto-layout.",
    },
    {
        icon: GitFork,
        title: "AND / OR Patterns",
        description:
            "Transition nodes properly model AND-split, AND-join, and OR patterns. See the difference between parallel forks and exclusive choices.",
    },
    {
        icon: Play,
        title: "Workflow Simulator",
        description:
            "Step through your workflow visually. Toggle guards on/off to test different paths. See Symfony events fire in real-time. Auto-play with history and step-back.",
    },
    {
        icon: AlertTriangle,
        title: "Validation",
        description:
            "Detect unreachable states, dead transitions, and orphan places before exporting. Catch errors visually, not in production.",
    },
    {
        icon: Shield,
        title: "Guards & Metadata",
        description:
            "Configure guard expressions, transition listeners, and metadata on states and transitions visually.",
    },
    {
        icon: Palette,
        title: "Styling Metadata",
        description:
            "Set bg_color, description, color, and arrow_color per Symfony's workflow dump styling. Pick colors with a built-in color picker.",
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

const SYMFONY_VERSIONS = [
    { version: "5.4", label: "Security", status: "warning" as const },
    { version: "6.4", label: "LTS", status: "success" as const },
    { version: "7.4", label: "LTS", status: "success" as const },
    { version: "8.0", label: "Stable", status: "default" as const },
];

export default async function LandingPage() {
    const session = await auth();
    return (
        <div className="flex flex-col min-h-screen overflow-x-hidden">
            {/* ─── Navbar ─── */}
            <nav className="sticky top-0 z-50 glass border-b border-[var(--glass-border)]">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
                    <Link href="/">
                        <LogoWithText />
                    </Link>

                    <div className="hidden sm:flex items-center gap-6">
                        <Link
                            href="/features"
                            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
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

            {/* ─── Workflow Flow ─── */}
            <div className="flex flex-col items-center">
                {/* ─── Node: Hero (Initial) ─── */}
                <FlowNode label="initial_marking" isInitial className="pt-20 pb-8">
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
                                v{version}
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
                            Design state machines graphically, then export
                            production-ready YAML.
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
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="gap-2 text-sm"
                                >
                                    <GitHubIcon className="w-4 h-4" />
                                    Star on GitHub
                                </Button>
                            </a>
                        </div>

                        <p className="text-[11px] text-[var(--text-muted)]">
                            No account required. Free and open source forever.
                        </p>
                    </div>
                </FlowNode>

                <FlowConnector label="discover" />

                {/* ─── Node: Preview ─── */}
                <FlowNode label="preview" className="pb-12">
                    <div className="max-w-5xl mx-auto">
                        <HeroGraph />
                        <p className="text-center text-[10px] text-[var(--text-muted)] mt-3 font-mono">
                            Live workflow preview &mdash; this is what you build in the
                            editor
                        </p>
                    </div>
                </FlowNode>

                <FlowConnector label="compatibility" />

                {/* ─── Node: Versions ─── */}
                <FlowNode label="supports" className="pb-12">
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
                </FlowNode>

                <FlowConnector label="places" />

                {/* ─── Node: Features ─── */}
                <FlowNode id="features" label="features" className="py-16">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-12">
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
                </FlowNode>

                <FlowConnector label="transitions" />

                {/* ─── Node: How It Works ─── */}
                <FlowNode id="how-it-works" label="workflow" className="py-16">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-light text-[var(--text-primary)] tracking-tight">
                                Three steps to{" "}
                                <span className="font-medium">production YAML</span>
                            </h2>
                        </div>

                        <div className="flex flex-col md:flex-row items-stretch gap-0">
                            {[
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
                            ].map((step, i) => (
                                <div
                                    key={step.step}
                                    className="flex-1 flex flex-col md:flex-row items-center"
                                >
                                    {/* Step node */}
                                    <div className="flex-1 glass rounded-[14px] p-5 flex flex-col gap-3 relative">
                                        {/* Accent top bar */}
                                        <div
                                            className={`absolute top-0 left-4 right-4 h-[2px] rounded-full ${
                                                i === 0
                                                    ? "bg-[var(--accent)]"
                                                    : i === 2
                                                      ? "bg-[var(--success)]"
                                                      : "bg-[var(--warning)]"
                                            }`}
                                        />
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    i === 0
                                                        ? "bg-[var(--accent)]"
                                                        : i === 2
                                                          ? "bg-[var(--success)]"
                                                          : "bg-[var(--warning)]"
                                                }`}
                                            />
                                            <span className="text-lg font-light text-[var(--accent)] font-mono">
                                                {step.step}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-medium text-[var(--text-primary)]">
                                            {step.title}
                                        </h3>
                                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                    {/* Connector between steps */}
                                    {i < 2 && (
                                        <div className="hidden md:flex items-center justify-center w-12 shrink-0">
                                            <svg
                                                width="40"
                                                height="2"
                                                style={{ overflow: "visible" }}
                                            >
                                                <line
                                                    x1="0"
                                                    y1="1"
                                                    x2="40"
                                                    y2="1"
                                                    stroke="rgba(255,255,255,0.15)"
                                                    strokeWidth="1.5"
                                                    strokeDasharray="6 4"
                                                >
                                                    <animate
                                                        attributeName="stroke-dashoffset"
                                                        from="0"
                                                        to="-20"
                                                        dur="1s"
                                                        repeatCount="indefinite"
                                                    />
                                                </line>
                                            </svg>
                                        </div>
                                    )}
                                    {/* Vertical connector on mobile */}
                                    {i < 2 && (
                                        <div className="md:hidden flex justify-center py-3">
                                            <svg
                                                width="2"
                                                height="24"
                                                style={{ overflow: "visible" }}
                                            >
                                                <line
                                                    x1="1"
                                                    y1="0"
                                                    x2="1"
                                                    y2="24"
                                                    stroke="rgba(255,255,255,0.15)"
                                                    strokeWidth="1.5"
                                                    strokeDasharray="6 4"
                                                >
                                                    <animate
                                                        attributeName="stroke-dashoffset"
                                                        from="0"
                                                        to="-20"
                                                        dur="1s"
                                                        repeatCount="indefinite"
                                                    />
                                                </line>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </FlowNode>

                <FlowConnector label="export" />

                {/* ─── Node: YAML Export ─── */}
                <FlowNode id="yaml" label="yaml_output" className="py-16">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div className="flex flex-col gap-5">
                                <h2 className="text-3xl sm:text-4xl font-light text-[var(--text-primary)] tracking-tight leading-tight">
                                    Production-ready{" "}
                                    <span className="font-medium">Symfony YAML</span>
                                </h2>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                    Every graph you build is backed by a real-time YAML
                                    exporter. The output is structured exactly how Symfony
                                    expects it &mdash; complete with marking stores,
                                    guards, metadata, and version-specific compatibility.
                                </p>

                                <ul className="flex flex-col gap-2.5 mt-2">
                                    {[
                                        "Valid framework.workflows config structure",
                                        "Guard expressions with Symfony ExpressionLanguage",
                                        "Metadata on states and transitions",
                                        "Copy to clipboard or download as .yaml file",
                                        "Version-aware: 5.4, 6.4, 7.4, 8.0",
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

                            <YamlPreview />
                        </div>
                    </div>
                </FlowNode>

                <FlowConnector label="complete" />

                {/* ─── Node: Open Source (Final) ─── */}
                <FlowNode label="open_source" isFinal className="py-16">
                    <div className="max-w-3xl mx-auto">
                        <Card className="p-8 sm:p-12 text-center">
                            <CardContent className="flex flex-col items-center gap-5">
                                <Logo
                                    size={56}
                                    className="shadow-[0_0_40px_var(--accent-glow)]"
                                />
                                <h2 className="text-2xl sm:text-3xl font-light text-[var(--text-primary)] tracking-tight">
                                    Free & Open Source
                                </h2>
                                <p className="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
                                    SymFlowBuilder is MIT licensed and free forever. The
                                    editor is fully public &mdash; no account required.
                                    Sign in to unlock cloud save, versioning, and
                                    shareable links.
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
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="gap-2"
                                        >
                                            <GitHubIcon className="w-4 h-4" />
                                            View Source
                                        </Button>
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </FlowNode>
            </div>

            {/* ─── Footer ─── */}
            <footer className="border-t border-[var(--glass-border)] px-6 py-8 mt-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <LogoWithText size={24} />

                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-[var(--text-muted)]">
                            <Link
                                href="/editor"
                                className="hover:text-[var(--text-secondary)] transition-colors"
                            >
                                Editor
                            </Link>
                            <Link
                                href="/features"
                                className="hover:text-[var(--text-secondary)] transition-colors"
                            >
                                Features
                            </Link>
                            <Link
                                href="/how-it-works"
                                className="hover:text-[var(--text-secondary)] transition-colors"
                            >
                                How It Works
                            </Link>
                            <Link
                                href="/explore"
                                className="hover:text-[var(--text-secondary)] transition-colors"
                            >
                                Explore
                            </Link>
                            <Link
                                href="/blog"
                                className="hover:text-[var(--text-secondary)] transition-colors"
                            >
                                Blog
                            </Link>
                            <Link
                                href="/faq"
                                className="hover:text-[var(--text-secondary)] transition-colors"
                            >
                                FAQ
                            </Link>
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
                                href="https://dailybrew.work"
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
