import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app";
import { Platform, PostStatus } from "../../../config/constants";
import type { Context } from "../../../trpc";
import type { TPostUpdateInput } from "../../post/post.types";
import type { IProject } from "../../project/project.types";
import HashnodeService from "./hashnode.service";
import type { IHashnodeDefaultSettings } from "./hashnode.types";

export default class HashnodeController extends HashnodeService {
  async createPlatformHandler(
    input: { api_key: string; settings: IHashnodeDefaultSettings },
    ctx: Context,
  ) {
    const user = await super.getHashnodeUser(input.api_key, ctx.user._id);

    if (!user.data) {
      if (user.errors[0].extensions.code === "UNAUTHENTICATED") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid API key",
        });
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: defaultConfig.defaultErrorMessage,
      });
    }

    if (user.data.me.publications.totalDocuments === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You don't have any publications on Hashnode.",
      });
    }

    const platform = await super.getPlatformByUsername(
      user.data.me.username,
      ctx.user._id,
    );

    if (platform && !platform.user_id.equals(ctx.user._id)) {
      await super.deletePlatform(platform.user_id);
    }

    await super.createPlatform({
      user_id: ctx.user._id,
      api_key: input.api_key,
      username: user.data.me.username,
      blog_handle: user.data.me.publications.edges[0].node.url,
      publication: {
        publication_id: user.data.me.publications.edges[0].node.id,
      },
      settings: {
        enable_table_of_contents: input.settings.enable_table_of_contents,
        send_newsletter: input.settings.send_newsletter,
        delisted: input.settings.delisted,
      },
    });

    return {
      status: "success",
      data: {
        message: "Your Hashnode account has been connected successfully.",
      },
    };
  }

  async updatePlatformHandler(
    input: { api_key?: string; settings: IHashnodeDefaultSettings },
    ctx: Context,
  ) {
    if (input.api_key) {
      const user = await super.getHashnodeUser(input.api_key, ctx.user._id);

      if (!user.data) {
        if (user.errors[0].extensions.code === "UNAUTHENTICATED") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid API key",
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: defaultConfig.defaultErrorMessage,
        });
      }

      if (user.data.me.publications.totalDocuments === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You don't have any publications on Hashnode.",
        });
      }

      const platform = await super.getPlatformByUsername(
        user.data.me.username,
        ctx.user._id,
      );

      if (platform && !platform.user_id.equals(ctx.user._id)) {
        await super.deletePlatform(platform.user_id);
      }

      await super.updatePlatform(
        {
          api_key: input.api_key,
          username: user.data.me.username,
          blog_handle: user.data.me.publications.edges[0].node.url,
          publication: {
            publication_id: user.data.me.publications.edges[0].node.id,
          },
          settings: {
            enable_table_of_contents: input.settings.enable_table_of_contents,
            send_newsletter: input.settings.send_newsletter,
            delisted: input.settings.delisted,
          },
        },
        ctx.user._id,
      );

      return {
        status: "success",
        data: {
          message: "Your Hashnode account has been updated successfully.",
        },
      };
    }

    await super.updatePlatform(
      {
        settings: {
          enable_table_of_contents: input.settings.enable_table_of_contents,
          send_newsletter: input.settings.send_newsletter,
          delisted: input.settings.delisted,
        },
      },
      ctx.user._id,
    );

    return {
      status: "success",
      data: {
        message: "Your Hashnode account has been updated successfully.",
      },
    };
  }

  async deletePlatformHandler(ctx: Context) {
    const platform = await super.getPlatform(ctx.user._id);

    if (!platform) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "Account not found. Please connect your Hashnode account to continue.",
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
    input: {
      post: IProject;
    },
    user_id: Types.ObjectId,
  ): Promise<TPostUpdateInput> {
    const platform = await super.getPlatform(user_id);

    if (!platform) {
      return {
        platform: Platform.HASHNODE,
        status: PostStatus.ERROR,
      };
    }

    const { post } = input;

    if (!post.body?.markdown) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid fields",
      });
    }

    const _postTitle = post.title ?? post.name;
    let postTitle = _postTitle;
    if (postTitle.length < 6) {
      postTitle = `${postTitle} - Published from ${defaultConfig.appName}`;
    }

    const _postContent = post.body.markdown;
    let postContent = _postContent;
    if (postContent.length < 5) {
      postContent = `${postContent} - Published from ${defaultConfig.appName}`;
    }

    const newPost = await super.publishPost(
      {
        title: postTitle,
        contentMarkdown: postContent,
        // tags: post.tags?.hashnode_tags ?? [],
        tags: [],
        publicationId: platform.publication.publication_id,
        settings: {
          delisted: platform.settings.delisted,
          enableTableOfContent: platform.settings.enable_table_of_contents,
          isNewsletterActivated: platform.settings.send_newsletter,
        },
        coverImageOptions: {
          coverImageURL: post.cover_image,
        },
        originalArticleURL: post.canonical_url,
      },
      user_id,
    );

    if (newPost.isError || !newPost.data) {
      return {
        platform: Platform.HASHNODE,
        status: PostStatus.ERROR,
      };
    }

    const hashnodeUser = await new HashnodeController().getPlatform(user_id);

    const blogHandle = hashnodeUser?.blog_handle ?? "https://hashnode.com";
    const postSlug = newPost.data.publishPost.post.slug;

    return {
      platform: Platform.HASHNODE,
      status: PostStatus.SUCCESS,
      published_url: `${blogHandle}/${postSlug}`,
      post_id: newPost.data.publishPost.post.id,
    };
  }

  async updatePostHandler(
    input: {
      post: IProject;
      post_id: string;
    },
    user_id: Types.ObjectId,
  ) {
    const platform = await super.getPlatform(user_id);

    if (!platform) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "Account not found. Please connect your Hashnode account to continue.",
      });
    }

    const { post, post_id } = input;

    const _postTitle = post.title ?? post.name;
    let postTitle = _postTitle;
    if (postTitle.length < 6) {
      postTitle = `${postTitle} - Published from ${defaultConfig.appName}`;
    }

    const _postContent = post.body?.markdown;
    let postContent = _postContent ?? "";
    if (postContent.length < 5) {
      postContent = `${postContent} - Published from ${defaultConfig.appName}`;
    }

    const updatedPost = await super.updatePost(
      {
        title: postTitle,
        contentMarkdown: postContent,
        // tags: post.tags?.hashnode_tags ?? [],
        tags: [],
        coverImageOptions: {
          coverImageURL: post.cover_image,
        },
        originalArticleURL: post.canonical_url,
      },
      post_id,
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
    input: { pagination: { limit: number; end_cursor?: string } },
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
