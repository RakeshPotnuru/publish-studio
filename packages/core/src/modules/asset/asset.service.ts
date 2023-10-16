import type { PresignedPostOptions } from "@aws-sdk/s3-presigned-post";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import type { Context } from "../../trpc";
import type { IFile } from "../../types/file.types";
import Project from "../project/project.model";
import ProjectService from "../project/project.service";
import User from "../user/user.model";
import Asset from "./asset.model";

export default class AssetService extends ProjectService {
    async uploadImage(file: IFile, project_id: Types.ObjectId | undefined, ctx: Context) {
        try {
            const { mimetype, originalname, size } = file;
            const { s3, user } = ctx;

            const uuid = uuidv4();

            const filePath = `${user?._id.toString() ?? "default"}/${uuid}_${originalname}`;

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

            const hostedUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${
                process.env.AWS_REGION
            }.amazonaws.com/${filePath}.${mimetype.split("/")[1]}`;

            const newAsset = await Asset.create({
                original_file_name: originalname,
                hosted_url: hostedUrl,
                project_id: project_id,
                user_id: user?._id,
                size: size,
                mimetype: mimetype,
            });

            await User.findByIdAndUpdate(user?._id, {
                $push: { assets: newAsset._id },
            }).exec();

            if (project_id) {
                await Project.findByIdAndUpdate(project_id, {
                    $push: { assets: newAsset._id },
                }).exec();
            }

            return {
                url: post.url,
                fields: post.fields,
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while uploading the image. Please try again later.",
            });
        }
    }
}
