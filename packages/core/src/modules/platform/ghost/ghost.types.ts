import type { Types } from "mongoose";

import type { constants } from "../../../config/constants";

export type TGhostStatus = (typeof constants.ghostStatuses)[keyof typeof constants.ghostStatuses];

export interface IGhost {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    api_url: string;
    admin_api_key: string;
    status: TGhostStatus;
    created_at: Date;
    updated_at: Date;
}

export type TGhostCreateInput = Omit<IGhost, "_id" | "created_at" | "updated_at">;

export type TGhostCreateFormInput = Omit<TGhostCreateInput, "user_id">;

export type TGhostUpdateInput = Partial<TGhostCreateInput>;

export interface IGhostSiteOutput {
    result: {
        data: {
            success: boolean;
            data: {
                title: string;
                description: string;
                logo: string;
                version: string;
                url: string;
            };
        };
    };
}

export interface IGhostCreatePostInput {
    title: string;
    html?: string;
    canonical_url?: string;
    status?: TGhostStatus;
    tags?: { name: string }[];
}

export type TGhostUpdatePostInput = Partial<IGhostCreatePostInput> & {
    updated_at: Date;
    post_id: string;
};

export interface IGhostUpdatePostOutput {
    isError: boolean;
}
