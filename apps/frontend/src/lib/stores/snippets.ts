import type { ISnippet } from "@publish-studio/core";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface SnippetsState {
  snippets: ISnippet[];
  setSnippets: (snippets: ISnippet[]) => void;
  activeSnippet?: ISnippet;
  setActiveSnippet: (snippet: ISnippet | null) => void;
  isAutoSaving: boolean;
  setIsAutoSaving: (isAutoSaving: boolean) => void;
}

interface SnippetsActions {
  addSnippet: (snippet: ISnippet) => void;
  removeSnippet: (id: ISnippet["_id"]) => void;
  updateSnippet: (snippet: ISnippet) => void;
}

export const useSnippets = create<SnippetsState & SnippetsActions>()(
  immer((set) => ({
    snippets: [],
    setSnippets: (snippets) =>
      set(() => ({
        snippets,
      })),
    setActiveSnippet: (snippet) =>
      set(() => ({
        activeSnippet: snippet,
      })),
    addSnippet: (snippet) =>
      set((state) => {
        state.snippets.unshift(snippet);
      }),
    isAutoSaving: false,
    setIsAutoSaving: (isAutoSaving) =>
      set(() => ({
        isAutoSaving,
      })),
    removeSnippet: (id) =>
      set((state) => {
        state.snippets = state.snippets.filter((snippet) => snippet._id !== id);
      }),
    updateSnippet: (snippet) =>
      set((state) => {
        const index = state.snippets.findIndex((s) => s._id === snippet._id);

        if (index === -1) return;

        state.snippets[index] = snippet;
      }),
  })),
);
