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
        slug: "symflow-core-workflow-engine-for-nodejs",
        title: "Introducing @symflow/core: A Symfony-Compatible Workflow Engine for Node.js",
        date: "2026-04-19",
        excerpt:
            "We built a TypeScript workflow engine that mirrors Symfony's Workflow component. Use it in any Node.js app to manage state machines, Petri nets, guards, and events — no PHP required.",
        tags: ["announcement", "engine", "nodejs"],
        content: `## Why We Built Our Own Engine

SymFlowBuilder started as a visual editor that exports YAML for Symfony. But we needed something to power the [simulator](/blog/introducing-workflow-simulator) — a runtime that could fire transitions, track markings, evaluate guards, and emit events in the exact same order Symfony does.

So we built \`@symflow/core\`: a standalone TypeScript workflow engine with zero framework dependencies. It runs anywhere JavaScript runs — Node.js backends, serverless functions, CLI tools, or the browser.

## Installation

\`\`\`bash
npm install @symflow/core
\`\`\`

The package ships ESM and CJS builds with full TypeScript types.

## Defining a Workflow

A workflow definition is a plain object — no decorators, no config files:

\`\`\`typescript
import type { WorkflowDefinition } from "@symflow/core";

const orderWorkflow: WorkflowDefinition = {
    name: "order",
    type: "state_machine",
    places: [
        { name: "draft" },
        { name: "submitted" },
        { name: "approved" },
        { name: "rejected" },
        { name: "fulfilled" },
    ],
    transitions: [
        { name: "submit", froms: ["draft"], tos: ["submitted"] },
        { name: "approve", froms: ["submitted"], tos: ["approved"], guard: "subject.total < 10000" },
        { name: "reject", froms: ["submitted"], tos: ["rejected"] },
        { name: "fulfill", froms: ["approved"], tos: ["fulfilled"] },
    ],
    initialMarking: ["draft"],
};
\`\`\`

Two types are supported:
- **\`state_machine\`** — exactly one active place at a time (linear or branching flows)
- **\`workflow\`** — multiple places can be active simultaneously (Petri net with AND-split / AND-join)

## Using the Standalone Engine

The \`WorkflowEngine\` class manages a marking (the current state) directly:

\`\`\`typescript
import { WorkflowEngine } from "@symflow/core";

const engine = new WorkflowEngine(orderWorkflow);

// Check the current state
engine.getActivePlaces();        // ["draft"]
engine.getEnabledTransitions();  // [{ name: "submit", ... }]

// Check if a transition can fire
const result = engine.can("submit");
result.allowed;   // true
result.blockers;  // []

// Fire a transition
engine.apply("submit");
engine.getActivePlaces();  // ["submitted"]

// Reset to initial marking
engine.reset();
\`\`\`

If a transition cannot fire, \`apply()\` throws with a descriptive error. Use \`can()\` first to check safely — it returns structured blockers explaining why:

\`\`\`typescript
const result = engine.can("fulfill");
// { allowed: false, blockers: [{ code: "not_in_place", message: "..." }] }
\`\`\`

## Subject-Driven Workflows (Like Symfony)

For real applications you typically want the workflow state stored on your domain objects. The \`Workflow\` class mirrors Symfony's \`Workflow\` service — pass your entity to \`can()\` and \`apply()\`, and the marking is read from and written back to the subject automatically:

\`\`\`typescript
import { createWorkflow, propertyMarkingStore } from "@symflow/core";

interface Order {
    id: string;
    total: number;
    status: string;
}

const workflow = createWorkflow<Order>(orderWorkflow, {
    markingStore: propertyMarkingStore("status"),
});

const order: Order = { id: "ord_123", total: 5000, status: "draft" };

workflow.can(order, "submit");    // { allowed: true, blockers: [] }
workflow.apply(order, "submit");
console.log(order.status);        // "submitted"
\`\`\`

### Marking Stores

Two built-in marking stores match Symfony's options:

- **\`propertyMarkingStore("field")\`** — reads/writes a property directly (string for single place, string[] for parallel)
- **\`methodMarkingStore()\`** — calls \`subject.getMarking()\` / \`subject.setMarking()\`, configurable via options

## Guards

Guards are expressions attached to transitions. You provide an evaluator function that decides whether the expression passes:

\`\`\`typescript
const workflow = createWorkflow<Order>(orderWorkflow, {
    markingStore: propertyMarkingStore("status"),
    guardEvaluator: (expression, { subject }) => {
        if (expression === "subject.total < 10000") {
            return subject.total < 10000;
        }
        return true;
    },
});

const bigOrder: Order = { id: "ord_456", total: 50000, status: "submitted" };
workflow.can(bigOrder, "approve");
// { allowed: false, blockers: [{ code: "guard_blocked", message: "..." }] }
\`\`\`

The evaluator is fully pluggable — you can integrate role checks, feature flags, or any custom logic.

## Events

The engine fires events in the exact same order as Symfony's Workflow component:

1. **guard** — is the transition allowed?
2. **leave** — per source place, before tokens are removed
3. **transition** — after tokens are removed from source places
4. **enter** — per target place, before marking is updated
5. **entered** — after marking is updated
6. **completed** — after the full transition is done
7. **announce** — per newly enabled transition

\`\`\`typescript
workflow.on("entered", (event) => {
    console.log(\`Order \${event.subject.id} entered via "\${event.transition.name}"\`);
    console.log("New marking:", event.marking);
});

workflow.on("guard", (event) => {
    console.log(\`Checking guard for "\${event.transition.name}"\`);
});
\`\`\`

Each listener receives the event type, the transition, the current marking, the workflow name, and (for subject-driven workflows) the subject itself.

## Validation

Validate your definition before creating an engine to catch structural problems early:

\`\`\`typescript
import { validateDefinition } from "@symflow/core";

const result = validateDefinition(orderWorkflow);
if (!result.valid) {
    for (const error of result.errors) {
        console.error(\`[\${error.type}] \${error.message}\`);
    }
}
\`\`\`

The validator catches:
- Missing or invalid initial markings
- Transitions referencing non-existent places
- Unreachable places (BFS from initial marking)
- Dead transitions (source places are unreachable)
- Orphan places (no incoming or outgoing transitions)

## Parallel Workflows (Petri Net)

Switch to \`type: "workflow"\` to enable AND-split and AND-join patterns:

\`\`\`typescript
const reviewWorkflow: WorkflowDefinition = {
    name: "article_review",
    type: "workflow",
    places: [
        { name: "draft" },
        { name: "checking_content" },
        { name: "checking_spelling" },
        { name: "content_approved" },
        { name: "spelling_approved" },
        { name: "published" },
    ],
    transitions: [
        { name: "start_review", froms: ["draft"], tos: ["checking_content", "checking_spelling"] },
        { name: "approve_content", froms: ["checking_content"], tos: ["content_approved"] },
        { name: "approve_spelling", froms: ["checking_spelling"], tos: ["spelling_approved"] },
        { name: "publish", froms: ["content_approved", "spelling_approved"], tos: ["published"] },
    ],
    initialMarking: ["draft"],
};

const engine = new WorkflowEngine(reviewWorkflow);

engine.apply("start_review");
engine.getActivePlaces();  // ["checking_content", "checking_spelling"]

engine.apply("approve_content");
engine.can("publish");     // { allowed: false } — spelling not approved yet

engine.apply("approve_spelling");
engine.can("publish");     // { allowed: true } — both paths complete
engine.apply("publish");
engine.getActivePlaces();  // ["published"]
\`\`\`

## YAML / JSON Import and Export

The package also includes utilities to convert between workflow definitions and Symfony-compatible YAML or JSON:

\`\`\`typescript
import { exportYaml, importYaml } from "@symflow/core/yaml";
import { exportJson, importJson } from "@symflow/core/json";

// Export to Symfony YAML
const yaml = exportYaml(orderWorkflow);

// Import from existing Symfony config
const definition = importYaml(yamlString);
\`\`\`

## What This Means for You

If you are building a Node.js application that needs structured state management — order pipelines, approval flows, content publishing, onboarding funnels — you can now use the same workflow semantics as Symfony without running PHP.

Design your workflow visually in [SymFlowBuilder](https://symflowbuilder.com/editor), test it with the simulator, then use \`@symflow/core\` to run it in production.`,
    },
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
