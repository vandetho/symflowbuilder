import type {
    FieldPatch,
    JsonValue,
    MockRequest,
    SimulationConfig,
    TransitionEffect,
} from "@/types/simulation";

function parsePath(path: string): string[] {
    return path
        .replace(/^\$?\.?/, "")
        .split(/\.|\[(\d+)\]/)
        .filter((seg): seg is string => Boolean(seg) && seg.length > 0);
}

function isObject(v: unknown): v is Record<string, JsonValue> {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}

function setAt(
    target: Record<string, JsonValue> | JsonValue[],
    segments: string[],
    value: JsonValue
): void {
    if (segments.length === 0) return;
    let cursor: JsonValue = target as JsonValue;
    for (let i = 0; i < segments.length - 1; i++) {
        const seg = segments[i];
        const next = segments[i + 1];
        const wantArray = /^\d+$/.test(next);
        if (Array.isArray(cursor)) {
            const idx = Number(seg);
            if (
                cursor[idx] === null ||
                cursor[idx] === undefined ||
                typeof cursor[idx] !== "object"
            ) {
                cursor[idx] = wantArray ? [] : {};
            }
            cursor = cursor[idx];
        } else if (isObject(cursor)) {
            if (
                cursor[seg] === null ||
                cursor[seg] === undefined ||
                typeof cursor[seg] !== "object"
            ) {
                cursor[seg] = wantArray ? [] : {};
            }
            cursor = cursor[seg];
        }
    }
    const last = segments[segments.length - 1];
    if (Array.isArray(cursor)) {
        cursor[Number(last)] = value;
    } else if (isObject(cursor)) {
        cursor[last] = value;
    }
}

function pushAt(
    target: Record<string, JsonValue> | JsonValue[],
    segments: string[],
    value: JsonValue
): void {
    let cursor: JsonValue = target as JsonValue;
    for (const seg of segments) {
        if (Array.isArray(cursor)) {
            cursor = cursor[Number(seg)];
        } else if (isObject(cursor)) {
            if (cursor[seg] === null || cursor[seg] === undefined) {
                cursor[seg] = [];
            }
            cursor = cursor[seg];
        }
    }
    if (Array.isArray(cursor)) {
        cursor.push(value);
    }
}

function removeAt(
    target: Record<string, JsonValue> | JsonValue[],
    segments: string[]
): void {
    if (segments.length === 0) return;
    let cursor: JsonValue = target as JsonValue;
    for (let i = 0; i < segments.length - 1; i++) {
        const seg = segments[i];
        if (Array.isArray(cursor)) {
            cursor = cursor[Number(seg)];
        } else if (isObject(cursor)) {
            cursor = cursor[seg];
        }
        if (cursor === null || cursor === undefined) return;
    }
    const last = segments[segments.length - 1];
    if (Array.isArray(cursor)) {
        cursor.splice(Number(last), 1);
    } else if (isObject(cursor)) {
        delete cursor[last];
    }
}

export function deepClone<T>(value: T): T {
    if (typeof structuredClone === "function") return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
}

export function applyPatch(
    subject: Record<string, JsonValue>,
    patch: FieldPatch
): Record<string, JsonValue> {
    const segments = parsePath(patch.path);
    if (segments.length === 0) return subject;
    const op = patch.op ?? "set";
    if (op === "set") setAt(subject, segments, patch.value);
    else if (op === "push") pushAt(subject, segments, patch.value);
    else if (op === "remove") removeAt(subject, segments);
    return subject;
}

export function applyEffect(
    subject: Record<string, JsonValue>,
    effect: TransitionEffect | undefined
): Record<string, JsonValue> {
    const next = deepClone(subject);
    if (!effect?.patches) return next;
    for (const p of effect.patches) applyPatch(next, p);
    return next;
}

export function diffPaths(
    before: Record<string, JsonValue>,
    after: Record<string, JsonValue>,
    prefix: string[] = []
): string[] {
    const changed: string[] = [];
    const keys = new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]);
    for (const k of keys) {
        const a = (before as Record<string, JsonValue> | undefined)?.[k];
        const b = (after as Record<string, JsonValue> | undefined)?.[k];
        if (isObject(a) && isObject(b)) {
            changed.push(...diffPaths(a, b, [...prefix, k]));
        } else if (JSON.stringify(a) !== JSON.stringify(b)) {
            changed.push([...prefix, k].join("."));
        }
    }
    return changed;
}

export function ensureConfig(
    config: SimulationConfig | null | undefined
): SimulationConfig {
    return {
        subject: config?.subject ?? {},
        effects: config?.effects ?? {},
        templateId: config?.templateId,
    };
}

function readPath(
    subject: Record<string, JsonValue>,
    path: string
): JsonValue | undefined {
    const segments = path
        .replace(/^\$?\.?/, "")
        .split(/\.|\[(\d+)\]/)
        .filter((s): s is string => Boolean(s) && s.length > 0);
    let cursor: JsonValue | undefined = subject as JsonValue;
    for (const seg of segments) {
        if (cursor === null || cursor === undefined) return undefined;
        if (Array.isArray(cursor)) {
            cursor = cursor[Number(seg)];
        } else if (isObject(cursor)) {
            cursor = cursor[seg];
        } else {
            return undefined;
        }
    }
    return cursor;
}

export function interpolate(
    template: string,
    subject: Record<string, JsonValue>
): string {
    return template.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, expr: string) => {
        const value = readPath(subject, expr.trim());
        if (value === undefined || value === null) return "";
        if (typeof value === "string") return value;
        return JSON.stringify(value);
    });
}

function interpolateValue(
    value: JsonValue,
    subject: Record<string, JsonValue>
): JsonValue {
    if (typeof value === "string") return interpolate(value, subject);
    if (Array.isArray(value)) {
        return value.map((v) => interpolateValue(v, subject));
    }
    if (isObject(value)) {
        const next: Record<string, JsonValue> = {};
        for (const [k, v] of Object.entries(value)) {
            next[k] = interpolateValue(v, subject);
        }
        return next;
    }
    return value;
}

export function resolveMockRequest(
    request: MockRequest | undefined,
    subject: Record<string, JsonValue>
): MockRequest | undefined {
    if (!request) return undefined;
    return {
        method: request.method,
        url: interpolate(request.url, subject),
        body:
            request.body === undefined
                ? undefined
                : interpolateValue(request.body, subject),
        response: request.response
            ? {
                  status: request.response.status,
                  body:
                      request.response.body === undefined
                          ? undefined
                          : interpolateValue(request.response.body, subject),
              }
            : undefined,
    };
}
