import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import type { Context } from "../../trpc";
import PostService from "./post.service";
import type { TPostCreateInput, TPostUpdateInput } from "./post.types";

export default class PostController extends PostService {
  async createPostHandler(
    post: Omit<TPostCreateInput, "user_id">,
    ctx: Context,
  ) {
    if (!ctx.user.platforms?.find((platform) => platform === post.platform)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Connect ${post.platform} account to create post.`,
      });
    }

    const project = await super.getProjectById(post.project_id, ctx.user._id);

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found",
      });
    }

    const existingPost = await super.getPostByProjectIdAndPlatform(
      post.project_id,
      post.platform,
      ctx.user._id,
    );

    if (existingPost) {
      return;
    }

    await super.createPost({ ...post, user_id: ctx.user._id });

    return {
      status: "success",
      data: {
        message: "Post created successfully",
      },
    };
  }

  async updatePostHandler(
    input: {
      _id: Types.ObjectId;
      post: TPostUpdateInput;
    },
    ctx: Context,
  ) {
    const post = await super.getPost(input._id, ctx.user._id);

    if (!post) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Post not found",
      });
    }

    const project = await super.getProjectById(post.project_id, ctx.user._id);

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found",
      });
    }

    await super.updatePost(input._id, input.post, ctx.user._id);

    return {
      status: "success",
      data: {
        message: "Post updated successfully",
      },
    };
  }

  async getPostsByProjectIdHandler(project_id: Types.ObjectId, ctx: Context) {
    const posts = await super.getPostsByProjectId(project_id, ctx.user._id);

    return {
      status: "success",
      data: { posts },
    };
  }
}
