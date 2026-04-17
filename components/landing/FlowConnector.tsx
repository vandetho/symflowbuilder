"use client";

/**
 * Animated dashed line connector between landing page sections.
 * Mimics the editor's transition edges.
 */
export function FlowConnector({
    height = 80,
    label,
}: {
    height?: number;
    label?: string;
}) {
    return (
        <div className="relative flex items-center justify-center" style={{ height }}>
            <svg
                width="2"
                height={height}
                className="absolute"
                style={{ overflow: "visible" }}
            >
                <line
                    x1="1"
                    y1="0"
                    x2="1"
                    y2={height}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                >
                    <animate
                        attributeName="stroke-dashoffset"
                        from="0"
                        to="-20"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                </line>
            </svg>
            {/* Dot at top */}
            <div className="absolute top-0 w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]" />
            {/* Label */}
            {label && (
                <div className="absolute px-2.5 py-1 rounded-[8px] text-[10px] font-mono text-[var(--text-muted)] bg-[rgba(0,0,0,0.5)] border border-[var(--glass-border)]">
                    {label}
                </div>
            )}
            {/* Dot at bottom */}
            <div className="absolute bottom-0 w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]" />
        </div>
    );
}

/**
 * A section wrapper styled like a workflow state node.
 */
export function FlowNode({
    id,
    label,
    isInitial,
    isFinal,
    children,
    className,
}: {
    id?: string;
    label?: string;
    isInitial?: boolean;
    isFinal?: boolean;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section id={id} className={`relative px-6 w-full ${className ?? ""}`}>
            {/* Node accent bar */}
            {isInitial && (
                <div className="max-w-5xl mx-auto mb-0">
                    <div className="h-[2px] w-24 mx-auto rounded-full bg-[var(--accent)]" />
                </div>
            )}
            {isFinal && (
                <div className="max-w-5xl mx-auto mb-0">
                    <div className="h-[2px] w-24 mx-auto rounded-full bg-[var(--success)]" />
                </div>
            )}
            {/* Node label */}
            {label && (
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] glass-sm">
                        <span
                            className={`w-1.5 h-1.5 rounded-full ${isInitial ? "bg-[var(--accent)]" : isFinal ? "bg-[var(--success)]" : "bg-[rgba(255,255,255,0.25)]"}`}
                        />
                        <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                            {label}
                        </span>
                    </div>
                </div>
            )}
            {children}
        </section>
    );
}
