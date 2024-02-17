import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";
import { createClient } from "pexels";

import defaultConfig from "../../../config/app.config";
import { logtail } from "../../../utils/logtail";

export default class PexelsService {
  private pexels() {
    return createClient(process.env.PEXELS_API_KEY);
  }

  async searchPhotos(
    input: { query: string; per_page: number; page: number },
    user_id: Types.ObjectId,
  ) {
    try {
      const result = await this.pexels().photos.search({
        query: input.query,
        per_page: input.per_page,
        page: input.page,
      });

      if ("photos" in result) {
        return result;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: result.error,
      });
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: defaultConfig.defaultErrorMessage,
      });
    }
  }
}
