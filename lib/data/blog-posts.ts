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
        slug: "symflow-laravel-showcases-expense-approval-and-issue-tracker",
        title: "Two Runnable symflow-laravel Showcases: Expense Approval and Issue Tracker",
        date: "2026-05-01",
        excerpt:
            "Two open-source Laravel apps that put symflow-laravel through its paces — Petri-net AND-splits and AND-joins, role-based guards, audit middleware, live Mermaid diagrams, and a one-click round-trip back to the SymFlowBuilder canvas.",
        tags: ["showcase", "laravel", "symflow-laravel", "petri-net"],
        content: `## Why showcases beat docs

The README for [\`symflow-laravel\`](https://github.com/vandetho/symflow-laravel) is solid, but a workflow engine only really clicks once you watch it move tokens around a real domain. So we built two: an **expense approval flow** with three reviewers running in parallel, and an **issue tracker** that requires both code review and QA to sign off before a merge. Both are runnable, both deploy free on Fly.io, and both round-trip cleanly with the visual canvas at SymFlowBuilder.

This post is a tour of what each one demonstrates, what they share, and where to look when you want to copy a pattern into your own Laravel app.

## The two apps at a glance

| | [\`symflow-laravel-expense-approval\`](https://github.com/vandetho/symflow-laravel-expense-approval) | [\`symflow-laravel-issue-tracker\`](https://github.com/vandetho/symflow-laravel-issue-tracker) |
|---|---|---|
| Domain | Expense reports through legal + finance + manager review | Mini Jira clone where issues need code review + QA |
| AND-split | \`submit\` fans \`draft\` → three review places | \`submit_for_review\` fans \`in_progress\` → two review places |
| AND-join | \`finalize\` consumes a token from each \`*_approved\` place | \`merge\` consumes \`code_approved\` AND \`qa_approved\` |
| Roles | employee, legal, finance, manager | developer, reviewer, qa |
| UI | Livewire 3 + Tailwind, kanban dashboard, Mermaid diagram | Same stack, same diagram component |
| Share canvas | [\`/w/86b557637fa5a7aa\`](https://symflowbuilder.com/w/86b557637fa5a7aa) | [\`/w/9e50940e6f0e0d02\`](https://symflowbuilder.com/w/9e50940e6f0e0d02) |

They are deliberately built on the same scaffolding so you can diff them and see what is engine concern vs. domain concern.

## Engine features they exercise

Both apps push the same set of \`symflow-laravel\` features. The features matter individually, but the point of having two showcases is that you can see each one applied to a different domain:

| Feature | What you can study |
|---|---|
| Petri-net AND-split | A single transition with one input place and several output places — \`submit\` in expenses, \`submit_for_review\` in issues |
| Petri-net AND-join | A single transition that requires tokens in *all* its input places before it can fire |
| Guards | A custom \`GuardEvaluatorInterface\` parses \`role:legal\` / \`role:reviewer\` strings against the authed user |
| \`GuardResult\` codes | Disabled buttons surface the exact reason — *"Requires the legal role."*, *"Requires the qa role."* — instead of just being grey |
| Middleware | \`AuditLogMiddleware\` writes \`(actor, transition, marking_before, marking_after, reason)\` for every fired transition |
| Event listeners | A \`WorkflowEventType::Entered\` listener logs each hop, attached in \`WorkflowServiceProvider::boot\` |
| Live Mermaid diagram | The standard \`MermaidExporter\` output gets \`classDef\` rules injected per active place — places light up in real time |

## App #1 — Expense approval

The shape of the workflow is what makes this one interesting:

\`\`\`
                             ┌─ legal_review ──── approve_legal ────┐
                             │   reject_legal ─┐                    ▼
draft ── submit ─────────────┼─ finance_review ── approve_finance ──┤
                             │   reject_finance ┐                   ▼
                             └─ manager_review ── approve_manager ──┘
                                                                    │
        ┌──────────── (any reject) ──────────────► rejected         ▼
        │                                                        finalize
        │                                                            │
        │                                                            ▼
        │                                                         approved
        │                                                            │
        │                                                            ▼
        └────────────────────────────────────────────────────────── pay ──► paid
\`\`\`

\`submit\` is an AND-split — one transition that produces tokens in three places at once, so legal, finance, and manager are reviewing the same expense in parallel. Each reviewer can approve or reject independently. \`finalize\` is an AND-join — it can only fire when all three \`*_approved\` places hold a token. That is **not** something you can model in a state machine; it requires Petri-net semantics, which is exactly why the workflow type in \`config/laraflow.php\` is \`workflow\` and not \`state_machine\`.

The \`pay\` transition is gated on \`role:manager\`. The \`approve_legal\` / \`approve_finance\` / \`approve_manager\` transitions are gated on the matching role. With the demo's role-switcher, you sign in as Hedy Lamarr (legal), approve the legal track, switch to Marie Curie (finance), approve finance, switch to Linus (manager), approve manager + finalize + pay. Watch the Mermaid diagram light up each marked place as you go.

## App #2 — Issue tracker

Smaller scope, same skeleton:

\`\`\`
                                              ┌─ code_review ── approve_code ── code_approved ─┐
open ── start_work ── in_progress ── submit ──┤                                                ├── merge ── merged
                                              │                                                │     [role:reviewer]
                                              └─ qa_review ──── approve_qa ──── qa_approved ───┘

  reject_code | reject_qa  →  closed
  close (from open)         →  closed
\`\`\`

Two parallel tracks instead of three, but the AND-split / AND-join pattern is the same. The interesting bit is what \`reject_code\` and \`reject_qa\` do — they short-circuit the parallel branch they are on and the issue ends up in \`closed\`, even if the *other* branch hasn't finished. That asymmetry between approval (must wait for both) and rejection (either one closes it) is a real-world concern that pure state machines paper over.

If you are debating whether to use \`state_machine\` or \`workflow\` in your own project, this is the cleanest example we have of when you need the Petri net.

## What both apps share

The skeleton you would lift into your own Laravel app lives in three files:

\`\`\`
app/
├── Workflow/
│   ├── RoleGuardEvaluator.php       // implements GuardEvaluatorInterface
│   ├── AuditLogMiddleware.php       // implements MiddlewareInterface
│   └── WorkflowReasonContext.php    // request-scoped reason store
└── Providers/
    └── WorkflowServiceProvider.php  // rebinds the registry
\`\`\`

The \`LaraflowServiceProvider\` that ships with the package registers a default \`WorkflowRegistryInterface\` singleton that builds \`Workflow\` instances *without* a guard evaluator. Both showcases override that binding so each workflow is built with the custom \`RoleGuardEvaluator\`, then attach \`AuditLogMiddleware\` and the entered-event listener in \`boot()\`. That registry override is the one piece of plumbing that is genuinely required — the rest is domain code.

\`RoleGuardEvaluator\` is small enough to read in a sitting. It looks at the configured guard string (\`role:legal\`, \`role:reviewer\`, etc.), compares it to the authed user's role, and returns a \`GuardResult\` that carries either a granted flag or a structured reason code (\`not_authenticated\`, \`wrong_role\`). The Livewire view reads that reason and displays it under disabled buttons — a nice quality-of-life win that you only get because the engine surfaces *why* a transition is blocked, not just whether.

## How a transition fires

Same in both apps:

1. Livewire button → \`{Model}Show::fire('approve_code')\`
2. \`Workflow::can()\` runs the guard
3. \`WorkflowReasonContext::set($reason)\` stashes the optional comment
4. \`Workflow::apply()\` walks the engine: guard → leave → transition → enter → entered → completed → announce, hitting middleware along the way
5. \`AuditLogMiddleware\` writes the audit record
6. The \`Entered\` listener logs the hop
7. \`PropertyMarkingStore::write\` updates the in-memory \`marking\` attribute
8. Livewire calls \`$model->save()\` to persist

That sequence is identical to what you would get from Symfony's stock workflow component. If you have a Symfony app today and you are migrating to Laravel — or vice versa — the workflow code travels.

## The visual round-trip

Both repos ship a \`workflow.yaml\` file that is the same workflow expressed in SymFlowBuilder's import format. So you can:

1. Open the public canvas — [expense approval](https://symflowbuilder.com/w/86b557637fa5a7aa) or [issue tracker](https://symflowbuilder.com/w/9e50940e6f0e0d02)
2. Drag a place around, add a transition, change a guard
3. Hit Export → **PHP (Laravel)**
4. Paste the output into the repo's \`config/laraflow.php\`

Or go the other way — edit the YAML in the repo, paste it into the [editor](/editor)'s Import dialog, and see your changes on the canvas. The point of the showcases is not just *here is a working app*; it is *here is a working app whose workflow definition you can edit visually and ship to production without translating anything by hand*.

## Run them yourself

\`\`\`bash
git clone https://github.com/vandetho/symflow-laravel.git              # sibling, required by the path repo
git clone https://github.com/vandetho/symflow-laravel-expense-approval.git
# or:
git clone https://github.com/vandetho/symflow-laravel-issue-tracker.git

cd symflow-laravel-expense-approval     # or the issue tracker
composer install
npm install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate:fresh --seed
npm run build
php artisan serve
\`\`\`

Open <http://localhost:8000>, use the role-switcher in the top-right to pick a seeded user, and click around. Both apps include a kanban dashboard and a per-record detail page with the live diagram.

## Deploy free on Fly.io

Both repos ship a FrankenPHP-based \`Dockerfile\` and a \`fly.toml\` configured for a small machine plus a 1 GB persistent volume mounted at \`/data\` for SQLite:

\`\`\`bash
brew install flyctl   # or curl -L https://fly.io/install.sh | sh
fly auth login

fly launch --no-deploy --copy-config
fly volumes create expense_data --size 1     # or issue_data, per repo
fly secrets set APP_KEY="base64:$(openssl rand -base64 32)"
fly deploy
\`\`\`

The Dockerfile rewrites \`composer.json\` at build time to swap the local **path repo** (used for development against \`../symflow-laravel\`) for the Packagist release of \`vandetho/symflow-laravel\`, so production deploys don't need the sibling clone. \`auto_stop_machines = "stop"\` keeps the demos idle when nobody is using them, so they consume effectively zero of Fly's free allowance — first request after sleep is ~2s slower while the machine boots.

## What to copy into your own app

If you only have time to lift one thing, lift \`AuditLogMiddleware\`. A persistent \`(actor, transition, before, after, reason, timestamp)\` log per fired transition is the single highest-leverage piece of workflow infrastructure you can have. It powers compliance reports, "who approved this and when" UIs, and the kind of "rewind the state" debugging that saves an afternoon every time you need it.

If you have time for two, take the \`RoleGuardEvaluator\` pattern next. Putting role checks in declarative config (\`role:legal\` strings on transitions in \`config/laraflow.php\`) instead of scattered \`if (auth()->user()->hasRole(...))\` calls in controllers means your authorization model is *visible* — readable from the workflow definition, exportable as a diagram, editable on a canvas.

## Links

- [\`symflow-laravel\`](https://github.com/vandetho/symflow-laravel) — the engine
- [\`symflow-laravel-expense-approval\`](https://github.com/vandetho/symflow-laravel-expense-approval) — multi-stage approval showcase
- [\`symflow-laravel-issue-tracker\`](https://github.com/vandetho/symflow-laravel-issue-tracker) — parallel-review showcase
- [Laravel integration guide](/laravel) — how the PHP export works
- [Editor](/editor) — design your own workflow visually`,
    },
    {
        slug: "walkthrough-publishing-an-article-scenario",
        title: "Walkthrough: Building the 'Publishing an Article' Scenario from Scratch",
        date: "2026-04-30",
        excerpt:
            "A step-by-step walkthrough of designing a playable workflow scenario in SymFlowBuilder — from drawing places and transitions, to writing patches, to attaching mock API calls, to embedding the result in your docs.",
        tags: ["tutorial", "simulator", "scenarios", "article", "walkthrough"],
        content: `## What we are building

A blog post going through editorial review. Five places — \`draft\`, \`pending_review\`, \`approved\`, \`rejected\`, \`published\` — and four transitions. By the end you will be able to click through the simulator and watch an article object evolve from a draft with no reviewer to a published post with a public URL, with the API calls a real backend would make plotted out beside it.

This is the workflow shipped as the **Publishing an article** template. We are going to rebuild it from scratch, slowly, so each piece earns its place.

## Step 1 — Draw the graph

Open the [editor](/editor) and drag five state nodes onto the canvas. Name them:

- \`draft\` — initial state
- \`pending_review\`
- \`approved\`
- \`rejected\`
- \`published\`

Mark \`draft\` as the initial state in the properties panel. This becomes \`initial_marking: draft\` in the exported YAML.

Now connect them with four transitions:

- \`submit_for_review\` — \`draft\` → \`pending_review\`
- \`approve\` — \`pending_review\` → \`approved\`
- \`reject\` — \`pending_review\` → \`rejected\`
- \`publish\` — \`approved\` → \`published\`

Set the workflow type to \`state_machine\` (the article is in exactly one place at a time) and set \`property: status\` on the marking store — that is the field name on your domain object that holds the current state.

At this point you have a working state machine. Click **Simulate** in the toolbar and you can already step through it. But every transition does the same thing: shift a token between abstract place names. That is not very interesting yet.

## Step 2 — Open the Scenario tab

The simulator sheet on the right has three tabs: **Steps**, **Scenario**, **Inspector**. Switch to **Scenario**.

This is where the article lives. The starting **subject** — the JSON object your workflow operates on — needs to describe what an article actually looks like in your system. Paste this in:

\`\`\`json
{
    "id": "art_1042",
    "title": "My first post",
    "body": "Hello, world.",
    "author": "alice",
    "reviewer": null,
    "reviewNotes": null,
    "publishedAt": null
}
\`\`\`

Notice there is no \`status\` field. You do not need one — because you set \`property: status\` on the workflow, the simulator automatically writes the current marking into \`subject.status\` after every step. State machines write a single string (\`"draft"\`); workflow-type Petri nets write an array of place names. This mirrors what Symfony's marking store does in production.

So at \`t=0\`, your live subject is actually:

\`\`\`json
{
    "id": "art_1042",
    "title": "My first post",
    "body": "Hello, world.",
    "author": "alice",
    "reviewer": null,
    "reviewNotes": null,
    "publishedAt": null,
    "status": "draft"
}
\`\`\`

That is what shows up in the Inspector.

## Step 3 — Write the patches

Below the subject editor is a card per transition. Each card has a **+ Patch** button and a **+ Request** button. Patches mutate the subject when the transition fires.

A patch has three pieces: an **op**, a **path**, and a **value**.

The op is one of three things:

- **set** — assign a value at the path. Replaces whatever was there. *You will use this almost every time.* Example: \`set reviewer = "bob"\` becomes \`subject.reviewer = "bob"\`.
- **push** — append to an array at the path. Creates the array if missing. Example: \`push history "submitted"\` becomes \`subject.history.push("submitted")\`.
- **del** — delete the field entirely. Example: \`del reviewer\` becomes \`delete subject.reviewer\`. Different from \`set reviewer = null\` — \`del\` removes the key from the object.

The path is a JSON-pointer-style string: \`field\`, \`nested.field\`, or \`items[0].name\` for arrays. The value is anything JSON. Strings, numbers, booleans, arrays, nested objects.

Now configure the four transitions:

### \`submit_for_review\`

The author submits the draft. A reviewer gets assigned.

\`\`\`text
+ Patch  set  reviewer  "bob"
\`\`\`

### \`approve\`

The reviewer signs off.

\`\`\`text
+ Patch  set  reviewNotes  "LGTM"
\`\`\`

### \`reject\`

The reviewer asks for changes. Notes get set, reviewer gets cleared so a new one can be assigned next round.

\`\`\`text
+ Patch  set  reviewNotes  "Needs rework"
+ Patch  set  reviewer     null
\`\`\`

(You could use \`del reviewer\` instead — same end-result if you do not care about the field existing.)

### \`publish\`

The article goes live. We stamp a publish timestamp.

\`\`\`text
+ Patch  set  publishedAt  "2026-04-30T10:00:00.000Z"
\`\`\`

## Step 4 — Walk through it

Switch back to **Steps**. Click \`submit_for_review\`. Two things happen:

1. The marking advances from \`draft\` to \`pending_review\`. The state node on the canvas glows green; the previous one dims.
2. The subject mutates: \`reviewer\` becomes \`"bob"\` and \`status\` becomes \`"pending_review"\`.

You can see the second part directly: open **Inspector** and you get a side-by-side diff of the subject before and after that step. Changed fields are highlighted. \`reviewer\` flips from \`null\` to \`"bob"\`. \`status\` flips from \`"draft"\` to \`"pending_review"\`.

Click \`approve\`, then \`publish\`. The article walks the happy path. If you go back and pick \`reject\` instead, you can watch the alternate branch play out — \`reviewNotes\` gets set to \`"Needs rework"\`, \`reviewer\` clears to \`null\`, the article ends up in \`rejected\`.

This is the moment scenarios stop being abstract. You are not reading a YAML file. You are watching an article move through a process.

## Step 5 — Add mock API calls

Most workflows are not just state machines — each transition typically corresponds to a real API call. \`submit_for_review\` posts to \`/api/articles/.../submit\`. \`publish\` posts to \`/api/articles/.../publish\`. Real listeners fire those requests in production.

In the simulator you can attach a *mock* request to each transition — a fake HTTP call that the Inspector will display as if it had fired. No real network goes out. It is a teaching surface, not a backend mock.

Click **+ Request** on the \`submit_for_review\` card. The editor expands inline:

- **Method**: \`POST\`
- **URL**: \`/api/articles/{{id}}/submit\`
- **Request body**:
  \`\`\`json
  { "reviewer": "bob" }
  \`\`\`
- **Status**: \`202\`
- **Response body**:
  \`\`\`json
  { "id": "{{id}}", "status": "pending_review" }
  \`\`\`

Notice the \`{{id}}\` interpolation. The simulator substitutes \`{{ subject.path }}\` references with the actual subject value at the moment the transition fires. So when you click \`submit_for_review\`, the Inspector shows \`POST /api/articles/art_1042/submit\` — the \`{{id}}\` gets resolved against the live subject. Substitution works in URLs and in JSON values.

Add similar requests for the other three transitions:

- \`approve\` → \`POST /api/articles/{{id}}/approve\` returning \`200 { "id": "{{id}}", "status": "approved" }\`
- \`reject\` → \`POST /api/articles/{{id}}/reject\` returning \`200 { "id": "{{id}}", "status": "rejected" }\`
- \`publish\` → \`POST /api/articles/{{id}}/publish\` returning \`200 { "id": "{{id}}", "status": "published", "url": "https://example.com/blog/{{id}}" }\`

Now walk the scenario again. Click any step in the history. The Inspector shows the subject diff *and* the resolved mock request — method, URL, body, status, response. The substituted values are frozen into the step's history at the moment of the transition; if you patch \`id\` later, the historical request keeps the value it had at the time.

## Step 6 — Save and share

When you stop the simulator (or it auto-saves), the scenario gets persisted to the workflow alongside the graph. Reload the page and the scenario comes back. Sign in and the scenario rides up to the cloud with the workflow.

Open the share dialog and make the workflow public. Anyone visiting \`/w/[shareId]\` can hit **Simulate** and walk through your scenario without signing in. They get the article-publishing experience exactly as you designed it.

For docs sites, add an iframe:

\`\`\`html
<iframe
  src="https://symflowbuilder.com/embed/<shareId>?play=1&minimap=0&branding=0"
  width="100%"
  height="560"
  style="border:0;border-radius:14px"
  loading="lazy"
  title="Publishing an article"
></iframe>
\`\`\`

The \`?play=1\` query param makes the embed start the simulator automatically — readers land on a runnable demo, not a static diagram.

## What is actually persisting

Under the hood, your scenario is a small JSON blob saved on the workflow:

\`\`\`json
{
    "subject": {
        "id": "art_1042",
        "title": "My first post",
        "...": "..."
    },
    "effects": {
        "submit_for_review": {
            "patches": [{ "op": "set", "path": "reviewer", "value": "bob" }],
            "mockRequest": {
                "method": "POST",
                "url": "/api/articles/{{id}}/submit",
                "body": { "reviewer": "bob" },
                "response": { "status": 202, "body": { "id": "{{id}}", "status": "pending_review" } }
            }
        },
        "approve": { "...": "..." },
        "reject":  { "...": "..." },
        "publish": { "...": "..." }
    }
}
\`\`\`

It lives in a separate \`simulationConfig\` column on the workflow row in PostgreSQL. **Crucially, it never enters the Symfony YAML export.** Your exported \`config/packages/workflow.yaml\` stays a clean Symfony workflow definition — places, transitions, guards, metadata. The scenario is a layer on top, scoped to the simulator.

That separation is intentional. Scenarios are for explaining a workflow to a teammate or stakeholder; the YAML is for running it in production. Different audiences, different artifacts.

## Why this is worth your time

Half of every workflow review I have ever sat in starts with someone drawing on a whiteboard while saying "okay so an article comes in..." and then mutating a fictional object verbally. Scenarios put that conversation into the tool. Your reviewer no longer needs to imagine the article — they can click through the actual state machine with real-looking data and see, at each step, what the article looks like and what API the system would call.

Hand someone a workflow link and they will read the diagram. Hand them a workflow link with a scenario and they will *use* it. That is the difference.

## Try it now

The full template is one click away if you do not want to build it from scratch:

1. Open the [editor](/editor)
2. Drag five places and four transitions matching the layout above
3. Click **Simulate**, switch to **Scenario**, click **Publishing an article**
4. Walk it through

Or fork the existing public scenario and modify it — change the reviewer to your own team's names, swap the URL prefix to your real backend, add a \`tags\` array and \`push\` to it on each transition. The whole point of scenarios is that the data fits *your* domain, not ours.`,
    },
    {
        slug: "playable-scenarios-mock-data-in-the-simulator",
        title: "Playable Scenarios: Walk Through a Workflow Like You're Publishing an Article",
        date: "2026-04-30",
        excerpt:
            "The simulator now carries a real subject — an article, an order, a document — through your workflow. Each transition can mutate the subject and show a mock API request. Click through it like an n8n run.",
        tags: ["feature", "simulator", "scenarios", "mock-http"],
        content: `## A simulator that only knew states was only half a simulator

The original SymFlowBuilder simulator could fire transitions, track active places, evaluate guards, and replay Symfony events. What it could *not* do was answer the most common question someone asks of a workflow diagram:

> "But what does the data look like at each step?"

A workflow is rarely just a graph. It is a graph plus a *thing* moving through it — an article on its way to publication, an order on its way to fulfillment, a moderation case waiting on a reviewer. Without that thing, the simulator was an abstract token-pusher. You could see that \`approved\` was reachable from \`submitted\`. You could not see what an *approved article* actually looked like.

This release fixes that. The simulator now carries a **subject** — the JSON object your workflow operates on — and lets each transition mutate it as it fires. You can also attach a fake HTTP request to any transition and see exactly what would have hit your backend. The result feels less like watching a state machine and more like clicking through an n8n run.

## The article-publishing example, end to end

Open the editor, build a state machine with five places — \`draft\`, \`pending_review\`, \`approved\`, \`rejected\`, \`published\` — and four transitions: \`submit_for_review\`, \`approve\`, \`reject\`, \`publish\`. Click **Simulate**.

The simulator panel now has three tabs: **Steps**, **Scenario**, and **Inspector**. Open **Scenario** and click the **Publishing an article** template card.

The starting subject lands on the page:

\`\`\`json
{
    "id": "art_1042",
    "title": "My first post",
    "body": "Hello, world.",
    "author": "alice",
    "reviewer": null,
    "reviewNotes": null,
    "publishedAt": null
}
\`\`\`

Below it, four transition cards. Each one has patches that mutate the subject and a mock HTTP request that *would* have fired:

\`\`\`text
submit_for_review
  patches:  set reviewer = "bob"
  request:  POST /api/articles/{{id}}/submit
            { "reviewer": "bob" }
            → 202 { "id": "{{id}}", "status": "pending_review" }
\`\`\`

Switch to **Steps**. Click \`submit_for_review\`. The article is now in \`pending_review\` and the reviewer is bob. Click \`approve\`. Then \`publish\`. The history list shows each step with a colored \`POST\` badge — visual proof that a request would have fired.

Click any history row. The panel jumps to **Inspector** and shows you, side by side, what the article looked like *before* and *after* that transition, with the changed fields highlighted. Below that: the resolved mock request — \`POST /api/articles/art_1042/publish\` (the \`{{id}}\` was substituted with the real subject value at the moment of the transition) and a \`200\` response with a real-looking publish URL.

That is the moment the feature clicks. You are not reading a YAML file or staring at boxes connected by arrows. You are watching an article get reviewed and published, with the API calls a real backend would make plotted out next to it.

## What you can declare per transition

Each transition can carry an optional **effect** with three pieces, all of them optional:

### 1. A description

A one-line note about what the transition represents. Shown in the Inspector at the top of the step.

### 2. Patches that mutate the subject

A list of \`{ op, path, value }\` operations applied to a deep-cloned subject when the transition fires. Three ops are supported:

- \`set\` — write a value at the path. Path syntax is \`field.nested.deeper\` or \`items[0].name\`.
- \`push\` — append a value to an array at the path.
- \`remove\` — delete a key or splice an array element.

Patches are interpreted client-side, in pure JavaScript, on a *cloned* subject. Nothing escapes the simulator. The original subject in the scenario is your "starting state" — re-running the simulator always rewinds to it.

### 3. A mock HTTP request

A pretend request the transition would have fired, with method, URL, optional body, and an optional canned response with status + body. URLs and JSON values support \`{{ subject.path }}\` interpolation, so:

\`\`\`text
POST /api/articles/{{id}}/publish
\`\`\`

…becomes \`POST /api/articles/art_1042/publish\` when fired. The substitution happens once, at the moment of the transition, using the subject *as it was* before the patches ran. That snapshot is frozen into the step's history — even if you patch \`id\` later, the historical request keeps the value it had at the time.

No actual network call is made. The mock request is a UI artifact. That is intentional: scenarios are for *teaching, reviewing, and demoing* a workflow, not for testing your backend.

## Three tabs, one mental model

- **Steps** is the playback surface. Active places, available transitions, history. Click history to jump to Inspector.
- **Scenario** is the design surface. Subject editor, per-transition patches and mock requests, template gallery. Edits persist with the workflow when you save.
- **Inspector** is the *what just happened* surface. Before/after subject diff for the selected step, with changed paths highlighted, plus the resolved mock request and response.

The footer carries the playback controls — **Step Back**, **Restart**, **Auto-play** with a configurable interval, and a stop. The header has tooltipped icons for restart and close.

## Persistence and sharing

A scenario is stored alongside the workflow in a new \`simulationConfig\` JSONB column. It travels with the workflow:

- Auto-save picks up scenario edits and writes them to the cloud (signed-in users) or localStorage (guests), debounced 2 seconds.
- The public share view at \`/w/[shareId]\` loads the scenario when the share owner has saved one. Anyone visiting the link can hit **Simulate** and walk the article through the workflow without an account.
- The iframe embed at \`/embed/[shareId]\` is now interactive. Drop a \`<iframe>\` into a docs page, add \`?play=1\`, and the scenario auto-starts. Readers click through it the same way they click through an n8n demo on the n8n website.

\`\`\`html
<iframe
  src="https://symflowbuilder.com/embed/abc123?play=1&minimap=0&branding=0"
  width="100%"
  height="560"
  style="border:0;border-radius:14px"
  loading="lazy"
  title="Article publishing flow"
></iframe>
\`\`\`

That iframe is a runnable demo of your workflow. Embed it in your README, your docs site, your design review document — wherever explaining the flow has so far required either a screenshot or an awkward "let me share my screen" moment.

## What this is *not*

A few deliberate non-goals, since people will ask:

- **Not a backend mock**. No request leaves the browser. Mock responses are static — no scripting, no JavaScript evaluation. If you need a real mock backend, [MSW](https://mswjs.io) is what you want; this is a teaching surface.
- **Not in the Symfony YAML export**. Scenarios are simulator-only and live in their own column. Your exported YAML stays a clean Symfony workflow definition that drops into \`config/packages/workflow.yaml\` without surprises.
- **Not a replacement for tests**. It is excellent for *showing* a flow. It is not a substitute for the integration tests that pin your guards in production.

## How it works under the hood

The data model is small enough to describe in one paragraph. \`SimulationConfig\` is \`{ subject, effects, templateId }\`. Each effect is \`{ description?, patches?, mockRequest? }\`. The simulator store carries the subject as live state, deep-clones it on initialization, and on each \`apply()\` runs the matching effect's patches against a clone — preserving the *before* snapshot on the step. The mock request is resolved with a tiny \`{{ path }}\` interpolator that walks the subject via JSON-pointer-style segments and substitutes string and JSON values. Pure functions, fully sandboxed, no \`eval\`.

The whole thing is built on the same [\`symflow\` engine](/blog/symflow-workflow-engine-for-nodejs) that powers Symfony-compatible runtime. The marking is still a Symfony marking. The events still fire in Symfony's order. The subject is a layer the simulator adds on top — the engine itself is unchanged.

## Try it

1. Open the [editor](/editor) and either build a workflow or load an existing one.
2. Click **Simulate**.
3. Switch to the **Scenario** tab and click **Publishing an article**.
4. Switch back to **Steps** and walk \`submit_for_review\` → \`approve\` → \`publish\`.
5. Click any history row.

If you have already shared a workflow publicly, open its \`/w/[shareId]\` page — your viewers can now play through whatever scenario you saved.

## What is next

The natural follow-ups are user-supplied scenarios via share links (\`?scenario=template-id\` to override the saved one), per-place initial-state branches (so you can simulate "what if this article *started* in pending_review?"), and a record-and-replay button that captures a real run from your app and lets you scrub through it. Open issues if any of those would help.

Until then: design the workflow, save the scenario, share the link, watch your reviewer click through it without ever opening a YAML file.`,
    },
    {
        slug: "embed-workflows-anywhere",
        title: "Embed SymFlowBuilder Workflows in Any README, Doc, or Wiki",
        date: "2026-04-28",
        excerpt:
            "Two new ways to put a live workflow next to the code it describes: a one-click Mermaid block for GitHub READMEs, and an iframe embed for docs sites that want pan, zoom, and minimap.",
        tags: ["feature", "share", "embed", "mermaid", "documentation"],
        content: `## Workflows belong next to the code they describe

A Symfony workflow is documentation as much as it is configuration. The state machine for an order, an article, a moderation queue — that diagram answers more onboarding questions than half a wiki page. The problem has always been getting the diagram *into* the wiki page.

This release adds two paths from a SymFlowBuilder workflow to wherever your team writes things down. Pick the one that matches the destination.

## Path 1 — Copy a Mermaid block (works in GitHub READMEs)

Open any workflow on the dashboard or on its public share page, click **Export**, switch to **Mermaid**, and hit **Copy**.

What lands on your clipboard is not raw \`stateDiagram-v2\` text — it is already wrapped in a fenced block:

\`\`\`text
\\\`\\\`\\\`mermaid
stateDiagram-v2
    direction LR
    [*] --> draft
    draft --> submitted: submit
    submitted --> approved: approve [is_granted("ROLE_ADMIN")]
    submitted --> rejected: reject
    approved --> [*]
\\\`\\\`\\\`
\`\`\`

Paste that block straight into a GitHub README, a GitLab MR description, an Obsidian note, a Notion page, or any other Markdown surface that renders Mermaid. No screenshots to keep in sync, no PNG drift, no broken alt text. The diagram updates the next time you re-export.

If you want the raw \`.mmd\` (for embedding into your own tooling), the **Download** button still gives you the unwrapped version. Copy = Markdown-ready, Download = engine-ready.

## Path 2 — Drop in an \`<iframe>\` (works in any docs site)

Mermaid is great for static diagrams. But when you want pan, zoom, a minimap, and the actual node styling from your workflow — the kind of thing readers can scroll around in — you need the real canvas.

Make any workflow public from the dashboard, open the share dialog, and you will now see an **Embed** snippet alongside the share link:

\`\`\`html
<iframe
  src="https://symflowbuilder.com/embed/abc123def456"
  width="100%"
  height="500"
  style="border:0;border-radius:14px"
  loading="lazy"
  title="SymFlowBuilder workflow"
></iframe>
\`\`\`

That route — \`/embed/[shareId]\` — renders the same React Flow canvas you use in the editor, but with the chrome stripped: no header bar, no export drawer, no config dialog. Just the diagram, fit to view on load, with an interactive minimap in the corner and a small "SymFlowBuilder" watermark linking back to the live share page.

Drop it into Docusaurus, MkDocs, Mintlify, Nextra, your Notion-as-docs setup, a Confluence page that allows iframes — anywhere HTML is allowed.

### Tweak it with query params

The embed accepts a couple of switches:

- \`?minimap=0\` — hide the minimap (useful for small embeds)
- \`?branding=0\` — hide the SymFlowBuilder watermark (please leave it on if you can — it is the only "credit" the project gets)

### How it is actually allowed to be framed

By default, modern browsers will refuse to render an iframe from another origin if the response sets \`X-Frame-Options\` or restrictive \`frame-ancestors\`. The new route does the opposite: it ships an explicit \`Content-Security-Policy: frame-ancestors *\` header, scoped only to \`/embed/*\`. The rest of the app stays as it was. You opt in to being framed by sharing a workflow; the rest of the surface area is untouched.

## Pick the right path

| You want… | Use |
| --- | --- |
| A diagram in a GitHub/GitLab README | **Mermaid copy** — renders natively, no iframe needed |
| A diagram in a Markdown file rendered by a tool that does not support Mermaid | **Mermaid copy** — pastes as a fenced block, downgrades gracefully to monospace text |
| Pan, zoom, minimap, real styling, in a docs site | **Iframe embed** — interactive, always up-to-date with the source workflow |
| A static PNG/SVG for a slide deck | Coming next — see the roadmap |

## What is next

The natural follow-up is an SVG snapshot endpoint — \`/api/w/[shareId]/svg\` — that returns a rendered diagram in any markdown renderer that does not support Mermaid or iframes. That one needs a small addition to the [\`symflow\`](https://www.npmjs.com/package/symflow) engine to keep export functions consistent (string-builder pattern alongside YAML, JSON, TypeScript, Mermaid, and DOT). It is on the roadmap; ping the [issue tracker](https://github.com/vandetho/symflowbuilder/issues) if you have a use case that needs it sooner.

In the meantime: design the workflow once, paste it everywhere it belongs.`,
    },
    {
        slug: "laravel-export-and-symflow-laravel",
        title: "Design Workflows Visually, Run Them in Laravel with symflow-laravel",
        date: "2026-04-24",
        excerpt:
            "SymFlowBuilder now exports symflow-laravel compatible PHP config files. Design your workflow on a canvas, click Export, and drop the file into your Laravel project.",
        tags: ["feature", "laravel", "export"],
        content: `## Laravel Joins the Export Family

SymFlowBuilder has always been about bridging the gap between visual design and production config. Today we are adding a new export target: **PHP for Laravel**.

Click the export dropdown, choose **PHP (Laravel)**, and you get a ready-to-use config file for [symflow-laravel](https://github.com/vandetho/symflow-laravel) — a Symfony-compatible workflow engine for Laravel.

## What is symflow-laravel?

symflow-laravel is a Laravel package that brings Symfony's Workflow component semantics to Laravel applications. It supports state machines, Petri nets, guards, events, validation, weighted arcs, and middleware.

Install it with Composer:

\`\`\`bash
composer require vandetho/symflow-laravel
\`\`\`

## What the Export Looks Like

Here is a real export from SymFlowBuilder for a simple order workflow:

\`\`\`php
<?php

use Laraflow\\Data\\Place;
use Laraflow\\Data\\Transition;
use Laraflow\\Data\\WorkflowDefinition;
use Laraflow\\Data\\WorkflowMeta;
use Laraflow\\Enums\\MarkingStoreType;
use Laraflow\\Enums\\WorkflowType;

return [
    'definition' => new WorkflowDefinition(
        name: 'order',
        type: WorkflowType::StateMachine,
        places: [
            new Place(name: 'draft'),
            new Place(name: 'submitted'),
            new Place(name: 'approved'),
        ],
        transitions: [
            new Transition(
                name: 'submit',
                froms: ['draft'],
                tos: ['submitted'],
            ),
            new Transition(
                name: 'approve',
                froms: ['submitted'],
                tos: ['approved'],
                guard: 'is_granted("ROLE_ADMIN")',
            ),
        ],
        initialMarking: ['draft'],
    ),
    'meta' => new WorkflowMeta(
        name: 'order',
        type: WorkflowType::StateMachine,
        markingStore: MarkingStoreType::Method,
        initialMarking: ['draft'],
        supports: 'App\\\\Models\\\\Order',
        property: 'status',
    ),
];
\`\`\`

No manual translation from YAML to PHP. No copy-pasting place names. The file is complete with imports, type-safe enums, and your guard expressions.

## What is Included

The PHP export covers everything you configure in the editor:

- **WorkflowDefinition** with places, transitions, and initial marking
- **Guard expressions** on transitions
- **WorkflowType enum** (StateMachine or Workflow)
- **MarkingStoreType enum** (Method or Property)
- **Supports** (your model class)
- **Weighted arcs** (consume and produce weights)
- **Metadata** on places and transitions

## Three Steps

1. Design your workflow in the [editor](/editor)
2. Click Export and choose **PHP (Laravel)**
3. Drop the file into your Laravel project's config directory

See the full [Laravel integration guide](/laravel) for details.`,
    },
    {
        slug: "graphviz-dot-export",
        title: "Export Workflows as Graphviz DOT Diagrams",
        date: "2026-04-24",
        excerpt:
            "SymFlowBuilder now exports Graphviz DOT notation. Generate publication-quality workflow diagrams for documentation, presentations, and CI pipelines.",
        tags: ["feature", "export", "graphviz"],
        content: `## Graphviz DOT Export

SymFlowBuilder now supports exporting your workflow as **Graphviz DOT** notation — the standard graph description language used by tools like Graphviz, dot, and dozens of renderers.

Click the export dropdown and choose **DOT (Graphviz)** to get the output.

## Why DOT?

DOT is a plain-text format that describes graphs. It is supported everywhere:

- **Documentation** — embed diagrams in Markdown, AsciiDoc, or LaTeX with Graphviz plugins
- **CI pipelines** — generate workflow diagrams automatically from your config
- **Presentations** — render publication-quality SVG or PDF diagrams
- **Code reviews** — include a rendered diagram in your PR description
- **Wiki pages** — GitHub, GitLab, and Confluence all support Graphviz rendering

## Example Output

A simple order workflow exports as:

\`\`\`
digraph "order" {
    rankdir=LR;
    node [shape=circle, style=filled, fillcolor="#2a2a3e", fontcolor="white", fontsize=10];
    edge [fontsize=9];

    "draft" [peripheries=2];
    "submitted";
    "approved";

    "draft" -> "submitted" [label="submit"];
    "submitted" -> "approved" [label="approve"];
}
\`\`\`

## Rendering

You can render DOT files with any Graphviz-compatible tool:

\`\`\`bash
# Command line
dot -Tsvg workflow.dot -o workflow.svg
dot -Tpng workflow.dot -o workflow.png

# Or use an online renderer
\`\`\`

## All Six Export Formats

With this addition, SymFlowBuilder now supports six export formats:

| Format | Extension | Use Case |
|--------|-----------|----------|
| YAML | .yaml | Symfony framework config |
| JSON | .json | symflow npm package |
| TypeScript | .ts | Type-safe Node.js projects |
| Mermaid | .mmd | Markdown-embedded diagrams |
| DOT | .dot | Graphviz rendering, CI pipelines |
| PHP | .php | Laravel with symflow-laravel |

All formats are accessible from the export dropdown or the preview drawer tabs.`,
    },
    {
        slug: "weighted-arcs-for-petri-nets",
        title: "Weighted Arcs: Advanced Petri Net Modeling in SymFlowBuilder",
        date: "2026-04-24",
        excerpt:
            "Configure consume and produce weights on transitions for advanced Petri net workflows. Weights display on the canvas and export to all formats automatically.",
        tags: ["feature", "editor", "petri-net"],
        content: `## What Are Weighted Arcs?

In standard Petri nets, each transition consumes one token from each input place and produces one token in each output place. **Weighted arcs** change this — a transition can consume or produce multiple tokens at once.

This is useful for modeling:

- **Batch processing** — a transition that requires 3 items to proceed
- **Resource pools** — consuming 2 resources and producing 1 result
- **Rate limiting** — transitions that consume tokens at different rates

## How to Use Them

1. Select a transition node on the canvas
2. In the properties panel, find the **Arc Weights** section
3. Set the **Consume** weight (tokens consumed from input places, default 1)
4. Set the **Produce** weight (tokens produced in output places, default 1)

## Canvas Display

When a transition has non-default weights, they display directly on the canvas label:

\`\`\`
submit (3:2)
\`\`\`

This means the transition consumes **3** tokens and produces **2** tokens. Default weights (1:1) are hidden to keep the canvas clean.

## Export Support

Weighted arcs export to all six formats automatically:

- **YAML** — uses Symfony's weight syntax
- **JSON** — includes \`consumeWeight\` and \`produceWeight\` fields
- **TypeScript** — typed weight properties
- **Mermaid** — weight annotation in edge labels
- **DOT** — weight labels on edges
- **PHP** — weight properties on Transition data objects

## Validation

The symflow engine validates weights automatically. Invalid weights (zero, negative, or non-integer) are caught before export.

## When to Use Weights

Most workflows do not need weighted arcs. They are relevant when you are modeling a true Petri net where token counts matter — resource allocation, manufacturing processes, or concurrent systems with capacity constraints.

If you are building a standard state machine or approval workflow, the default weight of 1 is correct and you can ignore this feature entirely.`,
    },
    {
        slug: "import-workflows-from-url",
        title: "Import Workflows from Any URL — YAML and JSON",
        date: "2026-04-20",
        excerpt:
            "Paste a GitHub raw URL, a Gist link, or any public YAML/JSON endpoint and SymFlowBuilder imports it instantly. No download, no copy-paste.",
        tags: ["feature", "import"],
        content: `## Import from URL

The editor now supports importing workflow configurations directly from a URL. Click the arrow next to the **Import** button and choose **From URL**.

Paste any public URL that serves a YAML or JSON workflow config:

- GitHub raw files: \`https://raw.githubusercontent.com/user/repo/main/config/workflows/order.yaml\`
- GitHub Gists
- Any HTTP endpoint returning Symfony workflow YAML or symflow JSON

The editor auto-detects the format based on the file extension or content. \`.json\` files and content starting with \`{\` are parsed as JSON; everything else is parsed as YAML.

## YAML and JSON File Import

The file import now accepts both formats too. Click **Import** (or use the dropdown) and pick a \`.yaml\`, \`.yml\`, or \`.json\` file from your machine.

### Symfony YAML

Standard Symfony workflow configs work out of the box, including \`!php/const\` and \`!php/enum\` tags:

\`\`\`yaml
framework:
    workflows:
        order:
            type: state_machine
            marking_store:
                type: method
                property: currentState
            supports: [App\\Entity\\Order]
            initial_marking: draft
            places: [draft, submitted, approved]
            transitions:
                submit:
                    from: draft
                    to: submitted
                approve:
                    from: submitted
                    to: approved
\`\`\`

### symflow JSON

The JSON format exported by SymFlowBuilder and the \`symflow\` npm package:

\`\`\`json
{
    "definition": {
        "name": "order",
        "type": "state_machine",
        "places": [
            { "name": "draft" },
            { "name": "submitted" },
            { "name": "approved" }
        ],
        "transitions": [
            { "name": "submit", "froms": ["draft"], "tos": ["submitted"] },
            { "name": "approve", "froms": ["submitted"], "tos": ["approved"] }
        ],
        "initialMarking": ["draft"]
    },
    "meta": {
        "name": "order",
        "type": "state_machine",
        "symfonyVersion": "8.0",
        "marking_store": "method",
        "property": "currentState",
        "initial_marking": ["draft"],
        "supports": "App\\\\Entity\\\\Order"
    }
}
\`\`\`

## Export Formats

While we were at it, we also added JSON and TypeScript export alongside the existing YAML export.

Click **Export** for YAML (the default), or use the dropdown arrow to choose:

- **YAML** — production-ready Symfony workflow config
- **JSON** — the \`{ definition, meta }\` format used by the \`symflow\` npm package
- **TypeScript** — a typed module you can import directly in your Node.js project

\`\`\`typescript
import type { WorkflowDefinition, WorkflowMeta } from "symflow";

export const orderDefinition: WorkflowDefinition = { ... };
export const orderMeta: WorkflowMeta = { ... };
\`\`\`

The preview drawer lets you switch between formats with tabs, copy to clipboard, or download as a file — all without closing the panel.

## Try It

1. Open the [editor](https://symflowbuilder.com/editor)
2. Click the arrow next to **Import**
3. Choose **From URL** and paste a GitHub raw URL to any Symfony workflow YAML
4. The workflow renders instantly with auto-layout`,
    },
    {
        slug: "symflowbuilder-design-symfony-workflows-visually",
        title: "SymFlowBuilder: Design Symfony Workflows Visually, Export Production-Ready YAML",
        date: "2026-04-20",
        excerpt:
            "A visual editor, a working simulator, and a standalone TypeScript engine — all for the state machines powering your Symfony apps. Here is what SymFlowBuilder is, why we built it, and how to try it.",
        tags: ["announcement", "symfony", "workflow", "editor"],
        content: `## The Problem With Writing Workflows by Hand

Symfony's Workflow component is one of the most elegant pieces of the framework. State machines for order processing, Petri nets for multi-branch approvals, guards, listeners, events — all declared in a single YAML file.

In practice, that YAML grows fast. By the time you have a dozen places, a handful of AND-splits, and guards sprinkled across transitions, you are debugging indentation instead of designing behaviour. Reviewers look at a pull request and cannot tell whether a transition is reachable. New team members spend an afternoon redrawing the diagram on a whiteboard to understand what the file is actually doing.

**SymFlowBuilder** is the tool I wanted every time I opened one of those files.

## What It Is

SymFlowBuilder is a visual, drag-and-drop builder for Symfony Workflow configurations. You sketch the state machine on a canvas, configure guards and metadata with a properties panel, and export YAML that drops straight into \`config/packages/workflow.yaml\`.

It is public-first. You do not need an account to design a workflow, import an existing YAML file, or export the result. Signing in (GitHub or Google) unlocks cloud save, versioning, shareable links, and a dashboard.

### What you get

- **Visual Editor** — drag-and-drop places and transitions on a React Flow canvas, with a Petri-net model that makes AND-splits, AND-joins, and OR patterns immediately obvious.
- **YAML Import / Export** — round-trip support for Symfony 5.4, 6.4, 7.4, and 8.0. Drop in an existing file, get an auto-laid-out graph. Export pristine YAML with flow arrays, scalar \`initial_marking\` when single, \`~\` for null.
- **Workflow Simulator** — step through transitions live. Toggle guards on and off, watch the Symfony event log in execution order, use auto-play or step-back to debug edge cases.
- **Workflow Validation** — detect unreachable states, dead transitions, and orphan places *before* you ship the YAML.
- **Guards, Listeners, Metadata** — all configurable from the panel, including Symfony styling keys like \`bg_color\`, \`description\`, \`color\`, and \`arrow_color\`.
- **Undo / Redo** — 50-step history with the shortcuts you already know.
- **Shareable Links** — read-only public URLs for design reviews.

## A Worked Example: An Order Workflow

Imagine a typical e-commerce order. Draft → submitted → approved or rejected → fulfilled. Guards reject orders over a threshold.

In SymFlowBuilder you drag five place nodes onto the canvas, connect them with transitions, and fill in the properties panel:

\`\`\`yaml
framework:
    workflows:
        order:
            type: state_machine
            marking_store:
                type: method
                property: currentState
            supports:
                - App\\\\Entity\\\\Order
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
\`\`\`

That is a real export. No reformatting, no stripped metadata, no surprises.

## The Simulator: Your New Favourite Debugging Tool

Here is where the tool earns its keep. Click **Simulate** in the toolbar and the canvas becomes a live runtime:

- Active places glow with a pulse animation.
- Enabled transitions highlight; disabled ones dim with a tooltip explaining why.
- Click a transition to fire it. The event log records \`workflow.guard\`, \`workflow.leave\`, \`workflow.transition\`, \`workflow.enter\`, \`workflow.entered\`, \`workflow.completed\` — in Symfony's exact order.
- Flip guard switches on and off to explore branches without editing the workflow.
- Step back through history or turn on auto-play.

I cannot count the number of times a reviewer asked "are you sure \`fulfill\` can't fire from \`rejected\`?" — and now I can just show them.

## Under the Hood: The Standalone \`symflow\` Engine

The simulator needed a real runtime, not a half-baked imitation. So the workflow engine is a standalone TypeScript package — [\`symflow\` on npm](https://www.npmjs.com/package/symflow) — that mirrors Symfony's Workflow component with zero framework dependencies.

\`\`\`bash
npm install symflow
\`\`\`

\`\`\`typescript
import { WorkflowEngine } from "symflow/engine";
import { importWorkflowYaml } from "symflow/yaml";

const { definition } = importWorkflowYaml(yamlString);
const engine = new WorkflowEngine(definition);

engine.getActivePlaces();       // ["draft"]
engine.getEnabledTransitions(); // [{ name: "submit", ... }]

engine.apply("submit");
engine.getActivePlaces();       // ["submitted"]
\`\`\`

It runs in Node.js, serverless functions, CLI tools, and the browser. It supports state machines and Petri nets, guards, the full Symfony event order, validation, pattern analysis, YAML / JSON / TypeScript import/export, \`!php/const\` parsing, and a subject-driven API with marking stores that mirrors Symfony's \`Workflow\` service.

Translation: you can prototype the backend of a Node.js service using the exact same workflow definition your Symfony app consumes. See [the engine announcement post](/blog/symflow-workflow-engine-for-nodejs) for the full API walkthrough.

## The Stack, Briefly

| Layer        | Choice                                                |
| ------------ | ----------------------------------------------------- |
| Framework    | Next.js 16 (App Router, React Server Components)      |
| Language     | TypeScript, strict                                    |
| Styling      | Tailwind CSS v4, dark glassmorphism design system     |
| Graph editor | React Flow v12 (\`@xyflow/react\`)                    |
| State        | Zustand — one store for the editor, one for the simulator |
| Auth         | Auth.js v5 — GitHub + Google OAuth                    |
| Database     | PostgreSQL + Prisma                                   |

The editor is owned by Zustand, not local component state. Custom nodes are memoised. YAML export is a pure function. Guest drafts persist to \`localStorage\` and migrate to the cloud on sign-in. These sound like small decisions; together they are why the canvas stays responsive with hundreds of nodes.

## Who This Is For

- **Symfony teams** who want design reviews that look like diagrams, not YAML diffs.
- **Architects and PMs** who need to communicate state flow to stakeholders who will never read a configuration file.
- **Node.js / TypeScript developers** who want Symfony-style workflows in services that do not speak PHP — the \`symflow\` package is for you.
- **Anyone onboarding** to an existing Symfony codebase: paste the YAML in, get a map.

## Try It

1. Open the [editor](/editor) — no sign-up required.
2. Drag a few places, connect them, and hit **Simulate**.
3. Export the YAML and drop it into your Symfony project.

If you have an existing workflow YAML, import it first and watch the auto-layout lay out a graph you have probably never seen before.

The project is MIT-licensed and open source on [GitHub](https://github.com/vandetho/symflowbuilder). Issues, PRs, and feedback are welcome.`,
    },
    {
        slug: "symflow-workflow-engine-for-nodejs",
        title: "Introducing symflow: A Symfony-Compatible Workflow Engine for Node.js",
        date: "2026-04-19",
        excerpt:
            "We built a TypeScript workflow engine that mirrors Symfony's Workflow component. Use it in any Node.js app to manage state machines, Petri nets, guards, and events — no PHP required.",
        tags: ["announcement", "engine", "nodejs"],
        content: `## Why We Built Our Own Engine

SymFlowBuilder started as a visual editor that exports YAML for Symfony. But we needed something to power the [simulator](/blog/introducing-workflow-simulator) — a runtime that could fire transitions, track markings, evaluate guards, and emit events in the exact same order Symfony does.

So we built \`symflow\`: a standalone TypeScript workflow engine with zero framework dependencies. It runs anywhere JavaScript runs — Node.js backends, serverless functions, CLI tools, or the browser.

## Installation

\`\`\`bash
npm install symflow
\`\`\`

The package ships ESM and CJS builds with full TypeScript types.

## Defining a Workflow

A workflow definition is a plain object — no decorators, no config files:

\`\`\`typescript
import type { WorkflowDefinition } from "symflow/engine";

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
import { WorkflowEngine } from "symflow/engine";

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
import { createWorkflow, propertyMarkingStore } from "symflow/subject";

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
import { validateDefinition } from "symflow/engine";

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
import { exportWorkflowYaml, importWorkflowYaml } from "symflow/yaml";
import { exportWorkflowJson, importWorkflowJson } from "symflow/json";

// Export to Symfony YAML
const yaml = exportYaml(orderWorkflow);

// Import from existing Symfony config
const definition = importYaml(yamlString);
\`\`\`

## Real-World Example: Symfony Article Workflow

Here is a real Symfony workflow YAML — the classic article review pipeline:

\`\`\`yaml
framework:
    workflows:
        article_workflow:
            type: 'workflow'
            marking_store:
                type: 'method'
                property: 'marking'
            supports:
                - App\\Entity\\Article
            initial_marking: NEW_ARTICLE
            places:
                NEW_ARTICLE:
                CHECKING_CONTENT:
                    metadata:
                        bg_color: ORANGE
                CONTENT_APPROVED:
                    metadata:
                        bg_color: DeepSkyBlue
                CHECKING_SPELLING:
                    metadata:
                        bg_color: ORANGE
                SPELLING_APPROVED:
                    metadata:
                        bg_color: DeepSkyBlue
                PUBLISHED:
                    metadata:
                        bg_color: Lime
            transitions:
                CREATE_ARTICLE:
                    from: [NEW_ARTICLE]
                    to: [CHECKING_CONTENT, CHECKING_SPELLING]
                APPROVE_CONTENT:
                    from: [CHECKING_CONTENT]
                    to: [CONTENT_APPROVED]
                APPROVE_SPELLING:
                    from: [CHECKING_SPELLING]
                    to: [SPELLING_APPROVED]
                PUBLISH:
                    from: [CONTENT_APPROVED, SPELLING_APPROVED]
                    to: [PUBLISHED]
\`\`\`

Import it directly with \`symflow\` and run the engine:

\`\`\`typescript
import { readFileSync } from "fs";
import { importWorkflowYaml } from "symflow/yaml";
import { WorkflowEngine } from "symflow/engine";

const yaml = readFileSync("article_workflow.yaml", "utf8");
const { definition } = importWorkflowYaml(yaml);
const engine = new WorkflowEngine(definition);

engine.apply("CREATE_ARTICLE");
engine.getActivePlaces();  // ["CHECKING_CONTENT", "CHECKING_SPELLING"]

engine.apply("APPROVE_CONTENT");
engine.apply("APPROVE_SPELLING");
engine.apply("PUBLISH");
engine.getActivePlaces();  // ["PUBLISHED"]
\`\`\`

\`CREATE_ARTICLE\` is an AND-split — it forks into two parallel checks. \`PUBLISH\` is an AND-join — both content and spelling must be approved before the article can go live.

## State Machine Example: Blog Publishing

Not every workflow needs parallel states. This blog publishing flow uses \`type: state_machine\` — exactly one state active at a time, with branching paths for approval and rejection.

The importer also handles Symfony's \`!php/const\` YAML tags — constants like \`!php/const App\\\\Workflow\\\\State\\\\BlogState::NEW_BLOG\` are resolved to \`"NEW_BLOG"\` automatically.

\`\`\`typescript
import { readFileSync } from "fs";
import { importWorkflowYaml } from "symflow/yaml";
import { WorkflowEngine } from "symflow/engine";

const yaml = readFileSync("blog_event.yaml", "utf8");
const { definition } = importWorkflowYaml(yaml);
const engine = new WorkflowEngine(definition);

// Happy path: create → check → review → publish
engine.apply("CREATE_BLOG");
engine.apply("VALID");
engine.apply("PUBLISH");
engine.getActivePlaces();  // ["PUBLISHED"]

// Unpublish and update cycle
engine.apply("NEED_REVIEW");
engine.apply("REJECT");
engine.apply("UPDATE");
engine.getActivePlaces();  // ["NEED_REVIEW"]
\`\`\`

From \`CHECKING_CONTENT\`, the blog can go to \`NEED_REVIEW\` (valid) or \`NEED_UPDATE\` (invalid). Published articles can be pulled back to review. Rejected articles go through an update cycle until approved.

## What This Means for You

If you are building a Node.js application that needs structured state management — order pipelines, approval flows, content publishing, onboarding funnels — you can now use the same workflow semantics as Symfony without running PHP.

Design your workflow visually in [SymFlowBuilder](https://symflowbuilder.com/editor), test it with the simulator, then use \`symflow\` to run it in production.`,
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
