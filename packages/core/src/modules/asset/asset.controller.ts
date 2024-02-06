import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import { constants, MimeType } from "../../config/constants";
import type { Context } from "../../trpc";
import type { IPaginationOptions } from "../../types/common.types";
import type { IFile } from "../../types/file.types";
import AssetService from "./asset.service";

export default class AssetController extends AssetService {
    private validateFile(file: IFile) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (!Object.values(MimeType).includes(file.mimetype)) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Invalid file type",
            });
        }

        // file size should be less than 5MB
        if (file.size > constants.asset.MAX_FILE_SIZE) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "File size should be less than or equal to 5MB",
            });
        }

        return true;
    }

    async uploadImageHandler(input: { file: IFile; project_id?: Types.ObjectId }, ctx: Context) {
        const { file, project_id } = input;

        this.validateFile(file);

        const { asset, fields, url } = await super.uploadImage(file, project_id, ctx);

        return {
            status: "success",
            data: {
                submitTo: {
                    url,
                    fields,
                },
                asset,
            },
        };
    }

    async getAllAssetsHandler(
        input: {
            pagination: IPaginationOptions;
        },
        ctx: Context,
    ) {
        const { assets, pagination } = await super.getAllAssetsByUserId(
            input.pagination,
            ctx.user._id,
        );

        return {
            status: "success",
            data: {
                assets,
                pagination,
            },
        };
    }

    async deleteAssetsHandler(input: Types.ObjectId[], ctx: Context) {
        const deletedAssets = await super.deleteAssets(input, ctx.user._id);

        return {
            status: "success",
            data: {
                assets: deletedAssets,
            },
        };
    }
}
