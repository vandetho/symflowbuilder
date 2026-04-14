# CLAUDE.md — SymFlowBuilder Rebuild

## Project Overview

SymFlowBuilder is a visual drag-and-drop builder for Symfony Workflow configurations. Developers design state machines graphically and export production-ready YAML that drops directly into any Symfony application.

**Core philosophy:** Zero friction for discovery. The editor is fully public — no account required. Authentication unlocks persistence, versioning, and sharing. A guest user loses nothing except the ability to save across sessions.

**Live site:** https://symflowbuilder.com  
**Repo:** https://github.com/vandetho/symflowbuilder  
**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · React Flow · Auth.js v5 · PostgreSQL · Prisma

---

## Tech Stack

### Frontend
- **Framework:** Next.js 15 with App Router and React Server Components
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Graph editor:** React Flow v12 (`@xyflow/react`)
- **UI primitives:** shadcn/ui (radix-based, unstyled, customised to design system)
- **State management:** Zustand (editor state, undo/redo history)
- **Forms:** React Hook Form + Zod
- **Animations:** Framer Motion (page transitions, node entrance)
- **Icons:** Lucide React
- **YAML:** `js-yaml` for parse/serialize

### Backend
- **Auth:** Auth.js v5 — GitHub OAuth + Google OAuth
- **Database:** PostgreSQL
- **ORM:** Prisma
- **API:** Next.js Route Handlers (no separate backend)

### Tooling
- **Package manager:** pnpm
- **Linting:** ESLint + Prettier
- **Git hooks:** Husky + lint-staged
- **Release:** release-please (already configured)

---

## Design System

### Aesthetic Direction
**Dark Glassmorphism.** Depth through translucency. Surfaces float above a rich gradient backdrop — every panel feels like frosted glass catching ambient light. The editor canvas is where focus lives; the UI recedes behind it, present but never competing.

Inspired by macOS Sonoma, Figma's dark mode, and the best of modern tool UIs — polished enough to feel premium, restrained enough to stay out of the way.

### Background
The page background is never a flat color — it is always a deep gradient mesh that the glass layers sit on top of.

```css
body {
  background: radial-gradient(ellipse at 20% 50%, #1a1040 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, #0d2040 0%, transparent 50%),
              radial-gradient(ellipse at 60% 80%, #1a0d30 0%, transparent 50%),
              #08080f;
  min-height: 100vh;
}
```

On the editor canvas, the React Flow background uses a subtle dot grid over the same gradient.

### Typography
```
Display / headings:  Sora (wght 300–600)
Code / monospace:    JetBrains Mono (wght 400–500)
Body:                Sora (wght 400)
```

Import in `app/layout.tsx`:
```tsx
import { Sora, JetBrains_Mono } from 'next/font/google'

const sora = Sora({ subsets: ['latin'], variable: '--font-sans' })
const jetbrainsMono = JetBrains_Mono({ weight: ['400', '500'], subsets: ['latin'], variable: '--font-mono' })
```

### Color Tokens (CSS variables in `globals.css`)
```css
:root {
  /* Glass surfaces — always use with backdrop-filter */
  --glass-base:         rgba(255, 255, 255, 0.04);
  --glass-surface:      rgba(255, 255, 255, 0.07);
  --glass-overlay:      rgba(255, 255, 255, 0.10);
  --glass-hover:        rgba(255, 255, 255, 0.13);
  --glass-active:       rgba(255, 255, 255, 0.16);

  /* Glass borders — luminous rim light effect */
  --glass-border:       rgba(255, 255, 255, 0.10);
  --glass-border-hover: rgba(255, 255, 255, 0.18);
  --glass-border-strong:rgba(255, 255, 255, 0.25);

  /* Backdrop blur values */
  --blur-sm:   blur(8px);
  --blur-md:   blur(16px);
  --blur-lg:   blur(24px);
  --blur-xl:   blur(40px);

  /* Text */
  --text-primary:   rgba(255, 255, 255, 0.92);
  --text-secondary: rgba(255, 255, 255, 0.55);
  --text-muted:     rgba(255, 255, 255, 0.30);
  --text-disabled:  rgba(255, 255, 255, 0.18);

  /* Accent — Electric Violet */
  --accent:           #7c6ff7;
  --accent-bright:    #9d94ff;
  --accent-dim:       rgba(124, 111, 247, 0.20);
  --accent-border:    rgba(124, 111, 247, 0.35);
  --accent-glow:      rgba(124, 111, 247, 0.15);

  /* Semantic */
  --success:          #34d399;
  --success-dim:      rgba(52, 211, 153, 0.15);
  --warning:          #fbbf24;
  --warning-dim:      rgba(251, 191, 36, 0.15);
  --danger:           #f87171;
  --danger-dim:       rgba(248, 113, 113, 0.15);
}
```

