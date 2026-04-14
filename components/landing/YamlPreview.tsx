"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const YAML_SAMPLE = `framework:
    workflows:
        article_publishing:
            type: workflow
            marking_store:
                type: method
                property: currentState
            supports:
                - App\\Entity\\Article
            initial_marking:
                - draft
            places:
                draft:
                    metadata:
                        color: '#7c6ff7'
                review: ~
                approved: ~
                rejected: ~
                published: ~
            transitions:
                submit:
                    from: draft
                    to: review
                approve:
                    from: review
                    to: approved
                    guard: 'is_granted("ROLE_EDITOR")'
                reject:
                    from: review
                    to: rejected
                publish:
                    from: approved
                    to: published
                revise:
                    from: rejected
                    to: draft`;

export function YamlPreview() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(YAML_SAMPLE);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative glass-strong rounded-[18px] overflow-hidden shadow-[0_16px_64px_rgba(0,0,0,0.4)]">
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[rgba(248,113,113,0.6)]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[rgba(251,191,36,0.6)]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[rgba(52,211,153,0.6)]" />
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono ml-2">
                        article_publishing.yaml
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-6 px-2 text-[10px] gap-1"
                >
                    {copied ? (
                        <Check className="w-3 h-3 text-[var(--success)]" />
                    ) : (
                        <Copy className="w-3 h-3" />
                    )}
                    {copied ? "Copied" : "Copy"}
                </Button>
            </div>
            {/* Code */}
            <div className="p-4 overflow-auto max-h-[400px]">
                <pre className="text-[11px] font-mono leading-[1.7] text-[var(--text-secondary)]">
                    {YAML_SAMPLE.split("\n").map((line, i) => (
                        <div key={i} className="flex">
                            <span className="w-8 shrink-0 text-right pr-3 text-[var(--text-disabled)] select-none">
                                {i + 1}
                            </span>
                            <span>{highlightYamlLine(line)}</span>
                        </div>
                    ))}
                </pre>
            </div>
        </div>
    );
}

function highlightYamlLine(line: string) {
    // Simple YAML syntax highlighting
    // Keys
    if (line.match(/^\s*[\w_]+:/)) {
        const colonIdx = line.indexOf(":");
        const key = line.slice(0, colonIdx);
        const rest = line.slice(colonIdx);
        return (
            <>
                <span className="text-[var(--accent-bright)]">{key}</span>
                <span className="text-[var(--text-muted)]">:</span>
                <span>{highlightValue(rest.slice(1))}</span>
            </>
        );
    }
    // List items
    if (line.match(/^\s*- /)) {
        const dashIdx = line.indexOf("-");
        const indent = line.slice(0, dashIdx);
        const rest = line.slice(dashIdx + 2);
        return (
            <>
                <span>{indent}</span>
                <span className="text-[var(--text-muted)]">- </span>
                <span>{highlightValue(rest)}</span>
            </>
        );
    }
    return <span>{line}</span>;
}

function highlightValue(value: string) {
    const trimmed = value.trim();
    // Strings in quotes
    if (trimmed.startsWith("'") || trimmed.startsWith('"')) {
        return <span className="text-[var(--success)]">{value}</span>;
    }
    // Comments / null
    if (trimmed === "~") {
        return <span className="text-[var(--text-disabled)]">{value}</span>;
    }
    // Booleans / numbers
    if (["true", "false"].includes(trimmed) || /^\d+$/.test(trimmed)) {
        return <span className="text-[var(--warning)]">{value}</span>;
    }
    return <span className="text-[var(--text-primary)]">{value}</span>;
}
