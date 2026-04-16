import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Calendar, Workflow } from "lucide-react";
import { GitHubIcon } from "@/components/ui/icons";
import { DeleteAccountButton } from "@/components/dashboard/delete-account-button";
import { LinkAccountButton } from "@/components/dashboard/link-account-button";
import { formatDistanceToNow } from "date-fns";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            accounts: {
                select: { provider: true },
            },
            _count: {
                select: { workflows: true },
            },
        },
    });

    if (!user) return null;

    const providers = user.accounts.map((a) => a.provider);

    return (
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-light text-[var(--text-primary)]">
                    Settings
                </h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Manage your account
                </p>
            </div>

            {/* Profile */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Profile</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        {user.image && (
                            <Image
                                src={user.image}
                                alt=""
                                width={64}
                                height={64}
                                className="w-16 h-16 rounded-full border-2 border-[var(--glass-border)]"
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-lg font-medium text-[var(--text-primary)]">
                                {user.name}
                            </p>
                            <p className="text-sm text-[var(--text-secondary)]">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-[var(--text-muted)]" />
                            <div>
                                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                                    Name
                                </p>
                                <p className="text-sm text-[var(--text-primary)]">
                                    {user.name ?? "Not set"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-[var(--text-muted)]" />
                            <div>
                                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                                    Email
                                </p>
                                <p className="text-sm text-[var(--text-primary)]">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                            <div>
                                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                                    Joined
                                </p>
                                <p className="text-sm text-[var(--text-primary)]">
                                    {formatDistanceToNow(user.createdAt, {
                                        addSuffix: true,
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Workflow className="w-4 h-4 text-[var(--text-muted)]" />
                            <div>
                                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                                    Workflows
                                </p>
                                <p className="text-sm text-[var(--text-primary)]">
                                    {user._count.workflows}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Connected Accounts */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Connected Accounts</CardTitle>
                    <CardDescription>
                        OAuth providers linked to your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    <div className="flex items-center justify-between p-3 rounded-[10px] bg-[var(--glass-base)] border border-[var(--glass-border)]">
                        <div className="flex items-center gap-3">
                            <GitHubIcon className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span className="text-sm text-[var(--text-primary)]">
                                GitHub
                            </span>
                        </div>
                        {providers.includes("github") ? (
                            <Badge variant="success">Connected</Badge>
                        ) : (
                            <LinkAccountButton provider="github" />
                        )}
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-[10px] bg-[var(--glass-base)] border border-[var(--glass-border)]">
                        <div className="flex items-center gap-3">
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            <span className="text-sm text-[var(--text-primary)]">
                                Google
                            </span>
                        </div>
                        {providers.includes("google") ? (
                            <Badge variant="success">Connected</Badge>
                        ) : (
                            <LinkAccountButton provider="google" />
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-[var(--danger-dim)]">
                <CardHeader>
                    <CardTitle className="text-sm text-[var(--danger)]">
                        Danger Zone
                    </CardTitle>
                    <CardDescription>
                        Irreversible actions on your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <p className="text-xs text-[var(--text-muted)]">
                        Permanently delete your account and all workflows.
                    </p>
                    <DeleteAccountButton />
                </CardContent>
            </Card>
        </div>
    );
}
