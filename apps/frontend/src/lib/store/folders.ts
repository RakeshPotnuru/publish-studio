import type { Types } from "mongoose";
import { create } from "zustand";

export interface IFolder {
    _id: Types.ObjectId;
    name: string;
    projects?: Types.ObjectId[];
}

interface IFolderState {
    folders: IFolder[];
    setFolders: (folders: IFolder[]) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

const useFoldersStore = create<IFolderState>(set => ({
    folders: [],
    setFolders: folders => set(state => ({ ...state, folders })),
    isLoading: true,
    setIsLoading: isLoading => set(state => ({ ...state, isLoading })),
}));

export default useFoldersStore;
