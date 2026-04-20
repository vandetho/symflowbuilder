import Image from "next/image";
import Link from "next/link";
import { LogoWithText } from "@/components/ui/logo";

const FOOTER_LINKS = [
    { href: "/editor", label: "Editor" },
    { href: "/features", label: "Features" },
    { href: "/engine", label: "Engine" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/explore", label: "Explore" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
];

const SPONSORS = [
    {
        href: "https://supportdock.io",
        label: "SupportDock",
        logo: "/supportdock-logo.png",
    },
    { href: "https://basilbook.com", label: "BasilBook", logo: "/basilbook-logo.png" },
    { href: "https://dailybrew.work", label: "DailyBrew", logo: "/dailybrew-logo.svg" },
];

export function Footer() {
    return (
        <footer className="border-t border-[var(--glass-border)] px-6 py-8 mt-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <LogoWithText size={24} />

                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-[var(--text-muted)]">
                        {FOOTER_LINKS.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className="hover:text-[var(--text-secondary)] transition-colors"
                            >
                                {label}
                            </Link>
                        ))}
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
                        {SPONSORS.map(({ href, label, logo }) => (
                            <a
                                key={href}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                            >
                                <Image
                                    src={logo}
                                    alt={label}
                                    width={14}
                                    height={14}
                                    className="rounded-sm"
                                />
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
