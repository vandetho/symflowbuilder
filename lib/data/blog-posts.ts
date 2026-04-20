export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    tags: string[];
    content: string;
}

export const blogPosts: BlogPost[] = [
    {
        slug: "guard-toggles-and-event-log",
        title: "Testing Guards and Watching Events Fire",
        date: "2026-04-18",
        excerpt:
            "The simulator now lets you toggle guards on and off to test different workflow paths. See which Symfony events fire at each step.",
        tags: ["feature", "simulator", "guards"],
        content: `## Guard Toggles in the Simulator

When you activate the simulator, a new **Guards** section appears in the panel for any transitions that have guard expressions configured.

Each guard shows:
- A **shield icon** (green = passes, red = blocked)
- The transition name
- The guard expression

Click the shield to toggle a guard on or off. When a guard is blocked, its transition becomes unavailable — the edge dims and the button disappears from the available transitions list.

This lets you test different paths through your workflow without modifying the actual guard expressions.

## Symfony Event Log

Every time you fire a transition in the simulator, the engine records which Symfony events would fire in production:

1. **guard** — checks if the transition is allowed
2. **leave** — fires for each source place before tokens are removed
3. **transition** — fires after tokens are removed from source places
4. **enter** — fires for each target place before marking is updated
5. **entered** — fires after marking is updated
6. **completed** — fires after the full transition is done
7. **announce** — fires for each newly enabled transition

In the history section, each step shows an event count badge. Hover it to see the full list of events that fired.

## Why This Matters

In production Symfony applications, you often have event listeners attached to specific workflow events. Being able to see exactly which events fire for a given transition helps you:

- Verify your listener configuration
- Understand the event ordering
- Debug issues where listeners fire unexpectedly
- Test guard logic without deploying`,
    },
    {
        slug: "introducing-workflow-simulator",
        title: "Introducing the Workflow Simulator",
        date: "2026-04-17",
        excerpt:
            "Step through your Symfony workflows visually. See active states glow, click transitions to advance, and use auto-play to watch the full flow unfold.",
        tags: ["feature", "simulator"],
        content: `## What is the Workflow Simulator?

The simulator lets you execute your workflow directly in the editor. Toggle **Simulate** in the toolbar to enter play mode.

## How It Works

When you activate the simulator:

- **Active states glow green** with a pulse animation
- **Available transitions highlight** — click them to advance
- **Unavailable transitions dim** to 30% opacity
- The canvas becomes **read-only** — no dragging, connecting, or deleting

## The Simulator Panel

A panel appears at the bottom of the canvas showing:

- **Current State** — badges for each active place with token counts
- **Available Transitions** — clickable buttons to fire transitions
- **History** — a log of every step with from/to markings

## Auto-Play

Click the play button in the simulator footer to enable auto-play. The simulator will randomly pick an available transition and fire it at a configurable interval (0.5s, 1s, or 2s).

Auto-play stops automatically when no transitions are available (dead end).

## Step Back

Made a wrong choice? Click **Step Back** to revert to the previous marking. The engine restores the exact state from before the last transition.

## Reset

Click the reset button to return to the initial marking and clear all history.

## Under the Hood

The simulator is powered by a TypeScript workflow engine that mirrors Symfony's Workflow component. It tracks markings, evaluates transitions, supports guards, and fires events in the correct Symfony order.`,
    },
    {
        slug: "and-or-patterns-explained",
        title: "AND vs OR Patterns: How Symfony Workflows Really Work",
        date: "2026-04-16",
        excerpt:
            "Understand the difference between AND-split (parallel forks), AND-join (synchronization), and OR (exclusive choice) in Symfony workflows.",
        tags: ["guide", "patterns"],
        content: `## The Two Workflow Types

Symfony offers two types: **workflow** (Petri net) and **state_machine**.

- **state_machine**: Exactly one place is active at a time. Simple linear flows.
- **workflow**: Multiple places can be active simultaneously. Supports parallel execution.

## AND Patterns (Workflow Type Only)

### AND-Split (Fork)

A single transition with multiple target places:

\`\`\`yaml
transitions:
    start_review:
        from: draft
        to: [checking_content, checking_spelling]
\`\`\`

Both \`checking_content\` and \`checking_spelling\` become active simultaneously. The entity is in two places at once.

### AND-Join (Synchronization)

A single transition with multiple source places:

\`\`\`yaml
transitions:
    publish:
        from: [content_approved, spelling_approved]
        to: published
\`\`\`

Both \`content_approved\` AND \`spelling_approved\` must be marked for the transition to fire.

## OR Patterns

Separate transitions from the same place create an OR choice:

\`\`\`yaml
transitions:
    approve:
        from: review
        to: approved
    reject:
        from: review
        to: rejected
\`\`\`

From \`review\`, you can go to \`approved\` OR \`rejected\` — firing one consumes the token, so the other becomes unavailable.

## How SymFlowBuilder Shows the Difference

- **AND patterns**: Edges sharing the same transition name display an **AND** or **FORK** badge
- **OR patterns**: Separate transition nodes from the same place — no badge needed
- **In the simulator**: AND-joins require all source places to be marked before the transition enables`,
    },
    {
        slug: "getting-started-with-symfony-workflows",
        title: "Getting Started with Symfony Workflows",
        date: "2026-04-10",
        excerpt:
            "A beginner-friendly introduction to the Symfony Workflow component. Learn about places, transitions, marking stores, and how to design your first state machine.",
        tags: ["guide", "symfony"],
        content: `## What is a Symfony Workflow?

The Symfony Workflow component lets you define a set of **places** (states) and **transitions** (actions that move between states). It is used to model business processes like order fulfillment, content publishing, or approval flows.

## Key Concepts

### Places

Places represent the possible states your entity can be in:

\`\`\`yaml
places: [draft, submitted, approved, rejected, published]
\`\`\`

### Transitions

Transitions define how to move between places:

\`\`\`yaml
transitions:
    submit:
        from: draft
        to: submitted
    approve:
        from: submitted
        to: approved
\`\`\`

### Marking Store

The marking store determines how the current state is persisted on your entity:

\`\`\`yaml
marking_store:
    type: method
    property: currentState
\`\`\`

This means your entity needs a \`getCurrentState()\` and \`setCurrentState()\` method.

### Guards

Guards are expressions that control when a transition is allowed:

\`\`\`yaml
transitions:
    approve:
        from: submitted
        to: approved
        guard: 'is_granted("ROLE_ADMIN")'
\`\`\`

## Building Your First Workflow with SymFlowBuilder

1. Open the editor at [symflowbuilder.com/editor](https://symflowbuilder.com/editor)
2. Drag a state node from the palette
3. Draw an edge to create a transition
4. Set one state as initial in the properties panel
5. Configure the workflow type and Symfony version
6. Click Export YAML — done!`,
    },
    {
        slug: "state-machine-vs-workflow",
        title: "State Machine vs Workflow: When to Use Which",
        date: "2026-04-05",
        excerpt:
            "Symfony offers two types: workflow (Petri net, multiple active places) and state_machine (single active place). Here is when to choose each one.",
        tags: ["guide", "symfony"],
        content: `## State Machine

A state machine restricts your entity to **exactly one place** at a time. This is simpler and covers most use cases.

Use a state machine when:
- Your entity follows a linear or branching path
- It can only be in one state at a time
- Examples: order status, ticket lifecycle, user onboarding

\`\`\`yaml
framework:
    workflows:
        order:
            type: state_machine
            places: [new, processing, shipped, delivered]
\`\`\`

## Workflow (Petri Net)

A workflow allows your entity to be in **multiple places simultaneously**. This enables parallel processing paths.

Use a workflow when:
- Your entity needs to be in multiple states at once
- You have parallel approval or review processes
- Examples: content review (checking spelling AND content simultaneously)

\`\`\`yaml
framework:
    workflows:
        article:
            type: workflow
            transitions:
                start_review:
                    from: draft
                    to: [checking_content, checking_spelling]
                publish:
                    from: [content_approved, spelling_approved]
                    to: published
\`\`\`

## Decision Guide

| Question | State Machine | Workflow |
|----------|:---:|:---:|
| Can the entity be in multiple states? | No | Yes |
| Do you need parallel paths? | No | Yes |
| Is the flow mostly linear? | Yes | Maybe |
| Simpler to reason about? | Yes | No |

**When in doubt, start with state_machine.** You can always upgrade to workflow later if you need parallel states.`,
    },
    {
        slug: "exporting-production-ready-yaml",
        title: "Exporting Production-Ready YAML with SymFlowBuilder",
        date: "2026-03-28",
        excerpt:
            "Learn how SymFlowBuilder generates valid Symfony workflow YAML with proper null handling, flow arrays, guards, metadata, and version-specific output.",
        tags: ["tutorial", "yaml"],
        content: `## YAML Export Conventions

SymFlowBuilder generates YAML that follows Symfony's conventions exactly:

### Tilde Nulls

Empty places use \`~\` (YAML null), not \`null\`:

\`\`\`yaml
places:
    draft: ~
    submitted: ~
\`\`\`

### Flow Arrays

Arrays use bracket syntax:

\`\`\`yaml
supports: [App\\Entity\\Order]
initial_marking: [draft]
from: [content_approved, spelling_approved]
\`\`\`

### Scalar vs Array

When there is only one value, it is a plain string:

\`\`\`yaml
initial_marking: draft
from: draft
to: submitted
\`\`\`

### Places Format

When no places have metadata, places is a simple array:

\`\`\`yaml
places: [draft, submitted, approved]
\`\`\`

When any place has metadata, all places use the object format:

\`\`\`yaml
places:
    draft: ~
    review:
        metadata:
            description: Human review
    closed:
        metadata:
            bg_color: DeepSkyBlue
\`\`\`

## Styling Metadata

SymFlowBuilder supports Symfony's workflow dump styling metadata:

- **bg_color** — background color for places
- **description** — text description shown in dumps
- **color** — label color for transitions
- **arrow_color** — connector line color for transitions

These are exported as standard metadata and work with \`workflow:dump --with-metadata\`.

## Version Support

The exporter supports Symfony 5.4, 6.4, 7.4, and 8.0. Select your target version in the toolbar before exporting.`,
    },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
    return blogPosts.find((p) => p.slug === slug);
}
