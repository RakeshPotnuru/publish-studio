import type { Context } from "../../../trpc";
import PexelsService from "./pexels.service";

export default class PexelsController extends PexelsService {
  async searchPhotosHandler(
    input: { query: string; per_page: number; page: number },
    ctx: Context,
  ) {
    const photos = await super.searchPhotos(input, ctx.user._id);

    return {
      status: "success",
      data: {
        photos,
      },
    };
  }
}
