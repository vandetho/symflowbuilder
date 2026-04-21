<img src="public/logo.svg" alt="SymFlowBuilder" width="64" height="64" />

# SymFlowBuilder

A visual drag-and-drop builder for Symfony Workflow configurations.
Design state machines graphically, then export production-ready YAML, JSON, TypeScript, or Mermaid diagrams.

[Live Site](https://symflowbuilder.com) · [Issues](https://github.com/vandetho/symflowbuilder/issues) · [Contributing](#contributing)

## Features

- **Visual Editor** -- Drag-and-drop states and transitions on a React Flow canvas
- **Transition Nodes** -- Petri-net model with AND-split, AND-join, and OR patterns clearly visualized
- **Workflow Composition** -- Nest workflows by adding sub-workflow nodes that reference other saved workflows
- **Multi-Format Export** -- Production-ready YAML (Symfony 5.4–8.0), JSON, TypeScript, and Mermaid diagram output
- **YAML Import** -- Drop in existing YAML files to visualize and edit them with auto-layout
- **Workflow Simulator** -- Step through transitions visually with guard toggles, Symfony event log, auto-play, history, and step-back
- **Workflow Validation** -- Detect unreachable states, dead transitions, and orphan places before exporting
- **Workflow Engine** -- TypeScript runtime mirroring Symfony's Workflow component with marking, transitions, guards, and events. Available as a standalone npm package: [`symflow`](https://www.npmjs.com/package/symflow)
- **Guards & Metadata** -- Configure guard expressions, transition listeners, and metadata visually
- **Styling Metadata** -- Set `bg_color`, `description`, `color`, `arrow_color` with a built-in color picker
- **Undo / Redo** -- 50-step history with Cmd+Z / Cmd+Shift+Z
- **Shareable Links** -- Generate read-only public links to share workflow designs
- **No Account Required** -- The editor is fully public. Sign in to unlock cloud save, versioning, and sharing

## Tech Stack

| Layer        | Technology                                            |
| ------------ | ----------------------------------------------------- |
| Framework    | Next.js 16 (App Router, RSC)                          |
| Language     | TypeScript (strict)                                   |
| Styling      | Tailwind CSS v4, dark glassmorphism design system     |
| Graph Editor | React Flow v12 (`@xyflow/react`)                      |
| State        | Zustand                                               |
| Auth         | Auth.js v5 (GitHub + Google OAuth)                    |
| Database     | PostgreSQL + Prisma                                   |
| UI           | Custom glass-styled components (CVA + Radix patterns) |
| Fonts        | Sora + JetBrains Mono                                 |

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for PostgreSQL) or a PostgreSQL instance

### Setup

```bash
# Clone the repo
git clone https://github.com/vandetho/symflowbuilder.git
cd symflowbuilder

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your OAuth credentials and AUTH_SECRET

# Start PostgreSQL
docker compose up -d

# Generate Prisma client and run migrations
pnpm prisma:generate
pnpm --filter @symflowbuilder/db exec prisma migrate dev --name init

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

| Variable              | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `AUTH_SECRET`         | Random secret for Auth.js (`openssl rand -base64 32`) |
| `AUTH_GITHUB_ID`      | GitHub OAuth App client ID                            |
| `AUTH_GITHUB_SECRET`  | GitHub OAuth App client secret                        |
| `AUTH_GOOGLE_ID`      | Google OAuth client ID                                |
| `AUTH_GOOGLE_SECRET`  | Google OAuth client secret                            |
| `DATABASE_URL`        | PostgreSQL connection string                          |
| `NEXT_PUBLIC_APP_URL` | Public URL of the app                                 |

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format with Prettier
npm run format:check # Check Prettier formatting
npm run typecheck    # TypeScript type checking
```

## Project Structure

```
app/
  page.tsx                     # Landing page
  editor/page.tsx              # Visual editor (guest-accessible)
  editor/[id]/page.tsx         # Edit saved workflow
  dashboard/                   # Protected user workspace
  auth/                        # Sign in / error pages
  w/[shareId]/page.tsx         # Public shared workflow view
  api/workflows/               # CRUD + sharing + versioning API

components/
  editor/                      # Canvas, custom nodes (state, transition, subworkflow), edges, panels
  landing/                     # Hero graph, YAML preview
  ui/                          # Glass-styled UI primitives

stores/
  editor.ts                    # Zustand store (nodes, edges, undo/redo)
  simulator.ts                 # Simulator state (marking, history, auto-play)
lib/
  collab.ts                    # Optional collab module loader
  schemas/                     # Zod validation schemas
packages/
  db/                          # Prisma schema + client (@symflowbuilder/db)

# Workflow engine is the external `symflow` npm package
# See: https://github.com/vandetho/symflow
hooks/
  use-autosave.ts              # Debounced cloud/local save
  use-local-draft.ts           # localStorage persistence
  use-workflow.ts              # Workflow CRUD operations
```

