export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    tags: string[];
}

export const blogPosts: BlogPost[] = [
    {
        slug: "introducing-workflow-simulator",
        title: "Introducing the Workflow Simulator",
        date: "2026-04-17",
        excerpt:
            "Step through your Symfony workflows visually. See active states glow, click transitions to advance, and use auto-play to watch the full flow unfold.",
        tags: ["feature", "simulator"],
    },
    {
        slug: "and-or-patterns-explained",
        title: "AND vs OR Patterns: How Symfony Workflows Really Work",
        date: "2026-04-16",
        excerpt:
            "Understand the difference between AND-split (parallel forks), AND-join (synchronization), and OR (exclusive choice) in Symfony workflows. Learn how SymFlowBuilder visualizes them.",
        tags: ["guide", "patterns"],
    },
    {
        slug: "getting-started-with-symfony-workflows",
        title: "Getting Started with Symfony Workflows",
        date: "2026-04-10",
        excerpt:
            "A beginner-friendly introduction to the Symfony Workflow component. Learn about places, transitions, marking stores, and how to design your first state machine.",
        tags: ["guide", "symfony"],
    },
    {
        slug: "state-machine-vs-workflow",
        title: "State Machine vs Workflow: When to Use Which",
        date: "2026-04-05",
        excerpt:
            "Symfony offers two types: workflow (Petri net, multiple active places) and state_machine (single active place). Here is when to choose each one.",
        tags: ["guide", "symfony"],
    },
    {
        slug: "exporting-production-ready-yaml",
        title: "Exporting Production-Ready YAML with SymFlowBuilder",
        date: "2026-03-28",
        excerpt:
            "Learn how SymFlowBuilder generates valid Symfony workflow YAML with proper null handling, flow arrays, guards, metadata, and version-specific output.",
        tags: ["tutorial", "yaml"],
    },
];
