"use client";

import { SessionProvider } from "next-auth/react";
import { HotkeysProvider } from "@tanstack/react-hotkeys";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <HotkeysProvider>{children}</HotkeysProvider>
        </SessionProvider>
    );
}
