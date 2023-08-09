import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import Platform from "./platform.model";
import type { IPlatform } from "./platform.types";

export default class PlatformService {
    async getAllPlatforms(user_id: Types.ObjectId | undefined) {
        try {
            return (await Platform.find({ user_id }).populate("data").exec()) as IPlatform[];
        } catch (error) {
            console.error(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the platforms. Please try again later.",
            });
        }
    }
}
