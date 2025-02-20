import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

import { ThemeProvider } from '@/app/theme-provider';
import NavBar from '@/app/nav-bar';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import GoogleAnalytics from '@/app/GoogleAnalytics';
import { primaryMain } from '@/theme/palette';
import { TooltipProvider } from '@/components/ui/tooltip';
import SessionStorageProvider from '@/app/session-storage-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
    title: 'SymFlowBuilder - The platform where symfony workflows are made easy!',
    description:
        'a platform aimed at simplifying the Symfony Workflow configuration process, offering a graphical interface for easy visualization and management of workflows. This tool allows developers to design, configure, and export workflows with minimal hassle, significantly reducing development time and errors associated with manual configuration. It caters to the needs of both novice and experienced Symfony developers, streamlining the workflow configuration process and enhancing productivity across Symfony projects.',
    keywords: [
        'Team',
        'Management',
        'Task',
        'Tracking',
        'Comment',
        'Badge',
        'Application',
        'Multiple',
        'Products',
        'Members',
        'Group',
        'Activity',
        'Calendar',
        'Sharable',
        'Community',
        'Private',
        'Cloud',
        'Invoice',
        'Workflow',
        'Cambodia',
        'Cambodge',
        'Khmer',
        'English',
        'Francais',
        'French',
        'Hierarchy',
    ],
    robots: 'index, follow',
    manifest: '/manifest.json',
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_HOST_URL}`),
    openGraph: {
        url: `${process.env.NEXT_PUBLIC_HOST_URL}`,
        type: 'website',
        images: [`${process.env.NEXT_PUBLIC_HOST_URL}/logo.png`],
    },
};

export const viewport: Viewport = {
    themeColor: primaryMain,
    initialScale: 1,
    width: 'device-width',
    maximumScale: 5,
    minimumScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <NavBar />
                    <TooltipProvider>
                        <SessionStorageProvider>{children}</SessionStorageProvider>
                    </TooltipProvider>
                    <Toaster position="top-right" />
                </ThemeProvider>
                <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
            </body>
        </html>
    );
}
