# When `status = 'pending'` Stops Being Enough — Laravel + Petri Nets in Three Real Apps

![When status = 'pending' stops being enough — Petri nets bring clarity to complex Laravel workflows](/blog/laravel-petri-nets-hero.png)

_Why every Laravel app eventually outgrows the status enum, and what a real workflow engine looks like underneath._

---

You've written this `enum` before:

```php
enum OrderStatus: string {
    case Cart      = 'cart';
    case Pending   = 'pending';
    case Paid      = 'paid';
    case Shipped   = 'shipped';
    case Delivered = 'delivered';
    case Cancelled = 'cancelled';
}
```

It works. Until the order has to be paid _and_ shipped _and_ awaiting customs clearance, simultaneously. Until the customer requests a refund _after_ delivery, and "refunded" doesn't fit on the same axis as "delivered." Until your `if ($order->status === ...)` chain has 14 branches and three of them are commented `// FIXME: not really sure when this happens`.

The first time I hit this, I added a second status column. Then a third. Then a `metadata` JSON blob for "things that don't fit." Then I realized I was reinventing — badly — what Symfony's Workflow component had been doing for a decade.

This is the story of **[symflow-laravel](https://github.com/vandetho/symflow-laravel)** — a Symfony-compatible workflow engine for Laravel — and three runnable demos I built on it that turn into the three patterns every status field eventually becomes: parallel review, parallel check, and multiple concurrent lifecycles.

---

## What a workflow engine is, in 90 seconds

Forget orchestrators and queue runners. A workflow engine, in this sense, models **states and transitions** as first-class data structures:

- **Places** — the named states something can be in (`draft`, `code_review`, `qa_review`)
- **Transitions** — named operations that move tokens between places (`submit`, `approve_code`, `merge`)
- **Marking** — which place(s) currently hold a token

Two flavors:

- **State machine** — exactly one active place at a time. The classic on/off/standby radio.
- **Workflow (Petri net)** — multiple places can be active at once. The transition `submit_for_review` can put tokens in _both_ `code_review` and `qa_review`, and a later `merge` can require a token from each before firing.

That second flavor is where things get interesting, because it lets you say things your `status` field cannot: _"this issue is simultaneously waiting on a code review and a QA review."_ Your domain model gets to be honest.

`symflow-laravel` brings exactly that to Laravel — same place/transition/guard/event vocabulary as Symfony's own Workflow component, same YAML import format, but PSR-12 classes, Eloquent integration, and an Artisan toolbox.

```bash
composer require vandetho/symflow-laravel
```

---

## Demo 1: expense approval, parallel reviewers

The first place I'd reach for a Petri net in a real Laravel app is anything where **multiple parties have to sign off concurrently**. Expense approval is the canonical example: legal, finance, and management all need to weigh in, and there's no good reason to make them queue up.

The workflow:

```
                  ┌─ legal_review   ─── approve_legal   ─── legal_approved   ─┐
                  │                       [role:legal]                        │
draft ── submit ──┼─ finance_review ─── approve_finance ─── finance_approved ─┼── finalize ── approved ── pay ── paid
                  │                       [role:finance]                     │                       [role:finance]
                  └─ manager_review ─── approve_manager ─── manager_approved ─┘
                                          [role:manager]
```

`submit` is the **AND-split** — it puts a token in all three review places. `finalize` is the **AND-join** — it consumes one from each `*_approved` place and produces a single token in `approved`. In between, three roles approve in any order, in parallel.

Try expressing that with a `status` enum. You can't. You'd end up with something like `status_legal`, `status_finance`, `status_manager` — which is a Petri net with terrible bookkeeping.

In `symflow-laravel`, this is just config:

```php
'expense_approval' => [
    'type' => 'workflow',
    'marking_store' => ['type' => 'property', 'property' => 'marking'],
    'supports' => App\Models\ExpenseRequest::class,
    'initial_marking' => ['draft'],
    'transitions' => [
        'submit' => [
            'from' => ['draft'],
            'to'   => ['legal_review', 'finance_review', 'manager_review'],
        ],
        'approve_legal' => [
            'from'  => ['legal_review'],
            'to'    => ['legal_approved'],
            'guard' => 'role:legal',
        ],
        // ... etc
        'finalize' => [
            'from' => ['legal_approved', 'finance_approved', 'manager_approved'],
            'to'   => ['approved'],
        ],
    ],
],
```

The `guard: 'role:legal'` syntax is just a string — you write a `GuardEvaluator` class that interprets it however you want. In the demo, mine reads `auth()->user()->hasRole($x)` and returns a `GuardResult` with a structured reason code (`not_authenticated`, `wrong_role`, etc.) so the UI can show _why_ a button is disabled.

Try it: <https://github.com/vandetho/symflow-laravel-expense-approval>

---

## Demo 2: issue tracker, parallel review

If "expense approval" feels niche, the same pattern lives at the heart of every dev tool you've ever used. **Code review** and **QA review** run in parallel. Both have to pass before merge. If either rejects, the issue closes. That's a Petri net.

```
                                              ┌─ code_review ── approve_code ── code_approved ─┐
                                              │                 [role:reviewer]                │
open ── start_work ── in_progress ── submit ──┤                                                ├── merge ── merged
                                              │                                                │   [role:reviewer]
                                              └─ qa_review ──── approve_qa  ─── qa_approved ───┘
                                                                 [role:qa]
```

In a status enum world, you'd be tempted to invent ten dot-permuted statuses (`code_pending_qa_pending`, `code_approved_qa_pending`, `code_pending_qa_approved`, ...). With Petri-net semantics you just have _places_, and the marking is whichever places currently hold a token. The same `merge` transition fires when both `code_approved` and `qa_approved` have tokens — that's literally what AND-join means.

The repo: <https://github.com/vandetho/symflow-laravel-issue-tracker>

I built it with the same scaffolding pattern as the expense demo:

- A **`RoleGuardEvaluator`** that parses `role:X` and returns `GuardResult` objects
- An **`AuditLogMiddleware`** attached via `$workflow->use($mw)` — three lines of business logic, capturing actor + before-marking + after-marking on every transition
- A **`WorkflowServiceProvider`** that overrides the package's default registry to inject the guard and middleware
- A **Livewire detail page** that groups transition buttons into "Available now" / "Awaiting another actor" / "Not in this state" — so you never see a confusing wall of disabled buttons. Each button shows the exact reason it's disabled, lifted straight from the `GuardResult` or `TransitionBlocker`.

The "Awaiting another actor" group is the real win. Someone opens an issue waiting on QA and sees: _"approve_qa — Requires the qa role."_ No magic, no UI guessing — the engine told you.

---

## Demo 3: order lifecycle, _three_ concurrent workflows

The first two demos showed off Petri-net semantics. The third is the one that broke my mental model the first time I built it.

E-commerce orders have at least three independent lifecycles:

1. **The order itself** — `cart → placed → shipped → delivered → completed` (state machine)
2. **The payment** — `unpaid → authorized → captured → refunded` (state machine, can fail and retry)
3. **The fulfillment** — `queued → [picking ∥ packing] → ready` (Petri net — pickers and packers work in parallel)

These are _independent_. Payment can be `captured` while fulfillment is still `picking`. The order can be `delivered` and the payment `refunded` at the same time. Encoding all of this in a single `status` field would be insane — you'd need either a 50-case enum or some `state` flags array that fights you every time you query.

`symflow-laravel` lets you register **multiple workflows for the same model**, each with its own marking column:

```php
'workflows' => [
    'order_lifecycle' => [
        'type' => 'state_machine',
        'marking_store' => ['type' => 'property', 'property' => 'lifecycle'],
        'supports' => App\Models\Order::class,
        // ...
    ],
    'order_payment' => [
        'type' => 'state_machine',
        'marking_store' => ['type' => 'property', 'property' => 'payment'],
        'supports' => App\Models\Order::class,
        // ...
    ],
    'order_fulfillment' => [
        'type' => 'workflow', // Petri net
        'marking_store' => ['type' => 'property', 'property' => 'fulfillment_marking'],
        'supports' => App\Models\Order::class,
        // ...
    ],
],
```

Three columns on `orders`: `lifecycle` (string), `payment` (string), `fulfillment_marking` (JSON for the Petri net). Three independent state spaces. Firing transitions on any of them is just:

```php
$order->applyTransition('place');                     // default workflow
$order->applyTransition('authorize', 'order_payment');
$order->applyTransition('start_fulfillment', 'order_fulfillment'); // splits into picking + packing
```

The detail page in the demo renders **three diagrams stacked** — one per workflow, each highlighting its own active places. Below them, a single combined audit timeline color-codes every transition by which workflow fired it (sky for lifecycle, emerald for payment, orange for fulfillment), all written by the same `AuditLogMiddleware`. The trick: capture `$context->workflowName` from the middleware context so a single audit table works across all three.

The repo: <https://github.com/vandetho/symflow-laravel-order-lifecycle>

The interesting seeded order is **ORD-1002** — `lifecycle=placed`, `payment=authorized`, `fulfillment=picking,packed`. That last one is a Petri-net mid-flight: picker hasn't finished yet but the packer already prepared the box. You can't say that with one column.

---

## Designing workflows visually

Workflows-as-config is great for diffs and code review, but it's a lousy way to _think_ about a state machine. So the same author also built **[symflowbuilder.com](https://symflowbuilder.com)** — a free, drag-and-drop visual editor. React Flow canvas, places + transitions, exports the exact same Symfony YAML format `symflow-laravel` reads. No account needed.

Each of the three demos is published there:

- [Expense approval](https://symflowbuilder.com/w/9e50940e6f0e0d02)
- [Issue tracker](https://symflowbuilder.com/w/86b557637fa5a7aa)
- [Order lifecycle / payment / fulfillment](https://symflowbuilder.com/w/f9fb48bd55b047f3) (three separate canvases)

And here's the part I'm most excited about: the editor's `/embed/{shareId}` route accepts a `?marking=place_a,place_b` query param. The detail page in each demo embeds the canonical SymFlowBuilder canvas as an iframe and **rebuilds the URL per record**, so the canonical canvas lights up the _same_ places the host's local Mermaid render highlights:

```html
<iframe
    src="https://symflowbuilder.com/embed/86b557637fa5a7aa
  ?branding=0&minimap=0&scenario=0
  &marking=code_review,qa_review"
>
</iframe>
```

[Open the live embed in a new tab](https://symflowbuilder.com/embed/86b557637fa5a7aa?branding=0&minimap=0&scenario=0&marking=code_review,qa_review) — the issue tracker locked in `[code_review, qa_review]`, both places pulsing on the canonical canvas. Change the `?marking=` value in the URL bar and the highlights follow.

Every detail page now ships two diagrams per workflow: a fast local Mermaid render that the engine drives directly, and a live iframe of the canonical canvas that the host populates by URL. Same colors, same active places, two completely independent rendering paths. The whole loop closes.

---

## What it actually costs to ship this

The package is small enough to read in an afternoon. The three demos compose to roughly:

- ~5 files of "engine glue" per app: `RoleGuardEvaluator`, `AuditLogMiddleware`, `WorkflowReasonContext`, `WorkflowServiceProvider`, plus `WorkflowDescriptor` for the multi-workflow case
- Workflow configs in `config/laraflow.php` (or YAML if you prefer)
- A handful of Livewire components for the UI (`Dashboard`, `OrderShow`, `WorkflowSection`, `WorkflowDiagram`)

That's it. The Petri-net theory is in the package; you're just choosing places, transitions, and how to express your guards. Once written, you don't have to touch the engine again — adding a new state means adding one line of YAML, not a `switch` everywhere.

All three repos ship a `Dockerfile` (FrankenPHP) and `fly.toml` so deploy is one command on Fly.io's free allowance:

```bash
fly launch --no-deploy --copy-config
fly volumes create expense_data --size 1
fly secrets set APP_KEY="base64:$(openssl rand -base64 32)"
fly deploy
```

`auto_stop_machines = "stop"` puts each demo to sleep when nobody's looking, so a free Fly account can host all three concurrently.

---

## When you should reach for this

If your app has a `status` field and:

- Two reviewers/approvers/checkers can run in parallel — you want a Petri net.
- Different aspects of the same entity have different lifecycles — you want multiple workflows on one model.
- You need to answer "why didn't this transition fire?" in your UI — you want the structured `GuardResult` codes.
- You'd like to inspect "what happened to this thing?" in one query — middleware-driven audit beats sprinkled `Log::info` calls.

If your app has three statuses and one transition between them — you don't need this. A status enum is fine. There's no free lunch in adding an engine; you trade `if/else` for primitives. The win compounds when domain complexity does.

---

## Try them

- 📦 The package: <https://github.com/vandetho/symflow-laravel>
- 💸 Expense approval (parallel reviewers): <https://github.com/vandetho/symflow-laravel-expense-approval>
- 🐞 Issue tracker (code-review + QA): <https://github.com/vandetho/symflow-laravel-issue-tracker>
- 📦 Order lifecycle (three concurrent workflows): <https://github.com/vandetho/symflow-laravel-order-lifecycle>
- 🎨 Visual editor: <https://symflowbuilder.com>

Each demo has seven seeded records spanning every workflow state, a role switcher to flip between actors, and `npm run build && php artisan serve` boots in 30 seconds. Click through one for ten minutes. If your `status` field has been quietly accumulating workarounds, you'll know whether it's time to retire it.

---

_I write about Laravel internals, workflow engines, and the gap between docs and "but how do I actually wire this up." If that's your kind of problem, [follow on Medium](https://medium.com/@vandetho)._
