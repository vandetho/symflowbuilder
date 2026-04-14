"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function ErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const errorMessages: Record<string, string> = {
        Configuration: "There is a problem with the server configuration.",
        AccessDenied: "Access denied. You do not have permission to sign in.",
        Verification: "The verification link has expired or has been used.",
        Default: "An unexpected error occurred during sign in.",
    };

    const message = errorMessages[error ?? "Default"] ?? errorMessages.Default;

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-sm">
                <CardContent className="flex flex-col items-center gap-4 py-8">
                    <div className="w-12 h-12 rounded-full bg-[var(--danger-dim)] flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-[var(--danger)]" />
                    </div>
                    <h1 className="text-lg font-medium text-[var(--text-primary)]">
                        Authentication Error
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] text-center">
                        {message}
                    </p>
                    <Link href="/auth/signin">
                        <Button variant="outline" size="sm">
                            Try Again
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}

export default function AuthErrorPage() {
    return (
        <Suspense>
            <ErrorContent />
        </Suspense>
    );
}
