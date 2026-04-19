import Link from "next/link";
import { BookOpen } from "lucide-react";
import { LogoWithText } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/auth";
import { blogPosts } from "@/lib/data/blog-posts";
import { formatDistanceToNow } from "date-fns";

export const metadata = {
    title: "Blog — SymFlowBuilder",
    description:
        "Articles about Symfony workflows, state machines, and visual workflow design with SymFlowBuilder.",
};

export default async function BlogPage() {
    const session = await auth();
    const sortedPosts = [...blogPosts].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className="flex flex-col min-h-screen">
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
                            className="text-xs text-[var(--accent-bright)] transition-colors"
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
                        Blog
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl font-light text-[var(--text-primary)] tracking-tight">
                        Articles & <span className="font-medium">Guides</span>
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] max-w-md">
                        Tips, tutorials, and updates about Symfony workflows and
                        SymFlowBuilder.
                    </p>
                </div>
            </section>

            <section className="flex-1 px-6 pb-16">
                <div className="max-w-3xl mx-auto flex flex-col gap-4">
                    {sortedPosts.map((post) => (
                        <Card
                            key={post.slug}
                            className="hover:border-[var(--glass-border-hover)] transition-colors"
                        >
                            <CardContent className="p-5 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-[var(--text-muted)] font-mono">
                                        {formatDistanceToNow(new Date(post.date), {
                                            addSuffix: true,
                                        })}
                                    </span>
                                    <div className="flex gap-1">
                                        {post.tags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="outline"
                                                className="text-[9px] px-1.5"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <h2 className="text-base font-medium text-[var(--text-primary)]">
                                    {post.title}
                                </h2>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                    {post.excerpt}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
