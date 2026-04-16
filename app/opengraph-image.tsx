import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SymFlowBuilder — Visual Symfony Workflow Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "linear-gradient(135deg, #08080f 0%, #1a1040 30%, #0d2040 60%, #1a0d30 80%, #08080f 100%)",
                fontFamily: "sans-serif",
            }}
        >
            {/* Glow effect */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 500,
                    height: 500,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(124,111,247,0.15) 0%, transparent 70%)",
                }}
            />

            {/* Logo circle */}
            <div
                style={{
                    width: 80,
                    height: 80,
                    borderRadius: 20,
                    background: "linear-gradient(135deg, #7c6ff7, #9d94ff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 32,
                    boxShadow: "0 0 60px rgba(124,111,247,0.3)",
                }}
            >
                <div
                    style={{
                        color: "white",
                        fontSize: 36,
                        fontWeight: 700,
                        letterSpacing: -1,
                    }}
                >
                    SF
                </div>
            </div>

            {/* Title */}
            <div
                style={{
                    fontSize: 52,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.92)",
                    letterSpacing: -1,
                    marginBottom: 16,
                }}
            >
                Sym
                <span style={{ fontWeight: 600 }}>FlowBuilder</span>
            </div>

            {/* Subtitle */}
            <div
                style={{
                    fontSize: 22,
                    color: "rgba(255,255,255,0.55)",
                    maxWidth: 600,
                    textAlign: "center",
                    lineHeight: 1.5,
                }}
            >
                Design Symfony workflow configurations visually, then export
                production-ready YAML
            </div>

            {/* Version badges */}
            <div
                style={{
                    display: "flex",
                    gap: 12,
                    marginTop: 40,
                }}
            >
                {["5.4", "6.4", "7.4", "8.0"].map((v) => (
                    <div
                        key={v}
                        style={{
                            padding: "8px 20px",
                            borderRadius: 10,
                            background: "rgba(255,255,255,0.07)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.55)",
                            fontSize: 16,
                        }}
                    >
                        Symfony {v}
                    </div>
                ))}
            </div>

            {/* Bottom tagline */}
            <div
                style={{
                    position: "absolute",
                    bottom: 32,
                    fontSize: 14,
                    color: "rgba(255,255,255,0.3)",
                }}
            >
                symflowbuilder.com — Free & Open Source
            </div>
        </div>,
        { ...size }
    );
}
