import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import Cloudinary from "./cloudinary.model";
import type { TCloudinaryCreateInput, TCloudinaryUpdateInput } from "./cloudinary.types";

export default class CloudinaryService {
    async createIntegration(integration: TCloudinaryCreateInput): Promise<boolean> {
        try {
            await Cloudinary.create(integration);

            return true;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    "An error occurred while connecting the integration. Please try again later.",
            });
        }
    }

    async updateIntegration(
        integration: TCloudinaryUpdateInput,
        user_id: Types.ObjectId,
    ): Promise<boolean> {
        try {
            const doc = await Cloudinary.findOne({ user_id }).exec();
            doc?.set(integration);
            await doc?.save();

            return true;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    "An error occurred while updating the integration. Please try again later.",
            });
        }
    }

    async deleteIntegration(user_id: Types.ObjectId): Promise<boolean> {
        try {
            await Cloudinary.findOneAndDelete({
                user_id,
            }).exec();

            return true;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    "An error occurred while disconnecting the integration. Please try again later.",
            });
        }
    }
}
