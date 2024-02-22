import type { DeleteObjectsCommandInput } from "@aws-sdk/client-s3";
import { DeleteObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";
import { v4 as uuidV4 } from "uuid";

import type { IPaginationOptions } from "../../types/common.types";
import type { IFile } from "../../types/file.types";
import { logtail } from "../../utils/logtail";
import r2 from "../../utils/r2";
import ProjectService from "../project/project.service";
import Asset from "./asset.model";
import type { IAsset, IAssetsResponse } from "./asset.types";

export default class AssetService extends ProjectService {
  async uploadImage(
    file: IFile,
    project_id: Types.ObjectId | undefined,
    user_id: Types.ObjectId
  ) {
    try {
      const { mimetype, originalname, size } = file;

      const uuid = uuidV4();

      const filePath = `${user_id.toString()}/${uuid}_${originalname}`;

      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: filePath,
      });

      const url = await getSignedUrl(r2, command, { expiresIn: 60 * 60 });

      const hostedUrl = `https://stg.assets.publishstudio.one/${filePath}`;

      const newAsset = await Asset.create({
        original_file_name: originalname,
        hosted_url: hostedUrl,
        project_id: project_id,
        user_id: user_id,
        size: size,
        mimetype: mimetype,
        key: filePath,
      });

      return {
        url,
        asset: newAsset,
      };
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });
      console.log("error", error);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while uploading the image. Please try again later.",
      });
    }
  }

  private async deleteImages(keys: string[]) {
    try {
      const params: DeleteObjectsCommandInput = {
        Bucket: process.env.R2_BUCKET_NAME,
        Delete: {
          Objects: keys.map((key) => ({ Key: key })),
        },
      };

      const command = new DeleteObjectsCommand(params);

      return await r2.send(command);
    } catch (error) {
      await logtail.error(JSON.stringify(error));

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while deleting the image. Please try again later.",
      });
    }
  }

  async getAllAssetsByUserId(
    pagination: IPaginationOptions,
    user_id: Types.ObjectId
  ): Promise<IAssetsResponse> {
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
      };
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while fetching the assets. Please try again later.",
      });
    }
  }

  /**
   * Deletes assets with the given IDs for a specific user.
   * @param {Types.ObjectId[]} ids - The IDs of the assets to delete.
   * @param {Types.ObjectId} user_id - The ID of the user.
   * @returns {Promise<DeleteResult>} - A promise that resolves when the assets are deleted.
   * @throws {TRPCError} - If an error occurs while deleting the assets.
   */
  async deleteAssets(
    ids: Types.ObjectId[],
    user_id: Types.ObjectId
  ): Promise<{
    deletedCount: number;
  }> {
    try {
      const assets = await Asset.find({ _id: { $in: ids } }).exec();

      const keys = assets.map((asset) => asset.key);

      await this.deleteImages(keys);

      return await Asset.deleteMany({ user_id, _id: { $in: ids } }).exec();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while deleting the assets. Please try again later.",
      });
    }
  }
}
