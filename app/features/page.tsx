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
    Package,
    Cpu,
    CircleDot,
    Gem,
    Weight,
    Radio,
    type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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
                    "Drag states and transitions from the palette, then connect them visually. No config files to edit by hand.",
            },
            {
                icon: GitFork,
                title: "AND / OR Patterns",
                description:
                    "Transition nodes model Petri-net semantics: AND-split forks into parallel states, AND-join synchronizes them, and OR uses separate transitions for exclusive choices.",
            },
            {
                icon: Zap,
                title: "Undo / Redo",
                description:
                    "Full 50-step history (Cmd+Z / Cmd+Shift+Z). Every meaningful change — node move, edge add, property edit — creates a snapshot you can revert to.",
            },
            {
                icon: Shield,
                title: "Guards & Metadata",
                description:
                    "Configure guard expressions in Symfony ExpressionLanguage syntax. Attach transition listeners and key-value metadata to states and transitions.",
            },
            {
                icon: Palette,
                title: "Styling Metadata",
                description:
                    "Set bg_color, description, color, and arrow_color to match Symfony's workflow dump styling. Pick colors with the built-in picker and preview live on the canvas.",
            },
            {
                icon: Weight,
                title: "Weighted Arcs",
                description:
                    "Configure consume and produce weights on transitions for advanced Petri net modeling. Weights render on the canvas and round-trip through every export format.",
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
                    "Export valid Symfony workflow YAML for 5.4, 6.4, 7.4, and 8.0. Tilde nulls, flow arrays, scalar initial_marking — ready to paste into your project.",
            },
            {
                icon: Upload,
                title: "Import Existing Workflows",
                description:
                    "Drop in YAML files or paste them directly. SymFlowBuilder parses, detects the workflow type, and renders the graph with automatic topological layout.",
            },
            {
                icon: Gem,
                title: "PHP / Laravel Export",
                description:
                    "Export a symflow-laravel compatible PHP config file. Design visually, drop it into Laravel — zero manual config.",
            },
            {
                icon: CircleDot,
                title: "Graphviz DOT Export",
                description:
                    "Export Graphviz DOT for rendering with external tools, embedding in documentation, or generating publication-quality diagrams.",
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
                    "Step through your workflow visually. Active states glow, available transitions highlight, and Symfony events (guard, leave, transition, enter, entered, completed) fire in real time. Toggle guards to test different paths, auto-play at configurable speed, step back through history, or reset to the initial marking.",
            },
            {
                icon: AlertTriangle,
                title: "Validation",
                description:
                    "Catch unreachable states, dead transitions, orphan places, and invalid references in the editor — not in production.",
            },
        ],
    },
    {
        title: "Standalone Engine — symflow",
        features: [
            {
                icon: Package,
                title: "npm Package",
                description:
                    "The engine that powers SymFlowBuilder ships as symflow on npm. Run it in any Node.js, serverless, or browser project with zero framework dependencies.",
            },
            {
                icon: Cpu,
                title: "Symfony-Compatible Runtime",
                description:
                    "State machines and Petri nets with Symfony's exact semantics: guards, events in Symfony order (guard, leave, transition, enter, entered, completed, announce), marking stores, and validation.",
            },
            {
                icon: FileCode2,
                title: "Import & Export Formats",
                description:
                    "Round-trip YAML, JSON, TypeScript, Mermaid, Graphviz DOT, and PHP (Laravel). Import existing Symfony configs — including !php/const tags — and run them directly.",
            },
        ],
    },
    {
        title: "Save & Share",
        features: [
            {
                icon: Eye,
                title: "Shareable Links",
                description:
                    "Generate read-only public links. Recipients can view the workflow and export its YAML without an account.",
            },
            {
                icon: Cloud,
                title: "Cloud Save",
                description:
                    "Signed-in users get debounced auto-save to the cloud. Guest drafts persist to localStorage and migrate on sign-in.",
            },
            {
                icon: Radio,
                title: "Embed with Live Marking",
                description:
                    "Drop the canvas into any app via /embed/<shareId>. Pass ?marking=place_a,place_b and active places light up in real time — perfect for showing runtime state next to a Symfony or Laravel domain UI. Toggle minimap, branding, and scenario runner with query params.",
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
            <Navbar activePath="/features" session={session} />

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

            <Footer />
        </div>
    );
}
