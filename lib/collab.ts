/**
 * Optional collab integration.
 *
 * The @symflowbuilder/collab package is proprietary and not included
 * in the open source repository. The app works fully without it.
 *
 * When available, it provides:
 * - Real-time multiplayer editing
 * - Live cursor positions
 * - Presence indicators (who's online)
 * - Conflict-free change broadcasting
 */

export interface CollabModule {
    CollabClient: unknown;
    useCollabStore: unknown;
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
        collabModule = await import("@symflowbuilder/collab");
    } catch {
        // Package not installed — this is expected in the open source version
        collabModule = null;
    }

    return collabModule;
}

/** Synchronous check — only valid after loadCollab() has resolved */
export function isCollabAvailable(): boolean {
    return collabModule !== null;
}
