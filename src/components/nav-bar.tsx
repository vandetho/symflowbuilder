'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import { ThemeToggle } from '@/components/theme-toggle';
import Blogs from '@/app/blogs';
import Image from 'next/image';
import Logo from '@/assets/logo-34.png';
import Link from 'next/link';
import { useSearchParamsState } from '@/hooks/search-params-hook';

interface NavBarProps {}

const NavBar = React.memo<NavBarProps>(() => {
    const state = useSearchParamsState();
    const query = new URLSearchParams(state);
    const homepageUrl = `/?${query.toString()}`;
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="mr-4 hidden md:flex">
                    <Link className="mr-6 flex items-center space-x-2" href={homepageUrl}>
                        <Image src={Logo} alt="Symflowbuilder" width={35} height={33} priority />
                        <span className="hidden text-primary font-bold sm:inline-block">SymFlowBuilder</span>
                    </Link>
                    <nav className="flex items-center gap-6 text-sm">
                        <Link
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            href={homepageUrl}
                        >
                            Homepage
                        </Link>
                        <Blogs />
                        <Link
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            href="https://github.com/vandetho/workflow-builder"
                        >
                            GitHub
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <nav className="flex items-center">
                        <Link target="_blank" rel="noreferrer" href="https://github.com/vandetho/workflow-builder">
                            <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0">
                                <Icon icon={'akar-icons:github-fill'} className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </div>
                        </Link>
                        <ThemeToggle />
                    </nav>
                </div>
            </div>
        </header>
    );
});

export default NavBar;
