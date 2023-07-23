import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Types } from "mongoose";

import type { Context } from "../../trpc";
import Project from "../project/project.model";
import User from "../user/user.model";
import Asset from "./asset.model";
import type { IAsset } from "./asset.types";

export default class AssetService {
    async uploadImage(
        file: Express.Multer.File,
        project_id: Types.ObjectId | undefined,
        ctx: Context,
    ) {
        const { mimetype, originalname, buffer } = file;
        const { s3, user } = ctx;

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: originalname,
            Body: buffer,
            ContentType: mimetype,
        };

        const command = new PutObjectCommand(params);

        const signedUrl = await getSignedUrl(s3, command, {
            expiresIn: 3600,
        });

        const newAsset = await Asset.create({
            original_file_name: originalname,
            hosted_url: signedUrl,
            project_id,
            user_id: user?._id,
        });

        if (project_id) {
            await Project.findByIdAndUpdate(project_id, {
                $push: { assets: newAsset._id },
            }).exec();
        }

        await User.findByIdAndUpdate(user?._id, {
            $push: { assets: newAsset._id },
        }).exec();

        return newAsset as IAsset;
    }
}
