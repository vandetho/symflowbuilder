# Workflow Engine

The workflow engine (`lib/engine/`) is a TypeScript implementation that mirrors Symfony's Workflow component. It powers the visual simulator in the editor.

## Symfony Compatibility

The engine follows Symfony's semantics as closely as possible:

### Marking

- **`workflow` type**: Multiple places can be active simultaneously (Petri-net). Marking is a `Record<string, number>` mapping place names to token counts.
- **`state_machine` type**: Exactly one place is active at a time.

### Transition Semantics

- **`workflow` type with `from: [a, b]`**: AND-join. All from-places must have at least one token. Tokens are consumed from all from-places.
- **`state_machine` type with `from: [a, b]`**: OR. The single active place must be one of the listed from-places.
- **`to: [a, b]`**: AND-split. Tokens are placed in all to-places simultaneously.

### Event Dispatch Order

When `apply(transitionName)` is called, events fire in this order (matching Symfony):

| Order | Event        | Timing                                                  |
| ----- | ------------ | ------------------------------------------------------- |
| 1     | `guard`      | Before anything — checks if transition is allowed       |
| 2     | `leave`      | Per from-place, before tokens are removed               |
| 3     | `transition` | After tokens removed from from-places                   |
| 4     | `enter`      | Per to-place, BEFORE marking is updated                 |
| 5     | `entered`    | AFTER marking is updated (subject is now in new places) |
| 6     | `completed`  | After the full transition is done                       |
| 7     | `announce`   | Per newly enabled transition (re-checks availability)   |

Key difference from Symfony: the engine does not dispatch named sub-events like `workflow.blog.guard.publish`. It uses generic event types.

### Guards

- Guards are evaluated during `can()`, `apply()`, and `getEnabledTransitions()`
- A pluggable `GuardEvaluator` function decides pass/fail
- Default evaluator: all guards pass
- Simulator: users can toggle guards on/off per transition to test different paths

### TransitionBlockers

When `can()` returns `{ allowed: false }`, it includes `blockers[]` explaining why:

- `unknown_transition` — transition name doesn't exist
- `not_in_place` — required from-place is not marked
- `invalid_marking` — state_machine has wrong number of active places
- `guard_blocked` — guard expression blocked the transition

## Architecture

```
lib/engine/
  types.ts              — Marking, Place, Transition, WorkflowDefinition, events
  workflow-engine.ts    — WorkflowEngine class (core runtime)
  definition-builder.ts — React Flow graph → WorkflowDefinition
  validator.ts          — Structural validation (unreachable, dead, orphan)
  analyzer.ts           — Pattern detection (AND/OR/XOR)
  index.ts              — Barrel export
```

## Usage

```typescript
import { WorkflowEngine, buildDefinition, validateDefinition } from "@/lib/engine";

// Build definition from editor graph
const definition = buildDefinition(nodes, edges, workflowMeta);

// Validate
const result = validateDefinition(definition);
if (!result.valid) console.log(result.errors);

// Create engine
const engine = new WorkflowEngine(definition);

// Check and apply
if (engine.can("submit").allowed) {
    engine.apply("submit");
}

// Get current state
engine.getMarking(); // { draft: 0, submitted: 1, ... }
engine.getActivePlaces(); // ["submitted"]
engine.getEnabledTransitions(); // [{ name: "approve", ... }]

// Listen to events
engine.on("entered", (event) => {
    console.log(`Entered via ${event.transition.name}`);
});

// Reset
engine.reset();
```

## Differences from Symfony

| Feature                       | Symfony                              | SymFlowBuilder Engine                          |
| ----------------------------- | ------------------------------------ | ---------------------------------------------- |
| Event names                   | `workflow.[name].guard.[transition]` | Generic types: `guard`, `leave`, etc.          |
| Guard evaluation              | ExpressionLanguage                   | Pluggable function (toggle-based in simulator) |
| Subject                       | PHP object with marking property     | No subject — marking is standalone             |
| Weighted transitions          | Supported (token counts > 1)         | Not yet supported                              |
| Transition metadata in events | Full context object                  | Transition + marking snapshot                  |
| `announce` event              | Re-triggers all guard events         | Fires but does not re-dispatch guards          |

## Validator

`validateDefinition()` checks for:

- No initial marking defined
- Invalid initial marking (references non-existent place)
- Invalid transition source/target (references non-existent place)
- Unreachable places (BFS from initial marking)
- Dead transitions (source places are unreachable)
- Orphan places (no incoming or outgoing transitions)

## Analyzer

`analyzeWorkflow()` detects structural patterns:

**Transition patterns:**

- `simple` — 1 from → 1 to
- `and-split` — 1 from → N to (parallel fork)
- `and-join` — N from → 1 to (synchronization)
- `and-split-join` — N from → M to

**Place patterns (workflow type):**

- `or-split` — multiple outgoing transitions (choice)
- `or-join` — multiple incoming transitions (merge)

**Place patterns (state_machine type):**

- `xor-split` — exclusive choice (only one path)
- `xor-join` — exclusive merge (only one path was taken)
