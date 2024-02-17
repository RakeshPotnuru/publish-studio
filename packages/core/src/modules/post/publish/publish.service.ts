import type { Types } from "mongoose";

import type { Platform } from "../../../config/constants";
import { PostStatus, ProjectStatus } from "../../../config/constants";
import { createCaller } from "../../../routes";
import type { Context } from "../../../trpc";
import { logtail } from "../../../utils/logtail";
import type { IProject } from "../../project/project.types";
import PostController from "../post.controller";
import type { IPost } from "../post.types";
import PublishHelpers from "./publish.helpers";

export default class PublishService extends PostController {
  async publishPost(
    platforms: Platform[],
    project: IProject,
    user_id: Types.ObjectId,
  ) {
    const publishHelpers = new PublishHelpers();
    const posts = await super.getPostsByProjectId(project._id, user_id);

    if (!posts) {
      return;
    }

    let successCount = 0;
    for (const platform of platforms) {
      successCount += await this.handlePublishPost(
        platform,
        posts,
        project,
        user_id,
        publishHelpers,
      );
    }

    await super.updateProjectById(
      project._id,
      {
        status:
          successCount > 0 ? ProjectStatus.PUBLISHED : ProjectStatus.DRAFT,
      },
      user_id,
    );
  }

  createCaller(user_id: Types.ObjectId) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return createCaller({
      req: {} as any,
      res: {} as any,
      user: { _id: user_id } as any,
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }

  async handlePublishPost(
    platform: Platform,
    posts: IPost[],
    project: IProject,
    user_id: Types.ObjectId,
    publishHelpers: PublishHelpers,
  ) {
    const post = posts.find((post) => post.platform === platform);

    if (!post || post.status === PostStatus.SUCCESS) {
      return 0;
    }

    const caller = this.createCaller(user_id);

    try {
      const controller = publishHelpers.getPlatformCreateController(platform);
      if (!controller) {
        return 0;
      }

      const response = await controller.createPostHandler(
        { post: project },
        user_id,
      );
      await super.updatePost(post._id, response, user_id);

      const isSuccess = response.status === PostStatus.SUCCESS;

      await caller.notifications.create({
        type: isSuccess ? "Publish post" : "Publish post failed",
        message: isSuccess
          ? `Post "${project.name}" published on "${platform}" successfully.`
          : `Failed to publish "${project.name}" on "${platform}". Please check if your ${platform} credentials are valid.`,
      });

      return isSuccess ? 1 : 0;
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      return 0;
    }
  }

  async editPost(platforms: Platform[], project: IProject, ctx: Context) {
    const publishHelpers = new PublishHelpers();

    const posts = await super.getPostsByProjectId(project._id, ctx.user._id);

    if (!posts) {
      return;
    }

    for (const platform of platforms) {
      await this.handleEditPost(platform, posts, project, ctx, publishHelpers);
    }
  }

  async handleEditPost(
    platform: Platform,
    posts: IPost[],
    project: IProject,
    ctx: Context,
    publishHelpers: PublishHelpers,
  ) {
    const post = posts.find((post) => post.platform === platform);

    if (post && post.status === PostStatus.SUCCESS && post.post_id) {
      const controller = publishHelpers.getPlatformUpdateController(platform);

      if (controller) {
        const response = await controller.updatePostHandler(
          { post: project, post_id: post.post_id },
          ctx.user._id,
        );

        await super.updatePostHandler(
          {
            _id: post._id,
            post: {
              status: response.data.post.isError
                ? PostStatus.ERROR
                : PostStatus.SUCCESS,
            },
          },
          ctx,
        );

        const isSuccess = response.data.post.isError;
        const caller = createCaller(ctx);

        if (!isSuccess) {
          await caller.notifications.create({
            type: "Edit post failed",
            message: `Failed to edit "${project.name}" on "${platform}". Please check if post exists and your ${platform} credentials are valid.`,
          });
        }
      }
    }
  }
}
