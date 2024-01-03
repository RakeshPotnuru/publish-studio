import type { DeleteObjectsCommandInput } from "@aws-sdk/client-s3";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import type { PresignedPostOptions } from "@aws-sdk/s3-presigned-post";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import type { Context } from "../../trpc";
import type { IPaginationOptions } from "../../types/common.types";
import type { IFile } from "../../types/file.types";
import s3 from "../../utils/aws/s3";
import Project from "../project/project.model";
import ProjectService from "../project/project.service";
import Asset from "./asset.model";
import type { IAsset, IAssetsResponse } from "./asset.types";

export default class AssetService extends ProjectService {
    async uploadImage(file: IFile, project_id: Types.ObjectId | undefined, ctx: Context) {
        try {
            const { mimetype, originalname, size } = file;
            const { user } = ctx;

            const uuid = uuidv4();

            const filePath = `${
                user?._id.toString() ?? "default"
            }/${uuid}_${originalname.replaceAll(/\s/g, "_")}`;

            const params: PresignedPostOptions = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: filePath,
                Fields: {
                    "Content-Type": mimetype,
                    "Content-Length": size.toString(),
                },
                Expires: 60 * 60, // seconds
                Conditions: [
                    ["content-length-range", 0, 5 * 1024 * 1024], // 5MB
                ],
            };

            const post = await createPresignedPost(s3, params);

            const hostedUrl = `${post.url}${filePath}`;

            const newAsset = await Asset.create({
                original_file_name: originalname,
                hosted_url: hostedUrl,
                project_id: project_id,
                user_id: user?._id,
                size: size,
                mimetype: mimetype,
                key: filePath,
            });

            if (project_id) {
                await Project.findByIdAndUpdate(project_id, {
                    $push: { assets: newAsset._id },
                }).exec();
            }

            return {
                url: post.url,
                fields: post.fields,
                asset: newAsset,
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while uploading the image. Please try again later.",
            });
        }
    }

    private async deleteImages(keys: string[]) {
        try {
            const params: DeleteObjectsCommandInput = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Delete: {
                    Objects: keys.map(key => ({ Key: key })),
                },
            };

            const command = new DeleteObjectsCommand(params);

            return await s3.send(command);
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while deleting the image. Please try again later.",
            });
        }
    }

    async getAllAssetsByUserId(
        pagination: IPaginationOptions,
        user_id: Types.ObjectId | undefined,
    ) {
        try {
            const total_rows = await Asset.countDocuments({ user_id }).exec();
            const total_pages = Math.ceil(total_rows / pagination.limit);

            const assets = (await Asset.find({ user_id })
                .skip((pagination.page - 1) * pagination.limit)
                .limit(pagination.limit)
                .sort({ updated_at: -1 })
                .exec()) as IAsset[];

            return {
                assets,
                pagination: {
                    page: pagination.page,
                    limit: pagination.limit,
                    total_rows,
                    total_pages,
                },
            } as IAssetsResponse;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the assets. Please try again later.",
            });
        }
    }

    /**
     * The function `deleteAssets` deletes assets from a user's account and associated projects.
     * @param ids - An array of asset IDs that need to be deleted.
     * @param {Types.ObjectId | undefined} user_id - The `user_id` parameter is the ID of the user who
     * owns the assets. It is of type `Types.ObjectId | undefined`, which means it can either be a
     * valid `ObjectId` or `undefined`.
     * @returns the result of the `Asset.deleteMany({ _id: { : ids } }).exec()` operation.
     */
    async deleteAssets(ids: Types.ObjectId[], user_id: Types.ObjectId | undefined) {
        try {
            const assets = await Asset.find({ _id: { $in: ids } }).exec();

            const keys = assets.map(asset => asset.key);

            await this.deleteImages(keys);

            return await Asset.deleteMany({ user_id, _id: { $in: ids } }).exec();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while deleting the asset. Please try again later.",
            });
        }
    }
}