### Glass Mixin (copy this pattern everywhere)
```css
.glass {
  background: var(--glass-surface);
  backdrop-filter: var(--blur-md);
  -webkit-backdrop-filter: var(--blur-md);
  border: 1px solid var(--glass-border);
  border-radius: 14px;
}

.glass:hover {
  background: var(--glass-hover);
  border-color: var(--glass-border-hover);
}
```

As a Tailwind utility (add to `globals.css`):
```css
@layer utilities {
  .glass {
    background: var(--glass-surface);
    backdrop-filter: var(--blur-md);
    -webkit-backdrop-filter: var(--blur-md);
    border: 1px solid var(--glass-border);
  }
  .glass-sm {
    background: var(--glass-base);
    backdrop-filter: var(--blur-sm);
    -webkit-backdrop-filter: var(--blur-sm);
    border: 1px solid var(--glass-border);
  }
  .glass-strong {
    background: var(--glass-overlay);
    backdrop-filter: var(--blur-lg);
    -webkit-backdrop-filter: var(--blur-lg);
    border: 1px solid var(--glass-border-strong);
  }
}
```

### Component Rules
- **Every panel, card, sidebar, modal, and dropdown is a glass surface.** No solid-fill dark backgrounds.
- Border radius: `10px` (sm), `14px` (default), `18px` (card/panel), `24px` (modal)
- Borders: always `1px solid var(--glass-border)` — the rim light is essential to the glass effect
- Box shadows: `0 8px 32px rgba(0, 0, 0, 0.4)` on elevated surfaces (modals, dropdowns)
- Accent glow: buttons and active states use `box-shadow: 0 0 20px var(--accent-glow)`
- Focus rings: `outline: 1.5px solid var(--accent-bright); outline-offset: 2px`
- Buttons:
  - **Primary:** `background: linear-gradient(135deg, #7c6ff7, #9d94ff)` + subtle glow
  - **Ghost:** `glass-sm` + `--glass-border` border. On hover: `glass`
  - **Danger:** `background: var(--danger-dim)` + `border: 1px solid var(--danger)`
- Font weights: 300 (large display), 400 (body), 500 (label/emphasis), 600 (heading). Never 700+.
- Text on glass: always use `--text-primary` or `--text-secondary` — never hardcoded hex.
- Scrollbars: custom thin scrollbar with `--glass-border` track, `--accent-dim` thumb.

### Glass in shadcn/ui components
Override shadcn/ui defaults in `components/ui/` to apply glass:

```tsx
// components/ui/card.tsx — override default
<div className="glass rounded-[18px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
  {children}
</div>

// components/ui/dialog.tsx — modal overlay + glass panel
// Overlay: bg-black/50 backdrop-blur-sm
// Content: glass-strong rounded-[24px] shadow-[0_24px_64px_rgba(0,0,0,0.6)]

// components/ui/dropdown-menu.tsx
// Menu: glass rounded-[14px] shadow-[0_8px_32px_rgba(0,0,0,0.5)]
```

### React Flow editor canvas
- Canvas background: dot grid (`BackgroundVariant.Dots`) with `color: rgba(255,255,255,0.08)`
- Custom state nodes: glass card with accent-colored top border `border-t-2 border-[--accent]`
- Selected node: `border-color: var(--accent-bright)` + `box-shadow: 0 0 0 2px var(--accent-glow)`
- Edge lines: `stroke: rgba(255,255,255,0.25)`, selected: `stroke: var(--accent-bright)`
- MiniMap: glass panel, node fills use `--glass-overlay`
- Controls panel: glass-sm surface, buttons use ghost style

