"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LinkAccountButton({ provider }: { provider: string }) {
    const label = provider === "github" ? "GitHub" : "Google";

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => signIn(provider, { callbackUrl: "/dashboard/settings" })}
        >
            Link {label}
        </Button>
    );
}
