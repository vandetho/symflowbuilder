'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import { ThemeToggle } from '@/components/theme-toggle';

interface NavBarProps {}

const NavBar = React.memo<NavBarProps>(() => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="mr-4 hidden md:flex">
                    <a className="mr-6 flex items-center space-x-2" href="/">
                        <span className="hidden font-bold sm:inline-block">Workflow Builder</span>
                    </a>
                    <nav className="flex items-center gap-6 text-sm">
                        <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/">
                            Homepage
                        </a>
                        <a
                            className="hidden text-foreground/60 transition-colors hover:text-foreground/80 lg:block"
                            href="https://github.com/vandetho/workflow-builder"
                        >
                            GitHub
                        </a>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <nav className="flex items-center">
                        <a target="_blank" rel="noreferrer" href="https://github.com/vandetho/workflow-builder">
                            <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0">
                                <Icon icon={'akar-icons:github-fill'} className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </div>
                        </a>
                        <ThemeToggle />
                    </nav>
                </div>
            </div>
        </header>
    );
});

export default NavBar;
