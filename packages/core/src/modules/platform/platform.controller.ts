import type { Context } from "../../trpc";
import PlatformService from "./platform.service";

export default class PlatformController extends PlatformService {
    async getAllPlatformsHandler(ctx: Context) {
        const platforms = await this.getAllPlatforms(ctx.user?._id);

        return {
            status: "success",
            data: {
                platforms,
            },
        };
    }
}
