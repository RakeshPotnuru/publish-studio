import { TRPCError } from "@trpc/server";

import { EmailTemplate } from "../../../config/constants";
import type { IPaginationOptions } from "../../../types/common.types";
import { sendEmail } from "../../../utils/aws/ses";
import InviteService from "./invite.service";
import type { TInviteCreate } from "./invite.types";

export default class InviteController extends InviteService {
  async addToWaitListHandler(input: TInviteCreate) {
    if (await super.isDisposableEmail(input.email)) {
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

  async inviteHandler(input: { emails: string[] }) {
    await sendEmail(
      input.emails,
      EmailTemplate.INVITE,
      {},
      process.env.AWS_SES_PERSONAL_FROM_EMAIL
    );

    await super.invite(input.emails);

    return {
      status: "success",
      data: {
        message: "Invited users",
      },
    };
  }

  async getAllHandler(input: { pagination: IPaginationOptions }) {
    const invites = await super.getAllInvites(input.pagination);

    return {
      status: "success",
      data: {
        invites,
      },
    };
  }
}
