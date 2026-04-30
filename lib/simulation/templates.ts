import type { SimulationConfig } from "@/types/simulation";

export interface SimulationTemplate {
    id: string;
    name: string;
    description: string;
    matches?: { transitions: string[] };
    config: SimulationConfig;
}

export const SIMULATION_TEMPLATES: SimulationTemplate[] = [
    {
        id: "article-publishing",
        name: "Publishing an article",
        description:
            "A blog post moves from draft to published with a reviewer in between.",
        matches: {
            transitions: ["submit_for_review", "approve", "publish", "reject"],
        },
        config: {
            templateId: "article-publishing",
            subject: {
                id: "art_1042",
                title: "My first post",
                body: "Hello, world.",
                author: "alice",
                reviewer: null,
                reviewNotes: null,
                publishedAt: null,
            },
            effects: {
                submit_for_review: {
                    description: "Author submits the draft for editorial review.",
                    patches: [{ path: "reviewer", value: "bob" }],
                    mockRequest: {
                        method: "POST",
                        url: "/api/articles/{{id}}/submit",
                        body: { reviewer: "bob" },
                        response: {
                            status: 202,
                            body: { id: "{{id}}", status: "pending_review" },
                        },
                    },
                },
                approve: {
                    description: "Reviewer signs off on the article.",
                    patches: [{ path: "reviewNotes", value: "LGTM" }],
                    mockRequest: {
                        method: "POST",
                        url: "/api/articles/{{id}}/approve",
                        body: { notes: "LGTM" },
                        response: {
                            status: 200,
                            body: { id: "{{id}}", status: "approved" },
                        },
                    },
                },
                reject: {
                    description: "Reviewer requests changes.",
                    patches: [
                        { path: "reviewNotes", value: "Needs rework" },
                        { path: "reviewer", value: null },
                    ],
                    mockRequest: {
                        method: "POST",
                        url: "/api/articles/{{id}}/reject",
                        body: { notes: "Needs rework" },
                        response: {
                            status: 200,
                            body: { id: "{{id}}", status: "rejected" },
                        },
                    },
                },
                publish: {
                    description: "Article goes live.",
                    patches: [
                        {
                            path: "publishedAt",
                            value: "2026-04-30T10:00:00.000Z",
                        },
                    ],
                    mockRequest: {
                        method: "POST",
                        url: "/api/articles/{{id}}/publish",
                        response: {
                            status: 200,
                            body: {
                                id: "{{id}}",
                                status: "published",
                                url: "https://example.com/blog/{{id}}",
                            },
                        },
                    },
                },
            },
        },
    },
    {
        id: "order-fulfillment",
        name: "Order fulfillment",
        description: "An e-commerce order moves through pick, pack, and ship.",
        matches: { transitions: ["pay", "pack", "ship", "deliver", "cancel"] },
        config: {
            templateId: "order-fulfillment",
            subject: {
                orderId: "ORD-1042",
                customer: "alice@example.com",
                amount: 79.5,
                items: 3,
                tracking: null,
            },
            effects: {
                pay: { patches: [{ path: "paidAt", value: "2026-04-30T09:00:00.000Z" }] },
                pack: { patches: [{ path: "packedBy", value: "warehouse-1" }] },
                ship: {
                    patches: [{ path: "tracking", value: "1Z999AA10123456784" }],
                },
                deliver: {
                    patches: [{ path: "deliveredAt", value: "2026-05-02T14:30:00.000Z" }],
                },
                cancel: {
                    patches: [{ path: "cancelReason", value: "customer-request" }],
                },
            },
        },
    },
];

export function findTemplate(id: string | undefined): SimulationTemplate | null {
    if (!id) return null;
    return SIMULATION_TEMPLATES.find((t) => t.id === id) ?? null;
}
