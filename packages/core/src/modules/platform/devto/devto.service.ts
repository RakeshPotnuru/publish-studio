import { TRPCError } from "@trpc/server";
import axios from "axios";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import { Platform } from "../../../config/constants";
import type { IPaginationOptions } from "../../../types/common.types";
import { logtail } from "../../../utils/logtail";
import User from "../../user/user.model";
import PlatformModel from "../platform.model";
import DevTo from "./devto.model";
import type {
  IDevTo,
  IDevToCreatePostInput,
  IDevToGetAllPostsOutput,
  IDevToUpdatePost,
  IDevToUpdatePostOutput,
  IDevToUserOutput,
  TDevToCreateInput,
  TDevToCreatePostOutput,
  TDevToUpdateInput,
} from "./devto.types";

export default class DevToService {
  private readonly PLATFORM = Platform.DEVTO;

  private async devTo(user_id: Types.ObjectId) {
    const platform = await DevTo.findOne({ user_id }).exec();

    if (!platform) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Platform not found",
      });
    }

    try {
      return axios.create({
        baseURL: defaultConfig.devToApiUrl,
        timeout: 10_000,
        headers: {
          "Content-Type": "application/json",
          "api-key": platform.api_key,
          Accept: "application/vnd.forem.api-v1+json",
        },
      });
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: defaultConfig.defaultErrorMessage,
      });
    }
  }

  async createPlatform(platform: TDevToCreateInput): Promise<boolean> {
    try {
      const newPlatform = await DevTo.create(platform);

      await User.findByIdAndUpdate(platform.user_id, {
        $push: {
          platforms: this.PLATFORM,
        },
      }).exec();

      await PlatformModel.create({
        user_id: platform.user_id,
        name: this.PLATFORM,
        data: newPlatform._id,
      });

      return true;
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id: platform.user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while connecting the platform. Please try again later.",
      });
    }
  }

  async updatePlatform(
    platform: TDevToUpdateInput,
    user_id: Types.ObjectId
  ): Promise<boolean> {
    try {
      const doc = await DevTo.findOne({ user_id }).exec();

      if (!doc) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Platform not found",
        });
      }

      doc.set(platform);
      await doc.save();

      return true;
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while updating the platform. Please try again later.",
      });
    }
  }

  async deletePlatform(user_id: Types.ObjectId): Promise<boolean> {
    try {
      await PlatformModel.findOneAndDelete({
        user_id,
        name: this.PLATFORM,
      }).exec();

      await User.findByIdAndUpdate(user_id, {
        $pull: {
          platforms: this.PLATFORM,
        },
      }).exec();

      await DevTo.findOneAndDelete({ user_id }).select("-api_key").exec();

      return true;
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while disconnecting the platform. Please try again later.",
      });
    }
  }

  async getPlatform(
    user_id: Types.ObjectId
  ): Promise<Omit<IDevTo, "api_key"> | null> {
    try {
      return await DevTo.findOne({ user_id }).select("-api_key").exec();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while fetching the platform. Please try again later.",
      });
    }
  }

  async getPlatformByUsername(
    username: string,
    user_id: Types.ObjectId
  ): Promise<Omit<IDevTo, "api_key"> | null> {
    try {
      return await DevTo.findOne({ username }).select("-api_key").exec();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while fetching the platform. Please try again later.",
      });
    }
  }

  /* This method is used exactly twice before creating or updating user in `DevController()` class
    to fetch user Dev.to details and update them in database. That's why api key is being used directly. */
  async getDevUser(
    api_key: string,
    user_id: Types.ObjectId
  ): Promise<IDevToUserOutput> {
    try {
      const response = await axios.get(
        `${defaultConfig.devToApiUrl}/users/me`,
        {
          headers: {
            "api-key": api_key,
          },
        }
      );

      return response.data as IDevToUserOutput;
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid API key",
      });
    }
  }

  async publishPost(
    post: IDevToCreatePostInput,
    user_id: Types.ObjectId
  ): Promise<TDevToCreatePostOutput> {
    try {
      const devTo = await this.devTo(user_id);

      const response = await devTo.post("/articles", {
        article: post,
      });

      return response.data as TDevToCreatePostOutput;
    } catch (error) {
      await logtail.error(JSON.stringify(error));

      return { isError: true };
    }
  }

  async updatePost(
    post: IDevToUpdatePost,
    post_id: number,
    user_id: Types.ObjectId
  ): Promise<IDevToUpdatePostOutput> {
    try {
      const devTo = await this.devTo(user_id);

      const response = await devTo.put(`/articles/${post_id}`, {
        article: post,
      });

      return response.data as IDevToUpdatePostOutput;
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id: user_id.toString(),
      });

      return { isError: true };
    }
  }

  async getAllPosts(
    pagination: IPaginationOptions,
    user_id: Types.ObjectId
  ): Promise<IDevToGetAllPostsOutput[]> {
    try {
      const devTo = await this.devTo(user_id);

      const response = await devTo.get(
        `/articles/me/all?page=${pagination.page}&per_page=${pagination.limit}`
      );

      return response.data as IDevToGetAllPostsOutput[];
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while fetching posts. Please try again later.",
      });
    }
  }
}
