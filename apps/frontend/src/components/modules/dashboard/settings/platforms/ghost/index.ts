import type { Types } from "mongoose";

import { constants } from "@/config/constants";

export type TGhostStatus = (typeof constants.ghostStatuses)[keyof typeof constants.ghostStatuses];

export interface IGhostResponse {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    api_url: string;
    admin_api_key: string;
    default_publish_status: TGhostStatus;
    created_at: Date;
    updated_at: Date;
}

export { GhostConnectForm } from "./connect-form";
export { GhostEditForm } from "./edit-form";
