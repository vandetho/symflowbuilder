import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { LogoWithText } from "@/components/ui/logo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/auth";
import { Navbar } from "@/components/layout/Navbar";

const FAQS = [
    {
        question: "Do I need an account to use the editor?",
        answer: "No. The editor is fully public — you can design workflows, export YAML, and import existing files without creating an account. Signing in unlocks cloud save, versioning, sharing, and collaboration.",
    },
    {
        question: "What Symfony versions are supported?",
        answer: "SymFlowBuilder supports Symfony 5.4, 6.4, 7.4, and 8.0. The exported YAML is version-aware and generates the correct configuration structure for your selected version.",
    },
    {
        question: "What is the difference between a workflow and a state machine?",
        answer: "In Symfony, a workflow allows an entity to be in multiple places simultaneously, while a state machine restricts it to exactly one place at a time. State machines are simpler and more common for basic approval flows.",
    },
    {
        question: "Can I import my existing Symfony workflow YAML?",
        answer: "Yes. Drag and drop a YAML file onto the canvas or use the Import button in the toolbar. SymFlowBuilder parses the YAML and renders the graph with automatic layout positioning.",
    },
    {
        question: "How does guest persistence work?",
        answer: "When you use the editor without signing in, your workflow is automatically saved to your browser's localStorage. If you sign in later, your draft is migrated to cloud storage.",
    },
    {
        question: "Can I share a workflow with specific people?",
        answer: "Yes. Authenticated users can invite collaborators by email. Collaborators can be given viewer (read-only) or editor (read-write) access. This is separate from the public sharing link.",
    },
    {
        question: "What is a public sharing link?",
        answer: "Owners can generate a public link that lets anyone view a read-only version of the workflow and export its YAML — no account required. Public workflows also appear on the Explore page.",
    },
    {
        question: "Can I undo changes?",
        answer: "Yes. The editor maintains a 50-step undo/redo history. Use Cmd+Z (or Ctrl+Z) to undo and Cmd+Shift+Z (or Ctrl+Shift+Z) to redo.",
    },
    {
        question: "What are guards?",
        answer: 'Guards are Symfony ExpressionLanguage expressions that must evaluate to true for a transition to be allowed. For example, is_granted("ROLE_ADMIN") restricts a transition to admin users.',
    },
    {
        question: "Is SymFlowBuilder open source?",
        answer: "Yes. SymFlowBuilder is MIT licensed and the source code is available on GitHub. Contributions are welcome.",
    },
    {
        question: "Where is my data stored?",
        answer: "Guest workflows are stored locally in your browser. Authenticated users' workflows are stored in a PostgreSQL database. We do not sell or share your data.",
    },
    {
        question: "Can I self-host SymFlowBuilder?",
        answer: "Yes. The project includes deployment scripts for VPS hosting with PM2, Nginx, and PostgreSQL. Check the README for setup instructions.",
    },
];

export const metadata = {
    title: "FAQ — SymFlowBuilder",
    description:
        "Frequently asked questions about SymFlowBuilder, the visual Symfony workflow builder.",
};

export default async function FaqPage() {
    const session = await auth();

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar activePath="/faq" session={session} />

            {/* ─── Header ─── */}
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
                        <HelpCircle className="w-3 h-3" />
                        Help
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl font-light text-[var(--text-primary)] tracking-tight">
                        Frequently Asked <span className="font-medium">Questions</span>
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] max-w-md">
                        Everything you need to know about SymFlowBuilder.
                    </p>
                </div>
            </section>

            {/* ─── FAQ Items ─── */}
            <section className="flex-1 px-6 pb-16">
                <div className="max-w-3xl mx-auto flex flex-col gap-3">
                    {FAQS.map((faq) => (
                        <Card key={faq.question}>
                            <CardContent className="py-4">
                                <h3 className="text-sm font-medium text-[var(--text-primary)]">
                                    {faq.question}
                                </h3>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                                    {faq.answer}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
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
                            <Link
                                href="/faq"
                                className="hover:text-[var(--text-secondary)] transition-colors"
                            >
                                FAQ
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
