import type { Node, Edge } from "@xyflow/react";

const NODE_HEIGHT = 100;
const H_GAP = 280;
const V_GAP = 120;

export function autoLayoutNodes(nodes: Node[], edges: Edge[]): Node[] {
    if (nodes.length === 0) return nodes;

    const nodeIds = new Set(nodes.map((n) => n.id));

    // Build adjacency (only valid nodes)
    const successors = new Map<string, Set<string>>();
    const predecessors = new Map<string, Set<string>>();

    for (const id of nodeIds) {
        successors.set(id, new Set());
        predecessors.set(id, new Set());
    }

    for (const edge of edges) {
        if (nodeIds.has(edge.source) && nodeIds.has(edge.target)) {
            successors.get(edge.source)!.add(edge.target);
            predecessors.get(edge.target)!.add(edge.source);
        }
    }

    // Find root nodes (no predecessors)
    const roots = nodes.filter((n) => predecessors.get(n.id)!.size === 0);
    if (roots.length === 0 && nodes.length > 0) {
        roots.push(nodes[0]);
    }

    // --- BFS layering (shortest path from roots) ---
    // This keeps parallel branches at the same depth
    const layerOf = new Map<string, number>();
    const queue: string[] = [];

    for (const root of roots) {
        if (!layerOf.has(root.id)) {
            layerOf.set(root.id, 0);
            queue.push(root.id);
        }
    }

    while (queue.length > 0) {
        const current = queue.shift()!;
        const currentLayer = layerOf.get(current)!;

        for (const next of successors.get(current) ?? []) {
            if (!layerOf.has(next)) {
                layerOf.set(next, currentLayer + 1);
                queue.push(next);
            }
        }
    }

    // Assign any remaining disconnected nodes
    for (const node of nodes) {
        if (!layerOf.has(node.id)) {
            layerOf.set(node.id, 0);
        }
    }

    // Group by layer
    const layerCount = Math.max(0, ...Array.from(layerOf.values())) + 1;
    const layers: string[][] = Array.from({ length: layerCount }, () => []);
    for (const node of nodes) {
        layers[layerOf.get(node.id)!].push(node.id);
    }

    // --- Order within layers: barycenter heuristic (2 passes) ---

    // Forward pass
    for (let i = 1; i < layers.length; i++) {
        const prevOrder = new Map<string, number>();
        layers[i - 1].forEach((id, idx) => prevOrder.set(id, idx));

        layers[i].sort((a, b) => {
            const avgA = barycenter(predecessors.get(a)!, prevOrder);
            const avgB = barycenter(predecessors.get(b)!, prevOrder);
            return avgA - avgB;
        });
    }

    // Backward pass
    for (let i = layers.length - 2; i >= 0; i--) {
        const nextOrder = new Map<string, number>();
        layers[i + 1].forEach((id, idx) => nextOrder.set(id, idx));

        layers[i].sort((a, b) => {
            const avgA = barycenter(successors.get(a)!, nextOrder);
            const avgB = barycenter(successors.get(b)!, nextOrder);
            return avgA - avgB;
        });
    }

    // --- Position assignment ---
    const positioned = new Map<string, { x: number; y: number }>();
    const maxLayerSize = Math.max(...layers.map((l) => l.length), 1);

    for (let col = 0; col < layers.length; col++) {
        const layer = layers[col];
        const totalHeight = layer.length * NODE_HEIGHT + (layer.length - 1) * V_GAP;
        const maxTotalHeight = maxLayerSize * NODE_HEIGHT + (maxLayerSize - 1) * V_GAP;
        const startY = (maxTotalHeight - totalHeight) / 2;

        for (let row = 0; row < layer.length; row++) {
            positioned.set(layer[row], {
                x: col * H_GAP,
                y: startY + row * (NODE_HEIGHT + V_GAP),
            });
        }
    }

    return nodes.map((node) => ({
        ...node,
        position: positioned.get(node.id) ?? node.position,
    }));
}

function barycenter(neighbors: Set<string>, positions: Map<string, number>): number {
    if (neighbors.size === 0) return 0;
    let sum = 0;
    let count = 0;
    for (const id of neighbors) {
        const pos = positions.get(id);
        if (pos !== undefined) {
            sum += pos;
            count++;
        }
    }
    return count > 0 ? sum / count : 0;
}
