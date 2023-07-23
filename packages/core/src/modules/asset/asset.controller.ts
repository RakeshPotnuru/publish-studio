import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import type { Context } from "../../trpc";
import AssetService from "./asset.service";

export default class AssetController extends AssetService {
    private validateFile(file: Express.Multer.File) {
        // only allow images of specific mime types
        const allowedMimeTypes = [
            "image/png",
            "image/jpg",
            "image/jpeg",
            "image/svg+xml",
            "image/gif",
        ];

        if (!allowedMimeTypes.includes(file.mimetype as string)) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Invalid file type",
            });
        }

        // file size should be less than 5MB
        if (file.size > 5 * 1024 * 1024) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "File size should be less than 5MB",
            });
        }

        return true;
    }

    async uploadImageHandler(
        input: { file: Express.Multer.File; project_id?: Types.ObjectId },
        ctx: Context,
    ) {
        try {
            console.log(input);

            const { file, project_id } = input;

            this.validateFile(file);

            const asset = await this.uploadImage(file, project_id, ctx);

            return {
                status: "success",
                data: {
                    asset,
                },
            };
        } catch (error: any) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: error.message,
            });
        }
    }
}
