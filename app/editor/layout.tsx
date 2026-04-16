import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Editor",
    description:
        "Design Symfony workflow configurations visually with the drag-and-drop editor. No account required.",
    openGraph: {
        title: "Workflow Editor — SymFlowBuilder",
        description:
            "Design Symfony workflow configurations visually with the drag-and-drop editor.",
    },
};

export default function EditorLayout({ children }: { children: React.ReactNode }) {
    return children;
}
