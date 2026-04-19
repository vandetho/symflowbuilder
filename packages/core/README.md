# @symflow/core

A framework-agnostic TypeScript port of Symfony's Workflow component, plus
YAML / JSON / TypeScript import & export and an optional React Flow adapter.

The engine subpath has **zero runtime dependencies** and is not bound to any
framework — drop it into a Next.js, Remix, Gatsby, Nuxt-with-Vue (types only),
Node CLI, worker, or plain browser project.

## Subpath exports

| Import                     | Contents                                                                                                                                                                                             | Extra deps             |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `@symflow/core/engine`     | `WorkflowEngine`, validator, analyzer, domain types                                                                                                                                                  | none                   |
| `@symflow/core/yaml`       | Symfony YAML ↔ `WorkflowDefinition`                                                                                                                                                                  | `js-yaml`              |
| `@symflow/core/json`       | JSON ↔ `WorkflowDefinition` + `WorkflowMeta`                                                                                                                                                         | none                   |
| `@symflow/core/typescript` | Emit a typed `.ts` module string from a workflow (codegen)                                                                                                                                           | none                   |
| `@symflow/core/types`      | `WorkflowMeta`, `TransitionListener`, defaults                                                                                                                                                       | none                   |
| `@symflow/core/react-flow` | RF node/edge types + `buildDefinition`, `autoLayoutNodes`, `migrateGraphData`, `importWorkflowYamlToGraph`, `exportGraphToYaml`, `importWorkflowJsonToGraph`, `exportGraphToJson`, `exportGraphToTs` | `@xyflow/react` (peer) |
| `@symflow/core`            | All of the above re-exported                                                                                                                                                                         | all                    |

Pick the subpath that matches your need — `/engine`, `/json`, `/typescript`,
and `/types` pull nothing at all.

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

## Persistence formats

All three formats round-trip the same `{ definition, meta }` shape — pick
whichever fits your storage.

### YAML (Symfony framework config)

```ts
import { importWorkflowYaml, exportWorkflowYaml } from "@symflow/core/yaml";

const { definition, meta } = importWorkflowYaml(fs.readFileSync("flow.yaml", "utf8"));
const yaml = exportWorkflowYaml({ definition, meta });
```

### JSON (Postgres jsonb, Mongo, HTTP, files)

```ts
import { importWorkflowJson, exportWorkflowJson } from "@symflow/core/json";

const { definition, meta } = importWorkflowJson(jsonString);
const json = exportWorkflowJson({ definition, meta, indent: 2 });
```

### TypeScript codegen

Emits a typed module you can write to disk and `import` like any other source
file — no runtime parser needed.

```ts
import { exportWorkflowTs } from "@symflow/core/typescript";

const ts = exportWorkflowTs({
    definition,
    meta,
    exportName: "pullRequest", // → pullRequestDefinition, pullRequestMeta
    importFrom: "@symflow/core",
});
fs.writeFileSync("flows/pull-request.ts", ts);
```

```ts
// flows/pull-request.ts (generated)
import type { WorkflowDefinition, WorkflowMeta } from "@symflow/core";

export const pullRequestDefinition: WorkflowDefinition = { ... };
export const pullRequestMeta: WorkflowMeta = { ... };
```

## React Flow adapter (opt-in)

```ts
import {
    importWorkflowYamlToGraph,
    importWorkflowJsonToGraph,
    exportGraphToYaml,
    exportGraphToJson,
    exportGraphToTs,
    autoLayoutNodes,
    buildDefinition,
} from "@symflow/core/react-flow";

const { nodes, edges, meta } = importWorkflowYamlToGraph(yamlString);
// feed nodes/edges to <ReactFlow />
const yaml = exportGraphToYaml({ nodes, edges, meta });
const json = exportGraphToJson({ nodes, edges, meta });
const ts = exportGraphToTs({ nodes, edges, meta, exportName: "myFlow" });
```

## Parity with Symfony Workflow

Matches: `Definition`, `Marking`, `Transition`, `can()`, `apply()`,
`getEnabledTransitions()`, event order
`guard → leave → transition → enter → entered → completed`, `state_machine` vs
`workflow` semantics, pluggable guard evaluator.

Not included: `MarkingStoreInterface` (persist the marking yourself via
`engine.getMarking()` / `engine.setMarking()`), `ExpressionLanguage` (bring your
own via the `guardEvaluator` option), Graphviz dumper.
