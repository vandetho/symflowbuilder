"use client";

import { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";

interface CopyCommandProps {
    command: string;
}

export function CopyCommand({ command }: CopyCommandProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="glass-sm rounded-[10px] px-5 py-3 font-mono text-sm text-[var(--text-primary)] flex items-center gap-3 cursor-pointer hover:border-[var(--glass-border-hover)] transition-colors"
        >
            <Terminal className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
            <span className="flex-1 text-left">{command}</span>
            {copied ? (
                <Check className="w-3.5 h-3.5 text-[var(--success)] shrink-0" />
            ) : (
                <Copy className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
            )}
        </button>
    );
}
