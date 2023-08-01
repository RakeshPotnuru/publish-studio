import type { Types } from "mongoose";

import type { project } from "../../utils/constants";

export interface IPlatform {
    user_id: Types.ObjectId;
    platform_name: (typeof project.platforms)[keyof typeof project.platforms];
    api_key: string;
    username: string;
    medium_author_id?: string;
    hashnode_publication_id?: string;
    profile_pic?: string;
}
