import Link from "next/link";
import {
    Package,
    Cpu,
    FileCode2,
    Shield,
    Zap,
    GitFork,
    ArrowRight,
    Check,
    Terminal,
    Layers,
    Upload,
    Play,
} from "lucide-react";
import { GitHubIcon, NpmIcon } from "@/components/ui/icons";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";

const FEATURES = [
    {
        icon: Cpu,
        title: "Symfony-Compatible Runtime",
        description:
            "State machines and Petri net workflows with the same semantics as Symfony's Workflow component. Markings, transitions, guards, and events — all in TypeScript.",
    },
    {
        icon: Zap,
        title: "Event System",
        description:
            "Events fire in Symfony's exact order: guard, leave, transition, enter, entered, completed, announce. Subscribe to any event with typed listeners.",
    },
    {
        icon: Shield,
        title: "Pluggable Guards",
        description:
            "Attach guard expressions to transitions and provide your own evaluator. Integrate role checks, feature flags, or any custom authorization logic.",
    },
    {
        icon: GitFork,
        title: "AND / OR Patterns",
        description:
            "Petri net support with AND-split (parallel fork), AND-join (synchronization), OR-split (exclusive choice), and XOR patterns for state machines.",
    },
    {
        icon: Layers,
        title: "Subject-Driven API",
        description:
            "Mirrors Symfony's Workflow service. Pass your entity to can() and apply() — the marking is read from and written back automatically via marking stores.",
    },
    {
        icon: FileCode2,
        title: "YAML / JSON / TypeScript",
        description:
            "Round-trip import and export for all formats. Import existing Symfony configs including !php/const and !php/enum tags. Generate typed TypeScript modules.",
    },
    {
        icon: Upload,
        title: "!php/const & !php/enum",
        description:
            'Symfony YAML configs using PHP constants and backed enums are resolved automatically. App\\Enum\\Status::Active becomes "Active".',
    },
    {
        icon: Play,
        title: "Validation & Analysis",
        description:
            "Catch unreachable places, dead transitions, and orphan nodes before runtime. Analyze patterns to understand your workflow's structure.",
    },
];

const SUBPATHS = [
    {
        path: "symflow/engine",
        desc: "WorkflowEngine, validateDefinition, analyzeWorkflow",
        deps: "none",
    },
    {
        path: "symflow/subject",
        desc: "Workflow<T>, createWorkflow, marking stores",
        deps: "none",
    },
    {
        path: "symflow/yaml",
        desc: "Symfony YAML import/export, !php/const, !php/enum",
        deps: "js-yaml",
    },
    { path: "symflow/json", desc: "JSON import/export", deps: "none" },
    { path: "symflow/typescript", desc: "TypeScript codegen", deps: "none" },
    {
        path: "symflow/react-flow",
        desc: "React Flow graph utilities",
        deps: "@xyflow/react",
    },
];

const CODE_EXAMPLE = `import { WorkflowEngine, validateDefinition } from "symflow/engine";

const definition = {
    name: "order",
    type: "state_machine",
    places: [
        { name: "draft" },
        { name: "submitted" },
        { name: "approved" },
        { name: "fulfilled" },
    ],
    transitions: [
        { name: "submit", froms: ["draft"], tos: ["submitted"] },
        { name: "approve", froms: ["submitted"], tos: ["approved"] },
        { name: "fulfill", froms: ["approved"], tos: ["fulfilled"] },
    ],
    initialMarking: ["draft"],
};

// Validate
const { valid, errors } = validateDefinition(definition);

// Run
const engine = new WorkflowEngine(definition);
engine.apply("submit");
engine.getActivePlaces(); // ["submitted"]

// Listen to events
engine.on("entered", (event) => {
    console.log(\`Entered via \${event.transition.name}\`);
});`;

const SUBJECT_EXAMPLE = `import { createWorkflow, propertyMarkingStore } from "symflow/subject";

interface Order {
    id: string;
    total: number;
    status: string;
}

const workflow = createWorkflow(definition, {
    markingStore: propertyMarkingStore("status"),
    guardEvaluator: (expr, { subject }) => {
        if (expr === "subject.total < 10000") {
            return subject.total < 10000;
        }
        return true;
    },
});

const order = { id: "ord_1", total: 500, status: "draft" };

workflow.apply(order, "submit");
console.log(order.status); // "submitted"

workflow.on("entered", (event) => {
    console.log(event.subject.id, event.transition.name);
});`;

export const metadata = {
    title: "symflow — Symfony Workflow Engine for Node.js",
    description:
        "A standalone TypeScript workflow engine with Symfony-compatible semantics. State machines, Petri nets, guards, events, validation, and YAML/JSON/TypeScript import/export.",
};

