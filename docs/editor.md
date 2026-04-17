# Editor Architecture

## Library Choices

- **Graph editor:** `@xyflow/react` (React Flow v12) — handles editing and read-only display
- **Do NOT use** `react-dnd`, `dnd-kit`, `mermaid.js`, or `d3` for the graph
- **State:** Zustand (`stores/editor.ts`) owns all React Flow state
- **Simulator:** Separate Zustand store (`stores/simulator.ts`)

## File Structure

```
components/editor/
  EditorCanvas.tsx         — ReactFlow wrapper, wires stores to canvas
  nodes/
    StateNode.tsx          — Custom glass node for Symfony places
  edges/
    TransitionEdge.tsx     — Custom animated edge with label + guard badge
  panels/
    EditorToolbar.tsx      — Top: name, version, export, save, simulate, share
    PropertiesPanel.tsx    — Right: selected node/edge property editor
    EditorControls.tsx     — Bottom-left: undo/redo, fit view
    SimulatorPanel.tsx     — Bottom-center: simulation controls + history
    NodePalette.tsx        — Top-left: draggable node types
    ContextMenu.tsx        — Right-click context menu
```

## Workflow Engine (`lib/engine/`)

TypeScript runtime engine mirroring Symfony's Workflow component:

- **types.ts** — Marking, Place, Transition, WorkflowDefinition, events
- **workflow-engine.ts** — `WorkflowEngine` class: marking, transitions, guards, events
- **definition-builder.ts** — Converts React Flow graph to WorkflowDefinition
- **validator.ts** — Detects unreachable places, dead transitions, orphans

## Simulator

Toggle "Simulate" in toolbar to enter play mode:

- Active places glow green with pulse animation
- Enabled transitions highlighted, disabled dimmed
- Click transitions to step through the workflow
- History log with step-back support
- Auto-play mode with configurable speed
- Canvas becomes read-only during simulation

## YAML Export (`lib/yaml-export.ts`)

- Supports Symfony 5.4, 6.4, 7.4, 8.0
- Uses `~` for null places, flow arrays `[a, b]`, scalar `initial_marking` when single
- Preserves all metadata including styling keys (bg_color, description, color, arrow_color)

## YAML Import (`lib/yaml-import.ts`)

- Accepts `framework.workflows.{name}` or bare workflow config
- Auto-detects type (workflow vs state_machine)
- Auto-layouts nodes using topological sort (`lib/layout-engine.ts`)

## Keyboard Shortcuts

| Shortcut               | Action                 |
| ---------------------- | ---------------------- |
| `Cmd/Ctrl + Z`         | Undo                   |
| `Cmd/Ctrl + Shift + Z` | Redo                   |
| `Cmd/Ctrl + S`         | Save                   |
| `Cmd/Ctrl + E`         | Export YAML            |
| `Backspace / Delete`   | Delete selected        |
| `Cmd/Ctrl + A`         | Select all             |
| `Cmd/Ctrl + Shift + F` | Fit view               |
| `Escape`               | Deselect / close panel |
