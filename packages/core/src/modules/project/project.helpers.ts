import { TRPCError } from "@trpc/server";
import type { Job } from "bullmq";
import { Queue, Worker } from "bullmq";
import { Types } from "mongoose";

import { bullMQConnectionOptions } from "../../config/app.config";
import { constants } from "../../constants";
import DevToController from "../platform/devto/devto.controller";
import GhostController from "../platform/ghost/ghost.controller";
import HashnodeController from "../platform/hashnode/hashnode.controller";
import MediumController from "../platform/medium/medium.controller";
import type { TPlatformName } from "../platform/platform.types";
import ProjectController from "./project.controller";
import type { IPost, IProject, TTags } from "./project.types";

interface IPublishResponse {
    name: TPlatformName;
    status: "success" | "error";
    published_url: string;
    id: string;
}

export default class ProjectHelpers {
    static shouldPublishOnPlatform(
        project: IProject,
        targetPlatform: (typeof constants.user.platforms)[keyof typeof constants.user.platforms],
    ) {
        return (
            project.platforms?.find(platform => platform.name === targetPlatform) &&
            project.platforms.find(platform => platform.name === targetPlatform)?.status !==
                "success"
        );
    }

    async publishOnPlatform(
        platform: TPlatformName,
        project: IProject,
        user_id: Types.ObjectId,
        tags?: TTags,
    ) {
        switch (platform) {
            case constants.user.platforms.DEVTO: {
                const devResponse = await new DevToController().createPostHandler(
                    {
                        post: project,
                        tags: tags,
                    },
                    user_id,
                );

                return {
                    name: constants.user.platforms.DEVTO,
                    status: devResponse.data.post.error ? "error" : "success",
                    published_url: devResponse.data.post.url,
                    id: devResponse.data.post.id.toString(),
                } as IPublishResponse;
            }
            case constants.user.platforms.HASHNODE: {
                const hashnodeUser = await new HashnodeController().getPlatform(user_id);
                const hashnodeResponse = await new HashnodeController().createPostHandler(
                    {
                        post: project,
                        tags: tags,
                    },
                    user_id,
                );

                const blogHandle = hashnodeUser?.blog_handle ?? "unknown";
                const postSlug = hashnodeResponse.data.post.data.createStory.post.slug ?? "unknown";

                return {
                    name: constants.user.platforms.HASHNODE,
                    status: hashnodeResponse.data.post?.errors ? "error" : "success",
                    published_url: `https://${blogHandle}.hashnode.dev/${postSlug}`,
                    id: hashnodeResponse.data.post.data.createStory.post._id,
                } as IPublishResponse;
            }
            case constants.user.platforms.MEDIUM: {
                const mediumResponse = await new MediumController().createPostHandler(
                    {
                        post: project,
                        tags: tags,
                    },
                    user_id,
                );

                return {
                    name: constants.user.platforms.MEDIUM,
                    status: mediumResponse.data.post.errors ? "error" : "success",
                    published_url: mediumResponse.data.post.data.url,
                    id: mediumResponse.data.post.data.id,
                } as IPublishResponse;
            }
            case constants.user.platforms.GHOST: {
                const ghostResponse = await new GhostController().createPostHandler(
                    {
                        post: project,
                        tags: tags,
                    },
                    user_id,
                );

                return {
                    name: constants.user.platforms.GHOST,
                    status: ghostResponse.data.post?.success ? "success" : "error",
                    published_url: ghostResponse.data.post?.success
                        ? ghostResponse.data.post?.data.url
                        : "",
                    id: ghostResponse.data.post?.success ? ghostResponse.data.post?.data.id : "",
                } as IPublishResponse;
            }
            default: {
                return {} as IPublishResponse;
            }
        }
    }

    async publishOnPlatforms(project: IProject, user_id: Types.ObjectId, tags?: TTags) {
        const publishResponse = [] as IPublishResponse[];

        if (ProjectHelpers.shouldPublishOnPlatform(project, constants.user.platforms.DEVTO)) {
            const response = await this.publishOnPlatform(
                constants.user.platforms.DEVTO,
                project,
                user_id,
                tags,
            );

            publishResponse.push(response);
        }

        if (ProjectHelpers.shouldPublishOnPlatform(project, constants.user.platforms.HASHNODE)) {
            const response = await this.publishOnPlatform(
                constants.user.platforms.HASHNODE,
                project,
                user_id,
                tags,
            );

            publishResponse.push(response);
        }

        if (ProjectHelpers.shouldPublishOnPlatform(project, constants.user.platforms.MEDIUM)) {
            const response = await this.publishOnPlatform(
                constants.user.platforms.MEDIUM,
                project,
                user_id,
                tags,
            );

            publishResponse.push(response);
        }

        if (ProjectHelpers.shouldPublishOnPlatform(project, constants.user.platforms.GHOST)) {
            const response = await this.publishOnPlatform(
                constants.user.platforms.GHOST,
                project,
                user_id,
                tags,
            );

            publishResponse.push(response);
        }

        return publishResponse;
    }

