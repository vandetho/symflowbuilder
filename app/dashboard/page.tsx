import Link from "next/link";
import { Plus, Workflow, GitBranch, Clock, Globe } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { WorkflowActions } from "@/components/dashboard/workflow-actions";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const workflows = await prisma.workflow.findMany({
        where: { userId: session.user.id },
        orderBy: { updatedAt: "desc" },
        include: {
            _count: {
                select: { versions: true },
            },
        },
    });

    const totalWorkflows = workflows.length;
    const publicWorkflows = workflows.filter((w) => w.isPublic).length;
    const symfonyVersions = [...new Set(workflows.map((w) => w.symfonyVersion))];

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-light text-[var(--text-primary)]">
                        Dashboard
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                        Welcome back, {session.user.name?.split(" ")[0]}
                    </p>
                </div>
                <Link href="/editor">
                    <Button size="sm" className="gap-2">
                        <Plus className="w-3.5 h-3.5" />
                        New Workflow
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="flex items-center gap-4 py-4">
                        <div className="w-10 h-10 rounded-[12px] bg-[var(--accent-dim)] border border-[var(--accent-border)] flex items-center justify-center">
                            <Workflow className="w-4 h-4 text-[var(--accent-bright)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-light text-[var(--text-primary)]">
                                {totalWorkflows}
                            </p>
                            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                                Workflows
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-4 py-4">
                        <div className="w-10 h-10 rounded-[12px] bg-[var(--success-dim)] border border-[rgba(52,211,153,0.3)] flex items-center justify-center">
                            <Globe className="w-4 h-4 text-[var(--success)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-light text-[var(--text-primary)]">
                                {publicWorkflows}
                            </p>
                            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                                Shared
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-4 py-4">
                        <div className="w-10 h-10 rounded-[12px] bg-[var(--warning-dim)] border border-[rgba(251,191,36,0.3)] flex items-center justify-center">
                            <GitBranch className="w-4 h-4 text-[var(--warning)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-light text-[var(--text-primary)]">
                                {symfonyVersions.length > 0
                                    ? symfonyVersions.join(", ")
                                    : "--"}
                            </p>
                            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                                Symfony Versions
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Workflows */}
            <div>
                <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-4">
                    Your Workflows
                </h2>

                {workflows.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
                            <Logo size={48} className="opacity-30" />
                            <div className="text-center">
                                <p className="text-sm text-[var(--text-secondary)]">
                                    No workflows yet
                                </p>
                                <p className="text-xs text-[var(--text-muted)] mt-1">
                                    Create your first Symfony workflow to get started
                                </p>
                            </div>
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
                        <Link href="/editor">
                            <Card className="h-full border-dashed hover:border-[var(--accent-border)] hover:bg-[var(--accent-dim)] transition-all cursor-pointer flex items-center justify-center min-h-[180px]">
                                <CardContent className="flex flex-col items-center gap-3">
                                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-[var(--glass-border-hover)] flex items-center justify-center">
                                        <Plus className="w-4 h-4 text-[var(--text-muted)]" />
                                    </div>
                                    <span className="text-xs text-[var(--text-secondary)]">
                                        New Workflow
                                    </span>
                                </CardContent>
                            </Card>
                        </Link>
                        {workflows.map((workflow) => (
                            <Card
                                key={workflow.id}
                                className="group hover:border-[var(--glass-border-hover)] transition-all"
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <CardTitle className="text-sm font-mono truncate">
                                                {workflow.name}
                                            </CardTitle>
                                            {workflow.description && (
                                                <CardDescription className="text-[10px] mt-1 truncate">
                                                    {workflow.description}
                                                </CardDescription>
                                            )}
                                        </div>
                                        <Badge variant="outline" className="shrink-0">
                                            {workflow.type}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Badge variant="default" className="text-[9px]">
                                            Symfony {workflow.symfonyVersion}
                                        </Badge>
                                        <Badge variant="outline" className="text-[9px]">
                                            {(
                                                workflow.graphJson as {
                                                    nodes?: unknown[];
                                                }
                                            )?.nodes?.filter(
                                                (n) =>
                                                    n &&
                                                    typeof n === "object" &&
                                                    "type" in
                                                        (n as Record<string, unknown>) &&
                                                    (n as Record<string, unknown>)
                                                        .type === "state"
                                            )?.length ?? 0}{" "}
                                            states
                                        </Badge>
                                        {workflow.isPublic && (
                                            <Badge
                                                variant="success"
                                                className="text-[9px]"
                                            >
                                                public
                                            </Badge>
                                        )}
                                        {workflow._count.versions > 0 && (
                                            <Badge
                                                variant="outline"
                                                className="text-[9px]"
                                            >
                                                {workflow._count.versions} version
                                                {workflow._count.versions > 1 ? "s" : ""}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
                                        <Clock className="w-3 h-3" />
                                        {formatDistanceToNow(workflow.updatedAt, {
                                            addSuffix: true,
                                        })}
                                    </div>

                                    <WorkflowActions
                                        workflowId={workflow.id}
                                        workflowName={workflow.name}
                                        workflowType={workflow.type}
                                        symfonyVersion={workflow.symfonyVersion}
                                        shareId={workflow.shareId}
                                        graphJson={
                                            workflow.graphJson as Record<string, unknown>
                                        }
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
