import Link from "next/link";
import { LogoWithText } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/ui/icons";

const NAV_LINKS = [
    { href: "/features", label: "Features" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/explore", label: "Explore" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
];

interface NavbarProps {
    /** Current page path to highlight the active link */
    activePath?: string;
    session?: { user?: { name?: string | null; image?: string | null } } | null;
}

export function Navbar({ activePath, session }: NavbarProps) {
    return (
        <nav className="sticky top-0 z-50 glass-strong border-b border-[var(--glass-border)]">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
                <Link href="/">
                    <LogoWithText />
                </Link>

                <div className="hidden sm:flex items-center gap-6">
                    {NAV_LINKS.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`text-xs transition-colors ${
                                activePath === href
                                    ? "text-[var(--accent-bright)]"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
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
    );
}
