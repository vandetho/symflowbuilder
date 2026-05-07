import Link from "next/link";
import { FileText } from "lucide-react";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const LAST_UPDATED = "May 7, 2026";

export const metadata = {
    title: "Terms of Use — SymFlowBuilder",
    description:
        "The terms governing your use of SymFlowBuilder, the visual Symfony workflow builder.",
    alternates: {
        canonical: "/terms",
    },
};

export default async function TermsPage() {
    const session = await auth();

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar activePath="/terms" session={session} />

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
                        <FileText className="w-3 h-3" />
                        Legal
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl font-light text-[var(--text-primary)] tracking-tight">
                        Terms of <span className="font-medium">Use</span>
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] max-w-md">
                        The agreement that governs your use of SymFlowBuilder.
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
                                Agreement
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                                By accessing or using SymFlowBuilder (the
                                &quot;Service&quot;) at https://symflowbuilder.com, you
                                agree to these Terms of Use. If you do not agree, do not
                                use the Service. These terms apply to both guest visitors
                                and authenticated users.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                The Service
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                                SymFlowBuilder is a visual editor for Symfony Workflow
                                configurations. It lets you design state machines and
                                workflows graphically, simulate them, and export
                                production-ready YAML, JSON, TypeScript, and Mermaid
                                output. The editor is publicly available without an
                                account; signing in unlocks cloud save, versioning,
                                sharing, and collaboration features. The Service is also
                                available as open-source software under the MIT license —
                                you may self-host it under that license.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                Accounts
                            </h2>
                            <ul className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2 list-disc pl-4 flex flex-col gap-1.5">
                                <li>
                                    Accounts are created via GitHub OAuth or Google OAuth.
                                    You are responsible for maintaining the security of
                                    the underlying provider account.
                                </li>
                                <li>
                                    You must be at least 13 years old to create an
                                    account.
                                </li>
                                <li>
                                    You may not impersonate another person, share
                                    accounts, or access another user&apos;s account
                                    without authorization.
                                </li>
                                <li>
                                    You may delete your workflows at any time, and request
                                    account deletion by contacting us.
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                Your content
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                                You retain all rights to the workflows, names,
                                descriptions, guard expressions, and other content you
                                create or import into the Service (&quot;Your
                                Content&quot;). You grant us a limited, worldwide,
                                non-exclusive, royalty-free license to host, store, copy,
                                transmit, display, and back up Your Content solely for the
                                purpose of operating and providing the Service to you and
                                your collaborators.
                            </p>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-3">
                                If you mark a workflow as public or generate a public
                                share link, you grant any third party who accesses that
                                link the right to view, embed, and export the
                                workflow&apos;s content (including its YAML / JSON /
                                TypeScript / Mermaid output). You can revoke a share link
                                at any time, but copies already obtained are outside our
                                control.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                Acceptable use
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                                You agree not to:
                            </p>
                            <ul className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2 list-disc pl-4 flex flex-col gap-1.5">
                                <li>
                                    Use the Service to upload, store, or share unlawful,
                                    infringing, defamatory, hateful, or otherwise harmful
                                    content.
                                </li>
                                <li>
                                    Attempt to gain unauthorized access to other
                                    users&apos; accounts, workflows, or our
                                    infrastructure.
                                </li>
                                <li>
                                    Probe, scan, or test the vulnerability of the Service
                                    without our prior written consent, or interfere with
                                    its operation.
                                </li>
                                <li>
                                    Use automated means (scrapers, bots) to overload the
                                    Service, exfiltrate data at scale, or circumvent rate
                                    limits.
                                </li>
                                <li>
                                    Resell or redistribute the hosted Service as your own;
                                    you are however welcome to self-host the open-source
                                    codebase under the MIT license.
                                </li>
                            </ul>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-3">
                                We may suspend or terminate access for users who violate
                                these rules.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                Open source &amp; intellectual property
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                                The SymFlowBuilder source code is published under the{" "}
                                <a
                                    href="https://github.com/vandetho/symflowbuilder/blob/main/LICENSE"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--text-primary)] underline hover:no-underline"
                                >
                                    MIT License
                                </a>
                                . The SymFlowBuilder name, logo, and the visual design of
                                the hosted Service are not licensed under MIT — they
                                remain ours, and you may not use them in a way that
                                implies endorsement. Symfony is a trademark of its
                                respective owner; we are not affiliated with or endorsed
                                by Symfony.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                Embeds &amp; third-party sites
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                                Public workflows may be embedded into third-party sites
                                via the iframe embed route. You are responsible for
                                ensuring you have the right to embed any workflow and that
                                doing so complies with the policies of the host site. We
                                are not responsible for content displayed on third-party
                                sites that embed the Service.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                Service availability &amp; changes
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                                We strive for high availability but the Service is
                                provided on an &quot;as is&quot; basis without guaranteed
                                uptime. We may add, change, or remove features at any
                                time. We may also discontinue the hosted Service with
                                reasonable notice; you can always export your workflows as
                                YAML, JSON, TypeScript, or Mermaid and self-host the
                                open-source codebase.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                Disclaimer of warranties
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
                                AVAILABLE&quot;, WITHOUT WARRANTIES OF ANY KIND, EITHER
                                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED
                                WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                                PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE
                                SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT
                                EXPORTED CONFIGURATIONS WILL BE FREE OF DEFECTS. YOU ARE
                                RESPONSIBLE FOR REVIEWING AND TESTING ANY EXPORTED
                                CONFIGURATION BEFORE USING IT IN PRODUCTION.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                Limitation of liability
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                                TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL
                                WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                                CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
                                PROFITS, REVENUE, DATA, OR USE, ARISING OUT OF OR IN
                                CONNECTION WITH YOUR USE OF THE SERVICE, WHETHER BASED ON
                                CONTRACT, TORT, OR ANY OTHER LEGAL THEORY, EVEN IF ADVISED
                                OF THE POSSIBILITY OF SUCH DAMAGES.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                Indemnification
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                                You agree to indemnify and hold harmless SymFlowBuilder
                                and its maintainers from any claims, damages, or expenses
                                (including reasonable attorneys&apos; fees) arising out of
                                Your Content, your use of the Service, or your violation
                                of these Terms.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                Termination
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                                You may stop using the Service at any time. We may suspend
                                or terminate your access if you violate these Terms or if
                                required by law. Upon termination, your right to use the
                                hosted Service ends, but sections that by their nature
                                should survive (intellectual property, disclaimers,
                                limitations of liability, indemnification) will remain in
                                effect.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                Changes to these Terms
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                                We may update these Terms as the Service evolves. The
                                &quot;Last updated&quot; date at the top of this page
                                reflects the latest revision. Continued use of the Service
                                after changes are posted constitutes acceptance of the
                                updated Terms.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <h2 className="text-sm font-medium text-[var(--text-primary)]">
                                Contact
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                                Questions about these Terms? Email{" "}
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
                                    href="/privacy"
                                    className="text-[var(--text-primary)] underline hover:no-underline"
                                >
                                    Privacy Policy
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
