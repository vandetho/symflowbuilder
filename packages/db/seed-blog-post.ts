import "dotenv/config";
import { prisma } from "./src/index.js";

const post = {
    slug: "mermaid-export-and-workflow-composition",
    title: "Mermaid Diagram Export and Workflow Composition",
    date: new Date("2026-04-20"),
    excerpt:
        "Export your workflows as Mermaid stateDiagram-v2 diagrams for documentation, and compose complex systems by nesting sub-workflows inside a parent workflow.",
    tags: ["feature", "announcement", "mermaid", "composition"],
    published: true,
    content: `## Mermaid Diagram Export

SymFlowBuilder now exports workflows as Mermaid \`stateDiagram-v2\` diagrams. Click **Export** in the toolbar, choose **Mermaid**, and you get a text diagram you can paste directly into GitHub Markdown, Notion, Confluence, or any Mermaid-compatible renderer.

### How it works

The export reads your places and transitions and generates clean Mermaid syntax:

\`\`\`text
stateDiagram-v2
    direction LR
    [*] --> draft
    draft --> submitted : submit
    submitted --> approved : approve
    submitted --> rejected : reject [is_granted("ROLE_ADMIN")]
    approved --> fulfilled : fulfill
    fulfilled --> [*]
\`\`\`

Initial states get a \`[*] -->\` arrow. Final states (places with no outgoing transitions) get an arrow to \`[*]\`. Guard expressions appear in square brackets after the transition name.

### Where to use it

- **GitHub PRs and issues** — paste the Mermaid block inside a \\\`\\\`\\\`mermaid fence and GitHub renders it inline
- **Documentation** — embed diagrams in your Sphinx, MkDocs, or Docusaurus docs
- **Confluence / Notion** — both support Mermaid rendering
- **README files** — show your workflow structure without screenshots

### Export from anywhere

Mermaid export is available in:

- The **editor toolbar** export dropdown (alongside YAML, JSON, TypeScript)
- The **export preview panel** with format tabs to switch between all four formats
- The **dashboard** export dialog on each workflow card
- **Shared workflow links** with the export drawer

The Mermaid exporter is also available as a standalone function in the \`symflow\` npm package:

\`\`\`ts
import { exportWorkflowMermaid } from "symflow/mermaid";

const mmd = exportWorkflowMermaid({ definition, meta });
\`\`\`

Or from the React Flow adapter:

\`\`\`ts
import { exportGraphToMermaid } from "symflow/react-flow";

const mmd = exportGraphToMermaid({ nodes, edges, meta });
\`\`\`

## Workflow Composition

The second feature in this release is **workflow composition** — the ability to nest one workflow inside another using sub-workflow nodes.

### The problem

Real systems rarely have a single flat workflow. An order workflow might contain a payment sub-process, a fulfillment sub-process, and a returns sub-process. Until now, you had to model everything in one graph or maintain separate disconnected workflows.

### Sub-workflow nodes

The node palette now has a second draggable item: **Sub-Workflow**. Drag it onto the canvas to create a sub-workflow node, then select it and use the properties panel to link it to one of your saved workflows.

Sub-workflow nodes:

- **Behave like states** — they connect to transitions the same way regular places do
- **Reference saved workflows** — sign in and pick from your workflow library
- **Show the linked name** — the node displays both its label and the referenced workflow name
- **Export cleanly** — Mermaid renders them as composite states, YAML/JSON include them as regular places

### Connecting sub-workflows

Drag from a state to a sub-workflow node (or vice versa) and a transition is created automatically, just like connecting two regular states. The sub-workflow node acts as a place in the parent workflow graph.

### Getting started

1. Open the editor at [symflowbuilder.com/editor](https://symflowbuilder.com/editor)
2. Drag a **Sub-Workflow** from the palette onto the canvas
3. Select it and use the properties panel to pick a linked workflow
4. Connect it to other states and transitions as usual
5. Export to any format — YAML, JSON, TypeScript, or Mermaid`,
};

async function main() {
    const existing = await prisma.blogPost.findUnique({
        where: { slug: post.slug },
    });

    if (existing) {
        await prisma.blogPost.update({
            where: { slug: post.slug },
            data: post,
        });
        console.log(`Updated blog post: ${post.slug}`);
    } else {
        await prisma.blogPost.create({ data: post });
        console.log(`Created blog post: ${post.slug}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
