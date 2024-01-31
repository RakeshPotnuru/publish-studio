import type { Types } from "mongoose";

import { constants } from "../../../config/constants";
import { createCaller } from "../../../routes";
import type { Context } from "../../../trpc";
import type { TPlatformName } from "../../platform/platform.types";
import type { IProject } from "../../project/project.types";
import PostController from "../post.controller";
import type { IPost } from "../post.types";
import PublishHelpers from "./publish.helpers";

export default class PublishService extends PostController {
    async publishPost(platforms: TPlatformName[], project: IProject, user_id: Types.ObjectId) {
        const publishHelpers = new PublishHelpers();
        const posts = await super.getPostsByProjectId(project._id, user_id);

        let successCount = 0;
        for (const platform of platforms) {
            successCount += await this.handlePlatformPost(
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
                    successCount > 0
                        ? constants.project.status.PUBLISHED
                        : constants.project.status.DRAFT,
            },
            user_id,
        );
    }

    createCaller(user_id: Types.ObjectId) {
        return createCaller({
            req: {} as any,
            res: {} as any,
            user: { _id: user_id } as any,
        });
    }

    async handlePlatformPost(
        platform: TPlatformName,
        posts: IPost[],
        project: IProject,
        user_id: Types.ObjectId,
        publishHelpers: PublishHelpers,
    ) {
        const post = posts.find(post => post.platform === platform);

        if (!post || post.status === constants.postStatus.SUCCESS) {
            return 0;
        }

        const caller = this.createCaller(user_id);

        try {
            const controller = publishHelpers.getPlatformCreateController(platform);
            if (!controller) {
                return 0;
            }

            const response = await controller.createPostHandler({ post: project }, user_id);
            await super.updatePost(post._id, response);

            const isSuccess = response.status === constants.postStatus.SUCCESS;

            await caller.notifications.create({
                type: isSuccess ? "Publish post" : "Publish Post failed",
                message: isSuccess
                    ? `Post "${project.name}" published on "${platform}" successfully.`
                    : `Failed to publish "${project.name}" on "${platform}". Please check if your ${platform} credentials are valid.`,
            });

            return isSuccess ? 1 : 0;
        } catch (error) {
            console.log(error);
            return 0;
        }
    }

    async editPost(platforms: TPlatformName[], project: IProject, ctx: Context) {
        const publishHelpers = new PublishHelpers();

        const posts = await super.getPostsByProjectId(project._id, ctx.user._id);

        for (const platform of platforms) {
            const post = posts.find(post => post.platform === platform);

            if (post && post.status === constants.postStatus.SUCCESS && post.post_id) {
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
                                    ? constants.postStatus.ERROR
                                    : constants.postStatus.SUCCESS,
                            },
                        },
                        ctx,
                    );
                }
            }
        }
    }
}