    static updatePlatformStatus(
        updateResponse: IProject["platforms"],
        targetPlatform: (typeof constants.user.platforms)[keyof typeof constants.user.platforms],
        status: "success" | "error",
    ) {
        const platform = updateResponse?.find(platform => platform.name === targetPlatform);

        if (platform) {
            platform.status = status;
        }
    }

    async updateOnPlatform(
        platform: TPlatformName,
        project: IProject,
        user_id: Types.ObjectId | undefined,
        tags: TTags,
    ) {
        switch (platform) {
            case constants.user.platforms.DEVTO: {
                const post_id = project.platforms?.find(
                    platform => platform.name === constants.user.platforms.DEVTO,
                )?.id;

                if (!post_id) {
                    return;
                }

                const response = await new DevToController().updatePostHandler(
                    {
                        post: project,
                        post_id: Number.parseInt(post_id),
                        tags: tags,
                    },
                    user_id,
                );

                ProjectHelpers.updatePlatformStatus(
                    project.platforms,
                    constants.user.platforms.DEVTO,
                    response.data.post.error ? "error" : "success",
                );

                break;
            }
            case constants.user.platforms.HASHNODE: {
                const post_id = project.platforms?.find(
                    platform => platform.name === constants.user.platforms.HASHNODE,
                )?.id;

                if (!post_id) {
                    return;
                }

                const response = await new HashnodeController().updatePostHandler(
                    {
                        post: project,
                        tags: tags,
                        post_id,
                    },
                    user_id,
                );

                ProjectHelpers.updatePlatformStatus(
                    project.platforms,
                    constants.user.platforms.HASHNODE,
                    response.data.post?.errors ? "error" : "success",
                );

                break;
            }
            case constants.user.platforms.GHOST: {
                const post_id = project.platforms?.find(
                    platform => platform.name === constants.user.platforms.GHOST,
                )?.id;

                if (!post_id) {
                    return;
                }

                const response = await new GhostController().updatePostHandler(
                    {
                        post: project,
                        tags: tags,
                        post_id,
                    },
                    user_id,
                );

                ProjectHelpers.updatePlatformStatus(
                    project.platforms,
                    constants.user.platforms.GHOST,
                    response.data.post?.success ? "success" : "error",
                );

                break;
            }
            default: {
                break;
            }
        }
    }

    async updateOnPlatforms(project: IProject, user_id: Types.ObjectId | undefined, tags: TTags) {
        const updateResponse = project.platforms;

        if (!updateResponse) {
            return;
        }

        if (project.platforms?.find(platform => platform.name === constants.user.platforms.DEVTO)) {
            await this.updateOnPlatform(constants.user.platforms.DEVTO, project, user_id, tags);
        }

        if (
            project.platforms?.find(platform => platform.name === constants.user.platforms.HASHNODE)
        ) {
            await this.updateOnPlatform(constants.user.platforms.HASHNODE, project, user_id, tags);
        }

        if (project.platforms?.find(platform => platform.name === constants.user.platforms.GHOST)) {
            await this.updateOnPlatform(constants.user.platforms.GHOST, project, user_id, tags);
        }

        return updateResponse;
    }

    async schedulePost(data: IPost) {
        try {
            const postQueue = new Queue(constants.bullmq.queues.POST, {
                connection: bullMQConnectionOptions,
            });

            const delay = Number(new Date(data.scheduled_at)) - Date.now();
            console.log(`⏰ Sending post in ${delay}ms`);

            await postQueue.add(
                `${constants.bullmq.queues.POST}-job-${data.project_id.toString()}`,
                data,
                {
                    delay,
                },
            );

            this.startSchedulePostWorker();
        } catch (error) {
            console.log("❌ Failed to schedule post");

            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to schedule post. Please try again later.",
            });
        }
    }

    startSchedulePostWorker() {
        try {
            const worker = new Worker<IPost, IPost>(
                constants.bullmq.queues.POST,
                async (job: Job) => {
                    await new ProjectController().publishPost(
                        new Types.ObjectId(job.data.project_id as string),
                        new Types.ObjectId(job.data.user_id as string),
                        job.data.tags as TTags,
                    );

                    console.log(
                        `✅ Sent post ${job.id ?? ""} at ${job.data.scheduled_at as string}`,
                    );
                    return job.data as IPost;
                },
                { connection: bullMQConnectionOptions },
            );

            worker.on("completed", (job: Job) => {
                console.log(`✅ Completed scheduled post ${job.id ?? ""}`);
            });

            worker.on("failed", () => {
                console.log("❌ Job Failed");
            });

            worker.on("error", error => {
                console.log(error);
            });
        } catch (error) {
            console.log("❌ Failed to start schedule post worker");

            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to schedule post. Please try again later.",
            });
        }
    }
}
