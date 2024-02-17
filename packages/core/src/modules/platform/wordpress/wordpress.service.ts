import { TRPCError } from "@trpc/server";
import axios from "axios";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import { Platform } from "../../../config/constants";
import PlatformModel from "../../../modules/platform/platform.model";
import User from "../../../modules/user/user.model";
import type { IPaginationOptions } from "../../../types/common.types";
import { logtail } from "../../../utils/logtail";
import WordPress from "./wordpress.model";
import type {
  IWordPress,
  IWordPressCreatePostInput,
  IWordPressCreatePostOutput,
  IWordPressGetAllPostsOutput,
  IWordPressSiteOutput,
  IWordPressUpdateInput,
  IWordPressUpdatePostInput,
  IWordPressUpdatePostOutput,
  TWordPressCreateInput,
} from "./wordpress.types";

export default class WordPressService {
  private readonly PLATFORM = Platform.WORDPRESS;
  private readonly API_URL = defaultConfig.wordPressApiUrl;
  private readonly API_VERSION = "v1.1";

  private async wordpress(user_id: Types.ObjectId) {
    const platform = await WordPress.findOne({ user_id }).exec();

    if (!platform) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Platform not found",
      });
    }

    try {
      return axios.create({
        baseURL: `${this.API_URL}/rest/${this.API_VERSION}/`,
        timeout: 10_000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${platform.token}`,
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

  async createPlatform(platform: TWordPressCreateInput): Promise<boolean> {
    try {
      const newPlatform = await WordPress.create(platform);

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
    platform: IWordPressUpdateInput,
    user_id: Types.ObjectId,
  ): Promise<boolean> {
    try {
      const doc = await WordPress.findOne({ user_id }).exec();

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
      // Note: There's no way I can disconnect this application from user's connected applications
      await PlatformModel.findOneAndDelete({
        user_id,
        name: this.PLATFORM,
      }).exec();

      await User.findByIdAndUpdate(user_id, {
        $pull: {
          platforms: this.PLATFORM,
        },
      }).exec();

      await WordPress.findOneAndDelete({ user_id }).exec();

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

  async getPlatform(user_id: Types.ObjectId): Promise<IWordPress | null> {
    try {
      return await WordPress.findOne({
        user_id,
      }).exec();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while getting the platform.",
      });
    }
  }

  async getPlatformByBlogId(blog_id: string, user_id: Types.ObjectId) {
    try {
      return await WordPress.findOne({ blog_id }).exec();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while getting the platform.",
      });
    }
  }

  async getWordPressSite(
    code: string,
    user_id: Types.ObjectId,
  ): Promise<IWordPressSiteOutput> {
    try {
      const response = await axios.post(
        `${this.API_URL}/oauth2/token`,
        {
          client_id: process.env.WORDPRESS_CLIENT_ID,
          redirect_uri: defaultConfig.wordPressRedirectUri,
          client_secret: process.env.WORDPRESS_CLIENT_SECRET,
          code,
          grant_type: "authorization_code",
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      return response.data as IWordPressSiteOutput;
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid code.",
      });
    }
  }

  async publishPost(
    post: IWordPressCreatePostInput,
    user_id: Types.ObjectId,
  ): Promise<IWordPressCreatePostOutput> {
    try {
      const wordpress = await this.wordpress(user_id);

      const response = await wordpress.post(
        `/sites/${post.blog_id}/posts/new`,
        post,
      );

      return response.data as IWordPressCreatePostOutput;
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      return { isError: true };
    }
  }

  async updatePost(
    post: IWordPressUpdatePostInput,
    post_id: string,
    user_id: Types.ObjectId,
  ): Promise<IWordPressUpdatePostOutput> {
    try {
      const wordpress = await this.wordpress(user_id);

      const response = await wordpress.post(
        `/sites/${post.blog_id}/posts/${post_id}`,
        post,
      );

      return response.data as IWordPressUpdatePostOutput;
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      return { isError: true };
    }
  }

  async getAllPosts(
    pagination: IPaginationOptions,
    user_id: Types.ObjectId,
  ): Promise<IWordPressGetAllPostsOutput[]> {
    try {
      const wordpress = await this.wordpress(user_id);

      const response = await wordpress.get(
        `/me/posts?fields=ID,URL,title,excerpt,date,content,status,tags,featured_image&number=${pagination.limit}&page=${pagination.page}`,
      );

      return response.data.posts as IWordPressGetAllPostsOutput[];
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while getting the posts.",
      });
    }
  }
}
