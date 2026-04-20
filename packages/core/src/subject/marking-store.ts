import type { MarkingStore } from "./types";
import type { Marking } from "../engine/types";

/**
 * Marking store that reads/writes a single property on the subject, holding
 * the active place name (string) or names (string[] for parallel markings).
 *
 * Matches Symfony's default `property` marking store:
 *
 *     marking_store:
 *         type: property
 *         property: currentState
 */
export function propertyMarkingStore<T, K extends keyof T>(property: K): MarkingStore<T> {
    return {
        read(subject) {
            const value = subject[property] as unknown as string | string[] | undefined;
            if (value === undefined || value === null || value === "") return {};
            const places = Array.isArray(value) ? value : [value];
            const marking: Marking = {};
            for (const place of places) marking[place] = 1;
            return marking;
        },
        write(subject, marking) {
            const active = Object.entries(marking)
                .filter(([, count]) => count > 0)
                .map(([name]) => name);
            const next = active.length === 1 ? active[0] : active;
            (subject as Record<string, unknown>)[property as string] = next;
        },
    };
}

/**
 * Marking store that reads/writes the marking via getter/setter methods on the
 * subject. Matches Symfony's `method` marking store.
 *
 *     marking_store:
 *         type: method
 *
 * Expects `subject.getMarking()` / `subject.setMarking(value)` by default.
 */
export function methodMarkingStore<T>(options?: {
    getter?: string;
    setter?: string;
}): MarkingStore<T> {
    const getterName = options?.getter ?? "getMarking";
    const setterName = options?.setter ?? "setMarking";
    return {
        read(subject) {
            const getter = (subject as Record<string, unknown>)[getterName];
            if (typeof getter !== "function") {
                throw new Error(`Subject is missing getter method "${getterName}()"`);
            }
            const value = (getter as () => string | string[] | undefined).call(subject);
            if (value === undefined || value === null || value === "") return {};
            const places = Array.isArray(value) ? value : [value];
            const marking: Marking = {};
            for (const place of places) marking[place] = 1;
            return marking;
        },
        write(subject, marking) {
            const setter = (subject as Record<string, unknown>)[setterName];
            if (typeof setter !== "function") {
                throw new Error(
                    `Subject is missing setter method "${setterName}(value)"`
                );
            }
            const active = Object.entries(marking)
                .filter(([, count]) => count > 0)
                .map(([name]) => name);
            const next = active.length === 1 ? active[0] : active;
            (setter as (value: string | string[]) => void).call(subject, next);
        },
    };
}
