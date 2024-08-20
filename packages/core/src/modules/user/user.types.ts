import type { Types } from "mongoose";

import type { AuthMode, Platform, UserType } from "../../config/constants";

export interface IUser {
  _id: Types.ObjectId;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  profile_pic?: string;
  user_type: UserType;
  platforms?: Platform[];
  is_verified: boolean;
  last_login: Date;
  auth_modes: AuthMode[];
  google_sub?: string;
  customer_id?: string;
}

export type IUserUpdate = Partial<IUser>;
