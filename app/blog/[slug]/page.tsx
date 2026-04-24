import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@symflowbuilder/db";
import { getPostBySlug } from "@/lib/data/blog-posts";
import { auth } from "@/auth";
import { format } from "date-fns";

async function findPost(slug: string) {
    try {
        return await prisma.blogPost.findUnique({
            where: { slug, published: true },
        });
    } catch {
        // Fallback to static data if table doesn't exist yet
        const staticPost = getPostBySlug(slug);
        if (!staticPost) return null;
        return {
            ...staticPost,
            date: new Date(staticPost.date),
            published: true,
            id: slug,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await findPost(slug);
    if (!post) return { title: "Post Not Found" };

    return {
        title: `${post.title} — SymFlowBuilder Blog`,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await findPost(slug);
    if (!post) notFound();

    const session = await auth();

    // Simple markdown-to-JSX rendering for headings, code blocks, lists, tables, paragraphs
    const lines = post.content.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Code block
        if (line.startsWith("```")) {
            const lang = line.slice(3).trim() || undefined;
            const codeLines: string[] = [];
            i++;
            while (i < lines.length && !lines[i].startsWith("```")) {
                codeLines.push(lines[i]);
                i++;
            }
            i++; // skip closing ```
            elements.push(
                <div key={key++} className="my-4">
                    <CodeBlock code={codeLines.join("\n")} title={lang} />
                </div>
            );
            continue;
        }

        // Table
        if (line.includes("|") && line.trim().startsWith("|")) {
            const tableLines: string[] = [];
            while (
                i < lines.length &&
                lines[i].includes("|") &&
                lines[i].trim().startsWith("|")
            ) {
                tableLines.push(lines[i]);
                i++;
            }
            const rows = tableLines
                .filter((l) => !l.match(/^\|[\s-:|]+\|$/))
                .map((l) =>
                    l
                        .split("|")
                        .slice(1, -1)
                        .map((c) => c.trim())
                );
            if (rows.length > 0) {
                const [header, ...body] = rows;
                elements.push(
                    <div key={key++} className="overflow-x-auto my-4">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[var(--glass-border)]">
                                    {header.map((cell, j) => (
                                        <th
                                            key={j}
                                            className="px-3 py-2 text-left text-[var(--text-muted)] font-medium text-xs"
                                        >
                                            {cell}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {body.map((row, ri) => (
                                    <tr
                                        key={ri}
                                        className="border-b border-[var(--glass-border)]"
                                    >
                                        {row.map((cell, ci) => (
                                            <td
                                                key={ci}
                                                className="px-3 py-2 text-[var(--text-secondary)] text-xs"
                                            >
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            }
            continue;
        }

        // Heading
        if (line.startsWith("## ")) {
            elements.push(
                <h2
                    key={key++}
                    className="text-xl font-medium text-[var(--text-primary)] mt-8 mb-3"
                >
                    {line.slice(3)}
                </h2>
            );
            i++;
            continue;
        }
        if (line.startsWith("### ")) {
            elements.push(
                <h3
                    key={key++}
                    className="text-base font-medium text-[var(--text-primary)] mt-6 mb-2"
                >
                    {line.slice(4)}
                </h3>
            );
            i++;
            continue;
        }

        // List item
        if (line.startsWith("- ")) {
            const items: string[] = [];
            while (i < lines.length && lines[i].startsWith("- ")) {
                items.push(lines[i].slice(2));
                i++;
            }
            elements.push(
                <ul
                    key={key++}
                    className="list-disc list-inside my-3 flex flex-col gap-1.5"
                >
                    {items.map((item, j) => (
                        <li
                            key={j}
                            className="text-sm text-[var(--text-secondary)] leading-relaxed"
                        >
                            {renderInline(item)}
                        </li>
                    ))}
                </ul>
            );
            continue;
        }

        // Numbered list
        if (/^\d+\.\s/.test(line)) {
            const items: string[] = [];
            while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
                items.push(lines[i].replace(/^\d+\.\s/, ""));
                i++;
            }
            elements.push(
                <ol
                    key={key++}
                    className="list-decimal list-inside my-3 flex flex-col gap-1.5"
                >
                    {items.map((item, j) => (
                        <li
                            key={j}
                            className="text-sm text-[var(--text-secondary)] leading-relaxed"
                        >
                            {renderInline(item)}
                        </li>
                    ))}
                </ol>
            );
            continue;
        }

        // Empty line
        if (line.trim() === "") {
            i++;
            continue;
        }

        // Paragraph
        elements.push(
            <p
                key={key++}
                className="text-sm text-[var(--text-secondary)] leading-relaxed my-2"
            >
                {renderInline(line)}
            </p>
        );
        i++;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar activePath="/blog" session={session} />

            <article className="flex-1 px-6 py-12">
                <div className="max-w-2xl mx-auto">
                    <Link href="/blog">
                        <Button variant="ghost" size="sm" className="gap-1.5 mb-6 -ml-2">
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back to Blog
                        </Button>
                    </Link>

                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs text-[var(--text-muted)] font-mono">
                            {format(new Date(post.date), "MMMM d, yyyy")}
                        </span>
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

                    <h1 className="text-2xl sm:text-3xl font-light text-[var(--text-primary)] tracking-tight mb-6">
                        {post.title}
                    </h1>

                    <div className="border-t border-[var(--glass-border)] pt-6">
                        {elements}
                    </div>
                </div>
            </article>

            <Footer />
        </div>
    );
}

/** Render inline markdown: **bold**, `code`, [links] */
function renderInline(text: string): React.ReactNode {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let partKey = 0;

    while (remaining.length > 0) {
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        const codeMatch = remaining.match(/`(.+?)`/);
        const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/);

        const matches = [
            boldMatch
                ? { type: "bold", index: boldMatch.index!, match: boldMatch }
                : null,
            codeMatch
                ? { type: "code", index: codeMatch.index!, match: codeMatch }
                : null,
            linkMatch
                ? { type: "link", index: linkMatch.index!, match: linkMatch }
                : null,
        ]
            .filter(Boolean)
            .sort((a, b) => a!.index - b!.index);

        if (matches.length === 0) {
            parts.push(remaining);
            break;
        }

        const first = matches[0]!;
        if (first.index > 0) {
            parts.push(remaining.slice(0, first.index));
        }

        if (first.type === "bold") {
            parts.push(
                <strong
                    key={partKey++}
                    className="font-medium text-[var(--text-primary)]"
                >
                    {first.match[1]}
                </strong>
            );
        } else if (first.type === "code") {
            parts.push(
                <code
                    key={partKey++}
                    className="px-1.5 py-0.5 rounded bg-[var(--glass-base)] border border-[var(--glass-border)] text-[11px] font-mono text-[var(--accent-bright)]"
                >
                    {first.match[1]}
                </code>
            );
        } else if (first.type === "link") {
            parts.push(
                <a
                    key={partKey++}
                    href={first.match[2]}
                    className="text-[var(--accent-bright)] hover:underline"
                    target={first.match[2].startsWith("http") ? "_blank" : undefined}
                    rel={
                        first.match[2].startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                    }
                >
                    {first.match[1]}
                </a>
            );
        }
        remaining = remaining.slice(first.index + first.match[0].length);
    }

    return parts.length === 1 ? parts[0] : parts;
}
