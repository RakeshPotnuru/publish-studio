import type { IUser } from "@publish-studio/core";
import { create } from "zustand";

interface IUserState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const useUserStore = create<IUserState>((set) => ({
  user: null,
  setUser: (user) => set((state) => ({ ...state, user })),
  isLoading: true,
  setIsLoading: (isLoading) => set((state) => ({ ...state, isLoading })),
}));

export default useUserStore;
