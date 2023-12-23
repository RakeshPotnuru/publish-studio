import type { Types } from "mongoose";
import { create } from "zustand";

import { constants } from "@/config/constants";
import { TPlatformName } from "@/types/common";

type TProjectStatus = (typeof constants.project.status)[keyof typeof constants.project.status];
export type TPlatformPublishStatus =
    (typeof constants.project.platformPublishStatuses)[keyof typeof constants.project.platformPublishStatuses];

export interface THashnodeTag {
    name: string;
    id: string;
}

export interface TTags {
    hashnode_tags?: THashnodeTag[];
    devto_tags?: string[];
    medium_tags?: string[];
    ghost_tags?: { name: string }[];
}

export interface IProject {
    _id: Types.ObjectId;
    title: string;
    description?: string;
    status: TProjectStatus;
    created: Date;
    last_edited: Date;
    body?: { json?: JSON };
    platforms?: {
        name: TPlatformName;
        status?: TPlatformPublishStatus;
        published_url?: string;
        id?: string;
        _id: Types.ObjectId;
    }[];
    tags?: TTags;
    canonical_url?: string;
    scheduled_at?: Date;
    published_at?: Date;
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
