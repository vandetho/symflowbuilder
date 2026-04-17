"use client";

import { useSyncExternalStore } from "react";
import {
    ReactFlow,
    Background,
    BackgroundVariant,
    ReactFlowProvider,
    type Node,
    type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const nodeStyle = {
    borderRadius: "14px",
    color: "rgba(255,255,255,0.92)",
    fontSize: "14px",
    fontFamily: "var(--font-jetbrains-mono), monospace",
    fontWeight: 500,
    padding: "12px 24px",
    backdropFilter: "blur(8px)",
} as const;

const DEMO_NODES: Node[] = [
    {
        id: "draft",
        type: "default",
        position: { x: 0, y: 200 },
        data: { label: "draft" },
        style: {
            ...nodeStyle,
            background: "rgba(124, 111, 247, 0.15)",
            border: "1px solid rgba(124, 111, 247, 0.4)",
        },
    },
    {
        id: "review",
        type: "default",
        position: { x: 350, y: 60 },
        data: { label: "review" },
        style: {
            ...nodeStyle,
            background: "rgba(255, 255, 255, 0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
        },
    },
    {
        id: "approved",
        type: "default",
        position: { x: 720, y: 60 },
        data: { label: "approved" },
        style: {
            ...nodeStyle,
            background: "rgba(52, 211, 153, 0.12)",
            border: "1px solid rgba(52, 211, 153, 0.35)",
        },
    },
    {
        id: "rejected",
        type: "default",
        position: { x: 720, y: 340 },
        data: { label: "rejected" },
        style: {
            ...nodeStyle,
            background: "rgba(248, 113, 113, 0.12)",
            border: "1px solid rgba(248, 113, 113, 0.35)",
        },
    },
    {
        id: "published",
        type: "default",
        position: { x: 1100, y: 200 },
        data: { label: "published" },
        style: {
            ...nodeStyle,
            background: "rgba(52, 211, 153, 0.18)",
            border: "1px solid rgba(52, 211, 153, 0.45)",
        },
    },
];

const DEMO_EDGES: Edge[] = [
    {
        id: "e1",
        source: "draft",
        target: "review",
        label: "submit",
        animated: true,
        style: { stroke: "rgba(124, 111, 247, 0.5)", strokeWidth: 2 },
        labelStyle: {
            fill: "rgba(255,255,255,0.6)",
            fontSize: 12,
            fontFamily: "var(--font-jetbrains-mono), monospace",
        },
        labelBgStyle: {
            fill: "rgba(0,0,0,0.6)",
            fillOpacity: 0.8,
        },
        labelBgPadding: [8, 4] as [number, number],
        labelBgBorderRadius: 6,
    },
    {
        id: "e2",
        source: "review",
        target: "approved",
        label: "approve",
        animated: true,
        style: { stroke: "rgba(52, 211, 153, 0.5)", strokeWidth: 2 },
        labelStyle: {
            fill: "rgba(255,255,255,0.6)",
            fontSize: 12,
            fontFamily: "var(--font-jetbrains-mono), monospace",
        },
        labelBgStyle: { fill: "rgba(0,0,0,0.6)", fillOpacity: 0.8 },
        labelBgPadding: [8, 4] as [number, number],
        labelBgBorderRadius: 6,
    },
    {
        id: "e3",
        source: "review",
        target: "rejected",
        label: "reject",
        animated: true,
        style: { stroke: "rgba(248, 113, 113, 0.4)", strokeWidth: 2 },
        labelStyle: {
            fill: "rgba(255,255,255,0.6)",
            fontSize: 12,
            fontFamily: "var(--font-jetbrains-mono), monospace",
        },
        labelBgStyle: { fill: "rgba(0,0,0,0.6)", fillOpacity: 0.8 },
        labelBgPadding: [8, 4] as [number, number],
        labelBgBorderRadius: 6,
    },
    {
        id: "e4",
        source: "approved",
        target: "published",
        label: "publish",
        animated: true,
        style: { stroke: "rgba(52, 211, 153, 0.5)", strokeWidth: 2 },
        labelStyle: {
            fill: "rgba(255,255,255,0.6)",
            fontSize: 12,
            fontFamily: "var(--font-jetbrains-mono), monospace",
        },
        labelBgStyle: { fill: "rgba(0,0,0,0.6)", fillOpacity: 0.8 },
        labelBgPadding: [8, 4] as [number, number],
        labelBgBorderRadius: 6,
    },
    {
        id: "e5",
        source: "rejected",
        target: "draft",
        label: "revise",
        animated: true,
        style: {
            stroke: "rgba(251, 191, 36, 0.4)",
            strokeWidth: 2,
            strokeDasharray: "6 3",
        },
        labelStyle: {
            fill: "rgba(255,255,255,0.6)",
            fontSize: 12,
            fontFamily: "var(--font-jetbrains-mono), monospace",
        },
        labelBgStyle: { fill: "rgba(0,0,0,0.6)", fillOpacity: 0.8 },
        labelBgPadding: [8, 4] as [number, number],
        labelBgBorderRadius: 6,
    },
];

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function HeroGraph() {
    const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    if (!mounted) {
        return <div className="w-full h-[540px] rounded-[18px] glass animate-pulse" />;
    }

    return (
        <div className="w-full h-[540px] rounded-[18px] glass overflow-hidden shadow-[0_16px_64px_rgba(124,111,247,0.08)]">
            <ReactFlowProvider>
                <ReactFlow
                    nodes={DEMO_NODES}
                    edges={DEMO_EDGES}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={false}
                    panOnDrag={false}
                    zoomOnScroll={false}
                    zoomOnPinch={false}
                    zoomOnDoubleClick={false}
                    preventScrolling={false}
                    fitView
                    fitViewOptions={{ padding: 0.08 }}
                    proOptions={{ hideAttribution: true }}
                >
                    <Background
                        variant={BackgroundVariant.Dots}
                        gap={20}
                        size={1}
                        color="rgba(255,255,255,0.05)"
                    />
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    );
}
