# Workflow Engine

The workflow engine is published as the [`symflow`](https://www.npmjs.com/package/symflow) npm package ([GitHub](https://github.com/vandetho/symflow)). It powers the visual simulator in the editor and can be used standalone in any Node.js, serverless, or browser project.

```bash
npm install symflow
```

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

## Package Structure

The engine is split into subpath exports:

| Import               | Contents                                                                      | Extra deps             |
| -------------------- | ----------------------------------------------------------------------------- | ---------------------- |
| `symflow/engine`     | `WorkflowEngine`, `validateDefinition`, `analyzeWorkflow`, types              | none                   |
| `symflow/subject`    | `Workflow<T>`, `createWorkflow`, `propertyMarkingStore`, `methodMarkingStore` | none                   |
| `symflow/yaml`       | Symfony YAML import/export (supports `!php/const` and `!php/enum` tags)       | `js-yaml`              |
| `symflow/json`       | JSON import/export                                                            | none                   |
| `symflow/typescript` | TypeScript codegen from a definition                                          | none                   |
| `symflow/react-flow` | React Flow node/edge types, graph utilities                                   | `@xyflow/react` (peer) |

## Usage

### Standalone Engine

```typescript
import { WorkflowEngine, validateDefinition } from "symflow/engine";
import type { WorkflowDefinition } from "symflow/engine";

const definition: WorkflowDefinition = {
    name: "order",
    type: "state_machine",
    places: [{ name: "draft" }, { name: "submitted" }, { name: "approved" }],
    transitions: [
        { name: "submit", froms: ["draft"], tos: ["submitted"] },
        { name: "approve", froms: ["submitted"], tos: ["approved"] },
    ],
    initialMarking: ["draft"],
};

const { valid, errors } = validateDefinition(definition);
const engine = new WorkflowEngine(definition);

if (engine.can("submit").allowed) {
    engine.apply("submit");
}

engine.getActivePlaces(); // ["submitted"]
```

### Subject-Driven API

```typescript
import { createWorkflow, propertyMarkingStore } from "symflow/subject";

interface Order {
    id: string;
    status: string;
}

const workflow = createWorkflow<Order>(definition, {
    markingStore: propertyMarkingStore("status"),
});

const order: Order = { id: "1", status: "draft" };
workflow.apply(order, "submit");
console.log(order.status); // "submitted"
```

### Import Symfony YAML

```typescript
import { importWorkflowYaml } from "symflow/yaml";
import { WorkflowEngine } from "symflow/engine";

// Supports !php/const and !php/enum tags
const { definition } = importWorkflowYaml(yamlString);
const engine = new WorkflowEngine(definition);
```

## Differences from Symfony

| Feature                       | Symfony                              | symflow                                                 |
| ----------------------------- | ------------------------------------ | ------------------------------------------------------- |
| Event names                   | `workflow.[name].guard.[transition]` | Generic types: `guard`, `leave`, etc.                   |
| Guard evaluation              | ExpressionLanguage                   | Pluggable function (toggle-based in simulator)          |
| Subject                       | PHP object with marking property     | Optional via `symflow/subject`                          |
| Marking stores                | `property` and `method` types        | Same, via `propertyMarkingStore` / `methodMarkingStore` |
| Weighted transitions          | Supported (token counts > 1)         | Not yet supported                                       |
| Transition metadata in events | Full context object                  | Transition + marking snapshot                           |
| `announce` event              | Re-triggers all guard events         | Fires but does not re-dispatch guards                   |
| `!php/const` / `!php/enum`    | Resolved by PHP at runtime           | Resolved to short name after `::`                       |

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
- `and-split` — target of a transition with multiple tos
- `and-join` — source of a transition with multiple froms

**Place patterns (state_machine type):**

- `xor-split` — exclusive choice (only one path)
- `xor-join` — exclusive merge (only one path was taken)
