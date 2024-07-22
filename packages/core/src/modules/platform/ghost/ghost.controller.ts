import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import { Platform, PostStatus } from "../../../config/constants";
import type { Context } from "../../../trpc";
import type { IPaginationOptions } from "../../../types/common.types";
import type { TPostUpdateInput } from "../../post/post.types";
import type { IProject } from "../../project/project.types";
import GhostService from "./ghost.service";
import type { TGhostCreateFormInput, TGhostUpdateInput } from "./ghost.types";

export default class GhostController extends GhostService {
  async createPlatformHandler(input: TGhostCreateFormInput, ctx: Context) {
    const site = await super.getGhostSite(
      ctx.user._id,
      input.api_url,
      input.admin_api_key,
    );

    if (!site.success) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Invalid fields. Site not found.",
      });
    }

    const platform = await super.getPlatformByAPIUrl(
      input.api_url,
      ctx.user._id,
    );

    if (platform && !platform.user_id.equals(ctx.user._id)) {
      await super.deletePlatform(platform.user_id);
    }

    await super.createPlatform({
      user_id: ctx.user._id,
      api_url: input.api_url,
      admin_api_key: input.admin_api_key,
      status: input.status,
    });

    return {
      status: "success",
      data: {
        message: "Your Ghost account has been connected successfully.",
      },
    };
  }

  async updatePlatformHandler(input: TGhostUpdateInput, ctx: Context) {
    if (input.admin_api_key && input.api_url) {
      const site = await super.getGhostSite(
        ctx.user._id,
        input.api_url,
        input.admin_api_key,
      );

      if (!site.success) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid fields. Site not found.",
        });
      }

      const platform = await super.getPlatformByAPIUrl(
        input.api_url,
        ctx.user._id,
      );

      if (platform && !platform.user_id.equals(ctx.user._id)) {
        await super.deletePlatform(platform.user_id);
      }

      await super.updatePlatform(
        {
          api_url: input.api_url,
          admin_api_key: input.admin_api_key,
          status: input.status,
        },
        ctx.user._id,
      );

      return {
        status: "success",
        data: {
          message: "Your Ghost account has been updated successfully.",
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
        message: "Your Ghost account has been updated successfully.",
      },
    };
  }

  async deletePlatformHandler(ctx: Context) {
    const platform = await super.getPlatform(ctx.user._id);

    if (!platform) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Platform not found.",
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
        platform: Platform.GHOST,
        status: PostStatus.ERROR,
      };
    }

    const { post } = input;

    const tags = post.tags?.ghost_tags?.map((tag) => {
      return {
        name: tag.name,
      };
    });

    const newPost = await super.publishPost(
      {
        html: post.body?.html,
        title: post.title ?? post.name,
        canonical_url: post.canonical_url,
        status: platform.status,
        tags: tags ?? undefined,
      },
      user_id,
    );

    if (!newPost.success) {
      return {
        platform: Platform.GHOST,
        status: PostStatus.ERROR,
      };
    }

    return {
      platform: Platform.GHOST,
      status: PostStatus.SUCCESS,
      published_url: newPost.data.url,
      post_id: newPost.data.id,
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
          "Platform not found. Please connect your Ghost account to continue.",
      });
    }

    const { post, post_id } = input;

    const tags = post.tags?.ghost_tags?.map((tag) => {
      return {
        name: tag.name,
      };
    });

    const existingPost = await super.getPost(post_id, user_id);

    const updatedPost = await (existingPost.success
      ? super.updatePost(
          {
            html: post.body?.html,
            title: post.title,
            canonical_url: post.canonical_url,
            status: platform.status,
            tags: tags ?? undefined,
            updated_at: new Date(existingPost.data.updated_at ?? Date.now()),
          },
          post_id,
          user_id,
        )
      : super.updatePost(
          {
            html: post.body?.html,
            title: post.title,
            canonical_url: post.canonical_url,
            status: platform.status,
            tags: tags ?? undefined,
            updated_at: new Date(),
          },
          post_id,
          user_id,
        ));

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
