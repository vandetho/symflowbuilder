import { PrismaClient } from "@prisma/client";
import { blogPosts } from "../../../lib/data/blog-posts";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding blog posts...");

    for (const post of blogPosts) {
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

    console.log(`Seeded ${blogPosts.length} blog posts.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
