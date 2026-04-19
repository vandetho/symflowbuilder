# @symflowbuilder/core

Framework-agnostic TypeScript port of Symfony's Workflow component, plus YAML
import/export, auto-layout, and graph migrations used by
[SymFlowBuilder](https://symflowbuilder.com).

## Subpath exports

| Import                                     | Contents                                            | Extra deps      |
| ------------------------------------------ | --------------------------------------------------- | --------------- |
| `@symflowbuilder/core/engine`              | `WorkflowEngine`, validator, analyzer, domain types | none            |
| `@symflowbuilder/core/yaml`                | Symfony-style YAML import / export                  | `js-yaml`       |
| `@symflowbuilder/core/layout`              | BFS + barycenter auto-layout                        | none            |
| `@symflowbuilder/core/migrations`          | Graph format migrations                             | none            |
| `@symflowbuilder/core/types`               | `WorkflowMeta`, node/edge data, `AccessLevel`       | none            |
| `@symflowbuilder/core/adapters/react-flow` | `buildDefinition(nodes, edges, meta)`               | `@xyflow/react` |
| `@symflowbuilder/core`                     | All of the above re-exported                        | all             |

Use the subpath that matches your need — `/engine` pulls no peer dependencies.

## Engine usage

```ts
import {
    WorkflowEngine,
    validateDefinition,
    type WorkflowDefinition,
} from "@symflowbuilder/core/engine";

const definition: WorkflowDefinition = {
    name: "pull_request",
    type: "state_machine",
    places: [{ name: "draft" }, { name: "review" }, { name: "merged" }],
    transitions: [
        { name: "submit", froms: ["draft"], tos: ["review"] },
        { name: "merge", froms: ["review"], tos: ["merged"] },
    ],
    initialMarking: ["draft"],
};

const { valid, errors } = validateDefinition(definition);
if (!valid) throw new Error(errors.map((e) => e.message).join("\n"));

const engine = new WorkflowEngine(definition, {
    guardEvaluator: (expr, { marking }) => true, // plug in expr-eval, jexl, etc.
});

engine.on("entered", (e) => console.log(e.transition.name, e.marking));

if (engine.can("submit").allowed) {
    engine.apply("submit");
}
```

## Parity with Symfony Workflow

Matches: `Definition`, `Marking`, `Transition`, `can()`, `apply()`,
`getEnabledTransitions()`, event order
`guard → leave → transition → enter → entered → completed`, `state_machine` vs
`workflow` semantics, pluggable guard evaluator.

Not included: `MarkingStoreInterface` (persist the marking yourself via
`engine.getMarking()` / `engine.setMarking()`), `ExpressionLanguage` (bring your
own via the `guardEvaluator` option), Graphviz dumper.
