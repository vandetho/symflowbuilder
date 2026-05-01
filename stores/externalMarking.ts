import { create } from "zustand";

interface ExternalMarkingState {
    places: Set<string>;
    setPlaces: (places: string[]) => void;
    clear: () => void;
}

export const useExternalMarkingStore = create<ExternalMarkingState>((set) => ({
    places: new Set<string>(),
    setPlaces: (places) => set({ places: new Set(places) }),
    clear: () => set({ places: new Set<string>() }),
}));
