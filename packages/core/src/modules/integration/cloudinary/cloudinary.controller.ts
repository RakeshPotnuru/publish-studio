import type { Context } from "../../../trpc";
import CloudinaryService from "./cloudinary.service";

export default class CloudinaryController extends CloudinaryService {
    async createIntegrationHandler(input: { cloud_name: string; api_key: string }, ctx: Context) {
        await super.createIntegration({
            ...input,
            user_id: ctx.user._id,
        });

        return {
            status: "success",
            data: {
                message: "Integration connected successfully.",
            },
        };
    }

    async updateIntegrationHandler(input: { cloud_name: string; api_key: string }, ctx: Context) {
        await super.updateIntegration(input, ctx.user._id);

        return {
            status: "success",
            data: {
                message: "Integration updated successfully.",
            },
        };
    }

    async deleteIntegrationHandler(ctx: Context) {
        await super.deleteIntegration(ctx.user._id);

        return {
            status: "success",
            data: {
                message: "Integration disconnected successfully.",
            },
        };
    }
}
