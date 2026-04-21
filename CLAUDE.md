# CLAUDE.md — SymFlowBuilder

## Project Overview

Visual drag-and-drop builder for Symfony Workflow configurations. Design state machines graphically, export production-ready YAML.

- **Live site:** https://symflowbuilder.com
- **Repo:** https://github.com/vandetho/symflowbuilder
- **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · React Flow v12 · Zustand · Auth.js v5 · PostgreSQL · Prisma
- **Package manager:** pnpm (CI uses pnpm, deploy uses npm)

## Documentation

- [Design System](docs/design-system.md) — Dark glassmorphism theme, color tokens, glass utilities
- [Editor Architecture](docs/editor.md) — Canvas, simulator, YAML export/import
- [Workflow Engine](docs/workflow-engine.md) — TypeScript runtime, Symfony compatibility, events, guards
- [Entity Relationship Diagram](docs/erm.md) — Database schema
- [Architecture](docs/architecture.md) — System overview, deployment pipeline

---

## Coding Conventions

### UI Components — NEVER use native HTML elements

Every interactive or visual element must use a component from `/components/ui/` or Radix UI primitives. **This includes specialized inputs** — never use native `<input type="color">`, `<input type="checkbox">`, `<input type="range">`, `<input type="date">`, etc. Native HTML tags are only acceptable inside component implementation files (`/components/ui/*`).

```
❌ <button>        ✅ <Button>
❌ <input>         ✅ <Input>
❌ <input color>   ✅ <ColorInput>    (components/ui/color-input.tsx)
❌ <input checkbox>✅ <Checkbox>      (Radix-based)
❌ <select>        ✅ <Select>
❌ <a>             ✅ <Link>          (Next.js)
❌ <img>           ✅ <Image>         (Next.js)
❌ <dialog>        ✅ <Dialog>
```

Available in `/components/ui/`: `badge`, `button`, `card`, `checkbox` (Radix), `color-input` (react-color), `dialog`, `input`, `label`, `radio-group` (Radix), `select`, `separator`, `tooltip`.

If a component doesn't exist, build it in `/components/ui/` using Radix primitives — never fall back to bare HTML.

### Design System

- **Theme:** Dark glassmorphism — see [docs/design-system.md](docs/design-system.md)
- All surfaces use `.glass` / `.glass-sm` / `.glass-strong` utilities
- Text colors: `--text-primary`, `--text-secondary`, `--text-muted` — never hardcoded hex
- Border radius: `10px` (sm), `14px` (default), `18px` (panel), `24px` (modal)
- Font weights: 300-600 only, never 700+

### React Flow / Editor

- React Flow state is owned by Zustand (`stores/editor.ts`), not local component state
- Custom nodes always use `memo()` from React
- Three node types: `state`, `transition`, `subworkflow` — registered in `EditorCanvas.tsx`
- Sub-workflow nodes act as place nodes (can connect to/from transitions like state nodes)
- Simulator state lives in a separate store (`stores/simulator.ts`)
- Do NOT use `react-dnd`, `dnd-kit`, `mermaid.js`, or `d3` — React Flow covers everything
- Node data types: `StateNodeData`, `TransitionNodeData` (from `@symflow/core/react-flow`), `SubWorkflowNodeData` (from `types/subworkflow.ts`)
- When casting React Flow `node.data`, always use `as unknown as XNodeData` (double cast)

### YAML Export

- Use `~` for null (not `null`)
- Use flow arrays: `[a, b, c]` (not block style)
- `initial_marking`: string when single, array when multiple
- `places`: string array when no metadata, object when any place has metadata
- Preserve Symfony styling metadata: `bg_color`, `description`, `color`, `arrow_color`

### Mermaid Export

- Pure function in `@symflow/core` (`src/mermaid/export.ts`) — engine-level, same pattern as YAML/JSON/TS
- React Flow adapter: `exportGraphToMermaid()` from `@symflow/core/react-flow`
- No `mermaid.js` dependency — only generates text output (string building)
- Generates `stateDiagram-v2` syntax with `direction LR`
- Final states auto-detected (places with no outgoing transitions)
- Guards shown as `transition_name [guard_expression]` in edge labels

### Workflow Composition (Sub-Workflows)

- `SubWorkflowNodeData` type in `types/subworkflow.ts` with `workflowId` and `workflowName`
- Sub-workflow nodes reference other saved workflows by CUID
- Linking requires authentication (fetches from `GET /api/workflows`)
- In the graph, sub-workflow nodes behave like state/place nodes (same connection rules)
- Properties panel shows a workflow picker dropdown when a sub-workflow node is selected

### Database

- PostgreSQL only. No SQLite, no MySQL
- All Prisma models use `@id @default(cuid())`
- All foreign keys have explicit `onDelete` (`Cascade`, `Restrict`, or `SetNull`)
- Never use raw SQL — Prisma Client only
- `DATABASE_URL` from env var only

### General

- `'use client'` only where genuinely needed. Prefer RSC
- API routes return `Response.json()` with typed bodies
- Prisma queries in try/catch, never leak DB errors to client
- Zod schemas in `/lib/schemas/` — shared between client and API validation
- snake*case enforcement on state/transition names: `/^[a-z]a-z0-9*]\*$/`
- Debounce auto-save 2000ms using `use-debounce`
- Dates displayed as relative time (`date-fns/formatDistanceToNow`)
- All export functions are pure (no side effects): YAML, JSON, TypeScript, Mermaid

### Auth Model

- Editor (`/editor`) is always public — never in auth middleware matcher
- Auth protects `/dashboard/*` and `/api/workflows/*` only
- Guest drafts persist to localStorage, migrate to cloud on sign-in
- Providers: GitHub OAuth + Google OAuth via Auth.js v5