export default async function EnginePage() {
    const session = await auth();

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar activePath="/engine" session={session} />

            {/* Hero */}
            <section className="relative px-6 pt-16 pb-12">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, rgba(124,111,247,0.12) 0%, transparent 70%)",
                    }}
                />
                <div className="relative max-w-3xl mx-auto text-center flex flex-col items-center gap-5">
                    <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-[10px] gap-1.5">
                            <Package className="w-3 h-3" />
                            npm package
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                            MIT License
                        </Badge>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-light text-(--text-primary) leading-[1.1] tracking-tight">
                        <span className="font-mono font-medium">symflow</span>
                    </h1>

                    <p className="text-base sm:text-lg text-(--text-secondary) max-w-lg leading-relaxed">
                        A Symfony-compatible workflow engine for TypeScript and Node.js.
                        Run state machines and Petri nets anywhere JavaScript runs — no
                        PHP required.
                    </p>

                    <div className="glass-sm rounded-[10px] px-5 py-3 font-mono text-sm text-(--text-primary) flex items-center gap-3">
                        <Terminal className="w-4 h-4 text-(--text-muted)" />
                        npm install symflow
                    </div>

                    <div className="flex items-center gap-3 mt-1">
                        <a
                            href="https://www.npmjs.com/package/symflow"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button size="lg" className="gap-2 text-sm">
                                <NpmIcon className="w-4 h-4" />
                                View on npm
                            </Button>
                        </a>
                        <a
                            href="https://github.com/vandetho/symflow"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="outline" size="lg" className="gap-2 text-sm">
                                <GitHubIcon className="w-4 h-4" />
                                Source Code
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="px-6 py-12">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-light text-(--text-primary) tracking-tight text-center mb-10">
                        Everything from Symfony&apos;s Workflow,{" "}
                        <span className="font-medium">in TypeScript</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {FEATURES.map((feature) => (
                            <Card
                                key={feature.title}
                                className="group hover:border-(--glass-border-hover) transition-all duration-200"
                            >
                                <CardContent className="flex flex-col gap-3">
                                    <div className="w-10 h-10 rounded-[12px] bg-(--accent-dim) border border-(--accent-border) flex items-center justify-center group-hover:shadow-[0_0_20px_var(--accent-glow)] transition-shadow">
                                        <feature.icon className="w-4.5 h-4.5 text-(--accent-bright)" />
                                    </div>
                                    <h3 className="text-sm font-medium text-(--text-primary)">
                                        {feature.title}
                                    </h3>
                                    <p className="text-xs text-(--text-secondary) leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Code Examples */}
            <section className="px-6 py-12">
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Standalone */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-medium text-(--text-primary)">
                            Standalone Engine
                        </h3>
                        <p className="text-xs text-(--text-secondary)">
                            Create an engine, validate, apply transitions, listen to
                            events.
                        </p>
                        <div className="glass rounded-[14px] p-4 overflow-x-auto">
                            <pre className="text-[11px] leading-[1.6] text-(--text-secondary) font-mono whitespace-pre">
                                {CODE_EXAMPLE}
                            </pre>
                        </div>
                    </div>

                    {/* Subject-Driven */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-medium text-(--text-primary)">
                            Subject-Driven API
                        </h3>
                        <p className="text-xs text-(--text-secondary)">
                            Like Symfony — pass your entity, the marking is managed for
                            you.
                        </p>
                        <div className="glass rounded-[14px] p-4 overflow-x-auto">
                            <pre className="text-[11px] leading-[1.6] text-(--text-secondary) font-mono whitespace-pre">
                                {SUBJECT_EXAMPLE}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subpath Exports */}
            <section className="px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-light text-(--text-primary) tracking-tight text-center mb-8">
                        Import only what you need
                    </h2>
                    <div className="glass rounded-[14px] overflow-hidden">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-(--glass-border) text-(--text-muted)">
                                    <th className="text-left px-5 py-3 font-medium">
                                        Import
                                    </th>
                                    <th className="text-left px-5 py-3 font-medium">
                                        Contents
                                    </th>
                                    <th className="text-left px-5 py-3 font-medium">
                                        Extra deps
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {SUBPATHS.map((sp) => (
                                    <tr
                                        key={sp.path}
                                        className="border-b border-(--glass-border) last:border-0"
                                    >
                                        <td className="px-5 py-3 font-mono text-(--accent-bright)">
                                            {sp.path}
                                        </td>
                                        <td className="px-5 py-3 text-(--text-secondary)">
                                            {sp.desc}
                                        </td>
                                        <td className="px-5 py-3 text-(--text-muted)">
                                            {sp.deps}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Symfony Parity */}
            <section className="px-6 py-12">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-light text-(--text-primary) tracking-tight mb-6">
                        Symfony Parity
                    </h2>
                    <div className="flex flex-wrap justify-center gap-2">
                        {[
                            "WorkflowDefinition",
                            "Marking",
                            "Transition",
                            "can()",
                            "apply()",
                            "getEnabledTransitions()",
                            "guard events",
                            "leave events",
                            "transition events",
                            "enter / entered",
                            "completed / announce",
                            "state_machine",
                            "workflow (Petri net)",
                            "property marking store",
                            "method marking store",
                            "!php/const",
                            "!php/enum",
                            "YAML import/export",
                        ].map((item) => (
                            <div
                                key={item}
                                className="glass-sm rounded-[8px] px-3 py-1.5 text-[11px] text-(--text-secondary) flex items-center gap-1.5"
                            >
                                <Check className="w-3 h-3 text-(--success)" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 py-16">
                <div className="max-w-3xl mx-auto">
                    <Card className="p-8 sm:p-12 text-center">
                        <CardContent className="flex flex-col items-center gap-5">
                            <h2 className="text-2xl sm:text-3xl font-light text-(--text-primary) tracking-tight">
                                Design visually, run anywhere
                            </h2>
                            <p className="text-sm text-(--text-secondary) max-w-md leading-relaxed">
                                Build your workflow in SymFlowBuilder, export it, and run
                                it with symflow in Node.js, serverless functions, or the
                                browser.
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                                <Link href="/editor">
                                    <Button size="lg" className="gap-2">
                                        Open Editor
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Link href="/blog/symflow-workflow-engine-for-nodejs">
                                    <Button variant="outline" size="lg" className="gap-2">
                                        Read the Blog Post
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <Footer />
        </div>
    );
}
