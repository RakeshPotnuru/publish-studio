import { TPlatformName } from "@/types/common";
import type { Types } from "mongoose";
import { create } from "zustand";

interface IUser {
    _id: Types.ObjectId;
    email: string;
    first_name: string;
    last_name: string;
    profile_pic?: string;
    platforms: TPlatformName[];
}

interface IUserState {
    user: IUser | null;
    setUser: (user: IUser) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

const useUserStore = create<IUserState>(set => ({
    user: null,
    setUser: user => set(state => ({ ...state, user })),
    isLoading: true,
    setIsLoading: isLoading => set(state => ({ ...state, isLoading })),
}));

export default useUserStore;
