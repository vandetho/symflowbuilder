'use client';

import React from 'react';

interface NavBarProps {}

const NavBar = React.memo<NavBarProps>((props) => {
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
            </div>
        </header>
    );
});

export default NavBar;
