# @symflow/core

A framework-agnostic TypeScript port of Symfony's Workflow component, plus
YAML import/export and an optional React Flow adapter.

The engine subpath has **zero runtime dependencies** and is not bound to any
framework — drop it into a Next.js, Remix, Gatsby, Nuxt-with-Vue (types only),
Node CLI, worker, or plain browser project.

## Subpath exports

| Import                     | Contents                                                                                                                       | Extra deps             |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------- |
| `@symflow/core/engine`     | `WorkflowEngine`, validator, analyzer, domain types                                                                            | none                   |
| `@symflow/core/yaml`       | Symfony YAML ↔ `WorkflowDefinition` (pure)                                                                                     | `js-yaml`              |
| `@symflow/core/types`      | `WorkflowMeta`, `TransitionListener`, defaults                                                                                 | none                   |
| `@symflow/core/react-flow` | RF node/edge types, `buildDefinition`, `autoLayoutNodes`, `migrateGraphData`, `importWorkflowYamlToGraph`, `exportGraphToYaml` | `@xyflow/react` (peer) |
| `@symflow/core`            | All of the above re-exported                                                                                                   | all                    |

Pick the subpath that matches your need — `/engine` pulls nothing at all.

## Engine usage

```ts
import {
    WorkflowEngine,
    validateDefinition,
    type WorkflowDefinition,
} from "@symflow/core/engine";

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

## YAML usage (pure, no React)

```ts
import { importWorkflowYaml, exportWorkflowYaml } from "@symflow/core/yaml";

const { definition, meta } = importWorkflowYaml(fs.readFileSync("flow.yaml", "utf8"));
const yaml = exportWorkflowYaml({ definition, meta });
```

## React Flow adapter (opt-in)

```ts
import {
    importWorkflowYamlToGraph,
    exportGraphToYaml,
    autoLayoutNodes,
    buildDefinition,
} from "@symflow/core/react-flow";

const { nodes, edges, meta } = importWorkflowYamlToGraph(yamlString);
// feed nodes/edges to <ReactFlow />
const yaml = exportGraphToYaml({ nodes, edges, meta });
```

## Parity with Symfony Workflow

Matches: `Definition`, `Marking`, `Transition`, `can()`, `apply()`,
`getEnabledTransitions()`, event order
`guard → leave → transition → enter → entered → completed`, `state_machine` vs
`workflow` semantics, pluggable guard evaluator.

Not included: `MarkingStoreInterface` (persist the marking yourself via
`engine.getMarking()` / `engine.setMarking()`), `ExpressionLanguage` (bring your
own via the `guardEvaluator` option), Graphviz dumper.
