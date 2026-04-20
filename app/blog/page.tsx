import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/auth";
import { prisma } from "@symflowbuilder/db";
import { formatDistanceToNow } from "date-fns";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
    title: "Blog — SymFlowBuilder",
    description:
        "Articles about Symfony workflows, state machines, and visual workflow design with SymFlowBuilder.",
};

export default async function BlogPage() {
    const session = await auth();
    const posts = await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { date: "desc" },
        select: {
            slug: true,
            title: true,
            date: true,
            excerpt: true,
            tags: true,
        },
    });

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar activePath="/blog" session={session} />

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
                    {posts.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`}>
                            <Card className="hover:border-[var(--glass-border-hover)] transition-colors cursor-pointer">
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
                        </Link>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}