## Authentication Model

The editor is **public-first**. No account is needed to use the full editor, export YAML, or import files.

Signing in (GitHub or Google) unlocks:

- Cloud save with auto-sync
- Workflow versioning
- Shareable read-only links
- Dashboard with workflow management

Guest drafts are saved to `localStorage` and automatically migrated to the cloud on sign-in.

## Standalone Engine: `symflow`

The workflow engine that powers SymFlowBuilder is published as a standalone npm package. Use it in any Node.js, serverless, or browser project — no PHP required.

```bash
npm install symflow
```

```ts
import { WorkflowEngine } from "symflow/engine";
import { importWorkflowYaml } from "symflow/yaml";

const { definition } = importWorkflowYaml(yamlString);
const engine = new WorkflowEngine(definition);

engine.apply("submit");
engine.getActivePlaces(); // ["submitted"]
```

Features: state machines, Petri nets, guards, Symfony event order, validation, pattern analysis, YAML/JSON/TypeScript/Mermaid import/export, `!php/const` support, subject-driven API with marking stores.

[npm](https://www.npmjs.com/package/symflow) · [GitHub](https://github.com/vandetho/symflow) · [Blog Post](/blog/symflow-workflow-engine-for-nodejs)

## Documentation

- [Entity Relationship Diagram](docs/erm.md) – Database schema with all models and relationships
- [Architecture](docs/architecture.md) -- System overview, editor data flow, auth model, and deployment pipeline
- [Design System](docs/design-system.md) -- Dark glassmorphism theme, color tokens, glass utilities
- [Editor Architecture](docs/editor.md) -- Canvas, simulator, YAML export/import
- [Workflow Engine](docs/workflow-engine.md) -- TypeScript runtime, Symfony compatibility, events, guards, validation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit with [conventional commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, etc.)
4. Push and open a Pull Request

CI runs ESLint, Prettier, TypeScript checks, and a production build on every PR.

## Roadmap

### Done

- [x] Visual editor with drag-and-drop states and transitions
- [x] YAML export for Symfony 5.4, 6.4, 7.4, and 8.0
- [x] YAML import with auto-layout
- [x] JSON and TypeScript export formats
- [x] Import from URL (GitHub raw, Gists, any HTTP endpoint)
- [x] Workflow simulator with step-through, auto-play, and history
- [x] Workflow validation (detect unreachable states, dead transitions)
- [x] Guards, listeners, and metadata on nodes/edges
- [x] Symfony styling metadata (bg_color, description, color, arrow_color)
- [x] Color picker component for styling metadata (react-color)
- [x] Undo / redo (50-step history)
- [x] GitHub + Google + Email/Password auth
- [x] Cloud save with auto-sync
- [x] Public sharing with read-only links
- [x] Explore page for community workflows
- [x] Keyboard shortcuts via TanStack Hotkeys
- [x] SEO with OG images, sitemap, and robots.txt
- [x] FAQ page and blog (PostgreSQL-backed)
- [x] Standalone workflow engine ([`symflow`](https://www.npmjs.com/package/symflow) npm package)
- [x] `!php/const` and `!php/enum` YAML tag support
- [x] Export to Mermaid diagram format (`stateDiagram-v2`)
- [x] Workflow composition (nested sub-workflow nodes)

### In Progress

- [ ] Real-time collaboration (multiplayer cursors via [`@symflowbuilder/collab`](https://github.com/vandetho/symflow-collab))
- [ ] Version history UI with restore

### Planned

- [ ] Workflow templates (e-commerce, CMS, approval flows)
- [ ] Export to PlantUML diagram format
- [ ] Symfony bundle generator (download a full bundle scaffold)
- [ ] Team workspaces with shared workflow libraries
- [ ] Workflow diff view (compare two versions side by side)
- [ ] Dark/light theme toggle
- [ ] Email invitations for collaborators
- [ ] Admin dashboard for blog post management

## Sponsors

This project is sponsored by:

|                                                                        | Sponsor                               | Description                                          |
| ---------------------------------------------------------------------- | ------------------------------------- | ---------------------------------------------------- |
| <img src="public/supportdock-logo.png" alt="SupportDock" width="24" /> | [SupportDock](https://supportdock.io) | Feedback collection and FAQ management for your apps |
| <img src="public/basilbook-logo.png" alt="BasilBook" width="24" />     | [BasilBook](https://basilbook.com)    | Restaurant accounting and inventory control platform |
| <img src="public/dailybrew-logo.svg" alt="DailyBrew" width="24" />     | [DailyBrew](https://dailybrew.work)   | Staff attendance and leave tracking for restaurants  |

## License

[MIT](LICENSE)
