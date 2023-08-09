import type { Types } from "mongoose";

import type { user } from "../../utils/constants";
import type { IDevTo } from "./devto/devto.types";
import type { IHashnode } from "./hashnode/hashnode.types";
import type { IMedium } from "./medium/medium.types";

export interface IPlatform {
    _id?: Types.ObjectId;
    user_id?: Types.ObjectId;
    name: (typeof user.platforms)[keyof typeof user.platforms];
    data: IHashnode | IMedium | IDevTo;
}
