import type { Metadata } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { FeedbackFab } from "@/components/feedback-fab";
import "./globals.css";

const sora = Sora({
    subsets: ["latin"],
    variable: "--font-sora",
    weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains-mono",
    weight: ["400", "500"],
});

export const metadata: Metadata = {
    title: "SymFlowBuilder — Visual Symfony Workflow Builder",
    description:
        "Design Symfony workflow configurations visually with drag-and-drop, then export production-ready YAML.",
    manifest: "/manifest.json",
    icons: {
        icon: [
            { url: "/icon.svg", type: "image/svg+xml" },
            { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
            { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: "/apple-icon.png",
    },
    themeColor: "#7c6ff7",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${sora.variable} ${jetbrainsMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                {children}
                <FeedbackFab />
                <Toaster
                    theme="dark"
                    toastOptions={{
                        style: {
                            background: "var(--glass-surface)",
                            backdropFilter: "var(--blur-md)",
                            border: "1px solid var(--glass-border)",
                            color: "var(--text-primary)",
                        },
                    }}
                />
            </body>
        </html>
    );
}
