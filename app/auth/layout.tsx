import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In",
    description:
        "Sign in to SymFlowBuilder with GitHub or Google to unlock cloud save, versioning, and sharing.",
    robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return children;
}
