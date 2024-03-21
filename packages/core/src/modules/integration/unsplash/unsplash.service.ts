import { TRPCError } from "@trpc/server";
import { createApi } from "unsplash-js";

import defaultConfig from "../../../config/app";
import { logtail } from "../../../utils/logtail";

export default class UnsplashService {
  private unsplash() {
    return createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY,
    });
  }

  async searchPhotos(input: { query: string; per_page: number; page: number }) {
    try {
      return await this.unsplash().search.getPhotos({
        query: input.query,
        perPage: input.per_page,
        page: input.page,
      });
    } catch (error) {
      await logtail.error("Error searching photos", {
        error: JSON.stringify(error),
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error searching photos",
      });
    }
  }

  async triggerDownload(download_location: string) {
    try {
      return await this.unsplash().photos.trackDownload({
        downloadLocation: download_location,
      });
    } catch (error) {
      await logtail.error("Error triggering download", {
        error: JSON.stringify(error),
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: defaultConfig.defaultErrorMessage,
      });
    }
  }
}
