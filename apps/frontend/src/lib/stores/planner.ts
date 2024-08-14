import type { ISection } from "@publish-studio/core";
import { create } from "zustand";

export interface IPlannerState {
  sections: ISection[];
  setSections: (update: (sections: ISection[]) => ISection[]) => void;
  reorderSections: (sections: ISection[]) => void;
}

const usePlannerStore = create<IPlannerState>((set) => ({
  sections: [],
  setSections: (update) =>
    set((state) => ({ sections: update(state.sections) })),
  reorderSections: (sections) => set({ sections }),
}));

export default usePlannerStore;
