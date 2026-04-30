export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface FieldPatch {
    path: string;
    value: JsonValue;
    op?: "set" | "push" | "remove";
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface MockResponse {
    status: number;
    body?: JsonValue;
}

export interface MockRequest {
    method: HttpMethod;
    url: string;
    body?: JsonValue;
    response?: MockResponse;
}

export interface TransitionEffect {
    description?: string;
    patches?: FieldPatch[];
    mockRequest?: MockRequest;
}

export interface SimulationConfig {
    subject: Record<string, JsonValue>;
    effects?: Record<string, TransitionEffect>;
    templateId?: string;
}

export const EMPTY_SIMULATION_CONFIG: SimulationConfig = {
    subject: {},
    effects: {},
};
