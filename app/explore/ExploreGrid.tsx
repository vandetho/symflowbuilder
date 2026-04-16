"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Search,
    Clock,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Workflow,
    Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";

interface ExploreWorkflow {
    id: string;
    name: string;
    description: string | null;
    symfonyVersion: string;
    type: string;
    shareId: string;
    graphJson: { nodes?: { type?: string }[] };
    createdAt: string;
    updatedAt: string;
    user: {
        name: string | null;
        image: string | null;
    };
}

interface ExploreResponse {
    workflows: ExploreWorkflow[];
    total: number;
    page: number;
    totalPages: number;
}

export function ExploreGrid({ isAuthenticated }: { isAuthenticated: boolean }) {
    const [search, setSearch] = useState("");
    const [type, setType] = useState("");
    const [version, setVersion] = useState("");
    const [sort, setSort] = useState("recent");
    const [page, setPage] = useState(1);
    const [data, setData] = useState<ExploreResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchWorkflows = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (type) params.set("type", type);
        if (version) params.set("version", version);
        if (sort) params.set("sort", sort);
        params.set("page", String(page));

        try {
            const res = await fetch(`/api/explore?${params}`);
            if (res.ok) {
                setData(await res.json());
            }
        } finally {
            setLoading(false);
        }
    }, [search, type, version, sort, page]);

    useEffect(() => {
        fetchWorkflows();
    }, [fetchWorkflows]);

    // Reset to page 1 when filters change
    const updateFilter =
        <T,>(setter: (v: T) => void) =>
        (v: T) => {
            setter(v);
            setPage(1);
        };

    // Debounced search
    const [searchInput, setSearchInput] = useState("");
    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 400);
        return () => clearTimeout(timeout);
    }, [searchInput]);

    return (
        <div className="flex flex-col gap-6">
            {/* ─── Filters ─── */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <Input
                        placeholder="Search workflows..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="pl-9 !font-sans"
                    />
                </div>
                <div className="flex gap-2">
                    <div className="w-[140px]">
                        <Select
                            value={type}
                            onChange={(e) => updateFilter(setType)(e.target.value)}
                            placeholder="All types"
                        >
                            <SelectItem value="">All types</SelectItem>
                            <SelectItem value="workflow">Workflow</SelectItem>
                            <SelectItem value="state_machine">State Machine</SelectItem>
                        </Select>
                    </div>
                    <div className="w-[140px]">
                        <Select
                            value={version}
                            onChange={(e) => updateFilter(setVersion)(e.target.value)}
                            placeholder="All versions"
                        >
                            <SelectItem value="">All versions</SelectItem>
                            <SelectItem value="5.4">Symfony 5.4</SelectItem>
                            <SelectItem value="6.4">Symfony 6.4</SelectItem>
                            <SelectItem value="7.4">Symfony 7.4</SelectItem>
                            <SelectItem value="8.0">Symfony 8.0</SelectItem>
                        </Select>
                    </div>
                    <div className="w-[130px]">
                        <Select
                            value={sort}
                            onChange={(e) => updateFilter(setSort)(e.target.value)}
                            placeholder="Sort by"
                        >
                            <SelectItem value="recent">Most recent</SelectItem>
                            <SelectItem value="oldest">Oldest first</SelectItem>
                            <SelectItem value="name">Name A–Z</SelectItem>
                        </Select>
                    </div>
                </div>
            </div>

            {/* ─── Results count ─── */}
            {data && !loading && (
                <p className="text-xs text-[var(--text-muted)]">
                    {data.total} workflow{data.total !== 1 ? "s" : ""} found
                </p>
            )}

            {/* ─── Loading ─── */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-5 h-5 text-[var(--accent)] animate-spin" />
                </div>
            )}

            {/* ─── Empty state ─── */}
            {!loading && data && data.workflows.length === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
                        <Logo size={48} className="opacity-30" />
                        <div className="text-center">
                            <p className="text-sm text-[var(--text-secondary)]">
                                No public workflows found
                            </p>
                            <p className="text-xs text-[var(--text-muted)] mt-1">
                                {search || type || version
                                    ? "Try adjusting your filters"
                                    : "Be the first to share a workflow with the community"}
                            </p>
                        </div>
                        {isAuthenticated ? (
                            <Link href="/editor">
                                <Button size="sm" className="gap-2">
                                    <Workflow className="w-3.5 h-3.5" />
                                    Create a Workflow
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/auth/signin">
                                <Button size="sm" variant="outline">
                                    Sign in to share workflows
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* ─── Workflow grid ─── */}
            {!loading && data && data.workflows.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.workflows.map((workflow) => {
                        const stateCount =
                            workflow.graphJson?.nodes?.filter(
                                (n) => n && n.type === "state"
                            )?.length ?? 0;

                        return (
                            <Link key={workflow.id} href={`/w/${workflow.shareId}`}>
                                <Card className="h-full group hover:border-[var(--glass-border-hover)] hover:shadow-[0_0_20px_var(--accent-glow)] transition-all cursor-pointer">
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <CardTitle className="text-sm font-mono truncate">
                                                    {workflow.name}
                                                </CardTitle>
                                                {workflow.description && (
                                                    <CardDescription className="text-[10px] mt-1 line-clamp-2">
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
                                            <Badge
                                                variant="default"
                                                className="text-[9px]"
                                            >
                                                Symfony {workflow.symfonyVersion}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="text-[9px]"
                                            >
                                                {stateCount} state
                                                {stateCount !== 1 ? "s" : ""}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {workflow.user.image ? (
                                                    <Image
                                                        src={workflow.user.image}
                                                        alt=""
                                                        width={16}
                                                        height={16}
                                                        className="w-4 h-4 rounded-full"
                                                    />
                                                ) : (
                                                    <div className="w-4 h-4 rounded-full bg-[var(--glass-overlay)]" />
                                                )}
                                                <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[100px]">
                                                    {workflow.user.name ?? "Anonymous"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
                                                <Clock className="w-3 h-3" />
                                                {formatDistanceToNow(
                                                    new Date(workflow.updatedAt),
                                                    { addSuffix: true }
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-[10px] text-[var(--accent-bright)] flex items-center gap-1">
                                                View workflow
                                                <ArrowRight className="w-3 h-3" />
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* ─── Pagination ─── */}
            {!loading && data && data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="gap-1"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        Previous
                    </Button>
                    <span className="text-xs text-[var(--text-secondary)] px-3">
                        Page {data.page} of {data.totalPages}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={page >= data.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="gap-1"
                    >
                        Next
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                </div>
            )}
        </div>
    );
}