### Performance note
`backdrop-filter` is GPU-accelerated but expensive when overused. Rules:
- Max 4–5 simultaneously visible blur layers on screen at once
- The editor canvas itself has NO blur (it's the base layer, nothing behind it)
- Use `will-change: transform` on animated glass elements only
- Disable blur on reduced-motion: `@media (prefers-reduced-motion: reduce) { backdrop-filter: none; }`


---

## Authentication Model

### Public-first, auth-optional

| Feature | Guest | Authenticated |
|---|---|---|
| Full editor access | ✅ | ✅ |
| Export YAML | ✅ | ✅ |
| Import YAML | ✅ | ✅ |
| Workflow visualization | ✅ | ✅ |
| Save to localStorage | ✅ (auto) | ✅ (fallback) |
| Save to cloud | ❌ | ✅ |
| Dashboard / workflow list | ❌ | ✅ |
| Workflow versioning | ❌ | ✅ |
| Shareable read-only links | ❌ | ✅ |
| Team collaboration (future) | ❌ | ✅ |

### Guest persistence
- Editor state saved to `localStorage` as `sfb_draft_{uuid}` on every change (debounced 500ms)
- On editor load: restore from localStorage if key present
- On sign-in: migrate localStorage draft to cloud automatically

### Auth providers
- **GitHub OAuth** — primary, one click for most Symfony devs
- **Google OAuth** — broad fallback, covers non-GitHub users

### Auth.js v5 setup
```
/app/api/auth/[...nextauth]/route.ts   — Auth.js route handler
/auth.ts                                — Auth config (providers, callbacks)
/middleware.ts                          — Protect /dashboard/* routes only
```

`auth.ts`:
```ts
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
})
```

`middleware.ts`:
```ts
export { auth as middleware } from './auth'

export const config = {
  matcher: ['/dashboard/:path*', '/api/workflows/:path*']
}
```

The `/editor` route is **never** in the matcher — always public.

---

## Routes & Pages

```
/                          — Landing page (hero + features + CTA)
/editor                    — New workflow (guest or authenticated)
/editor/[id]               — Edit existing workflow (guest: localStorage, auth: cloud)
/w/[shareId]               — Public read-only shared workflow view
/dashboard                 — Protected: user's workflow list
/dashboard/workflows       — All workflows with filters
/dashboard/settings        — Account settings
/auth/signin               — Sign in page (GitHub + Google)
/auth/error                — Auth error page
```

---

## Data Models (Prisma)

```prisma
model User {
  id            String      @id @default(cuid())
  email         String?     @unique
  name          String?
  image         String?
  githubId      String?     @unique
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  workflows     Workflow[]
  accounts      Account[]
  sessions      Session[]
}

model Workflow {
  id            String      @id @default(cuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  name          String
  description   String?
  symfonyVersion String     @default("6.4")    // "5.4" | "6.4" | "7.0" | "7.1"
  type          String      @default("workflow") // "workflow" | "state_machine"
  graphJson     Json        // React Flow nodes + edges serialized
  yamlCache     String?     // Last exported YAML (cached)
  shareId       String?     @unique             // null = not shared
  isPublic      Boolean     @default(false)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  versions      WorkflowVersion[]
}

model WorkflowVersion {
  id            String      @id @default(cuid())
  workflowId    String
  workflow      Workflow    @relation(fields: [workflowId], references: [id], onDelete: Cascade)
  graphJson     Json
  yamlSnapshot  String
  label         String?     // Optional: "before adding guards"
  createdAt     DateTime    @default(now())
}
```

---

## Editor Architecture

### Library choices
- **Drag & drop + workflow display:** `@xyflow/react` (React Flow v12) — handles both interactive editing and read-only display. No secondary library needed.
- **Do NOT use** `react-dnd`, `dnd-kit`, `mermaid.js`, or `d3` for the graph — React Flow covers everything.

### File structure
```
/components/editor/
  EditorCanvas.tsx         — ReactFlow wrapper, wires store → canvas
  nodes/
    StateNode.tsx          — Custom glass node for Symfony places
    InitialNode.tsx        — Start marker node (filled circle)
    FinalNode.tsx          — End marker node (double circle)
  edges/
    TransitionEdge.tsx     — Custom animated edge with label + guard badge
  panels/
    EditorToolbar.tsx      — Top: workflow name, Symfony version, export, save
    PropertiesPanel.tsx    — Right: selected node/edge property editor
    EditorControls.tsx     — Bottom-left: undo/redo, fit view, minimap toggle
    MiniMapPanel.tsx       — Bottom-right: React Flow MiniMap, glass styled
  overlays/
    YamlDrawer.tsx         — Slide-in YAML preview with syntax highlighting
    ImportDropzone.tsx     — Drag-and-drop YAML file overlay on empty canvas
    NodePalette.tsx        — Left: draggable node types to add to canvas
```

### ReactFlow canvas setup (`EditorCanvas.tsx`)
```tsx
import ReactFlow, {
  Background, BackgroundVariant,
  MiniMap, Controls,
  useNodesState, useEdgesState,
  addEdge, Connection,
  ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

const nodeTypes = {
  state:   StateNode,
  initial: InitialNode,
  final:   FinalNode,
}

const edgeTypes = {
  transition: TransitionEdge,
}

export function EditorCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange } = useEditorStore()

  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(c: Connection) => onConnect(c)}
        onNodeDragStop={snapshot}           // undo snapshot after drag
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="rgba(255,255,255,0.07)"
        />
        <MiniMapPanel />
        <EditorControls />
        <NodePalette />
      </ReactFlow>
    </ReactFlowProvider>
  )
}
```

### Read-only mode (public `/w/[shareId]` view)
Same component, different props — just disable all interactions:
```tsx
<ReactFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  edgeTypes={edgeTypes}
  nodesDraggable={false}
  nodesConnectable={false}
  elementsSelectable={false}
  panOnDrag={true}           // still allow pan/zoom for navigation
  zoomOnScroll={true}
  fitView
/>
```

---

### Custom node: StateNode (`nodes/StateNode.tsx`)

**Visual anatomy:**
```
┌─────────────────────────────┐  ← glass card, 1px border, border-radius 14px
│  ●  draft              [✓]  │  ← accent dot + label + initial/final badge
│─────────────────────────────│  ← divider line
│  2 in · 3 out               │  ← connection count (muted, monospace)
└─────────────────────────────┘
     ○  ○  ○                     ← React Flow handles (top/bottom/left/right)
```

```tsx
import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'

interface StateNodeData {
  label: string
  isInitial: boolean
  isFinal: boolean
  metadata: Record<string, string>
}

export const StateNode = memo(({ data, selected }: NodeProps<StateNodeData>) => {
  return (
    <div className={`
      relative min-w-[140px] rounded-[14px]
      border transition-all duration-150
      ${selected
        ? 'border-[--accent-bright] shadow-[0_0_0_2px_var(--accent-glow)] bg-[--glass-overlay]'
        : 'border-[--glass-border] bg-[--glass-surface] hover:border-[--glass-border-hover]'
      }
    `}
    style={{ backdropFilter: 'var(--blur-md)' }}
    >
      {/* Top accent bar — only on initial nodes */}
      {data.isInitial && (
        <div className="absolute top-0 left-4 right-4 h-[2px] rounded-full bg-[--accent]" />
      )}

      {/* Header */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        <span className={`
          w-2 h-2 rounded-full flex-shrink-0
          ${data.isInitial ? 'bg-[--accent]' : 'bg-[rgba(255,255,255,0.25)]'}
        `} />
        <span className="text-[13px] font-medium text-[--text-primary] font-mono leading-none flex-1 truncate">
          {data.label}
        </span>
        {data.isFinal && (
          <span className="text-[10px] text-[--success] border border-[--success-dim] bg-[--success-dim] px-1.5 py-0.5 rounded-md font-mono">
            final
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-[rgba(255,255,255,0.07)]" />

      {/* Meta row */}
      <div className="px-3 py-2">
        {Object.keys(data.metadata).length > 0 ? (
          <span className="text-[10px] text-[--text-muted] font-mono">
            {Object.keys(data.metadata).length} metadata
          </span>
        ) : (
          <span className="text-[10px] text-[--text-disabled] font-mono">no metadata</span>
        )}
      </div>

      {/* React Flow handles — invisible, full-edge clickable */}
      <Handle type="target" position={Position.Left}  className="!bg-[--accent] !w-2 !h-2 !border-2 !border-[--bg-base]" />
      <Handle type="source" position={Position.Right} className="!bg-[--accent] !w-2 !h-2 !border-2 !border-[--bg-base]" />
      <Handle type="target" position={Position.Top}   className="!bg-[--accent] !w-2 !h-2 !border-2 !border-[--bg-base]" />
      <Handle type="source" position={Position.Bottom} className="!bg-[--accent] !w-2 !h-2 !border-2 !border-[--bg-base]" />
    </div>
  )
})

StateNode.displayName = 'StateNode'
```

### Custom node: InitialNode (`nodes/InitialNode.tsx`)
Filled circle, no label — represents Symfony's `initial_marking` origin point.
```tsx
export const InitialNode = memo(({ selected }: NodeProps) => (
  <div className={`
    w-8 h-8 rounded-full
    bg-[--accent] shadow-[0_0_16px_var(--accent-glow)]
    border-2 ${selected ? 'border-[--accent-bright]' : 'border-transparent'}
  `}>
    <Handle type="source" position={Position.Right} className="!bg-transparent !border-0" />
  </div>
))
```

### Custom node: FinalNode (`nodes/FinalNode.tsx`)
Double circle — matches Symfony's final place convention.
```tsx
export const FinalNode = memo(({ selected }: NodeProps) => (
  <div className={`
    w-9 h-9 rounded-full flex items-center justify-center
    border-2 ${selected ? 'border-[--accent-bright]' : 'border-[--text-secondary]'}
  `}>
    <div className="w-5 h-5 rounded-full bg-[--text-secondary]" />
    <Handle type="target" position={Position.Left} className="!bg-transparent !border-0" />
  </div>
))
```

---

### Custom edge: TransitionEdge (`edges/TransitionEdge.tsx`)

**Visual anatomy:**
```
 ●──────[ submit ]──────▶●
              ↓
         [guard] 🔒        ← only shown if guard exists
```

```tsx
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from '@xyflow/react'

interface TransitionEdgeData {
  label: string
  guard?: string
  listeners: TransitionListener[]
  metadata: Record<string, string>
}

export const TransitionEdge = memo(({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  data, selected,
}: EdgeProps<TransitionEdgeData>) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  })

  return (
    <>
      {/* Edge path */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={selected ? 2 : 1.5}
        stroke={selected ? 'var(--accent-bright)' : 'rgba(255,255,255,0.25)'}
        fill="none"
        strokeDasharray={data?.guard ? '6 3' : undefined}  // dashed if guarded
      />

      {/* Animated dot travelling along the edge */}
      <circle r="3" fill="var(--accent)" opacity="0.7">
        <animateMotion dur="2s" repeatCount="indefinite" rotate="auto">
          <mpath href={`#${id}`} />
        </animateMotion>
      </circle>

      {/* Label + guard badge */}
      <EdgeLabelRenderer>
        <div
          style={{ transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)` }}
          className="absolute pointer-events-all nopan"
        >
          {/* Transition name */}
          <div className={`
            px-2 py-1 rounded-[8px] text-[11px] font-mono font-medium
            border backdrop-blur-sm
            ${selected
              ? 'bg-[--accent-dim] border-[--accent-border] text-[--accent-bright]'
              : 'bg-[rgba(0,0,0,0.5)] border-[--glass-border] text-[--text-secondary]'
            }
          `}>
            {data?.label}
          </div>

          {/* Guard badge — shown below label if guard exists */}
          {data?.guard && (
            <div className="mt-1 flex items-center justify-center gap-1 px-2 py-0.5 rounded-[6px] text-[10px] font-mono bg-[--warning-dim] border border-[rgba(251,191,36,0.2)] text-[--warning]">
              <span>🔒</span>
              <span className="truncate max-w-[120px]">{data.guard}</span>
            </div>
          )}

          {/* Listeners indicator */}
          {data?.listeners?.length > 0 && (
            <div className="mt-1 flex justify-center">
              <span className="px-1.5 py-0.5 rounded-[5px] text-[9px] font-mono bg-[rgba(124,111,247,0.15)] border border-[--accent-border] text-[--accent-bright]">
                {data.listeners.length} listener{data.listeners.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  )
})

TransitionEdge.displayName = 'TransitionEdge'
```

---

### Node Palette (`panels/NodePalette.tsx`)
Left panel — drag node types onto the canvas to create them.

```tsx
// Draggable palette item
function PaletteItem({ type, label }: { type: string, label: string }) {
  const onDragStart = (e: DragEvent) => {
    e.dataTransfer.setData('application/reactflow', type)
    e.dataTransfer.effectAllowed = 'move'
  }
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="glass-sm px-3 py-2 rounded-[10px] text-[12px] font-mono text-[--text-secondary] cursor-grab active:cursor-grabbing border border-[--glass-border] hover:border-[--glass-border-hover] hover:text-[--text-primary]"
    >
      {label}
    </div>
  )
}

// Canvas drop handler — add to EditorCanvas onDrop
const onDrop = useCallback((e: DragEvent) => {
  e.preventDefault()
  const type = e.dataTransfer.getData('application/reactflow')
  const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })
  const newNode = {
    id: `${type}-${Date.now()}`,
    type,
    position,
    data: type === 'state'
      ? { label: 'new_state', isInitial: false, isFinal: false, metadata: {} }
      : {},
  }
  setNodes(nodes => [...nodes, newNode])
  snapshot()
}, [screenToFlowPosition, setNodes, snapshot])
```

---

### Zustand editor store
```ts
interface EditorStore {
  nodes: Node[]
  edges: Edge[]
  history: { past: Snapshot[], future: Snapshot[] }
  workflowMeta: {
    name: string
    symfonyVersion: string
    type: 'workflow' | 'state_machine'
    marking_store: 'method' | 'property'
    initial_marking: string[]
  }

  // React Flow handlers (passed directly to ReactFlow props)
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: (connection: Connection) => void

  // Editor actions
  updateNodeData: (id: string, data: Partial<StateNodeData>) => void
  updateEdgeData: (id: string, data: Partial<TransitionEdgeData>) => void
  undo: () => void
  redo: () => void
  snapshot: () => void
  loadFromJson: (json: GraphJson) => void
  exportYaml: () => string
  importYaml: (yaml: string) => void
}
```

### Undo/Redo
Snapshot on every meaningful change: node add/delete/move, edge add/delete, property edit. Max 50 entries.
```ts
snapshot: () => set(state => ({
  history: {
    past: [...state.history.past.slice(-49), { nodes: state.nodes, edges: state.edges }],
    future: [],
  }
})),

undo: () => set(state => {
  const prev = state.history.past.at(-1)
  if (!prev) return state
  return {
    nodes: prev.nodes,
    edges: prev.edges,
    history: {
      past: state.history.past.slice(0, -1),
      future: [{ nodes: state.nodes, edges: state.edges }, ...state.history.future],
    }
  }
}),
```

---

### Keyboard shortcuts
| Shortcut | Action |
|---|---|
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |
| `Cmd/Ctrl + S` | Save + snapshot version |
| `Cmd/Ctrl + E` | Open YAML export drawer |
| `Backspace / Delete` | Delete selected node or edge |
| `Cmd/Ctrl + A` | Select all |
| `Cmd/Ctrl + Shift + F` | Fit view |
| `Space + drag` | Pan canvas |
| `Escape` | Deselect / close panel |

---

## YAML Export

The exporter lives in `/lib/yaml-export.ts`. It takes the Zustand store state and returns a valid Symfony workflow YAML string.

### Symfony version compatibility matrix

| Feature | 5.4 | 6.x | 7.x |
|---|---|---|---|
| `marking_store.type: method` | ✅ | ✅ | ✅ |
| `metadata` on states/transitions | ✅ | ✅ | ✅ |
| `guard` expressions | ✅ | ✅ | ✅ |
| `from` as array | ✅ | ✅ | ✅ |
| Compound transitions | ❌ | ✅ | ✅ |

### Export output structure
```yaml
framework:
  workflows:
    order_lifecycle:
      type: workflow            # or state_machine
      marking_store:
        type: method
        property: currentState
      supports:
        - App\Entity\Order
      initial_marking: [draft]
      places:
        draft:
          metadata:
            color: '#6366f1'
        submitted: ~
        approved: ~
        rejected: ~
      transitions:
        submit:
          from: draft
          to: submitted
          guard: 'is_granted("ROLE_USER")'
          metadata:
            title: Submit for review
        approve:
          from: submitted
          to: approved
          guard: 'is_granted("ROLE_ADMIN")'
        reject:
          from: submitted
          to: rejected
```

---

## YAML Import

Parser in `/lib/yaml-import.ts`. Reads a Symfony workflow YAML and produces `{ nodes, edges, workflowMeta }` for the editor store.

Support both formats:
- Full `framework.workflows.{name}` structure
- Bare workflow object (just the inner config)

Auto-detect `type` (workflow vs state_machine) from the YAML. Position nodes automatically using a simple layered layout algorithm (left to right, states as columns).

---

## API Routes

```
GET    /api/workflows              — List user's workflows (auth required)
POST   /api/workflows              — Create new workflow (auth required)
GET    /api/workflows/[id]         — Get workflow (auth required, or public if isPublic)
PUT    /api/workflows/[id]         — Update workflow (auth required, owner only)
DELETE /api/workflows/[id]         — Delete workflow (auth required, owner only)
POST   /api/workflows/[id]/share   — Generate shareId (auth required)
DELETE /api/workflows/[id]/share   — Remove shareId / make private (auth required)
GET    /api/w/[shareId]            — Public read-only workflow (no auth)
POST   /api/workflows/[id]/versions — Create version snapshot
GET    /api/workflows/[id]/versions — List versions
```

All authenticated routes use:
```ts
const session = await auth()
if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
```

---

## Pages Detail

### `/auth/signin` — Sign in
- Two buttons: "Continue with GitHub" + "Continue with Google"
- No email/password form — OAuth only
- Redirects back to previous page after sign in (using `callbackUrl`)
- Hero: tagline + animated workflow graph preview
- 3 feature highlights: Visual builder / YAML export / Import & visualize
- "Start building" CTA → `/editor` (no auth prompt)
- Minimal nav: logo + Sign in link

### `/editor` — New workflow
- Full-screen React Flow canvas
- Guest: auto-saves to localStorage key `sfb_draft_new`
- Auth: shows "Save" button in toolbar (triggers POST /api/workflows)
- Upsell: when guest tries to share or hits 3+ exports, show inline nudge to sign in

### `/editor/[id]` — Edit saved workflow
- Load from cloud (auth) or localStorage
- Auto-save on change (debounced 2s) to PUT /api/workflows/[id]
- Version snapshot on manual save (Cmd+S)

### `/w/[shareId]` — Public shared view
- Read-only React Flow canvas (interactions disabled)
- Shows workflow name, Symfony version, state/transition count
- "Export YAML" button (allowed even without auth)
- "Open in editor" → copies to their own editor session
- No sign-in wall

### `/dashboard` — User workspace
- Stats row: total workflows, total exports, Symfony versions used
- Workflow grid: card per workflow (name, state count, last updated, status badge)
- New workflow button
- Activity feed: recent exports, edits, imports

---

## Key UX Behaviours

### Guest → Auth migration
When a guest signs in:
1. Check localStorage for any `sfb_draft_*` keys
2. If found, POST each to `/api/workflows` with `source: 'migration'`
3. Clear localStorage after successful migration
4. Redirect to `/dashboard` with toast: "Your draft workflows have been saved"

### Auto-save indicator
Toolbar shows save state:
- `●` grey — no unsaved changes
- `●` amber — saving...
- `●` green — saved (fades after 2s)
- `●` red — save failed (with retry button)

### Export flow
1. Click "Export YAML"
2. Drawer opens with syntax-highlighted YAML preview (`react-syntax-highlighter` or `shiki`)
3. Symfony version selector (5.4 / 6.4 / 7.0 / 7.1)
4. Copy to clipboard OR download as `.yaml` file
5. If authenticated: version snapshot created automatically on export

### Node property panel (right sidebar)
Clicking a state node shows:
- Name field (validates snake_case on blur)
- Initial / Final toggles
- Metadata key-value editor

Clicking a transition edge shows:
- Name field
- Guard expression input (with syntax hint)
- Listeners list (add/remove service + event pairs)
- Metadata key-value editor

### Import flow
- Drag-and-drop zone on the canvas (when empty) OR "Import YAML" button in toolbar
- Parses YAML, validates structure, renders graph
- Shows import summary toast: "Imported 6 states, 8 transitions"
- If parse fails: shows specific error with line number

---

## File Structure

```
/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Landing
│   ├── editor/
│   │   ├── page.tsx                # New workflow
│   │   └── [id]/page.tsx           # Edit existing
│   ├── w/[shareId]/page.tsx        # Public shared view
│   ├── dashboard/
│   │   ├── layout.tsx              # Protected layout
│   │   ├── page.tsx
│   │   ├── workflows/page.tsx
│   │   └── settings/page.tsx
    ├── auth/
│   │   ├── signin/page.tsx
│   │   └── error/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       └── workflows/
│           ├── route.ts
│           └── [id]/
│               ├── route.ts
│               ├── share/route.ts
│               └── versions/route.ts
├── components/
│   ├── editor/                     # All editor components
│   ├── dashboard/                  # Dashboard UI components
│   ├── landing/                    # Landing page sections
│   └── ui/                         # shadcn/ui primitives
├── lib/
│   ├── yaml-export.ts
│   ├── yaml-import.ts
│   ├── layout-engine.ts            # Auto-position nodes on import
│   └── prisma.ts
├── stores/
│   └── editor.ts                   # Zustand editor store
├── hooks/
│   ├── use-autosave.ts
│   ├── use-local-draft.ts
│   └── use-workflow.ts
├── types/
│   └── workflow.ts
├── auth.ts                         # Auth.js config
├── middleware.ts
├── prisma/
│   └── schema.prisma
└── CLAUDE.md
```

---

## Environment Variables

```env
# Auth
AUTH_SECRET=                        # openssl rand -base64 32
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# Database
DATABASE_URL=

# App
NEXT_PUBLIC_APP_URL=https://symflowbuilder.com
```

---

## Build Order

Work in this sequence to ship incrementally:

1. **Project scaffold** — Next.js 15 + Tailwind + TypeScript + Prisma + Auth.js setup, deploy to Vercel, connect DB
2. **Design system** — globals.css tokens, shadcn/ui customised to dark theme, base components (Button, Input, Card, Badge)
3. **Editor v1 (guest)** — React Flow canvas, custom state nodes, transition edges, toolbar, localStorage persistence
4. **YAML export** — exporter for Symfony 5.4 / 6.4 / 7.x, YAML preview drawer, download/copy
5. **YAML import** — parser, auto-layout engine, import flow
6. **Undo/redo** — Zustand history middleware, keyboard shortcuts (Cmd+Z / Cmd+Shift+Z)
7. **Auth** — GitHub OAuth + Google OAuth, sign in page, session handling, guest→auth migration
8. **Dashboard** — workflow list, stats, activity feed, new/edit/delete
9. **Cloud save** — auto-save, version snapshots, save indicator
10. **Sharing** — shareId generation, public `/w/[shareId]` view
11. **Landing page** — hero, features, polished CTA
12. **Editor polish** — node sidebar panels, form builder, metadata editor, minimap, keyboard shortcuts reference
13. **Property panels** — guard expressions, listeners, metadata on nodes/edges
14. **Versions UI** — version history drawer, restore from version

---

## Coding Conventions

### UI Components — NEVER use native HTML elements directly
Every interactive or visual element must use a shadcn/ui component or a custom component built on Radix UI primitives. Native HTML tags are only acceptable inside component implementation files themselves, never in page or feature code.

```
❌ <button onClick={…}>Save</button>
✅ <Button onClick={…}>Save</Button>

❌ <input type="text" value={…} onChange={…} />
✅ <Input value={…} onChange={…} />

❌ <select>…</select>
✅ <Select>…</Select>

❌ <a href="/dashboard">Dashboard</a>
✅ <Link href="/dashboard">Dashboard</Link>   {/* Next.js Link */}

❌ <img src={…} alt={…} />
✅ <Image src={…} alt={…} width={…} height={…} />   {/* Next.js Image */}

❌ <dialog>…</dialog>
✅ <Dialog>…</Dialog>   {/* shadcn/ui Dialog */}
```

Available shadcn/ui components to install as needed: `button`, `input`, `textarea`, `select`, `checkbox`, `switch`, `label`, `badge`, `card`, `dialog`, `drawer`, `dropdown-menu`, `popover`, `tooltip`, `tabs`, `separator`, `scroll-area`, `avatar`, `toast` (via Sonner), `skeleton`.

If a required component does not exist in shadcn/ui, build a custom component in `/components/ui/` using Radix UI primitives directly — never fall back to a bare HTML element.

### Database — PostgreSQL only
- Use PostgreSQL exclusively. No SQLite, no MySQL.
- All Prisma models use `@id @default(cuid())` for primary keys
- All timestamps use `DateTime` with `@default(now())` and `@updatedAt` where appropriate
- Use `Json` type for flexible graph data (`graphJson`, `yamlCache`)
- All foreign keys must have explicit `onDelete` behaviour defined (`Cascade`, `Restrict`, or `SetNull`)
- Never use raw SQL queries — use Prisma Client exclusively
- Database URL must come from `DATABASE_URL` env var only
- Run `prisma migrate dev` for local schema changes, `prisma migrate deploy` in CI/CD

### General
- Use `'use client'` only where genuinely needed (interactive components). Prefer RSC.
- All API route handlers return `Response.json()` with typed response bodies
- Prisma queries wrapped in try/catch, never leak DB errors to client
- Zod schemas in `/lib/schemas/` — shared between client validation and API validation
- React Flow state is owned by Zustand, not local component state
- Custom nodes always use `memo()` from React
- YAML export is pure function (no side effects) — easy to unit test
- snake_case enforcement on state/transition names: validate with `/^[a-z][a-z0-9_]*$/`
- Debounce auto-save 2000ms using `use-debounce` package
- All dates displayed as relative time (`date-fns/formatDistanceToNow`)