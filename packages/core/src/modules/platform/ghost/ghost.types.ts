import type { Types } from "mongoose";

export type TGhostStatus = "published" | "draft";

export interface IGhost {
    _id?: Types.ObjectId;
    user_id?: Types.ObjectId;
    api_url: string;
    admin_api_key: string;
    ghost_version: `v5.${string}`;
    default_publish_status: TGhostStatus;
}

export type TGhostUpdate =
    | {
          api_url: string;
          admin_api_key: string;
          ghost_version: `v5.${string}`;
          default_publish_status: TGhostStatus;
      }
    | {
          api_url: string;
          ghost_version: `v5.${string}`;
          default_publish_status: TGhostStatus;
          admin_api_key?: string;
      };

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

export interface IGhostPostInput {
    title: string;
    html?: string;
    canonical_url?: string;
    status?: TGhostStatus;
    tags?: { name: string }[];
}

export type TGhostPostUpdate = Partial<IGhostPostInput> & { updated_at: Date };
