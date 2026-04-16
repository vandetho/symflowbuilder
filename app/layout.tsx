import type { Metadata, Viewport } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { FeedbackFab } from "@/components/feedback-fab";
import { Providers } from "@/components/providers";
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

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://symflowbuilder.com";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "SymFlowBuilder — Visual Symfony Workflow Builder",
        template: "%s — SymFlowBuilder",
    },
    description:
        "Design Symfony workflow configurations visually with drag-and-drop, then export production-ready YAML. Supports Symfony 5.4, 6.4, 7.4, and 8.0.",
    keywords: [
        "Symfony",
        "workflow",
        "state machine",
        "YAML",
        "visual builder",
        "drag and drop",
        "workflow editor",
        "Symfony workflow",
    ],
    authors: [{ name: "Vandeth THO", url: "https://github.com/vandetho" }],
    creator: "Vandeth THO",
    manifest: "/manifest.json",
    icons: {
        icon: [
            { url: "/icon.svg", type: "image/svg+xml" },
            { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
            { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: "/apple-icon.png",
    },
    openGraph: {
        type: "website",
        siteName: "SymFlowBuilder",
        title: "SymFlowBuilder — Visual Symfony Workflow Builder",
        description:
            "Design Symfony workflow configurations visually with drag-and-drop, then export production-ready YAML.",
        url: siteUrl,
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "SymFlowBuilder — Visual Symfony Workflow Builder",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "SymFlowBuilder — Visual Symfony Workflow Builder",
        description:
            "Design Symfony workflow configurations visually with drag-and-drop, then export production-ready YAML.",
        images: ["/og-image.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
};

export const viewport: Viewport = {
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
                <Providers>
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
                </Providers>
            </body>
        </html>
    );
}
