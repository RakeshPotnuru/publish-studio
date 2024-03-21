import { TRPCError } from "@trpc/server";

import defaultConfig from "../../config/app";
import type { Context } from "../../trpc";
import { logtail } from "../../utils/logtail";
import UserService from "./user.service";
import type { IUserUpdate } from "./user.types";

export default class UserController extends UserService {
  async getMeHandler(ctx: Context) {
    try {
      const user = ctx.user;

      return {
        status: "success",
        data: {
          user,
        },
      };
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id: ctx.user._id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: defaultConfig.defaultErrorMessage,
      });
    }
  }

  async getUserByIdHandler(ctx: Context) {
    const user = await super.getUserById(ctx.user._id);

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return {
      status: "success",
      data: {
        user: user,
      },
    };
  }

  async updateUserHandler(input: IUserUpdate, ctx: Context) {
    const user = await super.updateUser(ctx.user._id, input);

    return {
      status: "success",
      data: {
        user: user,
      },
    };
  }
}
