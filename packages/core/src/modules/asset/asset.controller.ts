import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import defaultConfig from "../../config/app.config";
import type { Context } from "../../trpc";
import type { IFile } from "../../types/file.types";
import AssetService from "./asset.service";

export default class AssetController extends AssetService {
    private validateFile(file: IFile) {
        // only allow images of specific mime types
        const allowedMimeTypes = [
            "image/png",
            "image/jpg",
            "image/jpeg",
            "image/svg+xml",
            "image/gif",
        ];

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Invalid file type",
            });
        }

        // file size should be less than 5MB
        if (file.size > 5 * 1024 * 1024) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "File size should be less than or equal to 5MB",
            });
        }

        return true;
    }

    async uploadImageHandler(input: { file: IFile; project_id?: Types.ObjectId }, ctx: Context) {
        try {
            const { file, project_id } = input;

            if (project_id) {
                const project = await super.getProjectById(project_id);

                if (!project) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Project not found",
                    });
                }
            }

            this.validateFile(file);

            const post = await super.uploadImage(file, project_id, ctx);

            return {
                status: "success",
                data: {
                    submitTo: post,
                },
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }
}
