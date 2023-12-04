import type { Types } from "mongoose";

import type { constants } from "../../config/constants";
import type { IPagination } from "../../types/common.types";
import type { IDevTo } from "./devto/devto.types";
import type { IHashnode } from "./hashnode/hashnode.types";
import type { IMedium } from "./medium/medium.types";

export interface IPlatform {
    _id?: Types.ObjectId;
    user_id?: Types.ObjectId;
    name: (typeof constants.user.platforms)[keyof typeof constants.user.platforms];
    data: IHashnode | IMedium | IDevTo;
    pagination?: IPagination;
}

export type TPlatformName =
    (typeof constants.user.platforms)[keyof typeof constants.user.platforms];
