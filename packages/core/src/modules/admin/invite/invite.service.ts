import { TRPCError } from "@trpc/server";

import type { IPaginationOptions } from "../../../types/common.types";
import { logtail } from "../../../utils/logtail";
import AuthService from "../../auth/auth.service";
import Invite from "./invite.model";
import type { IInvite, IInvitesResponse, TInviteCreate } from "./invite.types";

export default class InviteService extends AuthService {
  async createInvite(invite: TInviteCreate): Promise<boolean> {
    try {
      await Invite.create(invite);

      return true;
    } catch (error) {
      await logtail.error(JSON.stringify(error));

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while creating the invite. Please try again later.",
      });
    }
  }

  async invite(emails: string[]): Promise<boolean> {
    try {
      await Invite.updateMany(
        { email: { $in: emails } },
        { is_invited: true }
      ).exec();

      return true;
    } catch (error) {
      await logtail.error(JSON.stringify(error));

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while inviting the user. Please try again later.",
      });
    }
  }

  async getAllInvites(
    pagination: IPaginationOptions
  ): Promise<IInvitesResponse> {
    try {
      const total_rows = await Invite.countDocuments().exec();
      const total_pages = Math.ceil(total_rows / pagination.limit);

      const invites = (await Invite.find()
        .skip((pagination.page - 1) * pagination.limit)
        .limit(pagination.limit)
        .sort({ updated_at: -1 })
        .exec()) as IInvite[];

      return {
        invites,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total_rows,
          total_pages,
        },
      };
    } catch (error) {
      await logtail.error(JSON.stringify(error));

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while fetching the invites. Please try again later.",
      });
    }
  }

  async getInviteByEmail(email: string): Promise<IInvite | null> {
    try {
      return await Invite.findOne({ email }).exec();
    } catch (error) {
      await logtail.error(JSON.stringify(error));

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while fetching the invite. Please try again later.",
      });
    }
  }
}
