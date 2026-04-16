<p align="center">
  <img src="public/logo.svg" alt="SymFlowBuilder" width="80" height="80" />
</p>

<h1 align="center">SymFlowBuilder</h1>

<p align="center">
  A visual drag-and-drop builder for Symfony Workflow configurations.<br/>
  Design state machines graphically, then export production-ready YAML.
</p>

<p align="center">
  <a href="https://symflowbuilder.com">Live Site</a> &middot;
  <a href="https://github.com/vandetho/symflowbuilder/issues">Issues</a> &middot;
  <a href="#contributing">Contributing</a>
</p>

## Features

- **Visual Editor** -- Drag-and-drop states and transitions on a React Flow canvas
- **YAML Export** -- Production-ready Symfony workflow YAML for versions 5.4, 6.4, 7.4, and 8.0
- **YAML Import** -- Drop in existing YAML files to visualize and edit them with auto-layout
- **Guards & Metadata** -- Configure guard expressions, transition listeners, and metadata visually
- **Undo / Redo** -- 50-step history with Cmd+Z / Cmd+Shift+Z
- **No Account Required** -- The editor is fully public. Sign in to unlock cloud save, versioning, and sharing
- **Shareable Links** -- Generate read-only public links to share workflow designs

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
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your OAuth credentials and AUTH_SECRET

# Start PostgreSQL
docker compose up -d

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev --name init

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
  editor/                      # Canvas, custom nodes, edges, panels
  landing/                     # Hero graph, YAML preview
  ui/                          # Glass-styled UI primitives

stores/editor.ts               # Zustand store (nodes, edges, undo/redo)
lib/
  yaml-export.ts               # Graph -> Symfony YAML
  yaml-import.ts               # Symfony YAML -> graph
  layout-engine.ts             # Topological auto-layout
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

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit with [conventional commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, etc.)
4. Push and open a Pull Request

CI runs ESLint, Prettier, TypeScript checks, and a production build on every PR.

## Sponsors

This project is sponsored by:

- [SupportDock](https://supportdock.io) -- feedback collection and FAQ management for your apps
- [BasilBook](https://basilbook.com) -- recipe sharing and meal planning
- [DailyBrew](https://dailybrew.work) -- staff attendance and leave tracking for restaurants

## License

[MIT](LICENSE)
