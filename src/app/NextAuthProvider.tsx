'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';

export function NextAuthProvider({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}
