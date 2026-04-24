"use client";

import { useState } from "react";
import { highlight } from "sugar-high";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
    code: string;
    title?: string;
}

export function CodeBlock({ code, title }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);
    const html = highlight(code);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="glass rounded-[14px] overflow-hidden code-highlight">
            {title && (
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--glass-border)]">
                    <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                        {title}
                    </span>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
                    >
                        {copied ? (
                            <>
                                <Check className="w-3 h-3 text-[var(--success)]" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy className="w-3 h-3" />
                                Copy
                            </>
                        )}
                    </button>
                </div>
            )}
            {!title && (
                <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer z-10"
                >
                    {copied ? (
                        <Check className="w-3 h-3 text-[var(--success)]" />
                    ) : (
                        <Copy className="w-3 h-3" />
                    )}
                </button>
            )}
            <div className="p-4 overflow-x-auto relative">
                <pre className="text-[11px] leading-[1.6] font-mono whitespace-pre">
                    <code dangerouslySetInnerHTML={{ __html: html }} />
                </pre>
            </div>
        </div>
    );
}
