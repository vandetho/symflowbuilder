import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env") });
config({ path: resolve(__dirname, "../../.env.local"), override: true });

const { prisma } = await import("./src/index.js");

// Import all static blog posts
const { blogPosts } = await import("../../lib/data/blog-posts.js");

async function main() {
    let created = 0;
    let updated = 0;

    for (const post of blogPosts) {
        const data = {
            slug: post.slug,
            title: post.title,
            date: new Date(post.date),
            excerpt: post.excerpt,
            tags: post.tags,
            content: post.content,
            published: true,
        };

        const existing = await prisma.blogPost.findUnique({
            where: { slug: post.slug },
        });

        if (existing) {
            await prisma.blogPost.update({
                where: { slug: post.slug },
                data,
            });
            updated++;
            console.log(`  Updated: ${post.slug}`);
        } else {
            await prisma.blogPost.create({ data });
            created++;
            console.log(`  Created: ${post.slug}`);
        }
    }

    console.log(
        `\nDone — ${created} created, ${updated} updated (${blogPosts.length} total)`
    );
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
