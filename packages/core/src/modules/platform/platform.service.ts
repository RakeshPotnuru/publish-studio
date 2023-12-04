import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import type { IPagination } from "../../types/common.types";
import Platform from "./platform.model";
import type { IPlatform } from "./platform.types";

export default class PlatformService {
    async getAllPlatformsByUserId(pagination: IPagination, user_id: Types.ObjectId | undefined) {
        try {
            const total_rows = await Platform.countDocuments({ user_id }).exec();
            const total_pages = Math.ceil(total_rows / pagination.limit);

            const platforms = (await Platform.find({ user_id })
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
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the platforms. Please try again later.",
            });
        }
    }
}
