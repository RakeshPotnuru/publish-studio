import type { Types } from "mongoose";

import type { Platform } from "../../config/constants";
import type { IPagination } from "../../types/common.types";
import type { IBlogger } from "./blogger/blogger.types";
import type { IDevTo } from "./devto/devto.types";
import type { IGhost } from "./ghost/ghost.types";
import type { IHashnode } from "./hashnode/hashnode.types";
import type { IMedium } from "./medium/medium.types";
import type { IWordPress } from "./wordpress/wordpress.types";

export interface IPlatform {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  name: Platform;
  data: Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

type TPlatform<T extends Platform> = T extends "hashnode"
  ? IHashnode
  : T extends "medium"
    ? IMedium
    : T extends "devto"
      ? IDevTo
      : T extends "ghost"
        ? IGhost
        : T extends "wordpress"
          ? IWordPress
          : T extends "blogger"
            ? IBlogger
            : never;

export interface IPlatformResponse<T extends Platform = Platform> {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  name: Platform;
  data: TPlatform<T>;
  created_at: Date;
  updated_at: Date;
}

export interface IPlatformsResponse {
  platforms: IPlatformResponse[];
  pagination: IPagination;
}
