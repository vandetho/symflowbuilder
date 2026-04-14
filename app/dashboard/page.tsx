import Link from "next/link";
import { Plus } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const workflows = await prisma.workflow.findMany({
        where: { userId: session.user.id },
        orderBy: { updatedAt: "desc" },
    });

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-light text-[var(--text-primary)]">
                        Your Workflows
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                        {workflows.length} workflow{workflows.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Link href="/editor">
                    <Button size="sm" className="gap-2">
                        <Plus className="w-3.5 h-3.5" />
                        New Workflow
                    </Button>
                </Link>
            </div>

            {workflows.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
                        <Logo size={40} className="opacity-40" />
                        <p className="text-sm text-[var(--text-secondary)]">
                            No workflows yet. Create your first one.
                        </p>
                        <Link href="/editor">
                            <Button size="sm" className="gap-2">
                                <Plus className="w-3.5 h-3.5" />
                                Create Workflow
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {workflows.map((workflow) => (
                        <Link key={workflow.id} href={`/editor/${workflow.id}`}>
                            <Card className="hover:border-[var(--glass-border-hover)] transition-colors cursor-pointer">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-mono truncate">
                                            {workflow.name}
                                        </CardTitle>
                                        <Badge variant="outline">{workflow.type}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)] font-mono">
                                        <span>Symfony {workflow.symfonyVersion}</span>
                                        <span>
                                            {formatDistanceToNow(workflow.updatedAt, {
                                                addSuffix: true,
                                            })}
                                        </span>
                                        {workflow.isPublic && (
                                            <Badge
                                                variant="success"
                                                className="text-[9px]"
                                            >
                                                public
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
