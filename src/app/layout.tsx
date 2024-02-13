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
    title: 'Workflow Builder App - The platform where symfony workflows is made easy!',
    description: 'Workflow Builder App - The platform where symfony workflows is made easy!',
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
