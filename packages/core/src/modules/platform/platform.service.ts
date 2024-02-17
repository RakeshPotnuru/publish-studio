import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import { logtail } from "../../utils/logtail";
import Platform from "./platform.model";
import type { IPlatform, IPlatformsResponse } from "./platform.types";

export default class PlatformService {
  async getAllPlatformsByUserId(
    pagination: {
      page: number;
      limit: number;
    },
    user_id: Types.ObjectId,
  ): Promise<IPlatformsResponse> {
    try {
      const total_rows = await Platform.countDocuments({ user_id }).exec();
      const total_pages = Math.ceil(total_rows / pagination.limit);

      const platforms = (await Platform.find({ user_id })
        .populate("data")
        .skip((pagination.page - 1) * pagination.limit)
        .limit(pagination.limit)
        .exec()) as IPlatform[];

      return {
        platforms,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total_rows,
          total_pages,
        },
      } as IPlatformsResponse;
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while fetching the platforms. Please try again later.",
      });
    }
  }
}
