/**
 * Optional collab integration.
 *
 * The @symflowbuilder/collab package is proprietary and not included
 * in the open source repository. The app works fully without it.
 *
 * When available, it provides:
 * - Real-time multiplayer editing via WebSocket + Yjs
 * - Live cursor positions on the canvas
 * - Presence indicators (who's online)
 * - Conflict-free concurrent editing
 */

export interface CollabModule {
    CollabClient: unknown;
    useCollabStore: unknown;
    bindYjsToEditorStore: unknown;
    CursorOverlay: React.ComponentType;
    PresenceBar: React.ComponentType;
}

let collabModule: CollabModule | null = null;
let loadAttempted = false;

/**
 * Attempts to load the collab package. Returns null if not available.
 * Safe to call multiple times — caches the result.
 */
export async function loadCollab(): Promise<CollabModule | null> {
    if (loadAttempted) return collabModule;
    loadAttempted = true;

    try {
        collabModule =
            (await import("@symflowbuilder/collab")) as unknown as CollabModule;
    } catch {
        collabModule = null;
    }

    return collabModule;
}

/** Synchronous check — only valid after loadCollab() has resolved */
export function isCollabAvailable(): boolean {
    return collabModule !== null;
}
