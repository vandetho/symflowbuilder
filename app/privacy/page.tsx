import Link from "next/link";
import { Shield } from "lucide-react";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const LAST_UPDATED = "May 7, 2026";

export const metadata = {
    title: "Privacy Policy — SymFlowBuilder",
    description:
        "How SymFlowBuilder collects, stores, and uses your data. Read our privacy policy.",
    alternates: {
        canonical: "/privacy",
    },
};

export default async function PrivacyPage() {
    const session = await auth();

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar activePath="/privacy" session={session} />

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
                        <Shield className="w-3 h-3" />
                        Legal
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl font-light text-[var(--text-primary)] tracking-tight">
                        Privacy <span className="font-medium">Policy</span>
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] max-w-md">
                        How we collect, store, and use your data on SymFlowBuilder.
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                        Last updated: {LAST_UPDATED}
                    </p>
                </div>
            </section>

            {/* ─── Content ─── */}
            <section className="flex-1 px-6 pb-16">
                <div className="max-w-3xl mx-auto flex flex-col gap-3">
                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                Overview
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                                SymFlowBuilder (&quot;we&quot;, &quot;our&quot;, or
                                &quot;the Service&quot;) is a visual builder for Symfony
                                Workflow configurations operated from
                                https://symflowbuilder.com. This policy describes what
                                data we handle and why. We do not sell your data and we
                                collect only what is needed to provide the Service.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                Data we collect
                            </h2>
                            <ul className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2 list-disc pl-4 flex flex-col gap-1.5">
                                <li>
                                    <strong className="text-[var(--text-primary)] font-medium">
                                        Account data.
                                    </strong>{" "}
                                    When you sign in with GitHub or Google via Auth.js, we
                                    receive your name, email, avatar URL, and provider
                                    account ID. This is the minimum required to create and
                                    identify your account.
                                </li>
                                <li>
                                    <strong className="text-[var(--text-primary)] font-medium">
                                        Workflow content.
                                    </strong>{" "}
                                    Workflows you create or import (places, transitions,
                                    metadata, names, descriptions, share settings, and
                                    collaborator assignments) are stored in our PostgreSQL
                                    database against your account.
                                </li>
                                <li>
                                    <strong className="text-[var(--text-primary)] font-medium">
                                        Guest drafts.
                                    </strong>{" "}
                                    If you use the editor without signing in, your draft
                                    is saved only to your browser&apos;s localStorage. It
                                    never leaves your device until you sign in and choose
                                    to migrate it.
                                </li>
                                <li>
                                    <strong className="text-[var(--text-primary)] font-medium">
                                        Session cookies.
                                    </strong>{" "}
                                    Auth.js sets a secure, HTTP-only session cookie to
                                    keep you signed in. We do not use third-party tracking
                                    or advertising cookies.
                                </li>
                                <li>
                                    <strong className="text-[var(--text-primary)] font-medium">
                                        Server logs.
                                    </strong>{" "}
                                    Our hosting infrastructure records standard request
                                    logs (IP address, user agent, timestamp, URL) for
                                    operational, security, and abuse-prevention purposes.
                                    These logs are rotated and not used for profiling.
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                How we use your data
                            </h2>
                            <ul className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2 list-disc pl-4 flex flex-col gap-1.5">
                                <li>To authenticate you and keep you signed in.</li>
                                <li>
                                    To save, version, share, and load the workflows you
                                    create.
                                </li>
                                <li>
                                    To enable collaboration features (inviting teammates,
                                    public share links, the Explore page for workflows you
                                    mark as public).
                                </li>
                                <li>
                                    To operate, secure, and improve the Service —
                                    including diagnosing bugs and preventing abuse.
                                </li>
                            </ul>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-3">
                                We do not use your workflow content to train machine
                                learning models, and we do not sell, rent, or share
                                personal data with advertisers.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                Public &amp; shared content
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                                When you generate a public share link or mark a workflow
                                as public, its graph, metadata, and exported YAML become
                                accessible to anyone with the link, and may appear on the
                                Explore page and in iframe embeds. Do not place secrets,
                                customer data, or sensitive business information in
                                workflow names, descriptions, or guard expressions you
                                intend to share publicly. You can revoke a share link at
                                any time from the dashboard.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                Sub-processors
                            </h2>
                            <ul className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2 list-disc pl-4 flex flex-col gap-1.5">
                                <li>
                                    <strong className="text-[var(--text-primary)] font-medium">
                                        GitHub OAuth
                                    </strong>{" "}
                                    and{" "}
                                    <strong className="text-[var(--text-primary)] font-medium">
                                        Google OAuth
                                    </strong>{" "}
                                    — used only to authenticate you.
                                </li>
                                <li>
                                    <strong className="text-[var(--text-primary)] font-medium">
                                        Hosting provider
                                    </strong>{" "}
                                    — runs the application servers and PostgreSQL database
                                    that store your workflows.
                                </li>
                            </ul>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-3">
                                We may add or change sub-processors as the Service
                                evolves; material changes will be reflected on this page.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                Data retention
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                                We retain your account and workflows for as long as your
                                account is active. You can delete individual workflows
                                from the dashboard at any time. To delete your account and
                                associated data, contact us at the address below —
                                deletion is irreversible. Server logs are retained for a
                                limited period for security and operational purposes, then
                                purged on rotation.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                Your rights
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                                Depending on where you live, you may have the right to
                                access, correct, export, or delete the personal data we
                                hold about you, and to object to certain uses of it. To
                                exercise these rights, email us at{" "}
                                <a
                                    href="mailto:thovandeth@gmail.com"
                                    className="text-[var(--text-primary)] underline hover:no-underline"
                                >
                                    thovandeth@gmail.com
                                </a>
                                . We will respond within a reasonable timeframe.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                Children
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                                SymFlowBuilder is a developer tool not directed at
                                children under 13. We do not knowingly collect personal
                                data from children. If you believe a child has provided us
                                personal data, please contact us so we can remove it.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                Self-hosting
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                                SymFlowBuilder is open source under the MIT license and
                                can be self-hosted. This policy applies only to the hosted
                                Service at symflowbuilder.com. Self-hosted deployments are
                                operated entirely by you and are not covered here.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                Changes to this policy
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                                We may update this Privacy Policy as the Service evolves.
                                The &quot;Last updated&quot; date at the top of this page
                                reflects the latest revision. Continued use of the Service
                                after changes are posted constitutes acceptance of the
                                updated policy.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                Contact
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                                Questions about this policy or your data? Email{" "}
                                <a
                                    href="mailto:thovandeth@gmail.com"
                                    className="text-[var(--text-primary)] underline hover:no-underline"
                                >
                                    thovandeth@gmail.com
                                </a>{" "}
                                or open an issue at{" "}
                                <a
                                    href="https://github.com/vandetho/symflowbuilder/issues"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--text-primary)] underline hover:no-underline"
                                >
                                    github.com/vandetho/symflowbuilder
                                </a>
                                . See also our{" "}
                                <Link
                                    href="/terms"
                                    className="text-[var(--text-primary)] underline hover:no-underline"
                                >
                                    Terms of Use
                                </Link>
                                .
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <Footer />
        </div>
    );
}
