import type { Context } from "../../trpc";
import type { IPagination } from "../../types/common.types";
import PlatformService from "./platform.service";

export default class PlatformController extends PlatformService {
    async getAllPlatformsHandler(input: { pagination: IPagination }, ctx: Context) {
        const { platforms, pagination } = await this.getAllPlatformsByUserId(
            input.pagination,
            ctx.user?._id,
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
