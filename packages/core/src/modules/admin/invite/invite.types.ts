import type { Types } from "mongoose";

import type { IPagination } from "../../../types/common.types";

export interface IInvite {
  _id: Types.ObjectId;
  email: string;
  is_invited: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IInvitesResponse {
  invites: IInvite[];
  pagination: IPagination;
}

export type TInviteCreate = Pick<IInvite, "email">;
