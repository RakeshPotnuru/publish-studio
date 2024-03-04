import { TRPCError } from "@trpc/server";

import { EmailTemplate } from "../../../config/constants";
import type { IPaginationOptions } from "../../../types/common.types";
import { sendEmail } from "../../../utils/sendgrid";
import AuthService from "../../auth/auth.service";
import InviteService from "./invite.service";
import type { IInvite, TInviteCreate } from "./invite.types";

export default class InviteController extends InviteService {
  async addToWaitListHandler(input: TInviteCreate) {
    if (await new AuthService().isDisposableEmail(input.email)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Disposable email is not allowed",
      });
    }

    const invite = await super.getInviteByEmail(input.email);

    if (invite) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Email already in wait list",
      });
    }

    await super.createInvite(input);

    return {
      status: "success",
      data: {
        message: "Email added to wait list",
      },
    };
  }

  async inviteHandler(input: IInvite["_id"][]) {
    const invites = await super.getInvitesByIds(input);

    const nonInvitedInvites = invites.filter((invite) => !invite.is_invited);

    if (nonInvitedInvites.length === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No invites to invite",
      });
    }

    await super.invite(nonInvitedInvites.map((invite) => invite._id));

    await sendEmail(
      nonInvitedInvites.map((invite) => invite.email),
      EmailTemplate.INVITE,
      process.env.FROM_EMAIL_PERSONAL
    );

    return {
      status: "success",
      data: {
        message: "Invited users",
      },
    };
  }

  async getAllHandler(input: { pagination: IPaginationOptions }) {
    const { invites, pagination } = await super.getAllInvites(input.pagination);

    return {
      status: "success",
      data: {
        invites,
        pagination,
      },
    };
  }

  async deleteInvitesHandler(input: IInvite["_id"][]) {
    await super.deleteInvites(input);

    return {
      status: "success",
      data: {
        message: "Invites deleted",
      },
    };
  }
}
