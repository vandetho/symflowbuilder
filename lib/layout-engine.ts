import type { Node, Edge } from "@xyflow/react";

const NODE_HEIGHT = 80;
const HORIZONTAL_GAP = 220;
const VERTICAL_GAP = 120;

export function autoLayoutNodes(nodes: Node[], edges: Edge[]): Node[] {
    if (nodes.length === 0) return nodes;

    // Build adjacency for topological layering
    const adjacency = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    for (const node of nodes) {
        adjacency.set(node.id, []);
        inDegree.set(node.id, 0);
    }

    for (const edge of edges) {
        adjacency.get(edge.source)?.push(edge.target);
        inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
    }

    // Topological sort using Kahn's algorithm to assign layers
    const layers: string[][] = [];
    let currentLayer = nodes
        .filter((n) => (inDegree.get(n.id) ?? 0) === 0)
        .map((n) => n.id);

    const visited = new Set<string>();

    while (currentLayer.length > 0) {
        layers.push(currentLayer);
        currentLayer.forEach((id) => visited.add(id));

        const nextLayer: string[] = [];
        for (const nodeId of currentLayer) {
            for (const target of adjacency.get(nodeId) ?? []) {
                if (!visited.has(target)) {
                    const remaining = (inDegree.get(target) ?? 1) - 1;
                    inDegree.set(target, remaining);
                    if (remaining === 0) {
                        nextLayer.push(target);
                    }
                }
            }
        }
        currentLayer = nextLayer;
    }

    // Add any unvisited nodes (cycles or disconnected) to the last layer
    const unvisited = nodes.filter((n) => !visited.has(n.id)).map((n) => n.id);
    if (unvisited.length > 0) {
        layers.push(unvisited);
    }

    // Assign positions: layers go left to right, nodes in each layer go top to bottom
    const positioned = new Map<string, { x: number; y: number }>();
    for (let col = 0; col < layers.length; col++) {
        const layer = layers[col];
        const totalHeight =
            layer.length * NODE_HEIGHT + (layer.length - 1) * VERTICAL_GAP;
        const startY = -totalHeight / 2;

        for (let row = 0; row < layer.length; row++) {
            positioned.set(layer[row], {
                x: col * HORIZONTAL_GAP,
                y: startY + row * (NODE_HEIGHT + VERTICAL_GAP),
            });
        }
    }

    return nodes.map((node) => ({
        ...node,
        position: positioned.get(node.id) ?? node.position,
    }));
}
