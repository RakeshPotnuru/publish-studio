import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import type { IPaginationOptions } from "../../types/common.types";
import { logtail } from "../../utils/logtail";
import Project from "../project/project.model";
import Folder from "./folder.model";
import type {
  IFolder,
  IFoldersResponse,
  TFolderCreateInput,
  TFolderUpdateInput,
} from "./folder.types";

export default class FolderService {
  async createFolder(folder: TFolderCreateInput): Promise<IFolder> {
    try {
      return await Folder.create(folder);
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id: folder.user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while creating the folder. Please try again later.",
      });
    }
  }

  async getFolderByName(
    name: string,
    user_id: Types.ObjectId,
  ): Promise<IFolder | null> {
    try {
      return await Folder.findOne({ user_id, name }).exec();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while fetching the folder. Please try again later.",
      });
    }
  }

  async getFolderById(
    id: Types.ObjectId,
    user_id: Types.ObjectId,
  ): Promise<IFolder | null> {
    try {
      return await Folder.findOne({ user_id, _id: id }).exec();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while fetching the folder. Please try again later.",
      });
    }
  }

  async getAllFoldersByUserId(
    pagination: IPaginationOptions,
    user_id: Types.ObjectId,
  ): Promise<IFoldersResponse> {
    try {
      const total_rows = await Folder.countDocuments({ user_id }).exec();
      const total_pages = Math.ceil(total_rows / pagination.limit);

      const folders = (await Folder.find({ user_id })
        .skip((pagination.page - 1) * pagination.limit)
        .limit(pagination.limit)
        .sort({ updated_at: -1 })
        .exec()) as IFolder[];

      return {
        folders,
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
          "An error occurred while fetching the folders. Please try again later.",
      });
    }
  }

  async updateFolder(
    id: Types.ObjectId,
    user_id: Types.ObjectId,
    folder: TFolderUpdateInput,
  ): Promise<IFolder | null> {
    try {
      return await Folder.findOneAndUpdate({ user_id, _id: id }, folder, {
        new: true,
      }).exec();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while updating the folder. Please try again later.",
      });
    }
  }

  /**
   * The function `deleteFolders` deletes folders from a project and returns a promise that resolves
   * to the result of the deletion.
   * @param {Types.ObjectId[]} ids - An array of `Types.ObjectId` representing the IDs of the folders
   * to be deleted.
   * @param {Types.ObjectId | undefined} user_id - The `user_id` parameter is the ID of the user who
   * owns the folders. It is of type `Types.ObjectId | undefined`, which means it can either be a
   * valid `ObjectId` or `undefined`.
   * @returns the result of the `Folder.deleteMany()` method, which is a promise that resolves to an
   * object containing information about the deletion operation.
   */
  async deleteFolders(ids: Types.ObjectId[], user_id: Types.ObjectId) {
    try {
      await Project.updateMany(
        { user_id, folder_id: { $in: ids } },
        { folder_id: null },
      ).exec();
      return await Folder.deleteMany({ user_id, _id: { $in: ids } }).exec();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while deleting the folder. Please try again later.",
      });
    }
  }
}
