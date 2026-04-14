import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { GitBranch, LayoutDashboard, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user) {
        redirect("/auth/signin?callbackUrl=/dashboard");
    }

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-[220px] glass border-r border-[var(--glass-border)] flex flex-col p-4 gap-6">
                <Link href="/dashboard" className="flex items-center gap-2 px-2 py-1">
                    <GitBranch className="w-4 h-4 text-[var(--accent)]" />
                    <span className="text-sm font-semibold text-[var(--text-primary)] font-mono">
                        SFB
                    </span>
                </Link>

                <nav className="flex flex-col gap-1">
                    <Link href="/dashboard">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start gap-2"
                        >
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/dashboard/settings">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start gap-2"
                        >
                            <Settings className="w-3.5 h-3.5" />
                            Settings
                        </Button>
                    </Link>
                </nav>

                <div className="flex-1" />

                <div className="flex items-center gap-2 px-2">
                    {session.user.image && (
                        <Image
                            src={session.user.image}
                            alt=""
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full"
                        />
                    )}
                    <span className="text-xs text-[var(--text-secondary)] truncate flex-1">
                        {session.user.name ?? session.user.email}
                    </span>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
    );
}
