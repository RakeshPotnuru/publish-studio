import { constants } from "@/config/constants";
import { IPagination } from "@/types/common";
import { Types } from "mongoose";
import { create } from "zustand";

type TProjectStatus = (typeof constants.project.status)[keyof typeof constants.project.status];

export interface IProject {
    _id: Types.ObjectId;
    title: string;
    status: TProjectStatus;
    created: Date;
    last_edited: Date;
}

interface IProjectState {
    projects: IProject[];
    setProjects: (projects: IProject[]) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

const useProjectsStore = create<IProjectState>(set => ({
    projects: [],
    setProjects: projects => set(state => ({ ...state, projects })),
    isLoading: true,
    setIsLoading: isLoading => set(state => ({ ...state, isLoading })),
}));

export default useProjectsStore;
