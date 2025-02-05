import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import { Platform, PostStatus } from "../../../config/constants";
import type { Context } from "../../../trpc";
import type { IPaginationOptions } from "../../../types/common.types";
import type { TPostUpdateInput } from "../../post/post.types";
import type { IProject } from "../../project/project.types";
import DevToService from "./devto.service";

export default class DevToController extends DevToService {
  async createPlatformHandler(
    input: { api_key: string; status: boolean },
    ctx: Context,
  ) {
    const user = await super.getDevUser(input.api_key, ctx.user._id);

    const platform = await super.getPlatformByUsername(
      user.username,
      ctx.user._id,
    );

    if (platform && !platform.user_id.equals(ctx.user._id)) {
      await super.deletePlatform(platform.user_id);
    }

    await super.createPlatform({
      user_id: ctx.user._id,
      api_key: input.api_key,
      username: user.username,
      status: input.status,
    });

    return {
      status: "success",
      data: {
        message: "Your Dev account has been connected successfully.",
      },
    };
  }

  async updatePlatformHandler(
    input: { api_key?: string; status?: boolean },
    ctx: Context,
  ) {
    if (input.api_key) {
      const user = await super.getDevUser(input.api_key, ctx.user._id);

      const platform = await super.getPlatformByUsername(
        user.username,
        ctx.user._id,
      );

      if (platform && !platform.user_id.equals(ctx.user._id)) {
        await super.deletePlatform(platform.user_id);
      }

      await super.updatePlatform(
        {
          api_key: input.api_key,
          username: user.username,
          status: input.status,
        },
        ctx.user._id,
      );

      return {
        status: "success",
        data: {
          message: "Your Dev account has been updated successfully.",
        },
      };
    }

    await super.updatePlatform(
      {
        status: input.status,
      },
      ctx.user._id,
    );

    return {
      status: "success",
      data: {
        message: "Your Dev account has been updated successfully.",
      },
    };
  }

  async deletePlatformHandler(ctx: Context) {
    const platform = await super.getPlatform(ctx.user._id);

    if (!platform) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "Account not found. Please connect your Dev.to account to continue.",
      });
    }

    await super.deletePlatform(ctx.user._id);

    return {
      status: "success",
      data: {
        message: "Platform disconnected successfully.",
      },
    };
  }

  async createPostHandler(
    input: { post: IProject },
    user_id: Types.ObjectId,
  ): Promise<TPostUpdateInput> {
    const platform = await super.getPlatform(user_id);

    if (!platform) {
      return {
        platform: Platform.DEVTO,
        status: PostStatus.ERROR,
      };
    }

    const { post } = input;

    const newPost = await super.publishPost(
      {
        title: post.title ?? post.name,
        body_markdown: post.body?.markdown,
        description: post.description,
        published: platform.status,
        canonical_url: post.canonical_url,
        tags: post.tags?.devto_tags?.map((tag) => tag.replaceAll(/\W/g, "")), // remove non-alphanumeric characters from tags
        main_image: post.cover_image,
      },
      user_id,
    );

    if (newPost.isError || !newPost.url || !newPost.id) {
      return {
        platform: Platform.DEVTO,
        status: PostStatus.ERROR,
      };
    }

    return {
      platform: Platform.DEVTO,
      status: PostStatus.SUCCESS,
      published_url: newPost.url,
      post_id: newPost.id.toString(),
    };
  }

  async updatePostHandler(
    input: { post: IProject; post_id: string },
    user_id: Types.ObjectId,
  ) {
    const platform = await super.getPlatform(user_id);

    if (!platform) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "Account not found. Please connect your Dev.to account to continue.",
      });
    }

    const { post, post_id } = input;

    const updatedPost = await super.updatePost(
      {
        title: post.title,
        body_markdown: post.body?.markdown,
        description: post.description,
        published: platform.status,
        canonical_url: post.canonical_url,
        tags: post.tags?.devto_tags?.map((tag) => tag.replaceAll(/\W/g, "")), // remove non-alphanumeric characters from tags
        main_image: post.cover_image,
      },
      Number.parseInt(post_id),
      user_id,
    );

    return {
      status: "success",
      data: {
        post: updatedPost,
      },
    };
  }

  async getAllPostsHandler(
    input: { pagination: IPaginationOptions },
    ctx: Context,
  ) {
    const posts = await super.getAllPosts(input.pagination, ctx.user._id);

    return {
      status: "success",
      data: {
        posts,
      },
    };
  }
}
