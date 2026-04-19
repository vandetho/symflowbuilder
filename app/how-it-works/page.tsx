import Link from "next/link";
import {
    BookOpen,
    CircleDot,
    GitFork,
    Shield,
    Play,
    FileCode2,
    type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface Step {
    step: string;
    title: string;
    description: string;
    icon: LucideIcon;
    accent: string;
}

const STEPS: Step[] = [
    {
        step: "01",
        title: "Design your states",
        description:
            "Drag state nodes from the palette onto the canvas. Each node represents a Symfony place — a possible state your entity can be in. Mark which states are initial (where the workflow starts) and which are final (where it ends). Add metadata like colors and descriptions to document your workflow.",
        icon: CircleDot,
        accent: "var(--accent)",
    },
    {
        step: "02",
        title: "Add transitions",
        description:
            "Draw connections between states to create transitions. Each transition becomes a node that sits between the source and target states. Connect multiple states to a single transition for AND-join (synchronization), or connect one transition to multiple states for AND-split (parallel fork).",
        icon: GitFork,
        accent: "var(--warning)",
    },
    {
        step: "03",
        title: "Configure guards & metadata",
        description:
            "Click any transition node to configure guard expressions, add event listeners, and set metadata. Guards use Symfony ExpressionLanguage syntax to control when a transition is allowed. Add styling metadata (color, arrow_color) to customize the workflow dump output.",
        icon: Shield,
        accent: "var(--accent-bright)",
    },
    {
        step: "04",
        title: "Simulate & validate",
        description:
            "Toggle the simulator to step through your workflow visually. Active states glow green, available transitions highlight. Toggle guards on or off to test different paths and see which Symfony events fire at each step. Use auto-play to watch the full flow, or step back through history. The validator catches unreachable states, dead transitions, and orphan places before you export.",
        icon: Play,
        accent: "var(--success)",
    },
    {
        step: "05",
        title: "Export YAML",
        description:
            "Export production-ready Symfony workflow YAML for your target version (5.4, 6.4, 7.4, or 8.0). Copy to clipboard or download as a file. The output uses proper Symfony conventions — tilde nulls, flow arrays, and version-specific structures. Paste it into your project and you are done.",
        icon: FileCode2,
        accent: "var(--success)",
    },
];

export const metadata = {
    title: "How It Works — SymFlowBuilder",
    description:
        "Learn how to design Symfony workflows visually with SymFlowBuilder in five simple steps.",
};

export default async function HowItWorksPage() {
    const session = await auth();

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar activePath="/how-it-works" session={session} />

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
                        <BookOpen className="w-3 h-3" />
                        Guide
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl font-light text-[var(--text-primary)] tracking-tight">
                        Five steps to <span className="font-medium">production YAML</span>
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] max-w-md">
                        Design, validate, and export Symfony workflows without writing a
                        single line of YAML by hand.
                    </p>
                </div>
            </section>

            <section className="flex-1 px-6 pb-16">
                <div className="max-w-3xl mx-auto flex flex-col gap-0">
                    {STEPS.map((step, i) => (
                        <div key={step.step} className="flex flex-col items-center">
                            {/* Connector line (except before first step) */}
                            {i > 0 && (
                                <div className="w-px h-10 bg-[var(--glass-border)]" />
                            )}

                            <Card className="w-full">
                                <CardContent className="p-6">
                                    <div className="flex gap-5">
                                        <div className="flex flex-col items-center gap-2 shrink-0">
                                            <div
                                                className="w-10 h-10 rounded-[10px] flex items-center justify-center"
                                                style={{
                                                    backgroundColor: `color-mix(in srgb, ${step.accent} 15%, transparent)`,
                                                    border: `1px solid color-mix(in srgb, ${step.accent} 30%, transparent)`,
                                                }}
                                            >
                                                <step.icon
                                                    className="w-5 h-5"
                                                    style={{ color: step.accent }}
                                                />
                                            </div>
                                            <span
                                                className="text-[10px] font-mono font-medium"
                                                style={{ color: step.accent }}
                                            >
                                                {step.step}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-base font-medium text-[var(--text-primary)]">
                                                {step.title}
                                            </h3>
                                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}

                    {/* CTA */}
                    <div className="w-px h-10 bg-[var(--glass-border)] mx-auto" />
                    <div className="text-center flex flex-col items-center gap-4">
                        <Badge variant="outline" className="text-[10px]">
                            Ready?
                        </Badge>
                        <Link href="/editor">
                            <Button size="lg" className="gap-2">
                                Start Building
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
