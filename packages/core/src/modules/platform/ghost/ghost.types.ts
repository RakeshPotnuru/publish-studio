import type { Types } from "mongoose";

import type { constants } from "../../../config/constants";

export type TGhostStatus = (typeof constants.ghostStatuses)[keyof typeof constants.ghostStatuses];

export interface IGhost {
    _id?: Types.ObjectId;
    user_id?: Types.ObjectId;
    api_url: string;
    admin_api_key: string;
    default_publish_status: TGhostStatus;
}

export type TGhostUpdate = Partial<IGhost>;

export interface IGhostResponse {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    api_url: string;
    admin_api_key: string;
    default_publish_status: TGhostStatus;
    created_at: Date;
    updated_at: Date;
}

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

export type TGhostUpdatePostInput = Partial<IGhostCreatePostInput> & { updated_at: Date };

export interface IGhostUpdatePostOutput {
    isError: boolean;
}
