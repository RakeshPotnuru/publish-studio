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
                message: "Your Cloudinary account has been connected successfully.",
            },
        };
    }

    async updateIntegrationHandler(input: { cloud_name: string; api_key: string }, ctx: Context) {
        await super.updateIntegration(input, ctx.user._id);

        return {
            status: "success",
            data: {
                message: "Your Cloudinary account has been updated successfully.",
            },
        };
    }

    async deleteIntegrationHandler(ctx: Context) {
        await super.deleteIntegration(ctx.user._id);

        return {
            status: "success",
            data: {
                message: "Your Cloudinary account has been disconnected successfully.",
            },
        };
    }

    async getIntegrationHandler(ctx: Context) {
        const integration = await super.getIntegration(ctx.user._id);

        return {
            status: "success",
            data: {
                integration,
            },
        };
    }
}
