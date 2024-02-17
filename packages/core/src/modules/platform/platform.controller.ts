import type { Context } from "../../trpc";
import type { IPaginationOptions } from "../../types/common.types";
import PlatformService from "./platform.service";

export default class PlatformController extends PlatformService {
  async getAllPlatformsHandler(
    input: {
      pagination: IPaginationOptions;
    },
    ctx: Context,
  ) {
    const { platforms, pagination } = await super.getAllPlatformsByUserId(
      input.pagination,
      ctx.user._id,
    );

    return {
      status: "success",
      data: {
        platforms,
        pagination,
      },
    };
  }
}
