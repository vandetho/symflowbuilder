# SymFlowBuilder: Design Symfony Workflows Visually, Export Production-Ready YAML

*A visual editor, a working simulator, and a standalone TypeScript engine — all for the state machines powering your Symfony apps.*

---

## The Problem With Writing Workflows by Hand

Symfony's Workflow component is one of the most elegant pieces of the framework. State machines for order processing, Petri nets for multi-branch approvals, guards, listeners, events — all declared in a single YAML file.

In practice, that YAML grows fast. By the time you have a dozen places, a handful of AND-splits, and guards sprinkled across transitions, you are debugging indentation instead of designing behaviour. Reviewers look at a pull request and cannot tell whether a transition is reachable. New team members spend an afternoon redrawing the diagram on a whiteboard to understand what the file is actually doing.

**SymFlowBuilder** is the tool I wanted every time I opened one of those files.

> Live site: **[symflowbuilder.com](https://symflowbuilder.com)**
> Repo: **[github.com/vandetho/symflowbuilder](https://github.com/vandetho/symflowbuilder)**

---

## What It Is

SymFlowBuilder is a visual, drag-and-drop builder for Symfony Workflow configurations. You sketch the state machine on a canvas, configure guards and metadata with a properties panel, and export YAML that drops straight into `config/packages/workflow.yaml`.

It is public-first. You do not need an account to design a workflow, import an existing YAML file, or export the result. Signing in (GitHub or Google) unlocks cloud save, versioning, shareable links, and a dashboard.

### What you get

- **Visual Editor** — drag-and-drop places and transitions on a React Flow canvas, with a Petri-net model that makes AND-splits, AND-joins, and OR patterns immediately obvious.
- **YAML Import / Export** — round-trip support for Symfony 5.4, 6.4, 7.4, and 8.0. Drop in an existing file, get an auto-laid-out graph. Export pristine YAML with flow arrays, scalar `initial_marking` when single, `~` for null.
- **Workflow Simulator** — step through transitions live. Toggle guards on and off, watch the Symfony event log in execution order, use auto-play or step-back to debug edge cases.
- **Workflow Validation** — detect unreachable states, dead transitions, and orphan places *before* you ship the YAML.
- **Guards, Listeners, Metadata** — all configurable from the panel, including Symfony styling keys like `bg_color`, `description`, `color`, and `arrow_color`.
- **Undo / Redo** — 50-step history with the shortcuts you already know.
- **Shareable Links** — read-only public URLs for design reviews.

---

## A Worked Example: An Order Workflow

Imagine a typical e-commerce order. Draft → submitted → approved or rejected → fulfilled. Guards reject orders over a threshold.

In SymFlowBuilder you drag five place nodes onto the canvas, connect them with transitions, and fill in the properties panel:

```yaml
framework:
    workflows:
        order:
            type: state_machine
            marking_store:
                type: method
                property: currentState
            supports:
                - App\Entity\Order
            initial_marking: draft
            places: [draft, submitted, approved, rejected, fulfilled]
            transitions:
                submit:
                    from: draft
                    to:   submitted
                approve:
                    from: submitted
                    to:   approved
                    guard: "subject.getTotal() < 10000"
                reject:
                    from: submitted
                    to:   rejected
                fulfill:
                    from: approved
                    to:   fulfilled
```

That is a real export. No reformatting, no stripped metadata, no surprises.

---

## The Simulator: Your New Favourite Debugging Tool

Here is where the tool earns its keep. Click **Simulate** in the toolbar and the canvas becomes a live runtime:

- Active places glow with a pulse animation.
- Enabled transitions highlight; disabled ones dim with a tooltip explaining why.
- Click a transition to fire it. The event log records `workflow.guard`, `workflow.leave`, `workflow.transition`, `workflow.enter`, `workflow.entered`, `workflow.completed` — in Symfony's exact order.
- Flip guard switches on and off to explore branches without editing the workflow.
- Step back through history or turn on auto-play.

I cannot count the number of times a reviewer asked "are you sure `fulfill` can't fire from `rejected`?" — and now I can just show them.

---

## Under the Hood: The Standalone `symflow` Engine

The simulator needed a real runtime, not a half-baked imitation. So the workflow engine is a standalone TypeScript package — [`symflow` on npm](https://www.npmjs.com/package/symflow) — that mirrors Symfony's Workflow component with zero framework dependencies.

```bash
npm install symflow
```

```typescript
import { WorkflowEngine } from "symflow/engine";
import { importWorkflowYaml } from "symflow/yaml";

const { definition } = importWorkflowYaml(yamlString);
const engine = new WorkflowEngine(definition);

engine.getActivePlaces();       // ["draft"]
engine.getEnabledTransitions(); // [{ name: "submit", ... }]

engine.apply("submit");
engine.getActivePlaces();       // ["submitted"]
```

It runs in Node.js, serverless functions, CLI tools, and the browser. It supports state machines and Petri nets, guards, the full Symfony event order, validation, pattern analysis, YAML / JSON / TypeScript import/export, `!php/const` parsing, and a subject-driven API with marking stores that mirrors Symfony's `Workflow` service.

Translation: you can prototype the backend of a Node.js service using the exact same workflow definition your Symfony app consumes.

---

## The Stack, Briefly

| Layer        | Choice                                                |
| ------------ | ----------------------------------------------------- |
| Framework    | Next.js 16 (App Router, React Server Components)      |
| Language     | TypeScript, strict                                    |
| Styling      | Tailwind CSS v4, dark glassmorphism design system     |
| Graph editor | React Flow v12 (`@xyflow/react`)                      |
| State        | Zustand — one store for the editor, one for the simulator |
| Auth         | Auth.js v5 — GitHub + Google OAuth                    |
| Database     | PostgreSQL + Prisma                                   |

The editor is owned by Zustand, not local component state. Custom nodes are memoised. YAML export is a pure function. Guest drafts persist to `localStorage` and migrate to the cloud on sign-in. These sound like small decisions; together they are why the canvas stays responsive with hundreds of nodes.

---

## Who This Is For

- **Symfony teams** who want design reviews that look like diagrams, not YAML diffs.
- **Architects and PMs** who need to communicate state flow to stakeholders who will never read a configuration file.
- **Node.js / TypeScript developers** who want Symfony-style workflows in services that do not speak PHP — the `symflow` package is for you.
- **Anyone onboarding** to an existing Symfony codebase: paste the YAML in, get a map.

---

## Try It

1. Go to **[symflowbuilder.com/editor](https://symflowbuilder.com/editor)** — no sign-up required.
2. Drag a few places, connect them, and hit **Simulate**.
3. Export the YAML and drop it into your Symfony project.

If you have an existing workflow YAML, import it first and watch the auto-layout lay out a graph you have probably never seen before.

The project is MIT-licensed and open source on [GitHub](https://github.com/vandetho/symflowbuilder). Issues, PRs, and feedback are welcome.

---

*SymFlowBuilder is proudly sponsored by [SupportDock](https://supportdock.io) — feedback collection and FAQ management for your apps.*
