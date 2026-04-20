import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(__dirname, "..", "..", "..");

dotenv.config({ path: resolve(workspaceRoot, ".env.local") });
dotenv.config({ path: resolve(workspaceRoot, ".env") });

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

interface BlogPostData {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    tags: string[];
    content: string;
}

/**
 * Dynamically load blog posts from the static data file.
 * Uses a regex approach to extract the data since ESM cross-package
 * imports can fail in some Node.js environments.
 */
function loadBlogPosts(): BlogPostData[] {
    const filePath = resolve(__dirname, "../../../lib/data/blog-posts.ts");
    const source = readFileSync(filePath, "utf8");

    // Extract the blogPosts array by evaluating the TS file content
    // Find the array between `export const blogPosts: BlogPost[] = [` and the matching `];`
    const startMarker = "export const blogPosts: BlogPost[] = [";
    const startIdx = source.indexOf(startMarker);
    if (startIdx === -1) throw new Error("Could not find blogPosts in source file");

    // Find matching closing bracket by counting brackets
    let depth = 0;
    let endIdx = startIdx + startMarker.length - 1; // position of the `[`
    for (let i = endIdx; i < source.length; i++) {
        if (source[i] === "[") depth++;
        if (source[i] === "]") {
            depth--;
            if (depth === 0) {
                endIdx = i + 1;
                break;
            }
        }
    }

    const arraySource = source.slice(startIdx + startMarker.length - 1, endIdx);

    // Convert TS template literals and object syntax to JSON-parseable format
    // This is a simplified parser — works for our blog-posts.ts structure
    const posts: BlogPostData[] = [];
    const slugRegex = /slug:\s*"([^"]+)"/g;
    const titleRegex = /title:\s*"([^"]+)"/;
    const dateRegex = /date:\s*"([^"]+)"/;
    const excerptRegex = /excerpt:\s*\n?\s*"([^"]+)"/;
    const tagsRegex = /tags:\s*\[([^\]]+)\]/;
    const contentRegex = /content:\s*`([\s\S]*?)`/;

    // Split by slug matches to find each post block
    const blocks = arraySource.split(/\{\s*slug:/);

    for (const block of blocks.slice(1)) {
        const fullBlock = "slug:" + block;
        const slugMatch = fullBlock.match(/slug:\s*"([^"]+)"/);
        const titleMatch = fullBlock.match(titleRegex);
        const dateMatch = fullBlock.match(dateRegex);
        const excerptMatch = fullBlock.match(excerptRegex);
        const tagsMatch = fullBlock.match(tagsRegex);
        const contentMatch = fullBlock.match(contentRegex);

        if (slugMatch && titleMatch && dateMatch && excerptMatch && contentMatch) {
            const tags = tagsMatch
                ? tagsMatch[1]
                      .split(",")
                      .map((t) => t.trim().replace(/"/g, "").replace(/'/g, ""))
                : [];

            // Unescape template literal content
            const content = contentMatch[1].replace(/\\`/g, "`").replace(/\\\$/g, "$");

            posts.push({
                slug: slugMatch[1],
                title: titleMatch[1],
                date: dateMatch[1],
                excerpt: excerptMatch[1],
                tags,
                content,
            });
        }
    }

    return posts;
}

async function main() {
    console.log("Seeding blog posts...");

    const posts = loadBlogPosts();
    console.log(`Found ${posts.length} posts in source file.`);

    for (const post of posts) {
        await prisma.blogPost.upsert({
            where: { slug: post.slug },
            update: {
                title: post.title,
                date: new Date(post.date),
                excerpt: post.excerpt,
                tags: post.tags,
                content: post.content,
            },
            create: {
                slug: post.slug,
                title: post.title,
                date: new Date(post.date),
                excerpt: post.excerpt,
                tags: post.tags,
                content: post.content,
            },
        });
        console.log(`  ✓ ${post.slug}`);
    }

    console.log(`Seeded ${posts.length} blog posts.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
