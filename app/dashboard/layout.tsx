import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Settings, LogOut, Plus } from "lucide-react";
import { Logo } from "@/components/ui/logo";
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
            <aside className="w-[240px] bg-[#12121f] border-r border-[var(--glass-border)] flex flex-col p-4 gap-6">
                <Link href="/" className="flex items-center gap-2 px-2 py-1">
                    <Logo size={24} />
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                        SymFlowBuilder
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
                    <Link href="/editor">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start gap-2"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            New Workflow
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

                <div className="flex flex-col gap-3 px-2">
                    <div className="flex items-center gap-2">
                        {session.user.image && (
                            <Image
                                src={session.user.image}
                                alt=""
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full"
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                                {session.user.name}
                            </p>
                            <p className="text-[10px] text-[var(--text-muted)] truncate">
                                {session.user.email}
                            </p>
                        </div>
                    </div>
                    <form
                        action={async () => {
                            "use server";
                            await signOut({ redirectTo: "/" });
                        }}
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start gap-2 text-[var(--text-muted)] hover:text-[var(--danger)]"
                            type="submit"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign out
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 p-8 overflow-auto">{children}</main>
        </div>
    );
}
