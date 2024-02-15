import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

import { ThemeProvider } from '@/app/theme-provider';
import NavBar from '@/app/nav-bar';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import GoogleAnalytics from '@/app/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
    title: 'SymFlowBuilder - The platform where symfony workflows is made easy!',
    description:
        'a platform aimed at simplifying the Symfony Workflow configuration process, offering a graphical interface for easy visualization and management of workflows. This tool allows developers to design, configure, and export workflows with minimal hassle, significantly reducing development time and errors associated with manual configuration. It caters to the needs of both novice and experienced Symfony developers, streamlining the workflow configuration process and enhancing productivity across Symfony projects.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <NavBar />
                    {children}
                    <Toaster />
                </ThemeProvider>
                <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
            </body>
        </html>
    );
}
